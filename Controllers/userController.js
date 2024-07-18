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
                if (isValidPassword) {
                    const payload = {
                        _id: checkUser._id,
                        username: checkUser.name,
                        email: checkUser.email,
                        profileimage: checkUser.profileImage
                    }
                    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                    res.cookie('usertoken', token).redirect('/');
                } else {
                    res.render('errorPage', { errorMessage: "Email or Password Invalid", backUrl: "/login" });
                }

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

//Forgot password...
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.render('errorPage', { errorMessage: "Email is required", backUrl: "/forgotpassword" });
        }
        // Check if email is present in the database
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            const payload = {
                email: email
            }
            const resetPasswordToken = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '5m' });
            const link = `https://echowrite.onrender.com/resetpassword/${resetPasswordToken}`;
            // const link = `http://localhost:8000/resetpassword/${resetPasswordToken}`;
            const emailData = {
                to: email,
                subject: "Reset Password",
                html: `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Reset Your Password</title>
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
                                <h1>Reset Your Password</h1>
                                <p>Dear ${checkUser.name},</p>
                                <p>Please click the link below to reset your password:</p>
                                <p><a href="${link}" class="button">Reset Password</a></p>
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
            };
            await User.findByIdAndUpdate(checkUser._id, { resetPasswordToken: resetPasswordToken });
            await (sendMail(emailData, (error, response) => {
                if (error) {
                    res.render('errorPage', { errorMessage: "Mail sending Error" });
                } else {
                    // res.render("checkYourmailPage", { mailName: email });
                    res.redirect('/checkMail');
                }
            }));
        } else {
            res.render('errorPage', { errorMessage: "Email is not registered", backUrl: '/forgotpassword' });
        }
    } catch (error) {
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: "/login" });
    }
};

//Show Reset password Page...
const showResetPasswordPage = async (req, res) => {
    const { token } = req.params;
    try {
        if (!token) {
            res.render('errorPage', { errorMessage: "Token not found", backUrl: '/login' });
        } else {
            const verifyToken = JWT.verify(token, process.env.JWT_SECRET, { expiresIn: '2m' });
            if (verifyToken) {
                const checkUser = await User.findOne({ email: verifyToken.email });
                if (checkUser) {
                    const payload = {
                        email: checkUser.email
                    }
                    const resetPassToken = JWT.sign(payload, process.env.JWT_SECRET);
                    res.cookie("resetPassToken", resetPassToken).render('setNewPasswordPage');
                } else {
                    res.render('errorPage', { errorMessage: "Something Went Wrong", backUrl: '/login' });
                }
            } else {
                res.render('errorPage', { errorMessage: "Token is not valid", backUrl: '/login' });
            }
        }
    } catch (error) {
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: "/login" });
    }
}

//Update Password...
const updatePassword = async (req, res) => {
    const { password } = req.body;
    const { resetPassToken } = req.cookies;
    try {
        if (!password || !resetPassToken) {
            res.render('errorPage', { errorMessage: "Token not found", backUrl: '/login' });
        } else {
            const verifyToken = JWT.verify(resetPassToken, process.env.JWT_SECRET);
            if (verifyToken) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await User.findOneAndUpdate({ email: verifyToken.email }, { password: hashedPassword });
                res.clearCookie("resetPassToken").redirect('/login');
            } else {
                res.render('errorPage', { errorMessage: "Token is not verified", backUrl: '/login' });
            }
        }
    } catch (error) {
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: '/login' });
    }
}

module.exports = {
    loginUser,
    signin,
    forgotPassword,
    showResetPasswordPage,
    updatePassword
}