const authRouter = require('./auth');
const productRouter = require('./productR');
const cartRouter = require('./cartR');
const orderRouter = require('./orderR');

function route(app) {
  app.use('/category', require('./categoryR'));
  app.use('order', orderRouter);
  app.use('/cart', cartRouter);
  app.use('/product', productRouter);
  app.use('/', authRouter);  
  
}

module.exports = route;