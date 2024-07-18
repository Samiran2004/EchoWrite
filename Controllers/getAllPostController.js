const JWT = require('jsonwebtoken');
const Post = require('../Models/postModel');
const User = require('../Models/userModel');

const getAllPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;  // Default to page 0 if not specified
        const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page if not specified

        const data = await Post.find()
            .skip(page * limit)
            .limit(limit);

        const total = await Post.countDocuments(); 

        res.status(200).send({
            data: data.reverse(),
            total,
            page,
            pages: Math.ceil(total / limit)  
        });
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal Server Error"
        });
    }
}

module.exports = {
    getAllPost
}