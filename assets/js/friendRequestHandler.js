// Function to send a friend request
function handleFriendRequest(senderId,targetId) {
    $.ajax({
        type:'post',
        url: '/api/v1/users/send-friend-request',
        data: { senderId, targetId },
        success: function(data) {
            // Handle the success of sending a friend request
          console.log('data',data)
          if (data.data.success) {
            console.log('jhg')
        }
    },
        error: function() {
          console.error('Failed to send friend request acceptance');
        },
      }); 
}

// Function to update the friend requests list
function updateFriendRequestsList(senderUser){
    let userAvatar = ''
    if(senderUser.avatar){
        console.log('im in avatar')
        userAvatar =  `<img src='http://localhost:8000${senderUser.avatar}'/>`
    }else{
        console.log('im in else avatar')
        userAvatar = `<img src="https://i.pinimg.com/736x/d0/4b/1f/d04b1f2ed3ca8ad4a302fbe9f4f5a875.jpg"/>`
    }
    // Generate HTML for a friend request entry
    return `<li id="request-${senderUser._id}">
    <div class="row modal-lists">
        <div class="col-3 modal-profile-images">
            ${userAvatar}
        </div>
        <div class="col-9 modal-text">
            <div class="row">
                <div class="col-12">
                    <h6>${senderUser.fullName}</h6>
                </div>
                <div class="col-5">
                    <button id='${senderUser._id}' class="btn btn-primary btn-sm confirm-request-btn">Confirm</button>
                </div>
                <div class="offste-2 col-5">
                    <button id="${senderUser._id}" class="btn btn-danger btn-sm delete-request-btn">Delete</button>
                </div>
            </div> 
        </div>
    </div>
</li>
<hr/>`
}

// Click event handler for deleting a friend request
$(document).on('click','.delete-request-btn',function(){
    // Handle the click event for deleting a friend request
    console.log('clicked')
    console.log('this',this)
    let from_user = $(this).attr('id')
    console.log('from_user',from_user)
    let requestCounts = parseInt($('.request-counts').attr('data-requests'))
    console.log('requestCounts',requestCounts)
    requestCounts = requestCounts - 1
    if(requestCounts==0){
        $('.request-counts').css('display', 'none');
    }
    $('.request-counts').text(requestCounts);
    $('.request-counts').attr('data-requests',requestCounts)
    $.ajax({
        type:'post',
        url: '/api/v1/users/reject-friend-request',
        data: { from_user },
        success: function(data) {
            if(data.data.success){
                console.log('data',data.data)
            }
            $(`#request-${from_user}`).remove()
        },
         error: function() {
            console.error('Failed to send friend request acceptance');
        },
    });
})

// Click event handler for confirming a friend request
$(document).on('click', '.confirm-request-btn', function () {
    // Handle the click event for confirming a friend request
     console.log('clicked')
     console.log('this',this)
     let from_user = $(this).attr('id')
     let button = $(this);
     $.ajax({
        type:'post',
        url: '/api/v1/users/accept-friend-request',
        data: { from_user },
        success: function(data) {
            if(data.data.success){
                console.log('data',data.data)
                button.text('Accepted')
            }
        },
         error: function() {
            console.error('Failed to send friend request acceptance');
        },
    });
})


// Click event handler for navigating to a user's profile when clicking on a friend request
$('#friend_requests_container li').click(function(event){
    // Handle click event on friend request list items
    if ($(event.target).is('.confirm-request-btn')) {
        return;
    }
    if ($(event.target).is('.delete-request-btn')) { 
        return;
    }
    let id = $(this).attr('id')
    window.location.href = `/api/v1/users/display-profile/${id}`
})



       


