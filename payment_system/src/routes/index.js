const accountRoute = require("./account.route");
const transactionRoute = require("./transaction.route");
const reconcileRoute = require("./reconciliation.route");

function route(app) {
    //app.all("*", auth);

    app.use("/payment", accountRoute);

    app.use("/payment/transaction", transactionRoute);

    app.use("/payment/reconciliation", reconcileRoute);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
}

module.exports = route;
