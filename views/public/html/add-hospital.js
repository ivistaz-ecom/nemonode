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
    const doctorUpload = document.getElementById("doctor-upload").files[0];
    console.log(doctorUpload)

    try {
        const serverResponse = await axios.post("http://localhost:4000/others/create-hospital", {
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

 document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    localStorage.clear();
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
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
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