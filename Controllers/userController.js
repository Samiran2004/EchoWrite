import User from '../Models/userModel.js';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import cloudinary from '../Services/cloudinary.js';
import fs from 'fs';
import sendMail from '../Services/mailService.js';
import aj from '../Services/arcjetService.js';
import checkValidSocialLinks from '../Utils/CheckValidSocialLinks.js';
import Post from '../Models/postModel.js';
import MailTemplates from '../Mail/index.mail.js';

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

            //Email validation using Arcjet...
            const decision = await aj.protect(req, {
                email: email
            });
            // console.log("Arcjet decision: " , decision);
            if (decision.isDenied()) {
                return res.render("errorPage", { errorMessage: "Email is not exist!", backUrl: "/signup" });
            }

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
                const emailData = MailTemplates.SignUpMailtemplateContent({
                    email: newUser.email,
                    name: newUser.name
                });
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
            const emailData = MailTemplates.ForgotPasswordMailContent({
                email: email,
                name: checkUser.name,
                link: link
            });
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

//Update user dets...
const updateUserDets = async (req, res) => {
    try {
        const { name, bio, fbLink, xLink, linkdinLink } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.render('errorPage', { errorMessage: "User not found", backUrl: '/' });
        }

        // Update basic information
        //   If name then update in post also...
        if (name) {
            console.log(user.name);
            let posts = await Post.find({ authorName: user.name });
            user.name = name;
            console.log(posts);
        }
        if (bio) user.bio = bio;

        // Update social links after validation
        if (fbLink) {
            const isValidLink = await checkValidSocialLinks(fbLink);
            if (isValidLink) {
                user.facebookLink = fbLink;
            }
        }

        if (xLink) {
            const isValidLink = await checkValidSocialLinks(xLink);
            if (isValidLink) {
                user.twitterLink = xLink;
            }
        }

        if (linkdinLink) {
            const isValidLink = await checkValidSocialLinks(linkdinLink);
            if (isValidLink) {
                user.linkdinLink = linkdinLink;
            }
        }

        // Handle profile image updates
        if (req.file) {
            // Upload new image first
            const newProfileImage = await cloudinary.uploader.upload(req.file.path);

            // Delete old image if it exists
            if (user.profileImage) {
                const publicId = user.profileImage
                    .split('/')
                    .pop()
                    ?.split('.')[0];

                if (publicId) {
                    try {
                        await cloudinary.uploader.destroy(publicId);
                    } catch (error) {
                        console.error('Error deleting previous profile picture:', error);
                        // Continue with the update even if deletion fails
                    }
                }
            }

            // Update the user's profile image with the new URL
            user.profileImage = newProfileImage.url;
        }

        // Save the user and respond
        await user.save();
        return res.render('profilePage');

    } catch (error) {
        //   console.error("Error in update profile:", error);
        return res.render('errorPage', { errorMessage: "Failed to update profile", backUrl: '/profile' });
    }
};

export {
    loginUser,
    signin,
    forgotPassword,
    showResetPasswordPage,
    updatePassword,
    updateUserDets
}