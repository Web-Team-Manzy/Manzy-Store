const paymentRoute = require("./payment.route");

function route(app) {
    //app.all("*", auth);

    app.use("/payment", paymentRoute);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });
}

module.exports = route;
