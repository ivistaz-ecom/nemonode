const token = localStorage.getItem('token')

document.getElementById('cand-form').addEventListener('submit', async function sendResetLink(e) {
  e.preventDefault();
  try {
      // Get the email value from the input field
      const email = document.getElementById('email').value;

      // Make sure the email is not empty
      if (!email) {
          console.log('No valid email entered!');
          return;
      }

      // Prepare the data to be sent
      const data = {
          email: email.trim(),
      };

      // Use Axios to send a POST request to the server
      const response = await axios.post(`http://localhost:4000/candidate-password/forgotpassword`, data);
      console.log(response.data)
      // Check the response from the server
      if (response.data.success) {
          // Handle success, for example, show a success message
          console.log('Reset link sent successfully!');
      } else {
          // Handle other status codes or errors
          console.log(`Failed to send reset link: ${response.data.message}`);
      }
  } catch (error) {
      // Handle any errors that occurred during the request
      console.error('An error occurred while sending the request:', error);
  }
});


 document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    localStorage.clear();
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();

    // Change the message and spinner after a delay
    setTimeout(function() {
        document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
    }, 1000);

    // Redirect after another delay
    setTimeout(function() {
        window.location.href = "loginpage.html";
    }, 2000);
});
