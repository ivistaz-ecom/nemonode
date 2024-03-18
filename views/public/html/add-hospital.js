const token = localStorage.getItem('token')
document.getElementById("hospital-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const hospitalName = document.getElementById("hospital-name").value.trim();
    const doctorName = document.getElementById("doctor-name").value.trim();
    const doctorAddress = document.getElementById("doctor-address").value.trim();
    const doctorCity = document.getElementById("doctor-city").value.trim();
    const doctorState = document.getElementById("doctor-state").value.trim();
    const doctorPhone = document.getElementById("doctor-phone").value.trim();
    const doctorEmail = document.getElementById("doctor-email").value.trim();
    const doctorUpload = document.getElementById("doctor-upload").value.trim();

    try {
        const serverResponse = await axios.post("http://nemonode.ivistaz.co/others/create-hospital", {
            hospitalName,
            doctorName,
            doctorAddress,
            doctorCity,
            doctorState,
            doctorPhone,
            doctorEmail,
            doctorUpload,
        },{headers:{"Authorization":token}});
        
        console.log('Response:', serverResponse.data);
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