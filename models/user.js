const mongoose = require('mongoose'); // Importing mongoose to work with MongoDB
const Schema = mongoose.Schema; // Creating a new schema from mongoose
const passportLocalMongoose = require('passport-local-mongoose'); // Importing passport-local-mongoose for easy user authentication

// Defining the user schema
const userSchema = new Schema({
    email: {
        type: String, // The email field is a string
        required: true, // Email is required for every user
    }
});

// Adding passport-local-mongoose plugin to handle authentication logic (e.g., hashing passwords)
userSchema.plugin(passportLocalMongoose);

// Exporting the User model so it can be used in other parts of the application
module.exports = mongoose.model('User', userSchema);
