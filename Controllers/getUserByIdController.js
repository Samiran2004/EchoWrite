import Post from "../Models/postModel.js";
import User from "../Models/userModel.js";

const getUserById = async (req, res) => {
    try {
        const authorId = req.params.authorId;
        const author = await User.findById(authorId);
        if (!author) {
            return res.render('errorPage', { errorMessage: "Author Not Found", backUrl: '/' });
        }

        const authorsPost = await Post.find({ authorId: authorId });
        

        return res.render('authorPage',{
            authorName: author.name,
            authorImage: author.profileImage,
            authorBio: author.bio,
            authorsPost: authorsPost
        });

    } catch (error) {
        return res.render('errorPage', { errorMessage: "Internal Server Error", backUrl: "/" })
    }
}

export default getUserById;