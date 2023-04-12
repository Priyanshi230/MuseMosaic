/** this file contain shared code that each of the  */
/* document.ready waits untill the page is ready that means once the page has loaded  all of its dependancies
   this is used so that you can use the dependices like in this case we need the script from  main-layout  
*/
/*$(document).ready (() => {
   alert("hiii")
})
*/


//const {post} = require("../../routes/api/posts");
// FUNCTION FOR ENABLE AND DISABLE OF THE POST BUTTON ON WRITNG IN THE TEXTBOX
$("#postTextarea,#replyTextarea").keyup(event => {
    var textbox = $(event.target);
    // .val() && .trim() are predefined function :: trim will remove all the spaces so if user enter blanck space it will  stop the button being enabled when the user has entered space.    
    // .val gives us the value of the element here it will give us the text of the textbox
    var value = textbox.val().trim();
    
    var isModal = textbox.parents(".modal").length == 1;
    // enable or disable the submit button

    var submitButton = isModal ? $("#submitReplyButton") : $("#submitPostButton");

    if(submitButton.length == 0){
    return alert("NO submit button Found");
    }
    if(value == ""){
        // prop stands for property 
        // after checking condition we are disable  button to true
        submitButton.prop("disabled",true);
        return;
    }
    // if the above property pass button disable is turned false
    submitButton.prop("disabled",false);
})

// FUNCTION FOR POSTING
$("#submitPostButton").click(() =>{
    var button = $(event.target);
    var textbox = $("#postTextarea");
    // data is an object here
    var data = {
     content: textbox.val() 
    }

    // we will make an ajax request which will send the data to the server without us having to reload the page 

     
    // the below callback function is going to be the function which is called or executed when the request to the url has returned
    // we are sending the data to the url ans when that will return the function will be executed.
    // xhr stands for Xml Http Request .It conatins the status of the request(ef 200 if the code works,404 if it does not work)
 $.post("/api/posts", data, (postData,status,xhr) => {
    //console.log(postData); shows postdata in console
     var html = createPostHtml(postData); 
     $(".postsContainer").prepend(html);
     //prepend is used to add the post to the top of the page of the page 
     // apnned will add the post to the end of the page.
     textbox.val(""); // the textbox will be empty
     button.prop("disabled",true); // button will be automatically disabled
     
   })
})

$("#replyModal").on("show.bs.modal",(event) => {
  var button = $(event.relatedTarget); 
   var postId = getPostIdFromElement(button);
})

//like button click handler 
$(document).on("click",".likeButton",(event) =>{
   var button = $(event.target);
   var postId = getPostIdFromElement(button);
   
   if(postId === undefined){
   return;
}

    $.ajax({
         url: `/api/posts/${postId}/like`,
         type: "PUT",
         success : (postData) =>{
               

          button.find("span").text(postData.likes.length || "");
          if(postData.likes.includes(userLoggedIn._id)){
            button.addClass("active");

          } 
          else{
            button.removeClass("active"); 
          }
        }
     })
       
})

$(document).on("click",".retweetButton",(event) =>{
    var button = $(event.target);
    var postId = getPostIdFromElement(button);
    
    if(postId === undefined){
    return;
 }
 
     $.ajax({
          url: `/api/posts/${postId}/retweet`,
          type: "POST",
          success : (postData) =>{
                
 
           button.find("span").text(postData.retweetUsers.length || "");
           if(postData.retweetUsers.includes(userLoggedIn._id)){
             button.addClass("active");
 
           } 
           else{
             button.removeClass("active"); 
           }
         }
      })
        
 })
 
// this function would find the postid from the element we have given
function getPostIdFromElement(element){
    var isRoot = element.hasClass("post");
    // ternanry operator(conditional opeerator) used
    // .closest is jquery function which goes through the tree to find the parent with specified selector. 
    var rootElement = isRoot ? element :element.closest(".post");
    var postId = rootElement.data().id;


    if(postId === undefined)
    return alert( "postid undefined");

    return postId;
}
function createPostHtml(postData){
   // return postData.content;

   if(postData == null)
   return alert("Post object is null");
    
   var postedBy =  postData.postedBy;

   var isRetweet = postData.retweetData !== undefined;
   var retweetedBy = isRetweet ? postData.postedBy.username:null;
    postData = isRetweet ? postData.retweetData : postData;
   
    
   

     if(postedBy._id === undefined){
        return console.log("User Object not populated");
     }
     var displayName = postedBy.firstName + " "+postedBy.lastName;
     var timestamp = timeDifference(new Date(),new Date(postData.createdAt));
 
    var likeButtonActiveClass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedIn._id) ? "active" : "";

    var retweetText = '';
    if(isRetweet){
      retweetText = `<span>
                <i class="fa-solid fa-retweet"></i>
                Retweeted by <a href ='/profile/${retweetedBy}'>@${retweetedBy}</a>
      </span>` 
    }
    return`<div class ='post' data-id ='${postData._id}'>
        <div class = 'postActionContainer'>
          ${retweetText}

        </div>
           <div class = 'mainContentContainer'>
                <div class = 'userImageContainer'>
                    <img src = '${postedBy.profilePic}'>
                </div>

                <div class  ='postContentContainer'>
                    <div class = 'header'>
                    
                    <a href ='/profile/${postedBy.username}' class ='display'>${displayName}</a>
                    <span class  ='username'>@${postedBy.username}</span>
                    <span class ='date'>${timestamp}</span>
                    </div>
                    
                    <div class = 'postBody'>
                        <span>${postData.content}</span>  
                    </div>


                    <div class = 'postFooter'>
                         <div class = 'postButtonContainer'>
                           <button data-toggle ='modal' data-target ='#replyModal'>
                           <i class="fa-regular fa-comment"></i>
                           </button>
                         
                         </div>



                         <div class = 'postButtonContainer lavender '>
                         <button class = 'retweetButton ${retweetButtonActiveClass}' >
                         <i class="fa-solid fa-retweet"></i>
                         <span>${postData.retweetUsers.length || ""}</span>
                         </button>
                       
                       </div>



                       <div class = 'postButtonContainer lavender'>
                       <button class ='likeButton ${likeButtonActiveClass}'>
                       <i class="fa-regular fa-heart"></i>
                       
                       <span>${postData.likes.length || ""}</span>
                       </button>
                     
                     </div>

                    </div>
                </div>
           
           
            </div>
    </div>`;
    // when we create a string in js using backtick(` `) we can inject variables into it.
}


//(line 77)  anchor tag is used because we will give link of userprofile so that when we click userprofile we can be redirected to that profile

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;
  

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30) return "Just now";
        
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {   
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}