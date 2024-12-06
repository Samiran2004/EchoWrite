import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    problems: [
        {
            type: String
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

const Support = mongoose.model("Support", supportSchema);
export default Support;