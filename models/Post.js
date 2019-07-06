const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        require: true
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    hashTags: [],
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        date: {
            type: Date,
            default: Date.now
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    comments: [{
        commentBody: {
            type: String,
            require: true
        },
            commentUser: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            commentDate: {
                type: Date,
                default: Date.now
            }
        }],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    image: {
        type: String
    },
    status: {
        type: String
    }
});

mongoose.model('posts', PostSchema);