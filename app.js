const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
    console.log("Connection Successful");
})
.catch((err) => {
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My New Valley",
        description: "By the nature",
        price: 1200,
        location: "Calangute, Goa",
        country: "India"
    })
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful testing");
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    let detail = await Listing.findById(id);
    res.render("listings/edit.ejs", {detail});
})

// update route
app.put("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let detail = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...detail});
    res.redirect(`/listings/${id}`);

})

// delete route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id); 
    console.log(deletedListing);
    res.redirect("/listings");

})

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
})

// new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

// create route
app.post("/listings", async (req, res) => {
    // let {title, description, image, price, country, location} = req.body;
    let listing = req.body.listing;
    // let newListing = new Listing(listing);
    // await newListing.save();
    console.log(listing);
    await Listing.insertOne(listing);
    res.redirect("/listings");
})


// show route
app.get("/listings/:id", async (req, res) => {
    let {id}= req.params;
    const detail = await Listing.findOne({_id : id});
    // console.log("Details printed")
    // console.log(detail);
    res.render("listings/show.ejs", {detail});
})





app.listen(8080, () => {
    console.log("Server is listening to port 8080");
})