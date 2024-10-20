const Joi = require('joi'); // Importing the Joi library for schema validation

// Defining a schema for validating listings
module.exports.listingSchema = Joi.object({
    listing: Joi.object({ // 'listing' must be an object
        title: Joi.string().required(), // 'title' must be a string and is required
        description: Joi.string().required(), // 'description' must be a string and is required
        location: Joi.string().required(), // 'location' must be a string and is required
        price: Joi.number().required().min(0), // 'price' must be a number, is required, and must be at least 0
        country: Joi.string().required(), // 'country' must be a string and is required
        image: Joi.string().allow("", null) // 'image' must be a string but can be empty or null
    }).required() // The 'listing' object itself is required
});

// Defining a schema for validating reviews
module.exports.reviewSchema = Joi.object({
    review: Joi.object({ // 'review' must be an object
        rating: Joi.number().required().min(1).max(5), // 'rating' must be a number, required, and between 1 and 5
        comment: Joi.string().required(), // 'comment' must be a string and is required
    }).required() // The 'review' object itself is required
});
