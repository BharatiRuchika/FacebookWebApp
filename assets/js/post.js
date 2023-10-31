{
    // Function to create a new post
    let createPost = function(){
         // Get a reference to the new post form
        let newPostForm = $("#create-post-form")

        // Attach a submit event handler to the form
        newPostForm.submit(function(e){
            e.preventDefault()

            // Gather data from the form, including an image file and content
            const fileInput = document.getElementById('imageUpload');
            console.log('$("#content").value',$("#content").val())
            const formData = new FormData();
           formData.append("avatar", fileInput.files[0]);
           formData.append("content", $("#content").val());

           // Make an AJAX request to create a new post
            $.ajax({
                type:'post',
                url:'/api/v1/users/create-post',
                data:formData,
                contentType: false,
                processData: false,
                success:function(data){

                    // Display a success message and redirect to the home page
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

// Function to open an emoji container for comments
function openEmojiContainer(Element,postId) {
    $(Element).find('img').click(function(e){
        // Handle emoji container display logic
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

// Function to display emoji containers for posts and comments
function displayPostEmojiContainer(Element,postId,type){
    console.log('Element',Element)
    $(Element).click(function(e){
        // Handle emoji container display logic based on post type
        let emojis = $(Element).attr('data-emojis');
        
        let typeEmojis = $(`#${type}-emojis-${postId}`)[0]
      
        let parsedEmojis = JSON.parse(emojis)
       
        if (typeEmojis.style.display=='none'){
            typeEmojis.style.display='block'
            if(emojis.length>0){
                console.log('im here')
                const emojiDisplayContainer = document.createElement('div');
                emojiDisplayContainer.className = 'emojiDisplayContainer'
                for(let emoji of parsedEmojis){
                    let isCount = false
                    if(emoji.type=='Wow' && emoji.count>0){
                        isCount = true
                        console.log('im in span')
                        let span = document.createElement('span');
                        span.textContent = `😮 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Laugh' && emoji.count>0){
                        isCount = true
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
                        isCount = true
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
                        isCount = true
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
                    if(emoji.type=='Sad' && emoji.count>0){
                        isCount = true
                        let span = document.createElement('span');
                        span.textContent = `😔 ${emoji.count}`
                        if(type=='comment'){
                            var singleDiv = document.createElement('div');
                            singleDiv.appendChild(span)
                            emojiDisplayContainer.appendChild(singleDiv)
                        }else{
                            emojiDisplayContainer.appendChild(span)
                        }
                    }
                    if(emoji.type=='Angry' && emoji.count>0){
                        isCount = true
                        let span = document.createElement('span');
                        span.textContent = `😡 ${emoji.count}`
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
// Call the createPost function
createPost()

}

// Iterate over elements with class 'comment-content-reactions' and attach emoji click functionality
$('.comment-content-reactions').each(function(){
    const postId = $(this).attr('id');
    openEmojiContainer(this,postId)
})

// Iterate over elements with class 'comment-reactions-container' and display emoji containers for comments
$('.comment-reactions-container').each(function(){
    const Id = $(this).attr('id');
    let commentId = Id.substring(16)
    displayPostEmojiContainer(this,commentId,'comment')
})

// Iterate over elements with class 'post-reactions-container' and display emoji containers for posts
$('.post-reactions-container').each(function(){
    const Id = $(this).attr('id');
    console.log('emojis',typeof emojis)
    let postId = Id.substring(13)
    displayPostEmojiContainer(this,postId,'post') 
})


function deletePost(Element,Id){
    $(Element).click(function(e){
        let self = Element
        e.preventDefault()
        $.ajax({
            type:'post',
            url:$(Element).attr('href'),
            success:function(data){
                console.log('data',data)
                let {type,Id} = data.data
                console.log('element',`#${type}-${Id}`)
                let commentsCount = $(`#comment-container-${data.data.PostId}`).attr('data-comment-count')
                console.log('commentsCount',commentsCount)
                commentsCount = commentsCount-1
                if(commentsCount==0){
                    console.log('im in zero')
                    console.log('element',$(`#comments-status`))
                    $(`#comments-status`).text('No Comments yet')
                }
                $(`#${type}-${Id}`).remove()
                console.log('**element',$(`#comment-container-${data.data.PostId}`))
            },
            error:function(error){
                console.log(error.responseText)
            }
        })
    })
}

// Iterate over elements with class 'deleteItem' and attach delete functionality for posts
$('.deleteItem').each(function(){
    const Id = $(this).attr('id');
    deletePost(this,Id)
    
})


