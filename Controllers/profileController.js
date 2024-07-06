const User = require('../Models/userModel');
const Post = require('../Models/postModel');
const JWT = require('jsonwebtoken');

const getProfileInformation = async (req, res) => {
    const { usertoken } = req.cookies;
    try {
        if (!usertoken) {
            res.status(400).send({
                status: "Failed",
                message: "Token Not Found"
            });
        } else {
            const userPayload = await JWT.verify(usertoken, process.env.JWT_SECRET);

            const userdata = await User.findOne({ email: userPayload.email }, '-password -resetPasswordToken');
            const postData = await Post.find({ author: userdata._id });
            res.status(200).send({
                status: "Success",
                userdata,
                postData,
            });
        }
    } catch (error) {
        res.status(404).send({
            status: "Failed",
            message: "Authentication Failed"
        });
    }
}

module.exports = getProfileInformation;