const express = require('express'); 
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");     
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');



 
app.use(bodyParser.urlencoded({extended: false})); 
  

router.get("/",(req,res,next) => {
     Post.find()
    .populate("postedBy") 
    .populate("retweetData")
    // to sort the post so that the last posted post comes up
    // by default is 1 that means first posted will be shown first
    // -1 becuse we want last posted at first position.
    .sort({"createdAt" : -1})
   .then(async results => {
     results = await User.populate(results,{path: "retweerData.postedBy"});
     res.status(200).send(results)
   })
   .catch(error => {
     console.log(error);
     res.sendStatus(400);
   })
 

}) 


   

router.post("/", async(req,res,next) => {
  if(!req.body.content){
     console.log("Content parameter ot send with request");
     return res.sendStatus(400);
  }
     var postData = {
          content: req.body.content,
          postedBy: req.session.user
     }
     Post.create(postData)
     .then(async newPost => {
           //Populate allows you to replace IDs within your data with other data from Firebase
           newPost = await User.populate(newPost,{path:"postedBy"}) 

          res.status(201).send(newPost);
     })
     .catch(error =>{ 
          alert("Your Post was not able to submit.")
          res.sendStatus(400);
     })
     

})



router.put("/:id/like", async(req,res,next) => {
     var postId = req.params.id;
     var userId = req.session.user._id;

     // check if the post id is present in the like array of userschemas
     // if the postid exist we unlike it else we like it
     var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
      
     // insert user like
     // addtoset is an operator that mongodb has that allows as to add to a set
     // set is bascially a list where otem exist only one time
        
     //User.findByIdAndUpdate(userId,{$addToSet: {likes:postId}})

     // if we want to unlike it we will use pull
     // here we will conditionally use addToSet and pull
      // ternary operator used for the condition whoes result is stored in variable option which will be passed in square brackets becuse its a variable
      // $ >> ajax call (Asynchronous JavaScript and XML used for fast dynamic web pages.)
       var option = isLiked ? "$pull" : "$addToSet"; 
      
       
      // need to do the new: true and req.session.user si that gives us the updates valus  
     req.session.user = await User.findByIdAndUpdate(userId,{[option]: {likes:postId}},{new:true})
     .catch(error => {
          console.log(error);
          res.sendStatus(400);
     })
     //insert post like
     var post = await Post.findByIdAndUpdate(postId,{[option]: {likes:userId}},{new:true})
     .catch(error => {
          console.log(error);
          res.sendStatus(400);
     }) 
     res.status(200).send(post);
   })



   router.post("/:id/retweet", async(req,res,next) => {
     
     var postId = req.params.id;
     var userId = req.session.user._id;

     // try and delete retweet
     var deletedPost = await Post.findOneAndDelete({postedBy:userId,retweetData: postId})
     .catch(error => {
          console.log(error);
          res.sendStatus(400);
     })
       var option = deletedPost != null ? "$pull" : "$addToSet"; 
      
      var repost = deletedPost;
      if(repost == null){
          repost = await Post.create({postedBy:userId,retweetData:postId})
          .catch(error => {
               console.log(error);
               res.sendStatus(400);
          })
     }
       

     req.session.user = await User.findByIdAndUpdate(userId,{[option]: {retweets:repost._id}},{new:true})
     .catch(error => {
          console.log(error);
          res.sendStatus(400);
     })
     //insert post like
     var post = await Post.findByIdAndUpdate(postId,{[option]: {retweetUsers:userId}},{new:true})
     .catch(error => {
          console.log(error);
          res.sendStatus(400);
     }) 
     res.status(200).send(post);
   })
module.exports = router;