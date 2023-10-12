{
    let createPost = function(){
        let newPostForm = $("#create-post-form")
        newPostForm.submit(function(e){
            e.preventDefault()
            const fileInput = document.getElementById('imageUpload');
            console.log('$("#content").value',$("#content").val())
            const formData = new FormData();
           formData.append("avatar", fileInput.files[0]);
           formData.append("content", $("#content").val());
            $.ajax({
                type:'post',
                url:'/api/v1/users/create-post',
                data:formData,
                contentType: false,
                processData: false,
                success:function(data){
                    console.log('post data',data.data.post)
                   data.data.post.liked = false
                    let newPost = newPostDom(data.data.post)
                    $('#post-container').prepend(newPost)
                    deletePost($(' .delete-post-button',newPost))
                    openEmojiContainer($(`#${data.data.post._id}`, newPost), data.data.post._id);
                    new ToggleLike($(' .toggle-like-button',newPost))
                    new Noty({
                        theme:'relax',
                        text:'Post published',
                        type:'success',
                        layout:'topRight',
                        timeout:500
                    }).show()
                    window.location.href="http://localhost:8000/"
                },error:function(error){
                    console.log(error.responseText)
                }
            })
        })
    }
    let newPostDom = function(post){
        return $(`
        <div class="col-12">
        <div class="row">
            <div class="col-6">
                <div class="row">
                    <div class="col-2" id="post-container-profile">
                        <img
                            src="https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg" />
                    </div>
                    <div class="col-10">
                        <a class="redirect" href=""><h5>${post.user.fullName}</h5></a>
                        <span class="time">1 October,2023</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                ${post.content}
            </div>
            <div class="col-12" id="post-container-post">
                <img
                    src="${post.postImage}" />
            </div>
        </div>
        <div class="row react-section" id="like-comment-count-section">
            <div class="col-12">
                <div class="row">
                    <div class="col-3 post-reactions-container" id="${post._id}">
                        <img id="loveIcon" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e"/>
                        <img id="likeIcon" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"/>
                        
                        <div class="likeCount-${post._id}">
                             ${post.likes.length}
                        </div>
                    </div>
                    <div style="display:none" id="post-emojis-${post._id}">
                                    
                    </div>
                   
                    <div class="offset-6 col-3">
                            <span> ${post.comments.length} Comments</span>
                    </div>
                    <!-- <hr/> -->
                </div>
            </div>
        </div>
        <div class="row react-section" id="react-buttons">
            <div class="col-12">
                <div class="row">
                    <div class="col-4">
                        <a class="toggle-like-button" data-likes="${post.likes.length}" href="/api/v1/likes/toggle?id=${post._id}&type=Post">
                       
                        <i style="color: ${post.liked ? 'blue' : 'black'};" class="fa-regular fa-thumbs-up thumbs-up-${post._id}"></i>

                       
                        </a>

                        <span>Like</span>
                    </div>
                    <div class="col-4">
                        <i class="fa-regular fa-comment"></i>
                        <span>Comment</span>
                    </div>
                    <div class="col-4">
                        <i class="fa-solid fa-share"></i>
                        <span>Share</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row react-section" id="comment-section">
                <div class="col-12">
                    <div class="row comment_rows" id="comment-container-${post._id}">
                        
                    </div>
                    <!-- <div class="row comment_rows">
                        
                    </div> -->
                    <div class="row comment_rows">
                        <div class="12">
                            <div class="row">
                                <div class="col-1">
                                    <img class="profileImage" src="https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg"/>
                                </div>
                                <div class="col-10">
                                    <form action="" id="create-comment-form-${post._id}" method="POST" class="comment-form">
                                    <div class="row">
                                        <div class="col-12">
                                            <div id="create-comment-container">
                                                <input type="text" placeholder="write a comment..." id="comment-content-${post._id}" name="comment_content"/>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="hidden" id="hiddenInput" value="${post._id}"/>
                                    <div class="row">
                                        <div class="col-12">
                                        
                                            <div class="comment-content-reactions" id=${post._id}>
                                            <div>
                                                <img id="loveIcon" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%23FF6680'/%3e%3cstop offset='100%25' stop-color='%23E61739'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0.710144928 0 0 0 0 0 0 0 0 0 0.117780134 0 0 0 0.349786932 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 100 16A8 8 0 008 0z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M10.473 4C8.275 4 8 5.824 8 5.824S7.726 4 5.528 4c-2.114 0-2.73 2.222-2.472 3.41C3.736 10.55 8 12.75 8 12.75s4.265-2.2 4.945-5.34c.257-1.188-.36-3.41-2.472-3.41'/%3e%3c/g%3e%3c/svg%3e"/>
                                                <img id="likeIcon" src="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 16 16'%3e%3cdefs%3e%3clinearGradient id='a' x1='50%25' x2='50%25' y1='0%25' y2='100%25'%3e%3cstop offset='0%25' stop-color='%2318AFFF'/%3e%3cstop offset='100%25' stop-color='%230062DF'/%3e%3c/linearGradient%3e%3cfilter id='c' width='118.8%25' height='118.8%25' x='-9.4%25' y='-9.4%25' filterUnits='objectBoundingBox'%3e%3cfeGaussianBlur in='SourceAlpha' result='shadowBlurInner1' stdDeviation='1'/%3e%3cfeOffset dy='-1' in='shadowBlurInner1' result='shadowOffsetInner1'/%3e%3cfeComposite in='shadowOffsetInner1' in2='SourceAlpha' k2='-1' k3='1' operator='arithmetic' result='shadowInnerInner1'/%3e%3cfeColorMatrix in='shadowInnerInner1' values='0 0 0 0 0 0 0 0 0 0.299356041 0 0 0 0 0.681187726 0 0 0 0.3495684 0'/%3e%3c/filter%3e%3cpath id='b' d='M8 0a8 8 0 00-8 8 8 8 0 1016 0 8 8 0 00-8-8z'/%3e%3c/defs%3e%3cg fill='none'%3e%3cuse fill='url(%23a)' xlink:href='%23b'/%3e%3cuse fill='black' filter='url(%23c)' xlink:href='%23b'/%3e%3cpath fill='white' d='M12.162 7.338c.176.123.338.245.338.674 0 .43-.229.604-.474.725a.73.73 0 01.089.546c-.077.344-.392.611-.672.69.121.194.159.385.015.62-.185.295-.346.407-1.058.407H7.5c-.988 0-1.5-.546-1.5-1V7.665c0-1.23 1.467-2.275 1.467-3.13L7.361 3.47c-.005-.065.008-.224.058-.27.08-.079.301-.2.635-.2.218 0 .363.041.534.123.581.277.732.978.732 1.542 0 .271-.414 1.083-.47 1.364 0 0 .867-.192 1.879-.199 1.061-.006 1.749.19 1.749.842 0 .261-.219.523-.316.666zM3.6 7h.8a.6.6 0 01.6.6v3.8a.6.6 0 01-.6.6h-.8a.6.6 0 01-.6-.6V7.6a.6.6 0 01.6-.6z'/%3e%3c/g%3e%3c/svg%3e"/>
                                            <div>
                                                <button type="submit" id="post-comment-btn">
                                                    
                                               <a class="comment-share-btn" href="/api/v1/comment/create?postId=${post._id}"><i class="fa-regular fa-paper-plane"></i></a>
                                                </button>

                                            </div>
                                            <div style="display:none" class='comment-emojis-${post._id}'>
                                    
                                            </div>
                                        </div>
                                    </div>
                                    </form>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
        </div>
    </div>
        `)
    }

let deletePost = function(deleteLink){
    
    $(deleteLink).click(function(e){
        console.log("deleteLink",deleteLink)
        e.preventDefault()
        $.ajax({
            type:'get',
            url:$(deleteLink).prop('href'),
            success:function(data){
                console.log("data",data)
                $(`#post-${data.data.post_id}`).remove()
            },error:function(err){
                console.log("err",err.responseText)
            }

        })
    })
}
function openEmojiContainer(Element,postId) {
    
    $(Element).find('img').click(function(e){
        
        e.preventDefault()
        e.stopPropagation(); 
        const emojiInput = document.getElementById(`comment-content-${postId}`);
        const commentEmojis = document.getElementById(`comment-content-emojis-${postId}`);
        let style = window.getComputedStyle(commentEmojis)
        if (style.display == 'none'){
            commentEmojis.style.display = 'block'
            const emojis = ['😀', '😂', '😍', '👍', '👋', '🎉'];
            emojis.forEach((emoji) => {
                const emojiButton = document.createElement('div');
                emojiButton.className = 'emoji';
                emojiButton.textContent = emoji;
                emojiButton.addEventListener('click', () => {
                    emojiInput.value += emoji
                    commentEmojis.style.display = 'none';
                    commentEmojis.textContent = ''
                });
                commentEmojis.appendChild(emojiButton);
            });
        }else{
            commentEmojis.textContent = ''
            commentEmojis.style.display = 'none'
        }
    })
}


function displayPostEmojiContainer(Element,postId,type){
    console.log('Element',Element)
    $(Element).click(function(e){
        console.log('type',type)
        let emojis = $(Element).attr('data-emojis');
        console.log('clicked')
        let typeEmojis = $(`#${type}-emojis-${postId}`)[0]
        console.log('typeEmojis',typeEmojis)
        let parsedEmojis = JSON.parse(emojis)
        
        if (typeEmojis.style.display=='none'){
            typeEmojis.style.display='block'
            if(emojis.length>0){
                const emojiDisplayContainer = document.createElement('div');
                emojiDisplayContainer.className = 'emojiDisplayContainer'
                for(let emoji of parsedEmojis){
                    if(emoji.type=='Smiley' && emoji.count>0){
                        console.log('im in span')
                        
                        let span = document.createElement('span');
                        span.textContent = `😀 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Laugh' && emoji.count>0){
                        let span = document.createElement('span');
                        span.textContent = `😂 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Love' && emoji.count>0){
                        let span = document.createElement('span');
                        span.textContent = `😍 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Like' && emoji.count>0){
                        let span = document.createElement('span');
                        span.textContent = `👍 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Hi' && emoji.count>0){
                        let span = document.createElement('span');
                        span.textContent = `👋 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Congratulations' && emoji.count>0){
                        let span = document.createElement('span');
                        span.textContent = `🎉 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                }
                typeEmojis.appendChild(emojiDisplayContainer)
            }
        }else{
            typeEmojis.textContent = ''
            typeEmojis.style.display='none'
        }
    })
}

createPost()

}


$('.comment-content-reactions').each(function(){
    const postId = $(this).attr('id');
    openEmojiContainer(this,postId)
})

$('.comment-reactions-container').each(function(){
    const commentId = $(this).attr('id');
    displayPostEmojiContainer(this,commentId,'comment')
})

$('.post-reactions-container').each(function(){
    const postId = $(this).attr('id');
    console.log('emojis',typeof emojis)
    displayPostEmojiContainer(this,postId,'post') 
})

$('.LikeBtn').on('click', function() {
    if($(this).next()[0].style.display=='none'){
        $(this).next()[0].style.display = 'block'
    }else{
        $(this).next()[0].style.display = 'none'
    }
});


