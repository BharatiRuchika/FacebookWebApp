// Get references to the top and target elements
const topElement = document.querySelector('.facebook-header');
const targetElement = document.querySelector('.facebook-body')
// console.log("topElement",topElement)
// console.log("targetElement",targetElement)
// Calculate the margin-top value
const marginTopValue = topElement.clientHeight + 50; // Adjust 20 to your desired margin value

// Apply the margin-top to the target element
targetElement.style.marginTop = marginTopValue + 'px';




function updatePlaceholderText() {
    console.log('im here')
    const input = document.getElementById('facebook-search');
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 400) {
        input.setAttribute('placeholder', '\uf002');
    } else {
        input.placeholder = 'Search Facebook';
    }
}

window.addEventListener('resize', updatePlaceholderText);