// Establish a WebSocket connection to the specified server (http://localhost:5001)
let socket = io.connect('http://localhost:5001')

// Function to change the border color of an HTML element
function changeBorderColor(element) {
    console.log("im here")
    console.log('element',element)
    // Find the element with the "blue-border" class and remove the class
    let oldElement = document.querySelector(".blue-border");
    if (oldElement!=null){
        oldElement.classList.remove("blue-border")
    }
    // Toggle the "blue-border" class on the clicked element
    element.classList.toggle("blue-border");
    console.log('element',element)
}

// Attach a click event listener to elements with the "edit-icon" class
$('.edit-icon').on('click',function(){
    console.log('clicked')
    // Redirect the user to a specific URL when an element with the "edit-icon" class is clicked
    window.location.href='/api/v1/users/display-profile-picture-form'
})


