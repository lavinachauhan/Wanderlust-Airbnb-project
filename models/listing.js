const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    image :{
        type: String,
        default : "https://unsplash.com/photos/a-pool-of-water-surrounded-by-rocks-and-trees-zo_udYMcaVc",
        set : (v) => v === "" ? "https://unsplash.com/photos/a-pool-of-water-surrounded-by-rocks-and-trees-zo_udYMcaVc" : v
    },
    price : {
        type: Number
    },
    location : {
        type: String
    },
    country : {
        type: String
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;