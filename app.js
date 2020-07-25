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

//for Nodemailer
const nodemailerapp = require('./routes/server');
const nodemailer = require('nodemailer');
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
    res.redirect("/dashboard/" + req.user._id);
    // res.render("admin/dashboard");
});

app.get("/dashboard/:id", isLoggedIn, function(req, res) {
    console.log("Hello");
    // console.log(req.user);
    res.render("admin/dashboard", {user: req.user});
});

// post request for task 
app.post("/dashboard/:id", function(req, res){
    var newTask = {
        assignedTo: req.body.assignedTo,
        assignedBy: req.body.assignedBy,
        noOfHours: req.body.noOfHours,
        wagePerHour: req.body.wagePerHour,
        description: req.body.description,
        completed: "NO",
    };
    // console.log(newTask);

    User.findOne({username: req.body.assignedTo}, function(err, newUser) {
        if(err) {
            console.log(err);
        } else {
            Task.create(newTask, function(err, newlyCreated) {
                if(err)
                console.log(err);
                else {
                    newlyCreated.save();
                    console.log('Yoooo');
                    // console.log(newlyCreated);
                    newUser.tasks.push(newlyCreated);
                    console.log(newUser);
                    newUser.save();
                }
            });
        }
    })
    
    User.findById(req.params.id, function(err, newUser) {
        if(err) {
            console.log(err);
        } else {
            Task.create(newTask, function(err, newlyCreated) {
                if(err)
                console.log(err);
                else {
                    newlyCreated.save();
                    console.log('Yoooo');
                    // console.log(newlyCreated);
                    newUser.tasks.push(newlyCreated);
                    console.log(newUser);
                    newUser.save();
                }
            });
        }
    });

    res.redirect("/dashboard/" + req.params.id);
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
        area: req.body.area,
        tasks: []
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
    res.redirect("/");
})

// Middleware to check whether user is logged in or not

function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

app.post('/mail', function (req, res) {
    console.log(req.body);
    let output = `
    <h1>name: ${req.body.name}</h1>
    <h2>email: ${req.body.email}</h2>
    `;
    nodemailerapp(req.body.email,output).then(info=>{
        console.log("email sent");
        res.render('home', { user: req.user })
        console.log(info);
    }).catch((err,info)=>{
        console.log(info);
        console.log(err);

        res.send("invalid email address");
    })
    
    
   
  })

app.listen(3000, function() { 
    console.log('Server listening on port 3000'); 
});