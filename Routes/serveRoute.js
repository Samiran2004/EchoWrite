// const express = require('express');
import express from 'express';
// const {
//     loginUser,
//     signin,
//     forgotPassword,
//     showResetPasswordPage,
//     updatePassword
// } = require('../Controllers/userController');
import { loginUser, signin, forgotPassword, showResetPasswordPage, updatePassword, updateUserDets } from '../Controllers/userController.js';
// const uploader = require('../Middlewares/multerMiddleware');
import uploader from '../Middlewares/multerMiddleware.js';
import userAuth from '../Middlewares/userAuthenticationMiddleware.js';
import customerSupport from '../Controllers/customerSupportController.js';
import getProfileInformation from '../Controllers/profileController.js';
import { uploadPost, getPostById, postComments } from '../Controllers/postController.js'
import { getAllPost } from '../Controllers/getAllPostController.js';
import getUserById from '../Controllers/getUserByIdController.js';
import getAuthorById from '../Controllers/getAuthorById.js';
const router = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *      summary: Home page
 *      description: This is home page route
 *      responses:
 *          200:
 *              description: A list of sample Home page
 */
router.get('/', userAuth('usertoken'), (req, res) => {
    res.render('homePage');
});

router.get('/signup', (req, res) => {
    res.render('signupPage');
});

router.get('/login', (req, res) => {
    res.render('loginPage');
});

router.get('/logout', userAuth('usertoken'), (req, res) => {
    res.clearCookie('usertoken').redirect('/');
});

router.get('/forgotpassword', (req, res) => {
    res.render('forgotPasswordPage');
});

router.get('/checkMail', (req, res) => {
    res.render('checkYourMailPage', { mailName: req.body.email });
});

router.get('/resetpassword/:token', showResetPasswordPage);

router.post('/user/login', loginUser);
router.post('/user/signup', uploader.single("profileimage"), signin);
router.post('/user/forgotPassword', forgotPassword);
router.post('/updatePassword', updatePassword);

router.get('/user/post', userAuth('usertoken'), (req, res) => res.render('postPage'));
router.get('/user/profile', userAuth('usertoken'), (req, res) => res.render('profilePage'));
router.get('/user/getuserById/:authorId', userAuth('usertoken'), getUserById);
router.get('/user/getAuthorById/:id', getAuthorById);
router.get('/user/profile/update', userAuth('usertoken'), uploader.single('profilePicture'), (req, res) => {
    res.render('editProfilePage');
});
router.post('/user/profile/update',uploader.single('profilePicture') ,userAuth('usertoken'), updateUserDets);
router.get('/user/profileinfo/:token', getProfileInformation);
// router.get('/user/profileinfo', getProfileInformation);
router.get('/user/customersupport', userAuth('usertoken'), (req, res) => res.render('supportPage'));

router.post('/user/support', customerSupport);
router.post('/user/post', uploader.single('postimage'), uploadPost);

router.get('/user/getAllPost', userAuth('usertoken'), getAllPost);

router.get('/post/:postId', userAuth('usertoken'), getPostById);
router.post('/post/comment', userAuth('usertoken'), postComments);
export default router;