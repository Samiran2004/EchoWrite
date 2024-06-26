const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();

//Connect with Database...
mongoose.connect(process.env.DB_URI).then(() => console.log("Database connected...")).catch(() => console.log("Database connection error..."));

//Setup view engine...
app.set('view engine', 'ejs');
app.set('views', './views');

//Middlewares...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve('./Public')));

app.get('/', (req, res) => {
    res.render('homePage');
});

//Connect with server...
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Error to connect with server.");
    } else {
        console.log("Server connected.");
    }
});