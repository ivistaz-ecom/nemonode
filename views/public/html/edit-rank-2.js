const updateRankButton = document.getElementById("update-rank-form");
updateRankButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rankId = document.getElementById("u_rank_id").value;
    
    const updatedRankDetails = {
        id: rankId,
        rank: document.getElementById("u_rank_name").value,
        rankOrder: document.getElementById("u_rank_order").value,
        category: document.getElementById("u_rank_category").value,
        // Add other fields specific to Rank entity
    };

    try {
        const response = await axios.put(`https://nemo.ivistaz.co/others/update-rank/${rankId}`, updatedRankDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Rank Updated Successfully!");
        window.location.href ="./edit-rank.html"
    } catch (error) {
        console.error('Error:', error);
    }
});
// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page
alert('Please login to continue using Nemo');

  window.location.href = './loginpage.html';
}

window.onload = async function(){ 
  localStorage.clear();

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
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Fetch values from query parameters
    const rankId = getQueryParameter('rankId');
    const rank = getQueryParameter('rank');
    const rankOrder = getQueryParameter('rankOrder');
    const category = getQueryParameter('category');

    // Set values into the input fields
    document.getElementById("u_rank_id").value = rankId;
    document.getElementById("u_rank_name").value = decodeURIComponent(rank);
    document.getElementById("u_rank_order").value = decodeURIComponent(rankOrder);
    document.getElementById("u_rank_category").value = decodeURIComponent(category);
}

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