const token = localStorage.getItem('token')

document.getElementById("vessel-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselName = document.getElementById("vessel_name").value.trim();

    try {
        // Add a new vessel
        await axios.post("http://nemonode.ivistaz.co/others/create-vessel", { vesselName }, { headers: { "Authorization": token } });
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
        const serverResponse = await axios.post("http://nemonode.ivistaz.co/others/create-vsl", {
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