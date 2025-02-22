// const mongoose = require('mongoose');
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    profileImage: {
        type: String,
        default: "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg?size=338&ext=jpg&ga=GA1.1.2116175301.1719273600&semt=ais_user"
    },
    coverImage: {
        type: String,
        default: "https://png.pngtree.com/thumb_back/fh260/back_our/20190619/ourmid/pngtree-company-profile-corporate-culture-exhibition-board-display-poster-material-image_131622.jpg"
    },
    resetPasswordToken: {
        type: String
    },
    bio: {
        type: String,
        required: false
    },
    facebookLink: {
        type: String,
        required: false
    },
    twitterLink: {
        type: String,
        required: false
    },
    linkdinLink: {
        type: String,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;