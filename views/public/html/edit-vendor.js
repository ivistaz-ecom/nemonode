// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page

  window.location.href = './loginpage.html';
}

function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Function to populate input fields with URL parameters
  function populateFormFields() {
    const vendorId = getURLParameter('vendorId');
    const vendorName = getURLParameter('vendorName');
    const vendorAddress = getURLParameter('vendorAddress');
    console.log(vendorId, vendorName, vendorAddress);

    // Set values in the input fields
    document.getElementById('vendorId').value = vendorId;
    document.getElementById('editVendorName').value = vendorName;
    document.getElementById('editVendorAddress').value = vendorAddress;
  }

  // Call the populateFormFields function when the page loads
  document.addEventListener('DOMContentLoaded', () => {

    populateFormFields();
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';
  }
    if (vendorManagement) {
      document.getElementById('vendorManagementSection').style.display = 'block';
      document.getElementById('vendorManagementSections').style.display = 'block';

    }
  });

  document.getElementById('edit-vendor').addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
      // Get form data
      const vendorId = document.getElementById('vendorId').value;
      const vendorName = document.getElementById('editVendorName').value;
      const vendorAddress = document.getElementById('editVendorAddress').value;

      // Create data object
      const formData = {
        vendorName: vendorName,
        vendorAddress: vendorAddress
      };

      // Send data to the server using Axios with async/await
      const token = localStorage.getItem('token');
      const response = await axios.put(`https://nemo.ivistaz.co/others/update-vendor/${vendorId}`, formData, {
        headers: { "Authorization": token }
      });

      // Handle success, e.g., show a success message or redirect to another page
      console.log('Vendor updated successfully', response.data);
      window.location.href = './manage-vendor.html'
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error('Error updating vendor', error);
    }
  });

  document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`https://nemo.ivistaz.co/user/${userId}/logout`)
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
  

    
 





function decodeToken(token) {
  // Implementation depends on your JWT library
  // Here, we're using a simple base64 decode
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);


function updateDateTime() {
  const dateTimeElement = document.getElementById('datetime');
  const now = new Date();

  const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      ordinal: 'numeric',
  };

  const dateTimeString = now.toLocaleString('en-US', options);

  dateTimeElement.textContent = dateTimeString;
}

// Update date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);