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

// Hàm gửi email mã xác nhận đơn hàng
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
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px;">Image</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Size</th>
                        <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderDetails.items.map(item => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">
                                <img src="${item.product.image}" alt="${item.product.name}" style="width: 50px; height: 50px;">
                            </td>
                            <td style="border: 1px solid #ddd; padding: 8px;">
                                <p style="font-weight: bold;">${item.product.name}</p>
                            </td>
                            <td style="border: 1px solid #ddd; padding: 8px;">
                                ${Object.entries(item.sizes).map(
                                    ([size, quantity]) => `
                                        <p style="color: gray; font-size: 12px;">
                                            Size: ${size}
                                        </p>
                                    `
                                ).join('')}
                            </td>
                            <td style="border: 1px solid #ddd; padding: 8px;">
                                ${Object.entries(item.sizes).map(
                                    ([size, quantity]) => `
                                        <p style="color: gray; font-size: 12px;">
                                            ${quantity}
                                        </p>
                                    `
                                ).join('')}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

// Hàm gửi email mã PIN
const sendPinEmail = async (to, pin, purpose) => {
    const subject = purpose === 'order_confirmation' ? 'Order Transaction PIN' : 'Registration PIN';
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: `
            <h1>${subject}</h1>
            <p>Your transaction PIN is: <strong>${pin}</strong></p>
            <p>Please use this PIN to confirm your ${purpose === 'order_confirmation' ? 'order' : 'registration'} within 10 minutes.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Transaction PIN email sent successfully');
    } catch (error) {
        console.error('Error sending transaction PIN email:', error);
    }
};

module.exports = { sendOrderConfirmationEmail, sendPinEmail };