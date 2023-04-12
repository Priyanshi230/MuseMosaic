const express = require('express');
const app = express();
const port = 3000;
const middleware = require('./middleware');  
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require('./database');
const session = require("express-session");

 
//const mongodb = require('mongodb');
 
// pug is a easy to use templete 
 app.set("view engine","pug");
 // the view name becomes the file path, minus the root directory and the file extension.
 app.set("views","views"); 
 app.use(bodyParser.urlencoded({extended: false})); 
 // join the path and directory name
 app.use(express.static(path.join(__dirname,"public")))

 app.use(session ({
    // secrets are used to hash the session 
    // a string is used to hash here
    secret: "priyanshilovespasta",
    // resave forces the session to be saved
    // resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request
    resave: true,
    // saveUninitialized : prevents it from saving the session if uninitilized
    saveUninitialized:false
 }))

 
const server = app.listen(port,()=>{
    console.log("Server listening on port " + port)
});


// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes.js');

// API ROUTES
const postsApiRoute = require('./routes/api/posts');



app.use("/login",loginRoute );
app.use("/register",registerRoute);
app.use("/logout",logoutRoute);

app.use("/api/posts",postsApiRoute);
 
app.get("/",middleware.requireLogin,(req,res,next) => {

      
     var payload = {

        pageTitle: "HOME",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        
     }
    res.status(200).render("home",payload); 
})