var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");



mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);mongoose.connect("mongodb://localhost:27017/igabeDB");


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get("/",isLoggedIn,function(req,res){
    res.send("loged.in");
});

///AUTH_ROUTES

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    
    User.register(new User({username:req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/");
        });
    });
});


///login
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function(req,res){
});


///logout

app.get("/logout",function(req,res){
    req.logout();
    res.redirect('/');
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

app.listen("2020",function(){
    console.log("server started");
})