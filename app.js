const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js"); 


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
    console.log("Connection Successful");
})
.catch((err) => {
    console.log(err);
})

// database connection
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("views engine", "ejs"); // it tells which template engine to use
app.set("views", path.join(__dirname, "views")); //it tells express the absolute path to the folder containing ejs files

// app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})



app.get("/", (req, res) => {
    res.send("Hi, I am root");
})

// app.get("/demoUser", async(req, res) => {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     // console.log(registeredUser);
//     res.send(registeredUser);
// });



app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/testListing", wrapAsync(async (req, res) => {
    // creating a document (record) in listings table in Listing model
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
}))

app.use((req, res, next) => {
    next(new ExpressError(404,"Page Not Found!"));
})

// Defining a middleware to handle errors
app.use((err, req, res, next) => {
    // res.send("Something went wrong");
    let {statusCode = 500 , message = 'Something went wrong!'} = err;
    // res.status(statusCode).send(message);
    // res.render("error.ejs", {err});
    res.status(statusCode).render("error.ejs", {err});
})

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
})