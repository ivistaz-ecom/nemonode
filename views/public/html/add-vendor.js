const token = localStorage.getItem('token')

function addOption(selectElement, value) {
    const option = document.createElement('option');
    option.value = value;
    option.text = value;
    selectElement.appendChild(option);
}
// async function createCompanyDropdown() {

//     const companyResponse = await axios.get("http://nemonode.ivistaz.co:8000/company/view-company", { headers: { "Authorization": token } });
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
// await createCompanyDropdown()
// await createVendorDropdown()

const hasUserManagement = decodedToken.userManagement;
const hasVendorManagement = decodedToken.vendorManagement;

   console.log(hasUserManagement)
   if (hasUserManagement) {
     document.getElementById('userManagementSection').style.display = 'block';
     document.getElementById('userManagementSections').style.display = 'block';
   }
   
   console.log(hasVendorManagement)
   if (hasVendorManagement) {
     document.getElementById('vendorManagementSection').style.display = 'block';
     document.getElementById('vendorManagementSections').style.display = 'block';
   }

   const mc = decodedToken.master_create;
console.log(mc)
   const userGroup = decodedToken.userGroup
   const groupDropdown = document.getElementById('user_group');

   groupDropdown.innerHTML = ''; // Clear existing options

   // Add options based on userGroup
   if (userGroup === 'vendor' || userGroup==='admin') {
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
        const reports = document.getElementById('u_reports').checked;
        const createdBy = document.getElementById('user_created_date').value;
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
        };
        console.log(formData);
    
        try {
            const response = await axios.post('http://nemonode.ivistaz.co:8000/user/create-user', formData, { headers: { "Authorization": token } });
            // Handle the server response here
            console.log(response.data);
        } catch (error) {
            // Handle errors here
            console.error('Error:', error);
        }
    });
    
    


})
// async function createVendorDropdown() {
//     try {
//         const vendorResponse = await axios.get("http://nemonode.ivistaz.co:8000/others/view-vendor", { headers: { "Authorization": token } });
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