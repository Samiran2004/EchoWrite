import User from "../Models/userModel.js";
import Post from "../Models/postModel.js";

const getAuthorById = async (req, res) => {
    try {
        const authorId = req.params.id;
        const posts = await Post.find({
            authorId: authorId
        })
        return res.status(200).send({
            status: "Success",
            posts: posts.length
        })
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal Server Error!"
        });
    }
}

export default getAuthorById;