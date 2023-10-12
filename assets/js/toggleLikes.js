class ToggleLike{
    constructor(toggleElement){
        // console.log('this',this)
        this.toggler = toggleElement
        this.toggleLike()
    }
    toggleLike(){
        $(this.toggler).click(function(e){
            console.log('im here also')
            e.preventDefault()
            let self = this
            $.ajax({
                type:'Post',
                url:$(self).attr('href')
            }).done(function(data){
                console.log('likeable',data.data.likeable)
                let likesCount = parseInt($(self).attr('data-likes'))
                console.log(likesCount)
                if(data.data.deleted == true){
                    likesCount-=1;
                    // $(`.thumbs-up-${data.data.id}`)[0].style.color = 'black'
                }else{
                    likesCount+=1
                    // $(`.thumbs-up-${data.data.id}`)[0].style.color = 'blue'
                }
                console.log('postElement',$(`#${data.data.likeable._id}`)[0])
                $(`#${data.data.likeable._id}`).attr('data-emojis',JSON.stringify(data.data.likeable.emojis))
                $(`.likeCount-${data.data.id}`)[0].textContent  = `${data.data.likeable.likes.length}`;
                $(self).attr('data-likes',likesCount)
            }).fail(function(errData){
                console.log('error in completing the request')
            })
        })
    }
}