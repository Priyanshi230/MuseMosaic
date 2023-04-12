const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");     
const User = require('../schemas/UserSchema');
const bcrypt = require("bcrypt");

 
 
app.set("view engine","pug");
app.set("views","views");

app.use(bodyParser.urlencoded({extended: false})); 
  

router.get("/",(req,res,next) => {

     

   res.status(200).render("login"); 
}) 


   

router.post("/", async(req,res,next) => {
           
       var payload = req.body;

          if(req.body.logusername && req.body.logPassword) {
            var user =  await User.findOne({
               // or operator to check id any of the condition is true which means either the email or username is already in use.
              $or: [
               { username: req.body.logusername},
               {email:req.body.logusername}
               ]
            }) 
           
            .catch((error) => {
               console.log(error);
   
               payload.errorMessage = " Something went wrong."
               res.status(200).render("login",payload); 
            }); 

            if(user != null){
               // bcrypt.compare is a build in function which allows us to compare an unencrypted password  with an encrypted password
              var result = await bcrypt.compare(req.body.logPassword,user.password);


              if(result === true){
                  req.session.user = user;
                  return res.redirect("/");
              }
              
            }
              
            payload.errorMessage = " Incorrect Login Credentials."
            return res.status(200).render("login",payload); 
            

          }
     
           
       
          payload.errorMessage = "Make sure each field has valid values."
          res.status(200).render("login"); 
})

module.exports = router;