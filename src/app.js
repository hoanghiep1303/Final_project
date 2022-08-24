const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const ConnectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const route = require('./routes');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('req-flash');
ConnectDB();
dotenv.config();

const hbs = exphbs.create({  
    // helpers:require('./ulti/helpers'),
    extname: '.hbs'
  })
  

//Template engine
app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'resources/views'))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('combined'));

route(app);


app.use(express.static(path.join(__dirname, 'public')));


//Run server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is listening at http://localhost:${PORT}`);
});

