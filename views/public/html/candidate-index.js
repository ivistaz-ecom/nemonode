document.addEventListener('DOMContentLoaded', async function () {
    console.log('its working');

    // Retrieve the token from localStorage
    const token = localStorage.getItem('ctoken');
    console.log(token);

    function decodeToken(token) {
        // Implementation depends on your JWT library
        // Here, we're using a simple base64 decode
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    }

    // Use jwt_decode to extract information from the token
    const decodedToken = decodeToken(token);
    const indosNumber = decodedToken.indosNumber;

    const userSpan = document.getElementById('username');
    const userSpans = document.getElementById('user_name');

    if (userSpan,userSpans) {
        userSpan.textContent = indosNumber;
        userSpans.textContent= indosNumber;
    } else {
        console.error('Element with id "user_name" not found');
    }
});

document.getElementById('logout').addEventListener('click', function() {
    // Clear local storage
    localStorage.clear();

    // Perform logout actions
    // You may want to redirect to a login page or perform other logout-related tasks

    // For example, redirect to a login page
    window.location.href = './candidate-login.html';
})

const showInstructions = JSON.parse(localStorage.getItem('showInstructions')) || false;
  updateInstructionsDisplay(showInstructions);

  const toggleButton = document.getElementById('toggleButton');

  // Event listener for toggle changes
  toggleButton.addEventListener('change', () => {
    const showInstructions = toggleButton.checked;

    // Update localStorage to remember user preference
    localStorage.setItem('showInstructions', showInstructions);

    // Update instructions display based on the user preference
    updateInstructionsDisplay(showInstructions);
  });

  // Function to update instructions display based on user preference
  function updateInstructionsDisplay(showInstructions) {
    if (showInstructions) {
      // Display instructions
      console.log('Instructions are ON');
    } else {
      // Hide instructions
      console.log('Instructions are OFF');
    }
  }