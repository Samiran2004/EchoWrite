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

// Render home page with authentication
router.get('/', userAuth('usertoken'), (req, res) => {
    res.render('homePage');
});

// Render Signup page...
router.get('/signup', (req, res) => {
    res.render('signupPage');
});

// Render Login Page...
router.get('/login', (req, res) => {
    res.render('loginPage');
});

// Logout user...
router.get('/logout', userAuth('usertoken'), (req, res) => {
    res.clearCookie('usertoken').redirect('/');
});

// Render Forgot password...
router.get('/forgotpassword', (req, res) => {
    res.render('forgotPasswordPage');
});

// Render Chek mail page...
router.get('/checkMail', (req, res) => {
    res.render('checkYourMailPage', { mailName: req.body.email });
});

// Reset password route...
router.get('/resetpassword/:token', showResetPasswordPage);

// Login route...
router.post('/user/login', loginUser);

// Signup route...
router.post('/user/signup', uploader.single("profileimage"), signin);

// Forgot password route...
router.post('/user/forgotPassword', forgotPassword);

// Update password roure...
router.post('/updatePassword', updatePassword);

// Render create new post page...
router.get('/user/post', userAuth('usertoken'), (req, res) => res.render('postPage'));

// Render user profile page...
router.get('/user/profile', userAuth('usertoken'), (req, res) => res.render('profilePage'));

// Get user route...
router.get('/user/getuserById/:authorId', userAuth('usertoken'), getUserById);

// Get author by authore id...
router.get('/user/getAuthorById/:id', getAuthorById);

// Update an authorized user's profile dets...
router.get('/user/profile/update', userAuth('usertoken'), (req, res) => {
    res.render('editProfilePage');
});

// Update user dets route...
router.post('/user/profile/update',uploader.single('profilePicture') ,userAuth('usertoken'), updateUserDets);

//Get current user's profile info route...
router.get('/user/profileinfo/:token', getProfileInformation);
// router.get('/user/profileinfo', getProfileInformation);
router.get('/user/customersupport', userAuth('usertoken'), (req, res) => res.render('supportPage'));

// User support route...
router.post('/user/support', customerSupport);

// Upload a new post route...
router.post('/user/post', uploader.single('postimage'), uploadPost);

// Get all posts route...
router.get('/user/getAllPost', userAuth('usertoken'), getAllPost);

// Get a post by post id route...
router.get('/post/:postId', userAuth('usertoken'), getPostById);

// Comment route...
router.post('/post/comment', userAuth('usertoken'), postComments);
export default router;