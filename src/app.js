const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const path = require('path');
const update = require('express-fileupload');
const session = require('express-session');
const mainRoute = require('./routes/index');
const port = 3021;
const app = express();
const connectDb = require('./config/connectDb');
const helper1 = require('./app/helpers/helper1');
const pdf = require('express-pdf');
const cookie = require('cookie-parser');


app.use(express.static(path.join(__dirname, 'public')));
connectDb(mongoose);
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(update());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'somesecret',
  cookie: {
    maxAge: 4000
  }
}))
app.use(cookie());
app.use(pdf);
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: helper1,
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resource', 'views'));


mainRoute(app);
// app.get('/',(req,res)=>{
//   req.headers.host
// })


app.listen(process.env.PORT || port, () => {
  console.log(`this is page localhost http://localhost:${port}`)
})