const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const { reconcileTransaction } = require("./reconciliationService");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const generateExcelReport = async (filters) => {
    try {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Reconciliation Report");
        worksheet.columns = [
            { header: "Order ID", key: "orderIdEX", width: 30 },
            { header: "Transaction ID", key: "transactionIdEX", width: 30 },
            { header: "Main System Amount", key: "mainSystemAmountEX", width: 20 },
            { header: "Payment System Amount", key: "paymentSystemAmountEX", width: 20 },
            { header: "Discrepancy Amount", key: "discrepancyAmountEX", width: 20 },
            { header: "Status", key: "statusEX", width: 15 },
            { header: "Payment Method", key: "paymentMethodEX", width: 15 },
            { header: "Discrepancy Reason", key: "discrepancyReasonEX", width: 40 },
            { header: "Reconciliation Date", key: "reconciliationDateEX", width: 20 },
            { header: "Processed By", key: "processedByEX", width: 20 },
        ];

        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
        };

        worksheet.addConditionalFormatting({
            ref: "H2:H1000",
            rules: [
                {
                    type: "expression",
                    formulae: ["NOT(ISBLANK(H2))"],
                    style: {
                        fill: {
                            type: "pattern",
                            pattern: "solid",
                            bgColor: { argb: "FFFFD7D7" },
                        },
                    },
                },
            ],
        });

        let query = {
            reconciliationDate: {
                startDate: new Date(filters.startDate),
                endDate: new Date(filters.endDate),
            },
        };

        if (filters.status) query.status = filters.status;
        if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
        if (filters.minDiscrepancyAmount || filters.maxDiscrepancyAmount) {
            query.discrepancyAmount = {};
            if (filters.minDiscrepancyAmount)
                query.discrepancyAmount.$gte = filters.minDiscrepancyAmount;
            if (filters.maxDiscrepancyAmount)
                query.discrepancyAmount.$lte = filters.maxDiscrepancyAmount;
        }

        const data = await reconcileTransaction(
            query.reconciliationDate.startDate,
            query.reconciliationDate.endDate
        );

        const summary = data.DT;

        summary.forEach((record) => {
            console.log(">>> record:", record);
            const row = worksheet.addRow({
                orderIdEX: record.orderId,
                transactionIdEX: record.transactionId.toString(),
                reconciliationDateEX: new Date(record.reconciliationDate).toLocaleDateString(),
                mainSystemAmountEX: record.mainSystemAmount,
                paymentSystemAmountEX: record.paymentSystemAmount,
                discrepancyAmountEX: record.discrepancyAmount,
                discrepancyReasonEX: record.discrepancyReason || "N/A",
                statusEX: record.status,
                paymentMethodEX: record.paymentMethod,
                processedByEX: record.processedBy,
            });
            row.getCell("mainSystemAmountEX").numFmt = "#,##0.00";
            row.getCell("paymentSystemAmountEX").numFmt = "#,##0.00";
            row.getCell("discrepancyAmountEX").numFmt = "#,##0.00";
        });

        return workbook;
    } catch (error) {
        console.log(">>> generateExcelReport error:", error);
        return null;
    }
};

const sendReportEmail = async (filters) => {
    try {
        const workbook = await generateExcelReport(filters);

        const fileName = `Reconciliation_Report_${new Date().getTime()}.xlsx`;
        const filePath = `./public/reports/${fileName}`;

        await workbook.xlsx.writeFile(filePath);

        return true;
    } catch (error) {
        console.log(">>> sendReportEmail error:", error);
        return false;
    }
};

const sendAlert = async ({ type, data, error }) => {
    try {
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
    sendReportEmail,
};
