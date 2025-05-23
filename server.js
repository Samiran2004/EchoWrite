import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
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
import MailTemplates from './Mail/index.mail.js';
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
            const emailData = MailTemplates.SignUp2MailtemplateContent(user.email, user.name);
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
