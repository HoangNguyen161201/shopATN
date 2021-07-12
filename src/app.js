// packages and libraries that I will use for the project.
// Express framwork
const express = require('express');
const exphbs = require('express-handlebars');
// Require mongoose
const mongoose = require('mongoose');
const path = require('path');
// This file helps to move and update files.
const update = require('express-fileupload');
const session = require('express-session');
const mainRoute = require('./routes/index');
const port = 3021;
const app = express();
// Require connectDb.js to be able to connect to Mongo DB
const connectDb = require('./config/connectDb');
const helper1 = require('./app/helpers/helper1');
// This package helps in creating pdf files
const pdf = require('express-pdf');
// use cookie
const cookie = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
// use model chat to save message
const modelChat = require('./app/models/modelChat');

// chat real time
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', async (msg) => {
    var id = 1;
    await modelChat.findOne().sort({
      _id: 'desc'
    }).
    then(doc => {
      if (doc) {
        id = doc._id + 1;
      }
    });

    var ms = {
      _id: id,
      id_account: msg[0],
      name: msg[1],
      message: msg[2],
      date: msg[3],
    }
    await modelChat.create(ms);
    console.log(msg);
    io.emit('chat message', msg);
  });
});

app.use(express.static(path.join(__dirname, 'public')));
// connect database
connectDb(mongoose);
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(update());
// session configuration
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


// Use process.env.PORT to be able to run on the internet
server.listen(process.env.PORT || port, () => {
  console.log(`this is page localhost http://localhost:${port}`)
})