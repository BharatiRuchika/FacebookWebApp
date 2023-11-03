// Define a class named ToggleNoty
class ToggleNoty{
    constructor(toggleElement){
        // Constructor to initialize the class with the provided toggleElement
        this.toggler = toggleElement
        // Call the toggleNoty method when an instance of the class is created
        this.toggleNoty()
    }
    // Method to handle toggling notification and navigation
    toggleNoty(){
        $(this.toggler).click(function(e){
            e.preventDefault()
            let self = this
            // Send an AJAX request to the server when the notification is clicked
            $.ajax({
                type:'Post',
                url:$(self).attr('href')
            }).done(function(data){
                // Handle the response from the server
                // Check if a conversation is already started or the notification has already been seen
                if(!data.data.isConversationStarted || data.data.alreadySeen){
                }else{
                    // Handle the case where the conversation is not started, and the notification is not seen
                    // Update the notification count
                    let notyCount = parseInt($('.message-counts').attr('data-message-requests'))
                    notyCount = notyCount-1
                    if(notyCount>0){
                        // Update the notification count and display it
                        $('.message-counts').text(notyCount)
                        $('.message-counts').attr('data-message-requests',JSON.stringify(notyCount))
                    }else{
                        // Hide the notification count if it reaches zero
                        $('.message-counts').css('display', 'none');
                        $('.message-counts').attr('data-message-requests',JSON.stringify(notyCount))
                    }

                     // Get the linkId from the clicked element and set data-seen to 'false'
                    let linkId = $(self).attr('id')
                    console.log('linkId',linkId)
                    $(linkId).attr('data-seen','false')
                    
                }
                
                // Redirect to a specific URL based on the response data
                window.location.href=`/api/v1/message/openMessages/${data.data.id}`
                
               
            }).fail(function(errData){
                console.log('error in completing the request')
            })
        })
    }
}