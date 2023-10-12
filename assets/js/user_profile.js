function changeBorderColor(element) {
    console.log("im here")
    console.log('element',element)
    let oldElement = document.querySelector(".blue-border");
    if (oldElement!=null){
        oldElement.classList.remove("blue-border")
    }
    element.classList.toggle("blue-border");
    console.log('element',element)
}
$('#user-profile-image-container').on('click',function(){
    window.location.href='/api/v1/users/display-profile-picture-form'
})
