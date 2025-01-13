const schedule = require("node-schedule");

const { reconcileTransaction } = require("../services/reconciliationService");
const { sendAlert, sendReportEmail } = require("../services/notificationService");

const setupCronJobs = () => {
    // 1 0 * * * : run at 00:01 every day
    // * * * * * : run every minute
    schedule.scheduleJob("* * * * *", async () => {
        try {
            console.log(">>> Running reconciliation cron job...");

            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const startDate = new Date(yesterday.setHours(0, 0, 0, 0));
            const endDate = new Date(Date.now());

            await sendReportEmail({
                startDate,
                endDate,
            });
        } catch (error) {
            console.log(">>> Reconciliation cron job error:", error);
        }
    });

    // weekly report
    // 1 0 * * 1
    // schedule.scheduleJob("1 0 * * 1", async () => {
    //     try {
    //         console.log(">>> Running weekly report cron job...");

    //         const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    //         const startDate = new Date(lastWeek.setHours(0, 0, 0, 0));
    //         const endDate = new Date(Date.now());

    //         await sendReportEmail({
    //             startDate,
    //             endDate,
    //         })
    //     } catch (error) {
    //         console.log(">>> Weekly report cron job error:", error);
    //     }
    // });
};

module.exports = setupCronJobs;
