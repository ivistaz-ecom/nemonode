
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
        const serverResponse = await axios.post("http://localhost:4000/company/create-company", company_details,{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
        alert("Company Added Successfully!");
    } catch (error) {
        console.error('Error:', error);
    }
});
window.onload = async function () {
    const hasUserManagement = decodedToken.userManagement;
    const hasReadOnly = decodedToken.readOnly;
    console.log(hasReadOnly)
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