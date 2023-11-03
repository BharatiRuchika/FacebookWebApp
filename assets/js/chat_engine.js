class ChatEngine{
    constructor(chatBoxId,userId){
        // Initialize the chat engine with the given chat box and user ID
        this.chatBox = $(`#${chatBoxId}`)
        this.socket = io.connect('http://localhost:5001')
        this.currUserId = userId

        // Check if the user is logged in
        if(this.currUserId){
            this.connectionHandler()
        }  
    }
    connectionHandler(){
        let self = this

        // Handle socket connection
        this.socket.on('connect',function(){
            
        })
        
        // Notify the server about the user's connection
        self.socket.emit('user_connected', { id: self.currUserId });

        // Join the 'facebook' chatroom
        self.socket.emit('join_room',{
            user_email:self.userEmail,
            chatroom:'facebook'
        })

        // Handle user joined event
        self.socket.on('user_joined',function(data){
            
        })

        // Handle user sign-out
        $('#sign-out').click(function(){
           
            // self.socket.emit('disconnect')
            self.socket.emit('leave_room', { chatroom: 'codeial' });
        })

        // Handle form submission to send a new message
        $("#createMessageForm").submit(async function(e){
            e.preventDefault()
            var recipientId = $("#recipientId").val();
            let formData = $(this).serialize()
            let messageText = $("#inputField").val()
            //  handleMessageSender(formData)
            self.socket.emit('send_message', { formData ,senderId:self.currUserId,recipientId,messageText});
        })

         // Handle received messages from the sender
        self.socket.on('receive_sender_msg',(data)=>{
            const existingLi = document.querySelector(`#conversation-${data.conversation._id}`);
            if(existingLi){
                const h6Element = existingLi.querySelector('h6');
                const imgElement = existingLi.querySelector('img');
                imgElement.src = `${data.targetUser.avatar.url}`
                h6Element.textContent = `You: ${data.messageText}`;
                
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(existingLi, friendMessagesContainer.firstElementChild);
                
                $(`#message-container-${data.targetUser._id}`).append(`<div class="message float-right">` + data.messageText + '</div>');
                var container = $('.message-container')
                container.scrollTop(container[0].scrollHeight);

            }else{
                const link = document.createElement('a');
                link.style.color = 'black'
                link.style.textDecoration = 'none'
                link.href = `http://localhost:8000/api/v1/message/display-message/${data.targetUser._id}`;
                const newLi = document.createElement(`li`);
                link.id = `conversation-${data.conversation._id}`;
                link.classList.add('message-noty');
                $(link).attr('data-seen','false')
                new ToggleNoty(link)
                let element = `
                    <div class="row modal-lists">
                        <div class="col-3 modal-profile-images">
                        <img 
                        src="${data.targetUser.avatar.url}" />
                        </div>
                        <div class="col-9 modal-text">
                            <div class="row">
                                <div class="col-12">
                                    
                                    <h6>You: ${data.messageText}</h6>
                                </div>
                                <div class="col-12">
                                    <span>${data.targetUser.fullName}</span>
                                </div> 
                            </div>
                        </div>
                    </div><hr/>`
            
                newLi.innerHTML = element
                link.appendChild(newLi);
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(link, friendMessagesContainer.firstElementChild);
                $(`#message-container-${data.targetUser._id}`).append(`<div class="message float-right">` + data.messageText + '</div>');
            }
        })
// Handle received messages from the target user
        self.socket.on('receive_target_msg',(data)=>{
            const pingSound = new Audio('/Audio/bell.wav');
            pingSound.play()
            const existingLi = document.querySelector(`#conversation-${data.conversation._id}`);
            if(existingLi){
                const h6Element = existingLi.querySelector('h6');
                h6Element.textContent = data.messageText;
                const imgElement = existingLi.querySelector('img');
                imgElement.src = `${data.senderUser.avatar.url}`
                const friendMessagesContainer = document.getElementById('friend_messages_container');
                friendMessagesContainer.insertBefore(existingLi, friendMessagesContainer.firstElementChild);
                
                $(`#message-container-${data.senderUser._id}`).append(`<div class="message float-left"><img src=${data.senderUser.avatar.url}>` + data.messageText + '</div>');
                
                let messageCount = parseInt($('.message-counts').attr('data-message-requests'))
                let dataSeen = $(`#conversation-${data.conversation._id}`).attr('data-seen')
                if(dataSeen=='false'){
                    console.log('messageCount',messageCount)
                    messageCount = messageCount+1
                    $('.message-counts').text(messageCount);
                    $('.message-counts').css('display', 'block');
                    $('.message-counts').attr('data-message-requests',messageCount)
                    $(`#conversation-${data.conversation._id}`).attr('data-seen','true')
                }
                }else{
                    const link = document.createElement('a');
                    link.style.color = 'black'
                    link.style.textDecoration = 'none'
                    link.href = `/api/v1/message/display-message/${data.senderUser._id}`;
                    const newLi = document.createElement(`li`);
                    link.id = `conversation-${data.conversation._id}`;
                    link.classList.add('toggle-noty');
                    $(link).attr('data-seen','false')
                    new ToggleNoty(link)
                let element = `
                <div class="row modal-lists">
                    <div class="col-3 modal-profile-images">
                    <img 
                    src="${data.senderUser.avatar.url}" />
                    </div>
                    <div class="col-9 modal-text">
                        <div class="row">
                            <div class="col-12">
                                <h6>${data.messageText}</h6>
                            </div>
                            <div class="col-12">
                                <span>${data.senderUser.fullName}</span>
                            </div>
                        </div>
                    </div>
                </div><hr/>`
            
            newLi.innerHTML = element
            link.appendChild(newLi);
            const friendMessagesContainer = document.getElementById('friend_messages_container');
            friendMessagesContainer.insertBefore(link, friendMessagesContainer.firstElementChild);
            
            $(`#message-container-${data.senderUser._id}`).append(`<div class="message float-left"><img src=${data.senderUser.avatar.url}>` + data.messageText + '</div>');
            
            let messageCount = parseInt($('.message-counts').attr('data-message-requests'))
            messageCount = messageCount+1
            $('.message-counts').text(messageCount);
            $('.message-counts').css('display', 'block');
            $('.message-counts').attr('data-message-requests',messageCount)
            $(`#conversation-${data.conversation._id}`).attr('data-seen','true')
            }
        })
        
        // Handle adding a friend
        $('.add-friend-button').click(function(){
            let recipientId = $(this).attr('id')
            if($(this).attr('data-click')=='false'){
                $(this).attr('data-click', 'true');
                $(this).text('Pending')
                $(this).attr('disabled',true)
                console.log('recipientId',recipientId)
                console.log('curr_user_id',self.currUserId)
                handleFriendRequest(self.currUserId,recipientId);
                self.socket.emit('send_friend_request',{
                    senderUserId: self.currUserId,
                    targetUserId: recipientId,
                })
            }
        })
    
        // Handle friend requests
        self.socket.on('friend_request', (data) => {
            const { senderUserId,targetUserId,senderUser } = data;
            const pingSound = new Audio('/Audio/bell.wav');
            pingSound.play()
            let newFriendRequest = updateFriendRequestsList(senderUser);
            $('#friend_requests_container').prepend(newFriendRequest)
            let requestCount = parseInt($('.request-counts').attr('data-requests'))
            requestCount = requestCount+1
            $('.request-counts').css('display', 'block');
            $('.request-counts').text(requestCount);
            $('.request-counts').attr('data-requests',requestCount)
            
        });
        
        // Handle receiving messages
        self.socket.on('receive_message',function(data){
            let newMessage = $('<li>')
            let messageType = 'other-message'
            if(data.user_email==self.userEmail){
                console.log('im in self')
                messageType = 'self-message'
            }
            newMessage.append($('<span>',{
                'html': data.message
            }))
            newMessage.addClass(messageType)
            $('#chat-messages-list').append(newMessage)
        })
    }
}