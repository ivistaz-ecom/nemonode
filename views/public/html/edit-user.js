const token = localStorage.getItem('token');
let id;
function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
  const decodedToken = decodeToken(token);
document.addEventListener('DOMContentLoaded', async function () {
    // Function to get query parameters from URL
    const hasUserManagement = decodedToken.userManagement;
  console.log(hasUserManagement)
  if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
  const hasVendorManagement = decodedToken.vendorManagement;
  console.log(hasVendorManagement)
  if (hasVendorManagement) {
    document.getElementById('vendorManagementSection').style.display = 'block';
    document.getElementById('vendorManagementSections').style.display = 'block';

  }

  if (decodedToken.userGroup === 'vendor') {
    document.getElementById('userManage').style.display = 'none';
}

  const createdByField = document.getElementById('user_created_date'); // Assuming 'user_created_date' is the ID of the createdBy input field
  const username = decodedToken.userEmail;
  createdByField.value = username;

    function getQueryParameters() {
        const queryParams = new URLSearchParams(window.location.search);
        const params = {};
        for (const [key, value] of queryParams) {
            params[key] = value;
        }
        console.log(params)
        return params;
    }
    

    // Fetch query parameters
    const queryParams = getQueryParameters();

    // Function to set value in an input field
    function setInputValue(id, value) {
        const inputField = document.getElementById(id);
        if (inputField) {
            inputField.value = value;
        }
    }

    // Set values in respective input fields
    setInputValue('e_user_id',queryParams.id)
    setInputValue('f_name', queryParams.userName);
    setInputValue('l_name', queryParams.lastName);
    setInputValue('user_email', queryParams.userEmail);
    setInputValue('user_password', queryParams.userPassword);
    setInputValue('user_c_password', queryParams.userCPassword);
    setInputValue('user_phone', queryParams.userPhone);
    setInputValue('user_group', queryParams.userGroup);
    setInputValue('user_vendor', queryParams.userVendor);
    setInputValue('user_client', queryParams.userClient);
    setInputValue('user_created_date', queryParams.createdBy);
    setInputValue('disable_user', queryParams.disableUser);
    setInputValue('creationChain',queryParams.creationChain)
    setInputValue('staff',queryParams.staff);
    setInputValue('deletes',queryParams.deletes);
    id=queryParams.id;

    
// Set checkbox values
if (queryParams.readOnly==='true') {
    document.getElementById('u_read_only').checked = true;
} else {
    document.getElementById('u_read_only').checked = false;
}

if (queryParams.Write === 'true') {
    document.getElementById('u_write').checked = true;
} else {
    document.getElementById('u_write').checked = false;
}



if (queryParams.imports==='true') {
    document.getElementById('u_import').checked = true;
} else {
    document.getElementById('u_import').checked = false;
}

if (queryParams.exports==='true') {
    document.getElementById('u_export').checked = true;
} else {
    document.getElementById('u_export').checked = false;
}

if (queryParams.userManagement==='true') {
    document.getElementById('u_user_management').checked = true;
} else {
    document.getElementById('u_user_management').checked = false;
}
if (queryParams.vendorManagement==='true') {
    document.getElementById('u_vendor_management').checked = true;
} else {
    document.getElementById('u_vendor_management').checked = false;
}

if (queryParams.reports==='true') {
    document.getElementById('u_reports').checked = true;
} else {
    document.getElementById('u_reports').checked = false;
}
if (queryParams.reports_all==='true') {
    document.getElementById('u_reports_all').checked = true;
} else {
    document.getElementById('u_reports_all').checked = false;
}
if (queryParams.staff==='true') {
    document.getElementById('u_staff').checked = true;
} else {
    document.getElementById('u_staff').checked = false;
}
if (queryParams.deletes==='true') {
    document.getElementById('u_delete').checked = true;
} else {
    document.getElementById('u_delete').checked = false;
}




// Check the 'disable_user' checkbox if needed
if (queryParams.disableUser==='true') {
    document.getElementById('disable_user').checked = true;
} else {
    document.getElementById('disable_user').checked = false;
}
async function populateUserGroupDropdown() {
    const userGroupDropdown = document.getElementById('user_group');
    userGroupDropdown.innerHTML = ''; // Clear existing options

    const isAdmin = decodedToken.userGroup === 'admin';
    const isVendor = decodedToken.userGroup === 'vendor';

    // Add options based on the user's role
    if (isAdmin || isVendor) {
        addOption(userGroupDropdown, 'vendor');
    }

    if (isAdmin) {
        addOption(userGroupDropdown, 'admin');
    }

    // Set the selected option based on the role of the user being edited
    if (queryParams.userGroup === 'admin' || queryParams.userGroup === 'vendor') {
        userGroupDropdown.value = queryParams.userGroup;
    } else {
        // Set a default value if the user's role is neither admin nor vendor
        addOption(userGroupDropdown, 'null');
        userGroupDropdown.value = 'null';
    }
}

// Call the function to populate the user group dropdown
function addOption(selectElement, value) {
    const option = document.createElement('option');
    option.value = value;
    option.text = value;
    selectElement.appendChild(option);
}

// Call the function to create the user group dropdown
 await populateUserGroupDropdown();

    // Check the 'disable_user' checkbox if needed

    // ... (existing code)

    console.log('Received data from URL:', queryParams);

    // await createCompanyDropdown();
    // await createVendorDropdown();

    // async function createCompanyDropdown() {
    //     const companyResponse = await axios.get("https://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
    //     const companyOptions = companyResponse.data.company;
    //     const companyNames = companyOptions.map(company => company.company_name);
    
    //     const companyDropdown = document.getElementById('user_client');
    //     companyDropdown.innerHTML = ''; // Clear existing options
    
    //     // Add the default option
    //     const defaultOption = document.createElement('option');
    //     defaultOption.value = '';
    //     defaultOption.text = '-- Select Company --';
    //     companyDropdown.appendChild(defaultOption);
    
    //     // Add options for each company
    //     for (let i = 0; i < companyNames.length; i++) {
    //         const option = document.createElement('option');
    //         option.value = companyNames[i];
    //         option.text = companyNames[i];
    //         companyDropdown.appendChild(option);
    //     }
    //     companyDropdown.value = queryParams.userClient;
    // }
    
    // async function createVendorDropdown() {
    //     try {
    //         const vendorResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vendor", { headers: { "Authorization": token } });
    //         const vendorOptions = vendorResponse.data.vendors;
    //         const vendorNames = vendorOptions.map(vendor => vendor.vendorName);
    
    //         const vendorDropdown = document.getElementById('user_vendor');
    //         vendorDropdown.innerHTML = ''; // Clear existing options
    
    //         // Add the default option
    //         const defaultOption = document.createElement('option');
    //         defaultOption.value = '';
    //         defaultOption.text = '-- Select Vendor --';
    //         vendorDropdown.appendChild(defaultOption);
    
    //         // Add options for each vendor
    //         for (let i = 0; i < vendorNames.length; i++) {
    //             const option = document.createElement('option');
    //             option.value = vendorNames[i];
    //             option.text = vendorNames[i];
    //             vendorDropdown.appendChild(option);
    //         }
    //         const decodedUserVendor = decodeURIComponent(queryParams.userVendor);

    //         console.log(decodedUserVendor);
            
    //         // Set the value to the dropdown
    //         vendorDropdown.value = decodedUserVendor;
    //     } catch (error) {
    //         console.error('Error fetching vendor data:', error);
    //     }
    // }
});

document.getElementById('e_user-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Collect form data into an object
    const formData = {
        userName: document.getElementById('f_name').value,
        lastName: document.getElementById('l_name').value,
        userEmail: document.getElementById('user_email').value,
        userPassword: document.getElementById('user_password').value,
        userPhone: document.getElementById('user_phone').value,
        userGroup: document.getElementById('user_group').value,
        userVendor: document.getElementById('user_vendor').value,
        userClient: document.getElementById('user_client').value,
        createdBy: document.getElementById('user_created_date').value,

        disableUser: document.getElementById('disable_user').checked,
        readOnly:document.getElementById('u_read_only').checked,
        Write:document.getElementById('u_write').checked,

        imports:document.getElementById('u_import').checked,
        exports:document.getElementById('u_export').checked,
        userManagement:document.getElementById('u_user_management').checked,
        vendorManagement:document.getElementById('u_vendor_management').checked,

        reports:document.getElementById('u_reports').checked,
        reports_all:document.getElementById('u_reports_all').checked,
        deletes:document.getElementById('u_delete').checked,
        current_login:null,
        last_login:null,
        created_date:null,
        staff:document.getElementById('u_staff').checked,
    };

    try {
        // Make a POST request using Axios with async/await
        const response = await axios.put(`https://nemonode.ivistaz.co/user/update-user/${id}`, formData,{headers:{"Authorization":token}});
        console.log('Response:', response.data.message);
        alert('User edit successful!')
        // Handle success if needed
    } catch (error) {
        console.error('Error updating user:', error);
        // Handle error if needed
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