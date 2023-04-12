// this is the js for only home page
// this file will just load the post when the page loads


$(document).ready(() =>{
    $.get("/api/posts", results => {
        outputPosts(results,$(".postsContainer"));
        
       })
})


function outputPosts(results,container){
     container.html("");

     results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
     });


     if(results.length == 0){
        container.append("<span class = 'noresults'> Nothing to show.</span>")
     } 
}