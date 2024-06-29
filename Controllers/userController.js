const User = require('../Models/userModel');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cloudinary = require('../Services/cloudinary');
const fs = require('fs');
const sendMail = require('../Services/mailService');

//Login user...
async function loginUser(req, res) {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.render('errorPage', { errorMessage: "All feilds are required", backUrl: "/login" });
        } else {
            //Check email...
            const checkUser = await User.findOne({ email: email });
            if (checkUser) {
                const isValidPassword = await bcrypt.compare(password, checkUser.password);
                const payload = {
                    _id: checkUser._id,
                    username: checkUser.name,
                    email: checkUser.email,
                    profileimage: checkUser.profileImage
                }
                const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
                res.cookie('usertoken',token).redirect('/');

            } else {
                res.render('errorPage', { errorMessage: "Email or Password Invalid", backUrl: "/login" });
            }
        }
    } catch (error) {
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: "/login" });
    }
}

//Signin a new user...
const signin = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {

        //Check all fields are present or not...
        if (!name || !email || !password) {
            res.render('errorPage', { errorMessage: "All Fields Are Required", backUrl: "/signup" });
        } else {

            //Check email is already registered or not...
            const checkUser = await User.findOne({ email: email });

            //If the user is not present in database...
            if (!checkUser) {

                //Hash the password...
                const hashedPassword = await bcrypt.hash(password, 10);
                // console.log(hashedPassword);

                //Upload profilepicture into cloudinary...
                // console.log(req.file.path);
                const uploadImageUrl = await cloudinary.uploader.upload(req.file.path);
                // console.log(uploadImageUrl);
                fs.unlinkSync(req.file.path);
                //Create new user...
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    profileImage: uploadImageUrl.url
                });
                await newUser.save();

                //Send a welcome mail...
                const emailData = {
                    to: email,
                    subject: "Sign Up Success",
                    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to EchoWrite</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .content {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333333;
            }
            p {
                color: #666666;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin-top: 20px;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #999999;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Welcome to EchoWrite!</h1>
                <p>Dear ${name},</p>
<p>Thank you for signing up for EchoWrite. We are excited to have you on board.</p>
<p>EchoWrite is a powerful tool designed to help you create and manage your written content with ease.</p>
<p>If you have any questions or need assistance, feel free to contact our support team.</p>
<p>Best regards,</p>
<p>The EchoWrite Team</p>
<a href="https://echowrite.onrender.com" class="button">Visit EchoWrite</a>
<div class="footer">
    <p>&copy; 2024 EchoWrite. All rights reserved.</p>
    <p>123 EchoWrite Street, Suite 100, WriteCity, WC 12345</p>
</div>
            </div>
        </div>
    </body>
    </html>`
                }
                await sendMail(emailData, (error, response) => {
                    if (error) {
                        console.log("Mail send error.");
                    } else {
                        console.log("Mail send successful.");
                    }
                });
                res.redirect('/login');
            } else {
                res.render('errorPage', { errorMessage: "User already registered", backUrl: '/login' });
                fs.unlinkSync(req.file.path);
            }
        }
    } catch (error) {
        res.render("errorPage", { errorMessage: "Internal Server Error", backUrl: "/signup" });
    }
}

module.exports = {
    loginUser,
    signin
}