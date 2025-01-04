const authRouter = require("./auth");
const productRouter = require("./productR");
const cartRouter = require("./cartR");
const orderRouter = require("./orderR");
const userRouter = require("./users.route");
const categoryRouter = require("./categoryR");
const transactionRoute = require("./transactionR");

const auth = require("../middleware/auth");

function route(app) {
    // app.all("*", auth);

    app.use("/category", categoryRouter);
    app.use("/order", orderRouter);
    app.use("/cart", cartRouter);
    app.use("/product", productRouter);
    app.use("/users", userRouter);
    app.use("/transaction", transactionRoute);

    app.use("/", authRouter);
}

module.exports = route;
