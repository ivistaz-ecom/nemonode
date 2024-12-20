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
    const candidate_name = decodedToken.fname;
    const userSpan = document.getElementById('username');
    const userSpans = document.getElementById('user_name');

    if (userSpan,userSpans) {
        userSpan.textContent = indosNumber;
        userSpans.textContent= candidate_name;
    } else {
        console.error('Element with id "user_name" not found');
    }
});

document.getElementById("logout").addEventListener("click", function() {
  // Display the modal with initial message
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
  
  // Send request to update logged status to false
  const userId = localStorage.getItem('userId');
  if (userId) {
    axios.put(`${config.APIURL}user/${userId}/logout`)
      .then(response => {
        console.log('Logged out successfully');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  } else {
    console.error('User ID not found in localStorage');
  }

  localStorage.clear();
  
  // Change the message and spinner after a delay
  setTimeout(function() {
      document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
  }, 1000);

  // Redirect after another delay
  setTimeout(function() {
      window.location.href = "loginpage.html";
  }, 2000);
});



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