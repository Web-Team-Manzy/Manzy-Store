const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

class HTMLReportService {
    constructor() {
        // Đọc template HTML
        const rootPath = path.join(__dirname, "..");

        this.template = fs.readFileSync(
            path.join(rootPath, "views/templates/chart-report.handlebars"),
            "utf-8"
        );
        this.compiledTemplate = handlebars.compile(this.template);
    }

    async generateHTMLReport(data, filters) {
        // Chuẩn bị dữ liệu cho các biểu đồ
        const chartData = await this.prepareChartData(data);

        // Generate HTML với data
        return this.compiledTemplate({
            filters,
            chartData: JSON.stringify(chartData),
            generatedDate: new Date().toLocaleString(),
        });
    }

    async prepareChartData(data) {
        // 1. Dữ liệu cho Status Distribution (Pie Chart)
        const statusData = await this.aggregateByStatus(data);

        // 2. Dữ liệu cho Daily Trend (Line Chart)
        const trendData = await this.aggregateByDate(data);

        // 3. Dữ liệu cho Discrepancy Analysis (Bar Chart)
        const discrepancyData = await this.aggregateByDiscrepancy(data);

        // 4. Dữ liệu cho Payment Method Analysis (Bar Chart)
        const paymentMethodData = await this.aggregateByPaymentMethod(data);

        return {
            statusData,
            trendData,
            discrepancyData,
            paymentMethodData,
        };
    }

    async aggregateByStatus(data) {
        const aggregated = data.reduce((acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
        }, {});

        return {
            labels: Object.keys(aggregated),
            datasets: [
                {
                    data: Object.values(aggregated),
                    backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
                },
            ],
        };
    }

    async aggregateByDate(data) {
        const aggregated = data.reduce((acc, record) => {
            const date = new Date(record.reconciliationDate).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { MATCHED: 0, MISMATCHED: 0, PENDING: 0 };
            }
            acc[date][record.status]++;
            return acc;
        }, {});

        const dates = Object.keys(aggregated);
        return {
            labels: dates,
            datasets: [
                {
                    label: "Matched",
                    data: dates.map((date) => aggregated[date].MATCHED),
                    borderColor: "#36A2EB",
                },
                {
                    label: "Mismatched",
                    data: dates.map((date) => aggregated[date].MISMATCHED),
                    borderColor: "#FF6384",
                },
                {
                    label: "Pending",
                    data: dates.map((date) => aggregated[date].PENDING),
                    borderColor: "#FFCE56",
                },
            ],
        };
    }

    async aggregateByDiscrepancy(data) {
        const aggregated = data.reduce((acc, record) => {
            if (record.discrepancyReason) {
                acc[record.discrepancyReason] = (acc[record.discrepancyReason] || 0) + 1;
            }
            return acc;
        }, {});

        return {
            labels: Object.keys(aggregated),
            datasets: [
                {
                    label: "Number of Cases",
                    data: Object.values(aggregated),
                    backgroundColor: "#36A2EB",
                },
            ],
        };
    }

    async aggregateByPaymentMethod(data) {
        const aggregated = data.reduce((acc, record) => {
            if (!acc[record.paymentMethod]) {
                acc[record.paymentMethod] = { MATCHED: 0, MISMATCHED: 0, PENDING: 0 };
            }
            acc[record.paymentMethod][record.status]++;
            return acc;
        }, {});

        const methods = Object.keys(aggregated);
        return {
            labels: methods,
            datasets: [
                {
                    label: "Matched",
                    data: methods.map((method) => aggregated[method].MATCHED),
                    backgroundColor: "#36A2EB",
                },
                {
                    label: "Mismatched",
                    data: methods.map((method) => aggregated[method].MISMATCHED),
                    backgroundColor: "#FF6384",
                },
                {
                    label: "Pending",
                    data: methods.map((method) => aggregated[method].PENDING),
                    backgroundColor: "#FFCE56",
                },
            ],
        };
    }
}

module.exports = new HTMLReportService();
