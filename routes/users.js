/**
 * Connect to the MongoDB database.       
 * @returns None       
 */
const mongoose = require('mongoose')
/**
 * A passport local mongoose plugin that adds the username and password fields to the user model. 
 * @param {object} schema - The mongoose schema object. 
 * @returns None.
 */
const passportlocalmongoose = require('passport-local-mongoose')

/**
 * Connect to the database.       
 * @returns None       
 */
mongoose.connect("mongodb+srv://jeetul:jeetul@cluster0.qdcc4.mongodb.net/passport?retryWrites=true&w=majority").then(function (connection) {
  console.log("database connection established to passport3");
})




/**
 * A mongoose schema for the user model.           
 * @param {string} username - the username of the user.           
 * @param {string} password - the password of the user.           
 * @param {string} name - the name of the user.           
 * @param {string} posts - the posts of the user.           
 * @returns None           
 */
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  name: String,
  img: {
    type: String,
    default: 'https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745'
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "post"
  }]
})

/**
 * Adds the passport local mongoose plugin to the user schema.       
 * @returns None       
 */
userSchema.plugin(passportlocalmongoose)


/**
 * Creates a mongoose model for the User model.       
 * @param {mongoose.Schema} userSchema - the mongoose schema for the User model.       
 * @returns {mongoose.Model} - the mongoose model for the User model.       
 */
module.exports = mongoose.model("user", userSchema)