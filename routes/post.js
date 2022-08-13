const mongoose = require('mongoose')






/**
 * A mongoose schema for a post.       
 * @property {string} post - The text of the post.       
 * @property {[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}]} likes - The users who liked the post.       
 * @property {type: mongoose.Schema.Types.ObjectId, ref: 'user'} userid - The user who created the post.       
 */
const postSchema = mongoose.Schema({

    post: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: mongoose.Schema.Types.Mixed,
    }],
    imgpost: String,
})




/**
 * Creates a mongoose model for the User model.       
 * @param {mongoose.Schema} userSchema - the mongoose schema for the User model.       
 * @returns {mongoose.Model} - the mongoose model for the User model.       
 */
module.exports = mongoose.model("post", postSchema)