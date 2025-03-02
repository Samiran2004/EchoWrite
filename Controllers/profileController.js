import User from '../Models/userModel.js';
import Post from '../Models/postModel.js';
import JWT from 'jsonwebtoken';

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
            console.log(userdata);
            const postData = await Post.find({ authorId: userdata._id });


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

export default getProfileInformation;