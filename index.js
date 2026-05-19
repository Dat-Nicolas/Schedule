const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// API Endpoint nhận lệnh từ Cron-job.org
app.get('/trigger-chat', async (req, res) => {
    // Bảo mật: Kiểm tra Secret Token để tránh người lạ tự gọi API của bạn
    const cronToken = req.headers['x-cron-token'];
    if (cronToken !== process.env.CRON_SECRET_TOKEN) {
        return res.status(401).send('Unauthorized');
    }

    try {
        console.log("=== Bắt đầu tiến trình chat tự động vào 6h sáng ===");
        
        // --- ĐOẠN CODE GỌI API CHAT CỦA BẠN Ở ĐÂY ---
        // Ví dụ logic: Gọi sang API của Claude/Gemini, lấy câu trả lời rồi bắn về Telegram/Slack/Discord...
        const messageToSend = "Chào buổi sáng! Đây là tin nhắn tự động từ Cloud.";
        console.log(`Đang gửi tin nhắn: ${messageToSend}`);
        
        // Giả lập xử lý thành công
        res.status(200).send('Gửi tin nhắn thành công!');
    } catch (error) {
        console.error('Lỗi xử lý chat:', error);
        res.status(500).send('Xử lý thất bại');
    }
});

// Endpoint mặc định để kiểm tra trạng thái app (Health check)
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
});