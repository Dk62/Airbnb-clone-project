const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: " ",
    },

    url: {
      type: String,
      default:
        "https://www.getsready.com/wp-content/uploads/2016/03/Virgin-Islands-3.jpg",
      set: (v) =>
        v === ""
          ? "https://www.getsready.com/wp-content/uploads/2016/03/Virgin-Islands-3.jpg"
          : v,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
         message: (props) => `${props.value} is not a valid image URL!`, message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
  },
  price: Number,
  location: String,
  country: String,
});
const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
