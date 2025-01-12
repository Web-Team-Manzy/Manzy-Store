const nodemailer = require("nodemailer");

const sendAlert = async ({ type, data, error }) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const adminEmails = process.env.ADMIN_EMAILS.split(",");

        let subject = "";
        let content = "";

        switch (type) {
            case "RECONCILIATION_DISCREPANCY":
                subject = "Reconciliation Discrepancy Alert";
                content = `
                Discrepancies found in daily reconciliation:
                ${JSON.stringify(data, null, 2)}
              `;
                break;
            case "RECONCILIATION_ERROR":
                subject = "Reconciliation System Error";
                content = `Error during reconciliation: ${error}`;
                break;
        }

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: adminEmails,
            subject,
            text: content,
        });
    } catch (error) {
        console.log(">>> sendAlert error:", error);
    }
};

module.exports = {
    sendAlert,
};
