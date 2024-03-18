const token = localStorage.getItem('token')

window.onload = function () {
    const queryParams = new URLSearchParams(window.location.search);
const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

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
    const response = await axios.put(`https://nemonode.ivistaz.co/others/update-experience/${experienceId}`, updatedExperienceDetails,{headers:{"Authorization":token}});
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

document.getElementById('logout').addEventListener('click', function() {
    // Clear local storage
    localStorage.clear();

    // Perform logout actions
    // You may want to redirect to a login page or perform other logout-related tasks

    // For example, redirect to a login page
    window.location.href = './loginpage.html';
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