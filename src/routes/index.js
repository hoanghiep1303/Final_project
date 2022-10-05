const siteRouter = require('./site');
const productRouter = require('./product');
const adminRouter = require('./admin');
const cartRouter = require('./cart');
const categoryRouter = require('./category');
const userRouter = require('./user');
const { isLoggined, isAdmin } = require('../ulti/login');
const {upload} = require('../ulti/imagestorage');
const multer = require('multer');


function route(app){
    app.use('/user', upload.single('image'), userRouter);

    app.use('/category', upload.single('image'),isLoggined,categoryRouter);

    app.use('/product', upload.single('image'),isLoggined,productRouter);

    app.use('/admin', isLoggined,isAdmin,adminRouter);

    app.use('/cart' , isLoggined,cartRouter)

    app.use('/', siteRouter);

}

module.exports = route;