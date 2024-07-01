const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const botToken = '7048836463:AAEJ2AtPDcCRNIWmwuLXjSKK6HewFSw6PvI'; // Ganti dengan token bot Telegram Anda
const sendTelegramMessageByUsername = async (telegramId, message) => {
    try {
        // Fetch user from the database based on telegramId
        const user = await prisma.user.findFirst({
            where: { telegramId },
            select: { telegramId: true }
        });

        if (!user || !user.telegramId) {
            throw new Error('User not found or telegramId is empty');
        }

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: user.telegramId,
            text: message
        });

        console.log('Telegram API response:', response.data); // Log response data

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send Telegram message');
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

        const response = await axios.post(url, {
            chat_id: telegramId,
            text: message
        });

        console.log('Telegram API response:', response.data); // Log response data

        console.log('Message sent successfully');
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        throw new Error('Failed to send Telegram message');
    } finally {
        await prisma.$disconnect();
    }
};

module.exports = {
    sendTelegramMessageByKodeUnik,
    sendTelegramMessageByUsername
};
