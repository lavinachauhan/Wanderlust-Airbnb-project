const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

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

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", {allListings});
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