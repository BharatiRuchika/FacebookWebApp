class PostComments{
    // Constructor for PostComments class
    constructor(commentForm){
        this.Form = commentForm
        this.createComment()
    }
    createComment(){
        // Method to handle comment creation
        let pSelf = this
        $(this.Form).submit(function(e){
            e.preventDefault()
            let self = this
            // Send a POST request to create a new comment
            $.ajax({
                type:'post',
                url:'/api/v1/comment/create',
                data:$(self).serialize(),
                success:function(data){
                    // Handle successful comment creation
                    data.data.comment.liked = false
                    let newComment = pSelf.newCommentDom(data.data.comment,data.data.postId)
                    $(`#comment-container-${data.data.postId}`)[0].prepend(newComment[0])
                    pSelf.deleteComment($(' .delete-comment-button',newComment))
                    openEmojis($(' .toggle-like-container',newComment))
                    deletePost($(' .deleteItem',newComment))
                    displayPostEmojiContainer($(' .comment-reactions-container',newComment),data.data.comment._id,'comment')
                    new ToggleLike($(' .toggle-like-button',newComment))

                    // Display a success notification
                    new Noty({
                        theme:'relax',
                        text:'Comment published',
                        type:'success',
                        layout:'topRight',
                        timeout:500
                    }).show()              
                   
                    $(`#comment-content-${data.data.postId}`).val('')
                    // $(`#comments-status`).text('')
                    $('#comments-status').html('&nbsp;');
                },error:function(error){
                    console.log(error.responseText)
                }
            })
        })
        
        }

        // Define a newCommentDom function
        newCommentDom = function(comment,postId){
            // Create the DOM structure for a new comment
        return $(`
        <div class="row comment-container-div" id="Comment-${comment._id}">
        <div class="col-12">
            <div class="row">
           
                <div class="col-2 profile-pic">
                  
                    <img class="profileImage"
                    src="${comment.user.avatar.url}" />
                        
                </div>
    
                <div class="col-6">
                    <div id="comment-content">
                        <div class="row">
                            <div class="col-12">
                                <h6>
                                    ${comment.user.fullName}
                                </h6>
                            </div>
                            <div class="col-12">
                                <p>
                                    ${comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                        <div class="toggle-like-container" id="like-${comment._id}">
                            <a data-likes="${comment.likes.length}">
                                <i class="fa-regular fa-thumbs-up thumbs-up-${comment._id}"></i>
                            </a>
                            
                           <span class="LikeBtn">Like</span>
                        </div>
                            
                            
                            <div style="display: none" id="emojiContainer" >
                                <a id=${comment._id} class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Wow&emoji=😮">
                                    <div class="emoji">😮</div>
                                </a>
        
                                <a id=${comment._id} class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Laugh&emoji=😂">
                                    <div class="emoji">😂</div>
                                </a>
        
                                <a id=${comment._id}  class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Love&emoji=😍">
                                    <div class="emoji">😍</div>
                                </a>
        
                                <a id=${comment._id}  class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Like&emoji=👍">
                                    <div class="emoji">👍</div>
                                </a>
        
                                <a id=${comment._id}  class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Sad&emoji=😔">
                                    <div class="emoji">😔</div>
                                </a>
        
                                <a id=${comment._id}  class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emojiType=Angry&emoji=😡">
                                    <div class="emoji">😡</div>
                                </a>
                            </div>


                        </div>
                    </div>
                </div>
                <div class="col-3">
                <div class="comment-reactions-container" data-emojis="${JSON.stringify(comment.emojis)}" id="CommentReaction-${comment._id}">
                    <img id="loveIcon"
                        src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e" />
                    <img id="likeIcon"
                        src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" />

                        <div class="likeCount-${comment._id}">
                            <span>${comment.likes.length}</span> likes
                        </div>
                </div>

                
                <div style="display:none" id="comment-emojis-${comment._id}">
                    
                </div>
            </div>


                <div class="col-1">
                <button class="btn btn-primary menu-btn" data-toggle="collapse" data-target="#comment-edits-${comment._id}">
                    <h6>...</h6>
                </button>

                <div id="comment-edits-${comment._id}" style="padding: 10px;" class="collapse notification-list modals">
                <p>
                
                    
                <a class="deleteItem" id="${comment._id}"  href="/api/v1/users/delete/?id=${comment._id}&type=Comment&postId=${postId}">Delete</a>
                </p>
            </div>
                </div>
            </div>
        </div>
    </div>
                 `)
        }

    

    deleteComment = function(deleteLink){
        // Method to handle comment deletion
        $(deleteLink).click(function(e){
        e.preventDefault()
        $.ajax({
            type:'get',
            url:$(deleteLink).prop('href'),
            success:function(data){
                console.log("delete data",data)
                $(`#comment-${data.data.comment_id}`).remove()
                new Noty({
                    theme:'relax',
                    text:'Comment Deleted',
                    type:'success',
                    layout:'topRight',
                    timeout:1500
                }).show()    
            },error:function(err){
                console.log("err",err.responseText)
            }
        })
    })
}
}

// Define the openEmojis function
openEmojis = function(openLink){
    // Method to open or close emojis
    console.log('im in openEmojis')
    console.log('openLink',openLink)
    $(openLink).click(function(e){
        console.log('***',$(openLink).next()[0])
        if($(openLink).next()[0].style.display=='none'){
            $(openLink).next()[0].style.display = 'block'
        }else{
            $(openLink).next()[0].style.display = 'none'
        }
    })
}

$('.toggle-like-container').each(function(){
    // Iterate through elements with the class "toggle-like-container"
    console.log('toggle-like-container')
    openEmojis(this)
})






    

