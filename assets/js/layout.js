// Get references to the top and target elements
const topElement = document.querySelector('.facebook-header');
const targetElement = document.querySelector('.facebook-body')

// Calculate the margin value to apply to the target element
const marginTopValue = topElement.clientHeight + 50; // Adjust 20 to your desired margin value

// Apply the margin-top to the target element
targetElement.style.marginTop = marginTopValue + 'px';



// Function to update the placeholder text of a search input based on viewport width
function updatePlaceholderText() {
    const input = document.getElementById('facebook-search');
    const viewportWidth = window.innerWidth;
    // Check if the viewport width is less than or equal to 400
    if (viewportWidth <= 400) {
         // Set a custom placeholder text using a Unicode character
        input.setAttribute('placeholder', '\uf002');
    } else {
        // Set the default placeholder text
        input.placeholder = 'Search Facebook';
    }
}

// Add a resize event listener to call the updatePlaceholderText function
window.addEventListener('resize', updatePlaceholderText);