import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import figlet from 'figlet';
import serveRoute from './Routes/serveRoute.js';
import dbConnect from './Services/dbConnection.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import session from 'express-session';
import User from './Models/userModel.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import JWT from 'jsonwebtoken';
import sendMail from './Services/mailService.js';

const app = express();

app.use(cors());
import { config } from 'dotenv';
config();

app.use(cookieParser());

// Connect with Database...
dbConnect(process.env.DB_URI);

const viewsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'views');
const publicPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'Public');
// Setup view engine...
app.set('view engine', 'ejs');
app.set('views', viewsPath);

// Middlewares...
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(publicPath));

app.use(passport.initialize());
app.use(session(
    {
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true
    }
));
passport.use(new GoogleStrategy({
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: process.env.OAUTH_CALLBACK || "http://localhost:8000/auth/google/callback"
}, async function (accessToken, refreshToken, profile, cb) {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                profileImage: profile.photos[0].value
            });
            await user.save();
            const emailData = {
                to: user.email,
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
            <p>Dear ${user.name},</p>
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
            })
        }
        return cb(null, user);
    } catch (error) {
        return cb(error, null);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "EchoWrite with Swagger",
            version: "1.0.0",
            description: "EchoWrite API documentation"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}`
            }
        ],
    },
    apis: ["./Routes/*.js"]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', serveRoute);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), async (req, res) => {
    const checkUser = await User.findOne({ email: req.user.email });
    if (!checkUser) {
        return res.render('errorPage', { errorMessage: "Something Went Wrong in OAuth", backUrl: "/login" });
    }
    const payload = {
        _id: checkUser._id,
        username: checkUser.name,
        email: checkUser.email,
        profileimage: checkUser.profileImage
    }
    const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('usertoken', token).redirect('/');
    // res.redirect('/user/profile');
});

// Connect with server...
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.error("Error connecting to the server:", err);
    } else {
        figlet("Server Connected  .  .  .  .", (err, data) => {
            if (err) {
                console.error("Something went wrong!", err);
                return;
            }
            console.log(data);
        });
        console.log(`Server running on port ${process.env.PORT}`);
    }
});
