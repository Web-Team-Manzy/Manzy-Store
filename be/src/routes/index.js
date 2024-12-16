const authRouter = require('./auth');
const productRouter = require('./productR');
const cartRouter = require('./cartR');

function route(app) {

  app.use('/cart', cartRouter);
  app.use('/product', productRouter);
  app.use('/', authRouter);  
  
}

module.exports = route;