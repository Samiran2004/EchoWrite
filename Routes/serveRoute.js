const express = require('express');
const {
    loginUser,
    signin,
    forgotPassword,
    showResetPasswordPage,
    updatePassword
} = require('../Controllers/userController');
const uploader = require('../Middlewares/multerMiddleware');
const userAuth = require('../Middlewares/userAuthenticationMiddleware');
const router = express.Router();

router.get('/', userAuth('usertoken'), (req, res) => {
    res.render('homePage');
});

router.get('/signup', (req, res) => {
    res.render('signupPage');
});

router.get('/login', (req, res) => {
    res.render('loginPage');
});

router.get('/forgotpassword', (req, res) => {
    res.render('forgotPasswordPage');
});

router.get('/checkMail', (req, res) => {
    res.render('checkYourMailPage', { mailName: req.body.email });
});

router.get('/resetpassword/:token',showResetPasswordPage);

router.post('/user/login', loginUser);
router.post('/user/signup', uploader.single("profileimage"), signin);
router.post('/user/forgotPassword', forgotPassword);
router.post('/updatePassword',updatePassword);
module.exports = router;