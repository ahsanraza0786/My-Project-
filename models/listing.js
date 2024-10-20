const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");
// const listingSchema = new Schema({
//   title:
//   {
//     type:String,
//     required:true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default: "https://unsplash.com/photos/a-kitchen-with-a-table-and-chairs-in-it-gbplWlQZMco",
//     set: (v) => v === "" ? "https://unsplash.com/photos/a-kitchen-with-a-table-and-chairs-in-it-gbplWlQZMco" : v,
//   },

//   price: Number,
//   location: String,
//   country: String,
// });
// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     filename: String,
//     url: {
//       type: String,
//       default: "https://images.unsplash.com/photo-1556911220-e15b30f23d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDZ8fGtpdGNoZW58ZW58MHx8fHwxNjE1NTIwMzkz&ixlib=rb-1.2.1&q=80&w=1080",
//     },
//   },
//   price: Number,
//   location: String,
//   country: String,
// });
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    },
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Correct case for the User model
  },
});

// Middleware to handle actions after a Listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  // Check if a listing was found and deleted
  if (listing) {
      // Delete all reviews that are associated with the deleted listing
      await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
