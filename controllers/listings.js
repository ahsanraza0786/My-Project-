const Listing = require("../models/listing.js");

// Route to fetch and display all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Route to render the form for creating a new listing; checks user authentication
module.exports.renderNewForm = (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "you must be logged in to create a listing");
    return res.redirect("/login");
  }
  res.render("listings/new.ejs");
};

// Route to show details of a specific listing by ID, including related reviews and owner
module.exports.showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist ");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// Route to create and save a new listing based on user input
module.exports.createNew = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

// Route to render the form for editing an existing listing by ID
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing) {
      req.flash("error", "Listing Your Requested For Does Not Exist !");
      res.redirect("/listings") 
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_scale,h_250,w_370/");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Route to update the specified listing with new data
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Updated Listing !");
  res.redirect(`/listings/${id}`);
};

// Route to delete a listing by ID and redirect to the listings page
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
};
