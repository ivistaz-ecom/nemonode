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
      const response = await axios.post(`http://nemonode.ivistaz.co/candidate-password/forgotpassword`, data);
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


document.getElementById('logout').addEventListener('click', function() {
    // Clear local storage
    localStorage.clear();

    // Perform logout actions
    // You may want to redirect to a login page or perform other logout-related tasks

    // For example, redirect to a login page
    window.location.href = './loginpage.html';
});