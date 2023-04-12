const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema');
const bcrypt = require("bcrypt");    

app.set("view engine","pug");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false})); 

router.get("/",(req,res,next) => {

    
 
   res.status(200).render("register"); 
})

router.post("/",async(req,res,next) => {

     var firstName = req.body.firstName.trim();
     var lastName = req.body.lastName.trim();
     var username = req.body.username.trim();
     var email = req.body.email.trim();
     var password = req.body.password;
     var payload  = req.body;
     
     if(firstName && lastName && username && email && password) {

      
             
   
        // we are accesing the user schema object
        // findOne is going to one document (row) in the collection(tabel)
        var user =  await User.findOne({
            // or operator to check id any of the condition is true which means either the email or username is already in use.
           $or: [
            { username: username},
            {email:email}
            ]
         }) 
        
         .catch((err) => {
            console.log(err);

            payload.errorMessage = " Something went wrong."
            res.status(200).render("register",payload); 
         });
        

         if(user == null){
            // that means no user found
           // to insert user we use user.create
            var data = req.body;
            // becrypt is used to hash the password
            // bcrypt has two parameters
            // becrypt(the thing to be hashed,saltOrRounds)
            //saltOrRounds: specify how many time the function need to do hashing calculation, the higher the nmber makes password more secure
            // 10 menas it will calculate 2^10 which is 1024 which is highly secure
            data.password = await bcrypt.hash(password,10);
            User.create(data)
            .then((user) => {
             req.session.user = user;
             return res.redirect("/");
            })
         }
         else{
            // when user is found.
            if(email == user.email){
               payload.errorMessage = " The entered Email is already in use.";
            }
            else{
               payload.errorMessage = " The entered Username is already in use.";
            }
            res.status(200).render("register",payload); 
         }
     }
      else{
      payload.errorMessage = " Make sure you enter a valid value to all fields."
      res.status(200).render("register",payload); 
     }
  
})
module.exports = router;

/*

router.post("/",(req,res,next) => {
 console.log(req.body);
 res.status(200).render("register");
})

*/


