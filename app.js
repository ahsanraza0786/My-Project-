if (process.env.NODE_ENV != "production") {
  require("dotenv").config(); // Load environment variables from a .env file if not in production
}

const express = require("express"); // Import express framework
const app = express(); // Initialize express app
const mongoose = require("mongoose"); // Import mongoose to connect to MongoDB

const session = require("express-session"); // Import session middleware for managing user sessions
const MongoStore = require("connect-mongo"); // MongoDB session store for express-session
const path = require("path"); // Import path to work with file and directory paths
const flash = require("connect-flash"); // Import flash for storing and displaying messages (e.g., success or error)
const passport = require("passport"); // Import Passport for authentication
const LocalStrategy = require("passport-local"); // Import local strategy for username/password authentication
const User = require("./models/user.js"); // Import User model for authentication
const methodOverride = require("method-override"); // Allows using HTTP verbs like PUT or DELETE
const ejsMate = require("ejs-mate"); // Import ejsMate for EJS template engine
const ExpressError = require("./utils/ExpressError.js"); // Custom error handling class

const Review = require("./models/review.js"); // Import Review model

const listingsRouter = require("./routes/listings.js"); // Import routes for listings
const reviewsRouter = require("./routes/review.js"); // Import routes for reviews
const userRouter = require("./routes/user.js"); // Import routes for user-related actions

const cookie = require("express-session/session/cookie.js"); // Import cookie management from express-session

const dbUrl = process.env.ATLASDB_URL; // MongoDB URL from environment variables

// Function to connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB"); // Successful connection message
  })
  .catch((err) => {
    console.log(err); // Log connection error
  });

// Connect to MongoDB using mongoose
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs"); // Set the view engine to EJS
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.json()); // Parse JSON request bodies
app.use(methodOverride("_method")); // Override HTTP methods like PUT and DELETE
app.engine("ejs", ejsMate); // Use ejsMate as the rendering engine for EJS templates

app.use(express.static(path.join(__dirname, "/public"))); // Serve static files (CSS, JS, images) from the public directory

// Configure session store in MongoDB
const store = MongoStore.create({
  mongoUrl: dbUrl, // MongoDB URL
  crypto: {
    secret: process.env.SECRET, // Secret for encrypting session data
  },
  touchAfter: 24 * 60 * 60, // Update session once every 24 hours
});

// Handle any errors with MongoDB session store
store.on("err", () => {
  console.log("Error in MONGO SESSION STORE", err);
});

// Session configuration options
const sessionOptions = {
  store, // Use the MongoDB session store
  secret: process.env.SECRET,  // Secret for signing the session ID cookie
  resave: false, // Do not resave session if it's not modified
  saveUninitialized: false, // Do not save uninitialized sessions
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // Session expires in 7 days
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
  },
};

// Use session middleware with options
app.use(session(sessionOptions));

// Apply flash middleware for storing temporary messages
app.use(flash());

// Initialize Passport for managing user authentication
app.use(passport.initialize()); // Initialize Passport

// Enable session support for Passport
app.use(passport.session()); // Use session for Passport

// Use local strategy for user authentication (username and password)
passport.use(new LocalStrategy(User.authenticate()));

// Serialize user into session (save user ID in session)
passport.serializeUser(User.serializeUser());

// Deserialize user from session (retrieve user details by ID)
passport.deserializeUser(User.deserializeUser());

// Middleware to set flash messages and user info globally in templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // Success flash messages
  res.locals.error = req.flash("error"); // Error flash messages
  res.locals.currUser = req.user; // Current user info
  next(); // Proceed to next middleware
});

// // Demo user registration route (optional)
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "ahsankhan34@gmail.com",
//     username: "Ahsan Khan",
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser); // Return registered demo user
// });

// Use listings routes for handling all listings-related requests
app.use("/listings", listingsRouter);

// Use reviews routes for handling all review-related requests for specific listings
app.use("/listings/:id/reviews", reviewsRouter);

// Use user routes for user-related actions (login, registration, etc.)
app.use("/", userRouter);

// Catch-all route for undefined pages (404 error)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!")); // Pass 404 error to the error handler
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err; // Default error message
  res.status(statusCode).render("error.ejs", { message }); // Render error page
});

// Start the server and listen on port 8080
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
 