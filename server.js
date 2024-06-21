const express = require('express');
const mongoose = require('mongoose');
const app = express();
mongoose.connect("http://google.com").then(() => { console.log("Database connected"); }).catch(() => { console.log("Database connection error"); });

app.listen(3000,()=>{
    console.log("Server running...");
});