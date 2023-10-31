// Function to check the input field and enable/disable a submit button
function checkInput() {
     // Get references to the input field and submit button elements
    var inputField = document.getElementById("inputField");
    var submitButton = document.getElementById("submitButton");
    // Check if the trimmed value of the input field is not empty
    if (inputField.value.trim() !== '') {
        // If the input is not empty, remove the "disabled" attribute from the submit button
        submitButton.removeAttribute("disabled");
        // Change the text color of the submit button to a specific RGB value
        submitButton.style.color='rgb(0,132,255)'
    } else {
        // If the input is empty, set the "disabled" attribute on the submit button
        submitButton.setAttribute("disabled", "disabled");
    }
}