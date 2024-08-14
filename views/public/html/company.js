
const token = localStorage.getItem('token');


const company_name = document.getElementById("company_name");
const company_b_type = document.getElementById("company_b_type");
const company_contact = document.getElementById("company_contact");
const company_email = document.getElementById("company_email");
const company_address = document.getElementById("company_address");
const company_management = document.getElementById("company_management");
const company_phone = document.getElementById("company_phone");
const company_last_update = document.getElementById("company_last_update");

const addCompanyButton = document.getElementById("company-form");
addCompanyButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const selectedBusinessType = document.querySelector('input[name="business_type"]:checked');
    const businessType = selectedBusinessType ? selectedBusinessType.value : null;
    console.log(businessType);
    
    const company_details = {
        c_name: company_name.value.trim(),
        b_type: businessType,
        c_contact: company_contact.value.trim(),
        c_email: company_email.value.trim(),
        c_addr: company_address.value.trim(),
        c_mgmt: company_management.value.trim(),
        c_ph: company_phone.value.trim(),
        c_last_update: company_last_update.value.trim(),
    };

    console.log(company_details);
    try {
        const serverResponse = await axios.post("https://nemo.ivistaz.co/company/create-company", company_details,{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
        var successToast = new bootstrap.Toast(document.getElementById('successToast'));
        successToast.show();
        
    } catch (error) {
        console.error('Error:', error);
        var errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
        errorToast.show();
    }
    
});
window.onload = async function () {

    const hasReadOnly = decodedToken.readOnly;
    console.log(hasReadOnly)
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    const staff = decodedToken.staff;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
    if(staff) {
        // Hide the settings container
        document.getElementById('settingsContainer').style.display = 'none';
        document.getElementById('settingsCard').style.display='block'
        // Show a message indicating the user does not have permission
        
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


