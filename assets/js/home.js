// Click event handler for navigating to the create post page
$("#create-post").click(function(){
    window.location.href = "http://localhost:8000/api/v1/users/display-post"
})

// Iterate through toggle-like buttons and attach event handlers
$('.toggle-like-button').each(function(){
    let self = this
    // Create a ToggleLike instance for each button
    let toggleLike = new ToggleLike(self)
})

// Iterate through toggle-noty elements and attach event handlers
$('.toggle-noty').each(function(){
    console.log('im in toggle noty')
    let self = this
    console.log('this',this)
     // Create a ToggleNoty instance for each element
    let toggleNoty = new ToggleNoty(self)
})

// Iterate through comment-form elements and attach event handlers
$('.comment-form').each(function(){
    console.log('im in comment form')
    let self = this
    // Create a PostComments instance for each form
    let postComments = new PostComments(self)
})

// Click event handler for navigating to a user's profile when clicking on a user container
$('.user-container').click(function(){
    let id = $(this).attr('id')
    console.log('id',id)
    // Redirect to the user's profile page
    window.location.href = `http://localhost:8000/api/v1/users/display-profile/${id}`
})

// Click event handler for navigating to a user's profile when clicking on a friend container
$('.friend-container').click(function(){
    let id = $(this).attr('id')
    console.log('id',id)
    // Redirect to the user's profile page
    window.location.href = `http://localhost:8000/api/v1/users/display-profile/${id}`
})

// Click event handler for navigating to a user's profile when clicking on an all user container
$('.all-user-container').click(function(){
    let id = $(this).attr('id')
    console.log('id',id)
    // Redirect to the user's profile page
    window.location.href = `http://localhost:8000/api/v1/users/display-profile/${id}`
})




    


