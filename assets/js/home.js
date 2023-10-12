// document.getElementById('create-post').addEventListener('click',createPost)

// let createPost = function(){
//     console.log("im in create post")
//     let newPostForm = $("#new-post-form")
//     newPostForm.submit(function(e){
//         e.preventDefault()
//         console.log('newPostForm',newPostForm.serialize())
//         $.ajax({
//             type:'post',
//             url:'/post/create-post',
//             data:newPostForm.serialize(),
//             success:function(data){
//                 console.log('post data',data.data.post)
//                 let newPost = newPostDom(data.data.post)
//                 console.log('newPost',newPost);
//                 $('#posts-list-container>ul').prepend(newPost)
//                 console.log('element',$('#posts-list-container>ul'))
//                 deletePost($(' .delete-post-button',newPost))
//                 new PostComments(data.data.post._id)
//                 new ToggleLike($('.toggle-like-button',newPost))
//                 new Noty({
//                     theme:'relax',
//                     text:'Post published',
//                     type:'success',
//                     layout:'topRight',
//                     timeout:500
//                 }).show()
//             },error:function(error){
//                 console.log(error.responseText)
//             }
//         })
//     })
// }
// let newPostDom = function(post){
//     return $(`
//     <li id="post-${post._id}">
// <p>
//     <small>
//         <a class="delete-post-button" href="/post/destroy/${post._id}">X</a>
//     </small>
// ${post.content}
// <br/>
// <small>${post.user.name}</small>
// <br/>
// <small>
//     <a class="toggle-like-button" data-likes="0" href="/likes/toggle?id=${post._id}&type=Post">0 Likes</a>
// </small>
// </p>
// <div class="post-comments">

// <form action="/comment/create" id="new-comment-form" method="POST">
//     <textarea name="commentContent" id="" cols="30" rows="2" placeholder="Type Here to add comment..."></textarea>
//     <input type="hidden" name="postId" value="${post._id}"/>
//     <input type="submit" value="Post">
// </form>

// <div class="post-comments-list">
//     <ul id="post-comments-${post._id}">
        
//     </ul>
// </div>
// </div>
// </li>
//     `)
// }


$("#create-post").click(function(){
    // console.log('clicked')
    window.location.href = "http://localhost:8000/api/v1/users/display-post"
    
})



   $('.toggle-like-button').each(function(){
        // console.log('im in toggle like button')
        let self = this
        // console.log('this',this)
        let toggleLike = new ToggleLike(self)
    })

$('.comment-form').each(function(){
    // console.log('im in comment share button')
    let self = this
    let postComments = new PostComments(self)
})

    

    


