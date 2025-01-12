const schedule = require("node-schedule");

const { reconcileTransaction } = require("../services/reconciliationService");
const { sendAlert } = require("../services/notificationService");

const setupCronJobs = () => {
    schedule.scheduleJob("1 0 * * *", async () => {
        try {
            console.log(">>> Running reconciliation cron job...");

            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const startDate = new Date(yesterday.setHours(0, 0, 0, 0));
            const endDate = new Date(yesterday.setHours(23, 59, 59, 999));

            const data = await reconcileTransaction(startDate, endDate);

            const summary = data.DT;

            console.log(">>> Reconciliation summary:", summary);

            // Check for discrepancies
            if (summary.some((item) => item._id === "MISMATCHED" && item.count > 0)) {
                await sendAlert({
                    type: "RECONCILIATION_DISCREPANCY",
                    data: summary,
                });
            }
        } catch (error) {
            await sendAlert({
                type: "RECONCILIATION_ERROR",
                error: error.message,
            });
        }
    });
};

module.exports = setupCronJobs;
