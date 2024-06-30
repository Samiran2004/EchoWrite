const mongoose = require('mongoose');

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
        required: true
    },
    profileImage: {
        type: String,
        default: "https://img.freepik.com/free-vector/man-profile-account-picture_24908-81754.jpg?size=338&ext=jpg&ga=GA1.1.2116175301.1719273600&semt=ais_user"
    },
    resetPasswordToken:{
        type:String
    }
},{timestamps:true});

const User = mongoose.model('User', userSchema);
module.exports = User;