// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page

  window.location.href = './loginpage.html';
}

function addOption(selectElement, value) {
    const option = document.createElement('option');
    option.value = value;
    option.text = value;
    selectElement.appendChild(option);
}
// async function createCompanyDropdown() {

//     const companyResponse = await axios.get(`${config.APIURL}company/view-company`, { headers: { "Authorization": token } });
//         const companyOptions = companyResponse.data.company;
//         console.log(companyOptions)
//         const companyNames = companyOptions.map(company => company.company_name);


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
//         // If you want to clone the options for another dropdown, do it here
//         // companyDropdown.appendChild(option.cloneNode(true));
//     }
// }

   





function decodeToken(token) {
   // Implementation depends on your JWT library
   // Here, we're using a simple base64 decode
   const base64Url = token.split('.')[1];
   const base64 = base64Url.replace('-', '+').replace('_', '/');
   return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);

document.addEventListener('DOMContentLoaded', async function () {
   await fetchCountryCodes()
// await createCompanyDropdown()
// await createVendorDropdown()

const hasUserManagement = decodedToken.userManagement;
const hasVendorManagement = decodedToken.vendorManagement;
const user_id = decodedToken.userId;
console.log(user_id)

   console.log(hasUserManagement)
   if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
   console.log(hasVendorManagement)
   if (hasVendorManagement) {
     document.getElementById('vendorManagementSection').style.display = 'block';
     document.getElementById('vendorManagementSections').style.display = 'block';

   }
   console.log(decodedToken)
   const mc = decodedToken.master_create;
console.log(mc)
   const userGroup = decodedToken.userGroup
   const groupDropdown = document.getElementById('user_group');

   groupDropdown.innerHTML = ''; // Clear existing options

   // Add options based on userGroup
   if (userGroup === 'admin') {
       addOption(groupDropdown, 'admin');
       groupDropdown.value='admin'
   }
  else if (userGroup === 'vendor') {
    addOption(groupDropdown, 'vendor');
    groupDropdown.value='vendor'
}
else{
    addOption(groupDropdown, 'null');
    groupDropdown.value='null'
}

   

   // Add the default option
   const defaultOption = document.createElement('option');
   defaultOption.value = '';
   defaultOption.text = '-- Select Role --';
   groupDropdown.insertBefore(defaultOption, groupDropdown.firstChild);

   const createdByField = document.getElementById('user_created_date'); // Assuming 'user_created_date' is the ID of the createdBy input field
    const username = decodedToken.userEmail;
    createdByField.value = username;
    const masterCreateField = document.getElementById('master_create');
    const master = decodedToken.userEmail;
    if (userGroup === 'admin') {
        masterCreateField.value = '0'; // Set master_create as 0 for admin
    } else {
        // For vendor and client, set master_create to the email of the current user
        masterCreateField.value = master;
    }



    document.getElementById('user-form').addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const userName = document.getElementById('f_name').value.trim();
        const lastName = document.getElementById('l_name').value.trim();
        const userEmail = document.getElementById('user_email').value.trim();
        const userPassword = document.getElementById('user_password').value.trim();
        const userCPassword = document.getElementById('user_c_password').value.trim();
        const userPhone = document.getElementById('user_phone').value.trim();
        const userGroup = document.getElementById('user_group').value.trim();
        const userVendor = document.getElementById('user_vendor').value.trim() || '' ;
        const userClient = document.getElementById('user_client').value.trim() || '';
        const disableUser = document.getElementById('disable_user').checked;
        const readOnly = document.getElementById('u_read_only').checked;
        const Write = document.getElementById('u_write').checked;
        const imports = document.getElementById('u_import').checked;
        const exports = document.getElementById('u_export').checked;
        const userManagement = document.getElementById('u_user_management').checked;
        const vendorManagement = document.getElementById('u_vendor_management').checked;
        const nationality = document.getElementById('user_nationality').value

        const reports = document.getElementById('u_reports').checked;
        const reports_all = document.getElementById('u_reports_all').checked;
        const createdBy = document.getElementById('user_created_date').value;
        const deletes = document.getElementById('u_delete').checked;
        const current_login = null;
        const last_login = null;
        const company_login = false;
        const created_date=null;
        const staff = document.getElementById('u_staff').checked;
        const interviewer = document.getElementById('interviewer').checked



        const currentUserEmail = decodedToken.userEmail; // Get the email of the currently logged-in user from the token
        const currentUserMasterCreate = decodedToken.master_create; // Get the master_create value of the currently logged-in user from the token
        // Construct the new value of master_create by appending the current user's email and the fetched master_create value from the token
        const newValue = currentUserMasterCreate + ',' + currentUserEmail;
        const formData = {
            userName,
            lastName,
            userEmail,
            userPassword,
            userCPassword,
            userPhone,
            userGroup,
            userVendor,
            userClient,
            createdBy,
            master_create: newValue, // Set the master_create field to the new value
            disableUser,
            readOnly,
            Write,
            imports,
            exports,
            userManagement,
            vendorManagement,
            reports,
            reports_all,
            deletes:deletes,
            current_login:current_login,
            last_login:last_login,
            company_login:company_login,
            created_date:created_date,
            staff:staff,
            nationality:nationality,
            interviewer:interviewer,
        };
        console.log(formData);
    
        try {
            const token = localStorage.getItem('token')
            
            const response = await axios.post(`${config.APIURL}user/create-user/${user_id}`, formData, { headers: { "Authorization": token } });
            // Handle the server response here
            console.log(response.data);
        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
        }
    });
    
    


})

async function fetchCountryCodes() {
    try {
        const response = await axios.get(`${config.APIURL}fetch-nationality`);
        const countries = response.data.countries;
        // Clear existing options
        var select = document.getElementById("user_nationality");
        select.innerHTML = '<option value="">Code</option>';
        // Populate the dropdown options
        countries.forEach(function(country) {
            var option = document.createElement("option");
            option.value = country.code; // Set the value to phone_code
            option.text = country.country; // Display only the phone_code
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching country codes:', error);
    }
}
// async function createVendorDropdown() {
//     try {
//         const vendorResponse = await axios.get(`${config.APIURL}others/view-vendor`, { headers: { "Authorization": token } });
//         const vendorOptions = vendorResponse.data.vendors;
//         console.log(vendorOptions);
        
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
//             // If you want to clone the options for another dropdown, do it here
//             // vendorDropdown.appendChild(option.cloneNode(true));
//         }
//     } catch (error) {
//         console.error('Error fetching vendor data:', error);
//     }
// }







document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`${config.APIURL}user/${userId}/logout`)
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