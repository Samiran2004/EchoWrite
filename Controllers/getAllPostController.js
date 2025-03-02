import Post from '../Models/postModel.js';


const randomizeData = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const getAllPost = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;  // Default to page 0 if not specified
        const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page if not specified

        const data = await Post.find()
            .populate('authorId', 'name email profileImage _id')  // Populate user data
            .skip(page * limit)
            .limit(limit);

        const total = await Post.countDocuments();

        const randomData = randomizeData(data);

        res.status(200).send({
            data: randomData,
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

export { getAllPost }