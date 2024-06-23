const token = localStorage.getItem('token');
  // Declare vesselTypeId at the beginning
  let vesselTypeId;

window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const vesselId = urlParams.get('vesselId');
     vesselTypeId = urlParams.get('id');  // Assign value to vesselTypeId
    console.log(vesselId, vesselTypeId)
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
    if (vesselId) {
        // Fetch data for editing vessel
        fetchDataForVessel(vesselId);
    } else {
        // Fetch data for editing vessel type
        fetchDataForVesselType(vesselTypeId);
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

function fetchDataForVessel(vesselId) {
    const urlParams = new URLSearchParams(window.location.search);
    document.getElementById('u_vessel_id').value = vesselId;
    document.getElementById('u_vessel_name').value = urlParams.get('vesselName');
}

function fetchDataForVesselType(vesselTypeId) {
    const urlParams = new URLSearchParams(window.location.search);
    const vesselName = urlParams.get('vesselName');
    const vesselType = urlParams.get('vesselType');
    const vslCompany = urlParams.get('vslCompany');
    const imoNumber = urlParams.get('imoNumber');
    const vesselFlag = urlParams.get('vesselFlag');

    // Now you have all the data, you can set it in your form fields or handle it as needed.
    document.getElementById("u_vessel_type_id").value = vesselTypeId;
    document.getElementById("u_vessel_type_name").value = vesselName;
    document.getElementById("u_vessel_type").value = vesselType;
    document.getElementById("u_vessel_type_company").value = vslCompany;
    document.getElementById("u_vessel_type_imo").value = imoNumber;
    document.getElementById("u_vessel_type_flag").value = vesselFlag;
}

const updateVesselButton = document.getElementById("update-vessel-form");
updateVesselButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselId = document.getElementById("u_vessel_id").value;

    const updatedVesselDetails = {
        id: vesselId,
        vesselName: document.getElementById("u_vessel_name").value,
    };

    try {
        const response = await axios.put(`https://nemo.ivistaz.co/others/update-vessels/${vesselId}`, updatedVesselDetails, { headers: { "Authorization": token } });
        console.log('Response:', response.data);
        alert("Vessel Updated Successfully!");
        window.location.href = "./edit-vessel.html";
    } catch (error) {
        console.error('Error:', error);
    }
});

const updateVesselTypeFormButton = document.getElementById('update-vessel-type-form')
updateVesselTypeFormButton.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const updatedVesselTypeDetails = {
        id: document.getElementById('u_vessel_type_id').value,
        vesselName: document.getElementById('u_vessel_type_name').value,
        vesselType: document.getElementById('u_vessel_type').value,
        vsl_company: document.getElementById('u_vessel_type_company').value,
        imoNumber: document.getElementById('u_vessel_type_imo').value,
        vesselFlag: document.getElementById('u_vessel_type_flag').value,
        // Add other fields if needed
    };
    console.log(updatedVesselTypeDetails)

    try {
        const response = await axios.put(`https://nemo.ivistaz.co/others/update-vsl/${vesselTypeId}`, updatedVesselTypeDetails, { headers: { 'Authorization': token } });
        console.log('Response:', response.data);
        alert('Vessel Type Updated Successfully!');
        window.location.href = './edit-vessel.html';
    } catch (error) {
        console.error('Error:', error);
    }
}) 

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