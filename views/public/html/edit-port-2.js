const token = localStorage.getItem('token')
document.addEventListener('DOMContentLoaded', function () {
    // Function to get URL parameters by name
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Fetch parameters from URL
    const portId = getQueryParameter('portId');
    const portName = getQueryParameter('portName');

    // Set values into the input fields
    document.getElementById('u_port_id').value = portId;
    document.getElementById('u_port_name').value = decodeURIComponent(portName);
});

const updatePortButton = document.getElementById("update-port-form");
updatePortButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const portId = document.getElementById("u_port_id").value;
    
    const updatedPortDetails = {
        id: portId,
        portName: document.getElementById("u_port_name").value,
        // Add other fields specific to Port entity
    };

    try {
        const response = await axios.put(`http://localhost:4000/others/update-port/${portId}`, updatedPortDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Port Updated Successfully!");
        window.location.href='./edit-port.html';
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
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

window.onload = async function () {
    
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    if (vendorManagement) {
      document.getElementById('vendorManagement').style.display = 'block';
      document.getElementById('vendorManagementSections').style.display = 'block';

    }
};




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