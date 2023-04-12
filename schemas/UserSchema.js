const mongoose= require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        // trim is used to handel spaces alought we are handelling them already using trim 
        trim:true   
    },
    lastName:{
        type: String,
        required:true,
        trim:true
    },
    username: {
        type: String,
        required:true,
        trim:true,
        unique:true
    },

    email:{
       type: String,
       required:true,
       trim:true,
       unique:true
    },

    password:{
        type: String,
        required:true
    },

    
    profilePic:{
        type:String,
        default: "/images/profilePic.png"
    },
    // this is an array of all the post that a user has liked.
    likes: [{type: Schema.Types.ObjectId,ref:'Post'}],
    retweets: [{type: Schema.Types.ObjectId,ref:'Post'}]


},{timestamps: true});
// timestamp :true >> will return the time (in milliseconds) at which the event was created.It is a read-only property of Event Interface 

// using model we have exported our schema
var User = mongoose.model('User',UserSchema);
//
module.exports = User;