const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ====== HÀM GỬI TELEGRAM ======
async function sendTelegramMessage(text) {
  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.log("❌ Thiếu TELEGRAM_TOKEN hoặc CHAT_ID");
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
      }),
    });

    const data = await response.json();
    console.log("✅ Đã gửi Telegram:", data.ok);
  } catch (err) {
    console.error("❌ Lỗi gửi Telegram:", err);
  }
}

// ====== API CHO CRON ======
app.get("/trigger-chat", async (req, res) => {
  const cronToken = req.headers["x-cron-token"];

  if (cronToken !== process.env.CRON_SECRET_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  try {
    console.log("=== Cron trigger ===");

    const message = "🌅 Chào buổi sáng! Đây là tin nhắn tự động từ Cloud.";

    // 👉 Gửi Telegram
    await sendTelegramMessage(message);

    res.status(200).send("Gửi tin nhắn thành công!");
  } catch (error) {
    console.error("Lỗi xử lý:", error);
    res.status(500).send("Xử lý thất bại");
  }
});

// ====== HEALTH CHECK ======
app.get("/", (req, res) => {
  res.send("Bot is running!");
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`Server đang chạy tại port ${PORT}`);
});