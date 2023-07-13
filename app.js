//jshint esversion:6
require('dotenv').config()
const express = require ("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewURLParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(function(){
        res.render("secrets");
    }).catch(function(err){
        console.log(err);
    });
    
});

app.post("/login",function(req,res){
    const userEmail = req.body.username;
    const userPassword = req.body.password;
    User.findOne({email: userEmail}).then(function(foundUser){
        if(foundUser){
            if(foundUser.password===userPassword){
                res.render("secrets");
            }else{
                res.send("Wrong Password");
            }
        }else{
            res.send("NO user found");
        }
        
    }).catch(function(err){
        console.log(err);
    });
})

app.listen(3000,function(){
    console.log("Server started on port 3000.");
});