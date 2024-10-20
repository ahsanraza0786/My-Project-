const User = require("../models/user");

// Route to render the signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

// Route to handle user signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    // Create a new user object with email and username
    const newUser = new User({
      email,
      username,
    });
    // Register the new user with the provided password
    const registeredUser = await User.register(newUser, password);

    // Log in the user after successful registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next();
      }
      // Flash a success message and redirect to listings
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    // Flash an error message and redirect to signup on failure
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Route to render the login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Route to handle user login
module.exports.login = async (req, res) => {
  // Flash a success message upon login
  req.flash("success", "Welcome to Wanderlust! You are logged in!");

  // Check if a redirect URL was set, otherwise redirect to "/listings"
  const redirectUrl = res.locals.redirectUrl || "/listings";

  // Redirect to the determined URL
  res.redirect(redirectUrl);
};

// Route to handle user logout
module.exports.logout = (req, res, next) => {
  // Log out the user and handle errors if any
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Flash a success message and redirect to listings
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
