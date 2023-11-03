$('.curr-profile').on('click',function(){
    let id = $(this).attr('id')
    window.location.href=`/api/v1/users/display-profile/${id}`
})



