const mongoose= require('mongoose');

const Schema = mongoose.Schema;
const PostSchema = new Schema({
   content:{
    type : String,
    trim: true
   },
   postedBy:{
    type: Schema.Types.ObjectId,
    ref: "User"
   },
   pinned:Boolean,
   // this is an array of users.
   likes: [{type: Schema.Types.ObjectId,ref:'User'}],
   retweetUsers: [{type: Schema.Types.ObjectId,ref:'User'}],
   retweetData: {type: Schema.Types.ObjectId,ref:'Post'}
},{timestamps: true});
// timestamp :true >> will return the time (in milliseconds) at which the event was created.It is a read-only property of Event Interface 

// using model we have exported our schema
var Post = mongoose.model('Post',PostSchema);
//
module.exports = Post;