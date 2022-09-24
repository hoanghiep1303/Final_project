const siteRouter = require('./site');
const productRouter = require('./product');
const adminRouter = require('./admin');
const cartRouter = require('./cart');
const categoryRouter = require('./category');
const { isLoggined, isAdmin } = require('../ulti/login');


function route(app){
    app.use('/category', isLoggined,categoryRouter);

    app.use('/product', isLoggined,productRouter);

    app.use('/admin', isLoggined,isAdmin,adminRouter);

    app.use('/cart' , isLoggined,cartRouter)

    app.use('/', siteRouter);

}

module.exports = route;