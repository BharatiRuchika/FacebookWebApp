$('.curr-profile').on('click',function(){
    console.log('clicked')
    let id = $(this).attr('id')
    console.log('id',id)
    window.location.href=`/api/v1/users/display-profile/${id}`
})



