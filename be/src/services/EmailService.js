// services/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Tạo transporter với cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    }
});

// Hàm gửi email mã xác nhận
const sendOrderConfirmationEmail = async (to, orderDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Order Confirmation',
        html: `
            <h1>Thank you for your order!</h1>
            <p>Here are the details:</p>
            <ul>
                <li><strong>Order ID:</strong> ${orderDetails._id}</li>
                <li><strong>Amount:</strong> ${orderDetails.amount}</li>
                <li><strong>Address:</strong> ${orderDetails.address}</li>
                <li><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</li>
            </ul>
            <h2>Items:</h2>
            <div>
                ${orderDetails.items.map(item => `
                    <div style="margin-bottom: 10px;">
                        <p style="font-weight: bold;">${item.product.name}</p>
                        ${Object.entries(item.sizes).map(
                            ([size, quantity]) => `
                                <p style="color: gray; font-size: 12px;">
                                    Size: ${size} x ${quantity}
                                </p>
                            `
                        ).join('')}
                    </div>
                `).join('')}
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

module.exports = { sendOrderConfirmationEmail };