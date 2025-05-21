import User from "../Models/userModel.js";
import Post from "../Models/postModel.js";

const getAuthorById = async (req, res) => {
    try {
        const authorId = req.params.id;
        const posts = await Post.find({
            authorId: authorId
        })
        const author = await User.findById(authorId);
        return res.status(200).send({
            status: "Success",
            posts: posts.length,
            author
        })
    } catch (error) {
        res.status(500).send({
            status: "Failed",
            message: "Internal Server Error!"
        });
    }
}

export default getAuthorById;