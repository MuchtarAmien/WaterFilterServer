const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const botToken = '7048836463:AAEJ2AtPDcCRNIWmwuLXjSKK6HewFSw6PvI'; // Ganti dengan token bot Telegram Anda
const sendTelegramMessageByUsername = async (req, message) => {
    try {
        const { username } = req;

        // Ambil user dari database berdasarkan username
        const user = await prisma.user.findFirst({
            where: { username },
            select: { telegramId: true, username: true }
        });

        console.log('User found:', user);

        if (!user) {
            throw new Error('User not found');
        }

        if (!user.telegramId) {
            throw new Error('User found but telegramId is empty');
        }

        console.log('Username:', user.username); // Tampilkan username di konsol

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await axios.post(url, {
            chat_id: user.telegramId,
            text: message
        });

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};
const sendTelegramMessageByKodeUnik = async (message, data) => {
    try {
        const device = await prisma.perangkat.findFirst({
            where: { kode_unik: data.kode_unik },
            include: {
                User: {
                    select: { profil: { select: { telegramId: true } } }
                }
            }
        });

        if (!device || !device.User || !device.User.profil || !device.User.profil.telegramId) {
            throw new Error('User not found or telegramId is empty');
        }

        const { telegramId } = device.User.profil;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await axios.post(url, {
            chat_id: telegramId,
            text: message
        });

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.message);
    } finally {
        await prisma.$disconnect();
    }
};



module.exports = {
    sendTelegramMessageByKodeUnik,
    sendTelegramMessageByUsername
};
