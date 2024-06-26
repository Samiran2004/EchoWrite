const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
    res.json("Hello World...");
});

app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log("Error to connect with server.");
    } else {
        console.log("Server connected.");
    }
});