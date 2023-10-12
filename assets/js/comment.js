// {
// console.log("hello")
// let createComment = function(){
//     console.log("im in create post")
//     let newPostForm = $("#create-comment-form")
//     console.log('newPostForm',newPostForm)
//     newPostForm.submit(function(e){
//         e.preventDefault()
//         var hiddenInput = $("#hiddenInput");
//         console.log('hiddenInput',hiddenInput[0])
//         var postId = hiddenInput[0].value;
//         console.log('postId',postId)
//         console.log('newPostForm',newPostForm.serialize())
//         $.ajax({
//             type:'post',
//             url:`/api/v1/comment/create?postId=${postId}`,
//             data:newPostForm.serialize(),
//             success:function(data){
//                 console.log('coment data',data)
//                 console.log('comment container', $("#comment_content"))
//                 let newComment = newCommentDom(data.data.comment)
//                 console.log('newComment',newComment);
//                 $('#comment-container').prepend(newComment)
//                 console.log('element',$('#posts-list-container>ul'))
//                 deleteComment($(' .delete-comment-button',newComment))
//                 new ToggleLike($(' .toggle-like-button',newComment))
//                 new Noty({
//                     theme:'relax',
//                     text:'Comment published',
//                     type:'success',
//                     layout:'topRight',
//                     timeout:500
//                 }).show()
//                 $("#comment_content")[0].value = ''
//             },error:function(error){
//                 console.log(error.responseText)
//             }
//         })
//     })
// }





// let newCommentDom = function(comment){
//         console.log('im in new Comment Dom')
//         return $(`
//         <div class="col-1">
//             <img class="profileImage" src="https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg"/>
//                         </div>
//                         <div class="col-10">
//                             <div id="comment-content">
//                                     <div class="row">
//                                         <div class="col-12">
//                                             <h6>${comment.user.fullName}</h6>
//                                         </div>
//                                         <div class="col-12">
//                                             <p>${comment.content}</p>
//                                         </div>
//                                     </div>
//                             </div>
//                             <div class="row">
//                                 <div class="col-12">
//     <a class="comment-toggle-like-button" data-likes="${comment.likes.length}" href="/api/v1/likes/toggle?id=${comment._id}&type='Comment' ">
//                                     <i id="comment-thumbs-up" class="fa-regular fa-thumbs-up"></i></a>
//                                     <span id="comments-like-count">${comment.likes.length} </span>Likes
//                                 </div>
                               
//                             </div>
//                         </div>
//                         <div class="col-1">
//                             <p id="comment-menu">...</p>
//                         </div>
//         `)
// }

// let deleteComment = function(deleteLink){
//         $(deleteLink).click(function(e){
//         e.preventDefault()
//         $.ajax({
//             type:'get',
//             url:$(deleteLink).prop('href'),
//             success:function(data){
//                 console.log("delere data",data)
//                 $(`#comment-${data.data.comment_id}`).remove()
//                 new Noty({
//                     theme:'relax',
//                     text:'Comment Deleted',
//                     type:'success',
//                     layout:'topRight',
//                     timeout:1500
//                 }).show()
//             },error:function(err){
//                 console.log("err",err.responseText)
//             }
//         })
//     })

// }

// createComment()
// }





class PostComments{
    constructor(commentForm){
        console.log('commentForm',commentForm)
        this.Form = commentForm
        this.createComment()
    }
    createComment(){
        let pSelf = this
        $(this.Form).submit(function(e){
            e.preventDefault()
            console.log('form is submitted')
            let self = this
            console.log('serialize',$(self).serialize())
            $.ajax({
                type:'post',
                url:'/api/v1/comment/create',
                data:$(self).serialize(),
                success:function(data){
                    data.data.comment.liked = false
                    let newComment = pSelf.newCommentDom(data.data.comment)
                    // console.log('postId',data.data)
                    $(`#comment-container-${data.data.postId}`)[0].prepend(newComment[0])
                    pSelf.deleteComment($(' .delete-comment-button',newComment))
                    pSelf.openEmojis($(' .LikeBtn',newComment))
                    displayPostEmojiContainer($(' .comment-reactions-container',newComment),data.data.comment._id,'comment')
                    new ToggleLike($(' .toggle-like-button',newComment))
                    new Noty({
                        theme:'relax',
                        text:'Comment published',
                        type:'success',
                        layout:'topRight',
                        timeout:500
                    }).show()
                    $(`#commentsCount-${data.data.postId}`)[0].textContent = data.data.count
                    $(`#comment-content-${data.data.postId}`).val('')
                },error:function(error){
                    console.log(error.responseText)
                }
            })
        })
        
        }

        
        newCommentDom = function(comment){
        
        return $(`
        <div class="row">
        <div class="col-12">
            <div class="row">
                <div class="col-1">
                  
                    <img class="profileImage"
                    src="${comment.user.avatar ? `${comment.user.avatar}` : 'https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg'}" />
                        
                </div>
    
                <div class="col-7">
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
                            <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                href="/api/v1/likes/toggle?id=${comment._id}&type=Comment">
                                <i style="color: ${comment.liked ? 'blue' : 'black'};" class="fa-regular fa-thumbs-up thumbs-up-${comment._id}"></i>
                                </a>
    
                            <span class="likeCount-${comment._id}">
                                ${comment.likes.length}
                            </span>

                            <span class="LikeBtn">Likes</span>
                            
                            <div style="display: none" id="emojiContainer" >
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Smiley">
                                    <div class="emoji">😀</div>
                                </a>
        
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Laugh">
                                    <div class="emoji">😂</div>
                                </a>
        
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Love">
                                    <div class="emoji">😍</div>
                                </a>
        
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Like">
                                    <div class="emoji">👍</div>
                                </a>
        
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Hi">
                                    <div class="emoji">👋</div>
                                </a>
        
                                <a class="toggle-like-button" data-likes="${comment.likes.length}"
                                    href="/api/v1/likes/toggle?id=${comment._id}&type=Comment&emoji=Congratulations">
                                    <div class="emoji">🎉</div>
                                </a>
                            </div>


                        </div>
                    </div>
                </div>

                <div class="col-3">
                <div class="comment-reactions-container" data-emojis="<%=JSON.stringify(comment.emojis) %>" id="${comment._id}">
                    <img id="loveIcon"
                        src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e" />
                    <img id="likeIcon"
                        src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e" />
                </div>

                
                <div style="display:none" id="comment-emojis-${comment._id}">
                    
                </div>
            </div>


                <div class="col-1">
                    <p id="comment-menu">...</p>
                </div>
            </div>
        </div>
    </div>
                 `)
        }

    

    deleteComment = function(deleteLink){
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
openEmojis = function(openLink){
    $(openLink).click(function(e){
        if($(openLink).next()[0].style.display=='none'){
            $(openLink).next()[0].style.display = 'block'
        }else{
            $(openLink).next()[0].style.display = 'none'
        }
    })
}
}