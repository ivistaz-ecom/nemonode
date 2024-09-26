// Get the token from localStorage


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
      const response = await axios.post(`http://localhost:8001/candidate-password/forgotpassword`, data);
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


