const authRouter = require("./auth");
const productRouter = require("./productR");
const cartRouter = require("./cartR");
const orderRouter = require("./orderR");

const auth = require("../middleware/auth");

function route(app) {
   app.all("*", auth);

  app.use('/category', require('./categoryR'));
  app.use('order', orderRouter);
  app.use('/cart', cartRouter);
  app.use('/product', productRouter);
  app.use('/', authRouter);  
  
}

module.exports = route;
