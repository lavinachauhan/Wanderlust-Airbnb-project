const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingsSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
  var {error} = listingsSchema.validate(req.body);
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

// edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let detail = await Listing.findById(id);
    if(!detail){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {detail});
}))

// update route
router.put("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    let detail = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...detail});
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);

}))

// delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); 
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");

}))

// index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}))

// new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

// create route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    // try{
    // let {title, description, image, price, country, location} = req.body;
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for new listing");
    }
  
        let listing = req.body.listing;
        let newListing = new Listing(listing);
        // if(!newListing.title){
        //     throw new ExpressError(400, "Title is missing");
        // }
        await newListing.save();
        req.flash("success", "New Listing Created");
        // console.log(listing); 
        // await Listing.insertOne(listing);
        res.redirect("/listings");
    // }catch(err){
    //     next(err);
    // }
}))


// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id}= req.params;
    const detail = await Listing.findOne({_id : id}).populate("reviews");
    // console.log("Details printed")
    // console.log(detail);
    if(!detail){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {detail});
}))

module.exports = router;
