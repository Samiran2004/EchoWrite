const JWT = require('jsonwebtoken');
const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const cloudinary = require('../Services/cloudinary');

const uploadPost = async (req, res) => {
    const { title, content, categories} = req.body;
    try {
        const { usertoken } = req.cookies;
        if (!usertoken) {
            res.render('errorPage', { errorMessage: "Token Not Found", backUrl: '/user/post' });
        } else {
            const userPayload = JWT.verify(usertoken, process.env.JWT_SECRET);
            const checkUser = await User.findById(userPayload._id);
            const categorieArr = categories.split(",");
            if (checkUser) {
                const postImageUrl = await cloudinary.uploader.upload(req.file.path);
                await Post.create(
                    {
                        title: title,
                        content: content,
                        author: checkUser._id,
                        categories: categorieArr,
                        postImage: postImageUrl.url
                    }
                );
                res.redirect('/');
            } else {
                res.render('errorPage', { errorMessage: "User Not Found", backUrl: '/user/post' });
            }
        }
    } catch (error) {
        res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: '/user/post' });
    }
}

module.exports = {
    uploadPost
};