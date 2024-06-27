const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const serveRoute = require('./Routes/serveRoute');
const dbConnect = require('./Services/dbConnection');
const app = express();
require('dotenv').config();

//Connect with Database...
dbConnect(process.env.DB_URI);

//Setup view engine...
app.set('view engine', 'ejs');
app.set('views', './views');

//Middlewares...
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve('./Public')));

app.use('/', serveRoute);

//Connect with server...
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Error to connect with server.");
    } else {
        console.log("Server connected ✔️  ✔️  ✔️");
    }
});