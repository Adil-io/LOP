const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    email: { 
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    picUrl: {
        type: String,
        default: 'https://res.cloudinary.com/anheart/image/upload/v1607532623/default_w9rcvt.png'
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ]
});

mongoose.model('User', userSchema);
