// Define a class named ToggleLike
class ToggleLike{
    constructor(toggleElement){
        // Constructor to initialize the class with the provided toggleElement
        this.toggler = toggleElement
        // Call the toggleLike method when an instance of the class is created
        this.toggleLike()
    }

    // Method to handle toggling the "Like" functionality
    toggleLike(){
        $(this.toggler).click(function(e){
            console.log('im here also')
            e.preventDefault()
            let self = this
            // Send an AJAX request to the server when the "Like" button is clicked
            $.ajax({
                type:'Post',
                url:$(self).attr('href')
            }).done(function(data){
                // Handle the response from the server
                console.log('datalikeable',data.data.likeable)
                 // Update the "Like" count and toggle the "Like" button
                let likesCount = parseInt($(self).attr('data-likes'))
                console.log(likesCount)
                // Extract relevant data from the response
                let {emoji,emojiType} = data.data
                let typeId = $(self).attr('id')
                let element1 = $(`#like-${typeId}`)
                if(data.data.deleted == true){
                     // If the like was deleted, decrement the like count and update the button
                    likesCount-=1;
                    $(self).attr('data-likes',likesCount)
                    element1[0].innerHTML = `<a  data-likes=${likesCount}>
                    <i style="color:<%= (post.liked) ? 'blue' : 'black' %>"
                            class="fa-regular fa-thumbs-up thumbs-up-<%= post._id %>"></i>
                    </a><span>Like</span>`
                }else{
                    // If the like was added, increment the like count and update the button with the emoji
                    likesCount+=1
                    $(self).attr('data-likes',likesCount)
                    element1[0].innerHTML = `<a  data-likes=${likesCount}>
                    ${emoji}
                    </a><span>${emojiType}</span>`
                }
                console.log('TYOE',data.data.type)
                // Update the type of reaction and associated emoji data
                const selector = `#${data.data.type}Reaction-${data.data.likeable._id}`;
                console.log('element', $(selector));
                $(`#${data.data.type}Reaction-${data.data.likeable._id}`).attr('data-emojis',JSON.stringify(data.data.likeable.emojis))
                // Update the displayed like count
                var $container = $(`.likeCount-${data.data.likeable._id}`)
                const $span = $container.find('span');
                $span.text(`${data.data.likeable.likes.length}`);
            }).fail(function(errData){
                console.log('error in completing the request')
            })
        })
    }
}