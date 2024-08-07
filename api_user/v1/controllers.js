const { PrismaClient } = require("@prisma/client");
const {
    generateHash,
    setCookie,
    hashValidator,
    generateAuthorizationToken,
    getUser,
    generateResetUrl,
    getResetUrlPayload,
} = require("../../services/auth");
const {
    resError,
    resSuccess,
    ErrorException,
} = require("../../services/responseHandler");
const { sendEmail, urlTokenGenerator } = require("../../services/mailing");
const { random: stringGenerator } = require("@supercharge/strings");
const { sendTelegramMessageByUsername } = require("../../services/telegramServices")
const crypto = require("crypto");
const prisma = new PrismaClient();
const ITEM_LIMIT = Number(process.env.ITEM_LIMIT) || 10;

exports.register = async (req, res) => {
    const { username, email, password, telegramId } = req.body;
    try {
        // Cek jika user sudah ada
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Buat user baru dan profil
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: generateHash(password),
                telegramId,
                role: { connect: { name: 'BASE' } },
                passwordUpdatedAt: new Date(Date.now() - 1000),
                profil: {
                    create: {
                        full_name: username,
                        telegramId, // Simpan telegramId di profil
                    },
                },
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
                profil: true, // Memilih untuk mendapatkan data profil baru yang termasuk telegramId
            },
        });

        // Kirim pesan notifikasi ke Telegram
        await sendTelegramMessageByUsername(telegramId, 'Welcome! Your registration was successful.');
        // Hapus token autentikasi (jika ada) setelah registrasi
        res.clearCookie("auth_token");

        return resSuccess({
            res,
            title: "Success register user",
            data: newUser,
        });
    } catch (err) {
        console.error('Error during registration:', err);
        return resError({ res, title: "Failed register user", errors: err.message });
    }
};



exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // try find the user
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
            select: {
                id: true,
                username: true,
                password: true,
                email: true,
                role: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // give response if cant find the user
        if (user === null)
            throw new ErrorException({
                type: "username",
                detail: "Cant find the user",
            });

        // compare user and password
        const auth = hashValidator(password, user.password);

        // give response if password not match
        if (!auth)
            throw new ErrorException({
                type: "password",
                detail: "Username and Password didn't match",
            });

        setCookie({
            res,
            title: "Authorization",
            data: generateAuthorizationToken({
                data: { userID: user.id, username: user.username },
            }),
        });

        return resSuccess({
            res,
            title: "Berhasil login",
            data: {
                username: user.username,
                email: user.email,
                id: user.id,
                role: user.role.name,
            },
        });
    } catch (err) {
        return resError({
            res,
            title: "Failed to login",
            errors: err,
            code: 401,
        });
    }
};

exports.logout = (req, res) => {
    setCookie({ res, title: "Authorization", data: "", maxAge: 1 });
    return resSuccess({ res, title: "Success logout user" });
};

exports.detail = async (req, res) => {
    try {
        const id = await getUser(req);
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                username: true,
                email: true,
                telegramId: true, // Menambahkan telegramId
                profil: { select: { full_name: true, telegramId: true } },
                role: { select: { name: true } },
            },
        });
        return resSuccess({
            res,
            title: "Success get user information",
            data: user,
        });
    } catch (error) {
        return resError({
            res,
            title: "Failed to get user data",
            errors: error,
        });
    }
};


exports.updatePassword = async (req, res) => {
    try {
        //provide default or unupdated value
        const id = await getUser(req); // user id
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });

        // CEK OLD PASSWORD is MATCH
        const { oldPassword, newPassword } = req.body;
        const passCompare = hashValidator(oldPassword, user.password);

        if (!passCompare) throw "Old Password not match";

        const newHashPassword = generateHash(newPassword);

        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                password: newHashPassword,
                passwordUpdatedAt: new Date(Date.now() - 1000),
            },
            select: {
                id: true,
                username: true,
                email: true,
            },
        });

        setCookie({
            res,
            title: "Authorization",
            data: generateAuthorizationToken({ id: updatedUser.id }),
        });

        return resSuccess({
            res,
            title: "Success update user password",
            data: updatedUser,
        });
    } catch (err) {
        return resError({
            res,
            title: "Failed to update user password",
            errors: err,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const token = crypto.randomBytes(32).toString("hex");

        const secret = await prisma.user.update({
            where: { email },
            data: {
                token: crypto.createHash("sha256").update(token).digest("hex"),
                tokenExpiredAt: new Date(new Date().getTime() + 5 * 60000),
                tokenType: "RESET_TOKEN",
            },
        });

        const url = urlTokenGenerator(
            req,
            "api/v1/user/reset-password/",
            token
        );
        const subject = "Reset Password";
        const template = `<a href=${url}>${url}</a>`;
        await sendEmail(secret.email, subject, template);

        return resSuccess({
            res,
            title: "Success send reset link to your mail",
            data: [],
        });
    } catch (error) {
        return resError({ res, errors: error, title: "Failed reset email" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.query;
        const newPass = await prisma.user.update({
            where: {
                token: crypto.createHash("sha256").update(token).digest("hex"),
            },

            data: {
                password: generateHash(password),
                passwordUpdatedAt: new Date(Date.now() - 1000),
                token: null,
                tokenExpiredAt: null,
                tokenType: null,
            },
            select: {
                username: true,
                id: true,
                email: true,
            },
        });

        return resSuccess({
            res,
            title: "Success reset your password",
            data: newPass,
        });
    } catch (error) {
        console.log(error);
        return resError({ res, errors: error });
    }
};

exports.sendVerificationEmail = async (req, res) => {
    try {
        const token = crypto.randomBytes(32).toString("hex");
        const exp_time = 5;
        const secret = await prisma.user.update({
            where: { id: await getUser(req) },
            data: {
                token: crypto.createHash("sha256").update(token).digest("hex"),
                tokenExpiredAt: new Date(
                    new Date().getTime() + exp_time * 60000
                ),
                tokenType: "VERIFICATION_TOKEN",
            },
        });

        const subject = "Email Verification";
        const url = urlTokenGenerator(
            req,
            "api/v1/user/email-verification-process/",
            token
        );
        const template = `<a href=${url}>${url}</a>`;
        await sendEmail(secret.email, subject, template);

        return resSuccess({
            res,
            title: "We send verification url to your email",
            data: [],
        });
    } catch (error) {
        return resError({ res, errors: error, title: "Failed send email" });
    }
};

exports.verifyingEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const data = await prisma.user.update({
            where: {
                token: crypto.createHash("sha256").update(token).digest("hex"),
            },
            data: {
                emailIsVerified: true,
                accountIsVerified: true,
                token: null,
                tokenExpiredAt: null,
                tokenType: null,
            },
            select: {
                id: true,
                username: true,
                emailIsVerified: true,
                accountIsVerified: true,
            },
        });

        return resSuccess({
            res,
            title: "Email successfully verified",
            data: data,
        });
        // return res.redirect("/profile");
    } catch (error) {
        console.log(error);
        return resError({
            res,
            errors: error,
            title: "Failed to verification email",
        });
    }
};

exports.list = async (req, res) => {
    try {
        const { search, cursor } = req.query;
        let userList;

        if (search) {
            if (!cursor) {
                userList = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        username: "asc",
                    },
                    take: ITEM_LIMIT,
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        telegramId: true, // Tambahkan telegramId di sini
                        passwordUpdatedAt: true,
                        profil: { select: { full_name: true, photo: true } },
                        role: { select: { name: true } },
                    },
                });
            }

            if (cursor) {
                userList = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                    take: ITEM_LIMIT,
                    skip: 1,
                    cursor: {
                        id: cursor,
                    },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        telegramId: true, // Tambahkan telegramId di sini
                        passwordUpdatedAt: true,
                        profil: { select: { full_name: true, photo: true } },
                        role: { select: { name: true } },
                    },
                });
            }
        }

        if (!search) {
            if (!cursor) {
                userList = await prisma.user.findMany({
                    orderBy: {
                        username: "asc",
                    },
                    take: ITEM_LIMIT,
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        telegramId: true, // Tambahkan telegramId di sini
                        passwordUpdatedAt: true,
                        profil: { select: { full_name: true, photo: true } },
                        role: { select: { name: true } },
                    },
                });
            }
            if (cursor) {
                userList = await prisma.user.findMany({
                    orderBy: {
                        username: "asc",
                    },
                    take: ITEM_LIMIT,
                    skip: 1,
                    cursor: {
                        id: cursor,
                    },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        telegramId: true, // Tambahkan telegramId di sini
                        passwordUpdatedAt: true,
                        profil: { select: { full_name: true, photo: true } },
                        role: { select: { name: true } },
                    },
                });
            }
        }

        return resSuccess({
            res,
            title: "Success get user list",
            data: userList,
        });
    } catch (error) {
        return resError({
            res,
            title: "Cant get user list",
            errors: error,
        });
    }
};


exports.profileUpdate = async (req, res) => {
    try {
        const { email, password, username, telegramId } = req.body; // Tambahkan telegramId ke destructuring assignment
        const id = await getUser(req);
        const currentData = await prisma.user.findUnique({
            where: { id },
            include: { profil: true } // Memasukkan profil agar dapat diakses
        });

        // Validate and check for email change
        if (email && email !== currentData.email) {
            const checkUser = await prisma.user.findUnique({
                where: { email },
            });
            if (checkUser) throw new Error("Email already exists or registered");
        }

        // Hash the new password if provided
        let hashedPassword = null;
        if (password) {
            hashedPassword = await generateHash(password);
        }

        // Update user data
        const newData = await prisma.user.update({
            where: { id },
            data: {
                email: email || currentData.email,
                emailIsVerified: email ? currentData.email === email : currentData.emailIsVerified,
                ...(hashedPassword && { password: hashedPassword }),
                username: username || currentData.username, // Update username jika ada perubahan
                telegramId: telegramId || currentData.telegramId, // Update telegramId jika ada perubahan
                profil: {
                    update: {
                        full_name: username || currentData.profil.full_name,
                        telegramId: telegramId || currentData.profil.telegramId // Update telegramId juga di profil
                    },
                },
                updatedAt: new Date(Date.now() - 1000),
            },
            select: {
                id: true,
                username: true,
                email: true,
                telegramId: true, // Tambahkan telegramId pada hasil seleksi
                emailIsVerified: true,
                profil: {
                    select: {
                        full_name: true,
                        telegramId: true,
                    },
                },
            },
        });

        // Set new cookie for the user
        setCookie({
            res,
            title: "Authorization",
            data: generateAuthorizationToken({
                data: { userID: newData.id, username: newData.username },
            }),
        });

        return resSuccess({
            res,
            title: "Successfully updated your profile",
            data: newData,
        });
    } catch (err) {
        console.log(err);
        return resError({ res, errors: err.message || err, title: "Failed to update profile" });
    }
};
