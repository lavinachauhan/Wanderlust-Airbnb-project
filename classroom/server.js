const express = require("express");
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user is not registered");
    }
    else{
        req.flash("success", "user registered successfully");
    }
    // res.send(name)
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    // res.send(`Hello, ${req.session.name}`);
    // console.log(req.flash("success"));
    res.render("page.ejs", {name: req.session.name});
})



// app.get("/reqCount", (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.get("/test", (req, res) => {
//     res.send("test successful");
// })

app.listen(3000, () => {
    console.log("Server is listening to 3000");
});