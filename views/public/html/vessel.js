const token = localStorage.getItem('token')

document.getElementById("vessel-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselName = document.getElementById("vessel_name").value.trim();

    try {
        // Add a new vessel
        await axios.post("https://nemonode.ivistaz.co//others/create-vessel", { vesselName }, { headers: { "Authorization": token } });
        console.log('Vessel added successfully');
        // Refresh the vessel list after adding a new vessel
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById("vsl-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselName = document.getElementById("vessel_name_vsl").value;
    const vesselType = document.getElementById("vessel_type").value;
    const vsl_company = document.getElementById("vsl_company").value;
    const imoNumber = document.getElementById("imo_number").value;
    const vesselFlag = document.getElementById("vessel_flag").value;

    try {
        const serverResponse = await axios.post("https://nemonode.ivistaz.co//others/create-vsl", {
            vesselName,
            vesselType,
            vsl_company,
            imoNumber,
            vesselFlag,
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
    localStorage.clear()

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