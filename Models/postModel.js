const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    postImage: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    publishdate: {
        type: Date,
        default: Date.now
    },
    categories: [
        {
            type: String
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
            comment: {
                type: String,
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;