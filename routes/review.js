const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
  var {error} = reviewSchema.validate(req.body);
    // console.log(result);
    if(error){
        // const msg = error.details[0].message;
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
}

// Reviews Post Route
router.post("/", validateReview, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    // console.log("New Review Saved");
    // res.send("New Review Saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${req.params.id}`);
}));

// Reviews Delete Route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let {id, reviewId} = req.params;
    // $pull is used 
    await Listing.findByIdAndUpdate(id, {$pull :{reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${req.params.id}`);
}));


module.exports = router;