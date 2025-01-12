const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Tạo transporter với cấu hình SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// Hàm gửi email mã xác nhận đơn hàng
const sendOrderConfirmationEmail = async (to, orderDetails) => {
  console.log("orderDetails", orderDetails);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Order Confirmation",
    html: `
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    color: #333;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                h1 {
                    color: #4CAF50;
                }
                ul {
                    list-style-type: none;
                    padding: 0;
                }
                li {
                    margin-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                    color: #333;
                }
                td img {
                    width: 50px;
                    height: 50px;
                    border-radius: 5px;
                }
                h2 {
                    margin-top: 20px;
                    color: #4CAF50;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    padding-top: 15px;
                }
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
            <h1>Thank you for your order!</h1>
            <p>Here are the details:</p>
            <ul>
                <li><strong>Order ID:</strong> ${orderDetails._id}</li>
                <li><strong>Amount:</strong> ${orderDetails.amount} $</li>
                <li><strong>Address:</strong> ${orderDetails.address.ward}, ${orderDetails.address.district}, ${orderDetails.address.city}</li>
                <li><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</li>
            </ul>
            <h2>Items:</h2>
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Size</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderDetails.items
                      .map(
                        (item) => ` 
                        <tr>
                            <td><img src="${item.product.images[0]}" alt="${item.product.name}"></td>
                            <td><p style="font-weight: bold;">${item.product.name}</p></td>
                            <td>${Object.entries(item.sizes)
                              .map(
                                ([size, quantity]) => `
                                    <p style="color: gray; font-size: 12px;">Size: ${size}</p>`
                              )
                              .join("")}
                            </td>
                            <td>${Object.entries(item.sizes)
                              .map(
                                ([size, quantity]) => `
                                    <p style="color: gray; font-size: 12px;">${quantity}</p>`
                              )
                              .join("")}
                            </td>
                        </tr>`
                      )
                      .join("")}
                </tbody>
            </table>
            <div class="footer">
                <p>If you have any questions, feel free to contact us.</p>
                <p>Thank you for shopping with us!</p>
                <p>
                    <strong>Shop Name:</strong> Manzy Store <br>
                    <strong>Email:</strong> nambui250403@gmail.com <br>
                    <strong>Phone:</strong> +84 327 357 359 <br>
                    <strong>Address:</strong> 62/31 Street No. 4, Thu Duc District, Ho Chi Minh City
                </p>
                <p>Visit our website: <a href="http://manzystore.com" target="_blank">http://manzystore.com</a></p>
            </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};

// Hàm gửi email mã PIN
const sendPinEmail = async (to, pin, purpose) => {
  const subject =
    purpose === "order_confirmation"
      ? "Order Transaction PIN"
      : "Registration PIN";
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html: `
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    color: #333;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                h1 {
                    color: #4CAF50;
                }
                h2 {
                    font-size: 36px;
                    color: #ff5722;
                    font-weight: bold;
                }
                p {
                    font-size: 16px;
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                    border-top: 1px solid #ddd;
                    padding-top: 15px;
                }
                .footer a {
                    color: #4CAF50;
                    text-decoration: none;
                }
            </style>
            <div style="text-align: center;">
                <h1>${subject}</h1>
                <p>Your transaction PIN is:</p>
                <h2>${pin}</h2>
                <p>Please use this PIN to confirm your ${purpose === "order_confirmation" ? "order" : "registration"} within 10 minutes.</p>
                <p style="font-size: 14px; color: #777;">If you did not request this PIN, please ignore this email.</p>
            </div>
            <div class="footer">
                <p>If you have any questions, please contact our support team.</p>
                <p>
                    <strong>Shop Name:</strong> Manzy Store <br>
                    <strong>Email:</strong> nambui250403@gmail.com <br>
                    <strong>Phone:</strong> +84 327 357 359 <br>
                    <strong>Address:</strong> 62/31 Street No. 4, Thu Duc District, Ho Chi Minh City
                </p>
                <p>Visit our website: <a href="http://manzystore.com" target="_blank">www.manzystore.com</a></p>
            </div>
        `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Transaction PIN email sent successfully");
  } catch (error) {
    console.error("Error sending transaction PIN email:", error);
  }
};


module.exports = { sendOrderConfirmationEmail, sendPinEmail };
