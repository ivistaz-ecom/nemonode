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
        const response = await axios.put(`http://nemonode.ivistaz.co:8000/others/update-port/${portId}`, updatedPortDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Port Updated Successfully!");
        window.location.href='./edit-port.html';
    } catch (error) {
        console.error('Error:', error);
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
window.onload = async function () {
    
    const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

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