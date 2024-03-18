const token= localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', function () {
    // Get query parameters
    const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    const queryParams = new URLSearchParams(window.location.search);

    // Example usage to get portAgentId parameter
    const portAgentId = queryParams.get('portAgentId');
    const portAgentName = queryParams.get('portAgentName');
    const contactPerson = queryParams.get('contactPerson');
    const address = queryParams.get('address');
    const phone = queryParams.get('phone');
    const email = queryParams.get('email');
    const city = queryParams.get('city');
    const state = queryParams.get('state');
    const country = queryParams.get('country');

    // Set retrieved data to form fields
    document.getElementById('u_port_agent_id').value = portAgentId;

    document.getElementById('u_port_agent_name').value = portAgentName;
    document.getElementById('u_port_agent_contact').value = contactPerson;
    document.getElementById('u_port_agent_address').value = address;
    document.getElementById('u_port_agent_phone').value = phone;
    document.getElementById('u_port_agent_email').value = email;
    document.getElementById('u_port_agent_city').value = city;
    document.getElementById('u_port_agent_state').value = state;
    document.getElementById('u_port_agent_country').value = country;

    // Now you can use these variables as needed in your page
    console.log(portAgentId, portAgentName, contactPerson, address, phone, email, city, state, country);
});

const updatePortAgentButton = document.getElementById("update-port-agent-form");
updatePortAgentButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const portAgentId = document.getElementById("u_port_agent_id").value;
    
    const updatedPortAgentDetails = {
        id: portAgentId,
        portAgentName: document.getElementById("u_port_agent_name").value,
        contactPerson: document.getElementById("u_port_agent_contact").value,
        address: document.getElementById("u_port_agent_address").value,
        phone: document.getElementById("u_port_agent_phone").value,
        email: document.getElementById("u_port_agent_email").value,
        city: document.getElementById("u_port_agent_city").value,
        state: document.getElementById("u_port_agent_state").value,
        country: document.getElementById("u_port_agent_country").value,
        // Add other fields specific to Port Agent entity
    };

    console.log(updatedPortAgentDetails)
    try {
        const response = await axios.put(`http://nemonode.ivistaz.co:8000/others/update-port-agent/${portAgentId}`, updatedPortAgentDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Port Agent Updated Successfully!");
        window.location.href="./edit-portagent.html"
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