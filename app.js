const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/User"),
    Task = require("./models/Task");

const DBUrl = "mongodb://localhost/umeed";
mongoose.connect(DBUrl, {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// PASSPORT CONGIGURATION

app.use(require("express-session")({
    secret: "Women Empowerment",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware, so that every template has access to the user data
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/dashboard", isLoggedIn, function(req, res) {
    res.render("admin/dashboard");
});

// show register form
app.get("/register", function(req, res){
    res.render("login");
});

// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username,
        name: req.body.name,
        type: req.body.type,
        area: req.body.area
    });

    User.register(newUser, req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("login");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/dashboard");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/dashboard",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/landing");
})

// Middleware to check whether user is logged in or not

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function() { 
    console.log('Server listening on port 3000'); 
});