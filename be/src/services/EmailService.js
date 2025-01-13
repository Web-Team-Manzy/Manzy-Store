const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Cấu hình transporter với thông tin SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Gửi email xác nhận đơn hàng
 * @param {string} to - Địa chỉ email người nhận
 * @param {object} orderDetails - Thông tin đơn hàng
 */
const sendOrderConfirmationEmail = async (to, orderDetails) => {
  console.log("Sending order confirmation email with details:", orderDetails);

  const emailContent = `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px;">
    <h1 style="color: #4CAF50; text-align: center;">Thank you for your order!</h1>
    <p style="font-size: 16px; margin-top: 20px;">Here are the details:</p>
    <ul style="padding: 0; list-style: none; font-size: 14px;">
      <li style="margin-bottom: 10px;"><strong>Order ID:</strong> <span style="color: #ff5722; font-weight: bold;">${
        orderDetails._id
      }</span></li>
      <li style="margin-bottom: 10px;"><strong>Amount:</strong> <span style="color: #4CAF50; font-size: 18px;">${
        orderDetails.amount
      } $</span></li>
      <li style="margin-bottom: 10px;"><strong>Address:</strong> ${
        orderDetails.address.ward
      }, ${orderDetails.address.district}, ${orderDetails.address.city}</li>
      <li style="margin-bottom: 10px;"><strong>Payment Method:</strong> ${
        orderDetails.paymentMethod
      }</li>
    </ul>
    <h2 style="color: #4CAF50; margin-top: 20px;">Items:</h2>
    <table style="
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ">
      <thead>
        <tr>
          <th style="background: #f2f2f2; padding: 8px; text-align: left;">Image</th>
          <th style="background: #f2f2f2; padding: 8px; text-align: left;">Product</th>
          <th style="background: #f2f2f2; padding: 8px; text-align: left;">Size</th>
          <th style="background: #f2f2f2; padding: 8px; text-align: left;">Quantity</th>
        </tr>
      </thead>
      <tbody>
        ${orderDetails.items
          .map(
            (item) => `
          <tr>
            <td style="text-align: center; padding: 8px;">
              <img src="${item.product.images[0]}" alt="${
              item.product.name
            }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
            </td>
            <td style="padding: 8px;"><strong>${item.product.name}</strong></td>
            <td style="padding: 8px;">${Object.keys(item.sizes)
              .map((size) => `<p style="margin: 0; color: #555;">${size}</p>`)
              .join("")}</td>
            <td style="padding: 8px;">${Object.values(item.sizes)
              .map(
                (quantity) =>
                  `<p style="margin: 0; font-weight: bold; color: #4CAF50;">${quantity}</p>`
              )
              .join("")}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
      <p>If you have any questions, feel free to contact us.</p>
      <p><strong>Shop Name:</strong> Manzy Store<br>
      <strong>Email:</strong> nambui250403@gmail.com<br>
      <strong>Phone:</strong> +84 327 357 359<br>
      <strong>Address:</strong> 62/31 Street No. 4, Thu Duc District, Ho Chi Minh City</p>
      <p>Visit our website: <a href="http://manzystore.com" target="_blank" style="color: #4CAF50; text-decoration: none;">http://manzystore.com</a></p>
    </div>
  </div>
`;

  // Cấu hình email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Order Confirmation",
    html: emailContent,
  };

  // Gửi email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully.");
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
  }
};

/**
 * Gửi email mã PIN
 * @param {string} to - Địa chỉ email người nhận
 * @param {string} pin - Mã PIN
 * @param {string} purpose - Mục đích (order_confirmation hoặc registration)
 */
const sendPinEmail = async (to, pin, purpose) => {
  const subject =
    purpose === "order_confirmation"
      ? "Order Transaction PIN"
      : "Registration PIN";

  // HTML nội dung email
  const emailContent = `
  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; text-align: center; color: #333;">
    <h1 style="color: #4CAF50; margin-bottom: 20px;">${subject}</h1>
    <p style="font-size: 16px; margin: 10px 0;">Your transaction PIN is:</p>
    <h2 style="
      font-size: 48px;
      color: #ff5722;
      font-weight: bold;
      background: #fff3e0;
      border: 2px solid #ffab91;
      padding: 10px 20px;
      border-radius: 8px;
      display: inline-block;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    ">${pin}</h2>
    <p style="font-size: 16px; margin: 10px 0;">
      Please use this PIN to confirm your ${
        purpose === "order_confirmation" ? "order" : "registration"
      } within 10 minutes.
    </p>
    <p style="font-size: 14px; color: #777; margin: 20px 0;">If you did not request this PIN, please ignore this email.</p>
    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #777;">
      <p><strong>Shop Name:</strong> Manzy Store<br>
      <strong>Email:</strong> nambui250403@gmail.com<br>
      <strong>Phone:</strong> +84 327 357 359<br>
      <strong>Address:</strong> 62/31 Street No. 4, Thu Duc District, Ho Chi Minh City</p>
      <p>Visit our website: <a href="http://manzystore.com" target="_blank" style="color: #4CAF50; text-decoration: none;">www.manzystore.com</a></p>
    </div>
  </div>
`;

  // Cấu hình email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: emailContent,
  };

  // Gửi email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Transaction PIN email sent successfully.");
  } catch (error) {
    console.error("Failed to send transaction PIN email:", error);
  }
};

const sendEmail = async (from, to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
  
};

const sendRegistrationSuccessEmail = async (to, userName) => {
  const emailContent = `
        <div style="
            font-family: 'Arial', sans-serif; 
            background-color: #f3f4f6; 
            padding: 20px; 
            color: #333; 
            line-height: 1.6;">
            
            <!-- Email Container -->
            <div style="
                max-width: 600px; 
                margin: auto; 
                background-color: #ffffff; 
                padding: 30px; 
                border-radius: 10px; 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <h2 style="
                    color: #4CAF50; 
                    text-align: center;
                    font-weight: bold;">
                    Chào mừng đến với Manzy Store, ${userName}!
                </h2>

                <!-- Content -->
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Cảm ơn bạn đã đăng ký tài khoản tại Manzy Store. Chúng tôi rất vui được phục vụ bạn.
                </p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                    Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.
                </p>

                <!-- Contact Information -->
                <div style="
                    background-color: #f9f9f9; 
                    padding: 20px; 
                    border-radius: 8px; 
                    text-align: center;">
                    
                    <p style="font-size: 14px; margin: 5px 0;">
                        <strong>Shop Name:</strong> Manzy Store
                    </p>
                    <p style="font-size: 14px; margin: 5px 0;">
                        <strong>Email:</strong> 
                        <a href="mailto:nambui250403@gmail.com" style="color: #4CAF50; text-decoration: none;">nambui250403@gmail.com</a>
                    </p>
                    <p style="font-size: 14px; margin: 5px 0;">
                        <strong>Phone:</strong> 
                        <a href="tel:+84327357359" style="color: #4CAF50; text-decoration: none;">+84 327 357 359</a>
                    </p>
                    <p style="font-size: 14px; margin: 5px 0;">
                        <strong>Address:</strong> 
                        62/31 Street No. 4, Thu Duc District, Ho Chi Minh City
                    </p>
                </div>

                <!-- Call to Action -->
                <div style="text-align: center; margin-top: 20px;">
                    <a href="http://manzystore.com" target="_blank" 
                      style="
                            background-color: #4CAF50; 
                            color: white; 
                            padding: 10px 20px; 
                            text-decoration: none; 
                            font-size: 16px; 
                            border-radius: 5px;">
                        Visit Our Website
                    </a>
                </div>

                <!-- Footer -->
                <footer style="
                    margin-top: 30px; 
                    text-align: center; 
                    font-size: 12px; 
                    color: #999;">
                    <p>Bạn nhận được email này vì bạn đã đăng ký tại Manzy Store. Nếu bạn không thực hiện, vui lòng bỏ qua email này.</p>
                </footer>
            </div>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Đăng Ký Thành Công - Manzy Store",
        html: emailContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Registration success email sent successfully.");
    } catch (error) {
        console.error("Failed to send registration success email:", error);
    }
};


module.exports = { sendOrderConfirmationEmail, sendPinEmail, sendEmail , sendRegistrationSuccessEmail };
