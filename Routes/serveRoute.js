const express = require('express');
const {
    loginUser,
    signin
} = require('../Controllers/userController');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('homePage');
});

router.get('/signup', (req, res) => {
    res.render('signupPage');
});

router.get('/login', (req, res) => {
    res.render('loginPage');
});

router.post('/user/login', loginUser);
router.post('/user/signup', signin);
module.exports = router;