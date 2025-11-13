// server.js

// Tải các biến môi trường từ file .env
require('dotenv').config();

const express = require('express');
// const nodemailer = require('nodemailer'); // Bỏ Nodemailer
const { Resend } = require('resend'); // Thêm Resend
const multer = require('multer');

const app = express();

// Lấy thông tin từ Biến Môi Trường (.env)
const PORT = process.env.PORT || 3000;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
// const APP_PASSWORD = process.env.APP_PASSWORD; // Bỏ APP_PASSWORD
const RESEND_API_KEY = process.env.RESEND_API_KEY; // Thêm RESEND_API_KEY
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL;

// Kiểm tra biến môi trường quan trọng
if (!SENDER_EMAIL || !RESEND_API_KEY || !RECEIVER_EMAIL) {
    console.error("LỖI CẤU HÌNH: Thiếu SENDER_EMAIL, RESEND_API_KEY, hoặc RECEIVER_EMAIL trong file .env!");
    process.exit(1);
}

// --- Khởi tạo Resend Client ---
const resend = new Resend(RESEND_API_KEY);

// Cấu hình Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('resume');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Hàm chuyển đổi file Buffer sang Base64 cho Resend
function bufferToBase64(buffer, filename) {
    return {
        content: buffer.toString('base64'),
        filename: filename
    };
}

// ------------------------------------------------------------------
// --- ENDPOINT API: /api/send-application (Sử dụng Resend) ---
// ------------------------------------------------------------------
app.post('/api/send-application', (req, res) => {

    upload(req, res, async (err) => {

        try {
            // Xử lý lỗi File Size từ Multer
            if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'Kích thước file CV quá lớn (tối đa 5MB).' });
            } else if (err) {
                console.error('Lỗi Multer:', err);
                return res.status(500).json({ success: false, message: 'Lỗi xử lý file đính kèm.' });
            }

            // Lấy dữ liệu từ form (req.body) và file (req.file)
            const { full_name, email, phone, job_position, notes } = req.body;
            const file = req.file;

            if (!file) {
                return res.status(400).json({ success: false, message: 'Chưa có file CV đính kèm.' });
            }

            const safeNotes = notes ? notes.replace(/</g, "&lt;").replace(/>/g, "&gt;") : 'Không có ghi chú.';
            const attachment = bufferToBase64(file.buffer, file.originalname);


            // --- 1. Gửi Đơn Ứng Tuyển cho NHÀ TUYỂN DỤNG ---
            const recruiterMailData = {
                from: `${full_name} <${SENDER_EMAIL}>`, // Resend yêu cầu format này
                to: [RECEIVER_EMAIL],
                reply_to: email, // Resend dùng reply_to
                subject: `[Ứng Tuyển] Vị trí ${job_position} từ ${full_name}`,
                html: `
                    <h3>Thông tin ứng viên mới:</h3>
                    <p><strong>Họ và tên:</strong> ${full_name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Điện thoại:</strong> ${phone}</p>
                    <p><strong>Vị trí ứng tuyển:</strong> ${job_position}</p>
                    <p><strong>Ghi chú:</strong> ${safeNotes}</p>
                    <hr>
                    <p><i>CV đã được đính kèm.</i></p>
                `,
                attachments: [attachment] // Resend dùng mảng attachments với định dạng Base64
            };

            await resend.emails.send(recruiterMailData);


            // --- 2. Gửi Email Xác nhận cho ỨNG VIÊN ---
            const confirmationMailData = {
                from: `"Bộ phận Tuyển dụng" <${SENDER_EMAIL}>`,
                to: [email],
                subject: `[Xác nhận] Đã nhận đơn ứng tuyển vị trí ${job_position}`,
                html: `
                    Xin chào ${full_name},
                    <br><br>
                    Chúng tôi đã nhận được đơn ứng tuyển của bạn cho vị trí <b>${job_position}</b>.
                    <br>
                    Cảm ơn bạn đã quan tâm. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                    <br><br>
                    Trân trọng,
                    <br>
                    Công ty KCGAMES
                `,
            };

            await resend.emails.send(confirmationMailData);

            // Phản hồi thành công về Frontend
            res.status(200).json({ success: true, message: 'Đơn ứng tuyển và email xác nhận đã được gửi thành công.' });

        } catch (error) {

            console.error('Lỗi gửi đơn hoặc xử lý server:', error);
            // Resend trả về lỗi khác EAUTH/ETIMEDOUT, nên ta dùng thông báo chung
            let userMessage = 'Lỗi hệ thống: Không thể gửi đơn ứng tuyển. Vui lòng thử lại.';

            res.status(500).json({ success: false, message: userMessage });

        }
    });
});


// ------------------------------------------------------------------
// --- ENDPOINT API: /api/send-contact (Sử dụng Resend) ---
// ------------------------------------------------------------------
const textOnlyParser = express.urlencoded({ extended: true });

app.post('/api/send-contact', textOnlyParser, async (req, res) => {
    try {
        const { full_name, email, notes } = req.body;

        if (!full_name || !email || !notes) {
            return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ Họ tên, Email và Nội dung.' });
        }

        // --- 1. Gửi Email Liên hệ tới Nhà Tuyển Dụng ---
        const mailData = {
            from: `${full_name} <${SENDER_EMAIL}>`, // Resend yêu cầu format này
            to: [RECEIVER_EMAIL],
            reply_to: email, // Resend dùng reply_to
            subject: `[LIÊN HỆ MỚI] Từ ${full_name}`,
            html: `
                <h3>Thông tin liên hệ:</h3>
                <p><strong>Họ và tên:</strong> ${full_name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Nội dung:</strong> ${notes.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            `,
        };

        await resend.emails.send(mailData);

        res.status(200).json({ success: true, message: 'Gửi thông tin thành công.' });

    } catch (error) {
        console.error('Lỗi gửi liên hệ:', error);
        res.status(500).json({ success: false, message: 'Không thể gửi thông tin. Vui lòng thử lại sau.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});


module.exports = app;