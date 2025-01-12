const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const { reconcileTransaction } = require("./reconciliationService");
const HTMLReportService = require("./htmlReportService");

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

        worksheet.autoFilter = {
            from: "A1",
            to: "I1",
        };

        // Tạo sheet biểu đồ phân tích trạng thái
        const statusCounts = summary.reduce((acc, curr) => {
            const object = {
                _id: curr.status,
                count: 1,
                amount: curr.mainSystemAmount,
            };

            const existing = acc.find((item) => item._id === object._id);

            if (existing) {
                existing.count += object.count;
                existing.amount += object.amount;
            } else {
                acc.push(object);
            }

            return acc;
        }, []);

        const statusAnalysisSheet = workbook.addWorksheet("Status Analysis");

        statusAnalysisSheet.columns = [
            { header: "Status", key: "status", width: 15 },
            { header: "Count", key: "count", width: 15 },
            { header: "Total Amount", key: "amount", width: 20 },
            { header: "Percentage", key: "percentage", width: 15 },
        ];

        const statusTotal = statusCounts.reduce((a, b) => a + b.count, 0);

        statusCounts.forEach((item) => {
            statusAnalysisSheet.addRow({
                status: item._id,
                count: item.count,
                amount: item.amount,
                percentage: `${((item.count / statusTotal) * 100).toFixed(2)}%`,
            });
        });

        statusAnalysisSheet.getRow(1).font = { bold: true };
        statusAnalysisSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
        };
        statusAnalysisSheet.getColumn("amount").numFmt = "#,##0.00";

        // Tạo sheet biểu đồ phân tích phân tích theo thời gian
        const dateCounts = summary
            .reduce((acc, curr) => {
                const date = new Date(curr.reconciliationDate).toLocaleDateString();

                const object = {
                    _id: date,
                    total: 1,
                    matched: curr.status === "MATCHED" ? 1 : 0,
                    mismatched: curr.status === "MISMATCHED" ? 1 : 0,
                    pending: curr.status === "PENDING" ? 1 : 0,
                    amount: curr.mainSystemAmount,
                };

                const existing = acc.find((item) => item._id === object._id);

                if (existing) {
                    existing.total += object.total;
                    existing.matched += object.matched;
                    existing.mismatched += object.mismatched;
                    existing.pending += object.pending;
                    existing.amount += object.amount;
                } else {
                    acc.push(object);
                }

                return acc;
            }, [])
            .sort((a, b) => new Date(a._id) - new Date(b._id));

        const dateAnalysisSheet = workbook.addWorksheet("Date Analysis");

        dateAnalysisSheet.columns = [
            { header: "Date", key: "date", width: 15 },
            { header: "Total Transactions", key: "total", width: 20 },
            { header: "Matched", key: "matched", width: 15 },
            { header: "Mismatched", key: "mismatched", width: 15 },
            { header: "Pending", key: "pending", width: 15 },
            { header: "Total Amount", key: "amount", width: 20 },
        ];

        dateCounts.forEach((item) => {
            dateAnalysisSheet.addRow({
                date: item._id,
                total: item.total,
                matched: item.matched,
                mismatched: item.mismatched,
                pending: item.pending,
                amount: item.amount,
            });
        });

        dateAnalysisSheet.getRow(1).font = { bold: true };
        dateAnalysisSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
        };
        dateAnalysisSheet.getColumn("amount").numFmt = "#,##0.00";

        // Tạo sheet phân tích lý do sai khác
        const discrepancyReasons = summary.reduce((acc, curr) => {
            const object = {
                _id: curr.discrepancyReason || "N/A",
                count: 1,
                amount: curr.discrepancyAmount,
            };

            return acc;
        }, []);

        const discrepancyReasonsSheet = workbook.addWorksheet("Discrepancy Reasons");

        discrepancyReasonsSheet.columns = [
            { header: "Discrepancy Reason", key: "reason", width: 40 },
            { header: "Count", key: "count", width: 15 },
            { header: "Total Amount", key: "amount", width: 20 },
            { header: "Percentage", key: "percentage", width: 15 },
        ];

        const discrepancyTotal = discrepancyReasons.reduce((a, b) => a + b.count, 0);

        discrepancyReasons.forEach((item) => {
            discrepancyReasonsSheet.addRow({
                reason: item._id,
                count: item.count,
                amount: item.amount,
                percentage: `${((item.count / discrepancyTotal) * 100).toFixed(2)}%`,
            });
        });

        discrepancyReasonsSheet.getRow(1).font = { bold: true };
        discrepancyReasonsSheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
        };
        discrepancyReasonsSheet.getColumn("amount").numFmt = "#,##0.00";

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

        const data = await reconcileTransaction(
            new Date(filters.startDate),
            new Date(filters.endDate)
        );

        const htmlReport = await HTMLReportService.generateHTMLReport(data.DT, filters);
        const htmlFileName = `Reconciliation_Report_${new Date().getTime()}.html`;
        const htmlFilePath = `./public/reports/${htmlFileName}`;
        fs.writeFileSync(htmlFilePath, htmlReport);

        const templateData = {
            startDate: new Date(filters.startDate).toLocaleDateString(),
            endDate: new Date(filters.endDate).toLocaleDateString(),
            filters: {
                status: filters.status || "All",
                paymentMethod: filters.paymentMethod || "All",
                minDiscrepancyAmount: filters.minDiscrepancyAmount || "N/A",
                maxDiscrepancyAmount: filters.maxDiscrepancyAmount || "N/A",
            },
            recipient: process.env.ADMIN_EMAILS.split(",")[0],
            generatedDate: new Date().toLocaleString(),
        };

        const rootPath = path.join(__dirname, "..");

        console.log(">>> rootPath:", rootPath);

        const htmlContent = handlebars.compile(
            fs.readFileSync(path.join(rootPath, "views/templates/report-email.handlebars"), "utf8")
        )(templateData);

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAILS.split(","),
            subject: "Reconciliation Report",
            html: htmlContent,
            attachments: [
                {
                    filename: fileName,
                    path: filePath,
                },
                {
                    filename: htmlFileName,
                    path: htmlFilePath,
                },
            ],
        });

        fs.unlinkSync(filePath);
        fs.unlinkSync(htmlFilePath);

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
