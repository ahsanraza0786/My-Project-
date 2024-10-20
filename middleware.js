const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js"); // Custom error class for express
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
// const review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;

    req.flash("error", "You must be logged in create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing ");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Validate Listing Middleware
exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body); // Validate request body
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", "); // Create error message
    throw new ExpressError(400, errMsg); // Throw custom error
  }
  next(); // Proceed to the next middleware
};

// Validate Review Middleware
exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body); // Validate request body
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", "); // Create error message
    console.log(error); // Log the error details for debugging
    console.log(errMsg); // Log the error message
    throw new ExpressError(400, errMsg); // Throw custom error
  }
  next(); // Proceed to the next middleware
};

// Review Owner chacked Middleware ↓ (routes -> review.js)
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
