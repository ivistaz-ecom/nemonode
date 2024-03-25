const token = localStorage.getItem('token')

window.onload = function () {
    const queryParams = new URLSearchParams(window.location.search);
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
    // Get values using parameter names
    const experienceId = queryParams.get('expId');
    const experienceName = queryParams.get('expr');

    // Set values into the input fields
    document.getElementById("u_experience_id").value = experienceId;
    document.getElementById("u_experience_name").value = decodeURIComponent(experienceName);
    // Repeat the above lines for other input fields if needed
};




function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);

const updateExperienceButton = document.getElementById("update-experience-form");
updateExperienceButton.addEventListener("submit", async (e) => {
e.preventDefault();
const experienceId = document.getElementById("u_experience_id").value;

const updatedExperienceDetails = {
    id: experienceId,
    experience: document.getElementById("u_experience_name").value,
};
console.log(updatedExperienceDetails)
try {
    const response = await axios.put(`http://localhost:4000/others/update-experience/${experienceId}`, updatedExperienceDetails,{headers:{"Authorization":token}});
    console.log('Response:', response.data);
    alert("Experience Updated Successfully!");
    window.location.href="./edit-experience.html"
} catch (error) {
    console.error('Error:', error);
}
});

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


function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

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