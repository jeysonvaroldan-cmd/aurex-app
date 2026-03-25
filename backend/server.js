require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* 👉 ПОДКЛЮЧАЕМ FRONTEND */
app.use(express.static(path.join(__dirname, '..', 'frontend')));

/* 👉 ГЛАВНАЯ СТРАНИЦА */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

/* 👉 API ОТПРАВКИ */
app.post('/send', async (req, res) => {

    console.log("🔥 Запрос пришёл!", req.body);

    const { username, name, country, city } = req.body;

    const text = `
🆕 Новая заявка

👤 Username: ${username}
🧑 Имя: ${name}
🌍 Страна: ${country}
🏙 Город: ${city}
`;

    try {
        const tg = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: text
            })
        });

        const data = await tg.json();
        console.log("📩 Telegram ответ:", data);

        await fetch("https://script.google.com/macros/s/AKfycbw9-d4xWwaQ2_dEetv7FldZHRaJqfWjBThy5Lb88K1muHZcBr_b_SQ5N5cb-ogeVbA/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        username,
        name,
        country,
        city
    })
});
        res.json({ ok: true });

    } catch (err) {
        console.log("❌ Ошибка:", err);
        res.status(500).json({ ok: false });
    }
});

/* 👉 СТАРТ */
app.listen(3000, () => {
    console.log('🚀 Server started on http://localhost:3000');
});