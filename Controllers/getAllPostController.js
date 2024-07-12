const JWT = require('jsonwebtoken');
const Post = require('../Models/postModel');
const User = require('../Models/userModel');

const getAllPost = async(req,res)=>{
    try {
        const data = await Post.find();
        res.status(200).send({
            data
        });
    } catch (error) {
        res.status(500).send({
            status:"Failed",
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getAllPost
}