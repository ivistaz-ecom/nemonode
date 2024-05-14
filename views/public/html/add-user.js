const token = localStorage.getItem('token')

async function createCompanyDropdown() {

    const companyResponse = await axios.get("https://nemo.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.company;
        console.log(companyOptions)
        const companyNames = companyOptions.map(company => company.company_name);


    const companyDropdown = document.getElementById('user_client');
    companyDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Company --';
    companyDropdown.appendChild(defaultOption);

    // Add options for each company
    for (let i = 0; i < companyNames.length; i++) {
        const option = document.createElement('option');
        option.value = companyNames[i];
        option.text = companyNames[i];
        companyDropdown.appendChild(option);
        // If you want to clone the options for another dropdown, do it here
        // companyDropdown.appendChild(option.cloneNode(true));
    }
}


document.addEventListener('DOMContentLoaded', async function () {
// await createCompanyDropdown()
// await createVendorDropdown()
const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    const userGroup = decodedToken.userGroup;
    console.log(userGroup)
    const Write = decodedToken.Write;
    console.log(Write)
    await displayUsers(Write)

    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }

// document.getElementById('user-form').addEventListener('submit', async (event) => {
//     event.preventDefault();

//     const userName = document.getElementById('f_name').value;
//     const lastName = document.getElementById('l_name').value;
//     const userEmail = document.getElementById('user_email').value;
//     const userPassword = document.getElementById('user_password').value;
//     const userCPassword = document.getElementById('user_c_password').value;
//     const userPhone = document.getElementById('user_phone').value;
//     const userGroup = document.getElementById('user_group').value;
//     const userVendor = document.getElementById('user_vendor').value;
//     const userClient = document.getElementById('user_client').value;
//     const createdDate = document.getElementById('user_created_date').value;
//     const disableUser = document.getElementById('disable_user').checked;
//     const readOnly = document.getElementById('u_read_only').checked;
//     const Write = document.getElementById('u_write').checked;
//     const imports = document.getElementById('u_import').checked;
//     const exports = document.getElementById('u_export').checked;
//     const userManagement = document.getElementById('u_user_management').checked;
//     const reports = document.getElementById('u_reports').checked;

//     const formData = {
//         userName,
//         lastName,
//         userEmail,
//         userPassword,
//         userCPassword,
//         userPhone,
//         userGroup,
//         userVendor,
//         userClient,
//         createdDate,
//         disableUser,
//         readOnly,
//         Write,
//         imports,
//         exports,
//         userManagement,
//         reports,
//     };
//     console.log(formData);

//     try {
//         const response = await axios.post('https://nemo.ivistaz.co/user/create-user', formData, { headers: { "Authorization": token } });
//         // Handle the server response here
//         console.log(response.data);
//     } catch (error) {
//         // Handle errors here
//         console.error('Error:', error);
//     }
// });


})
async function createVendorDropdown() {
    try {
        const vendorResponse = await axios.get("https://nemo.ivistaz.co/others/view-vendor", { headers: { "Authorization": token } });
        const vendorOptions = vendorResponse.data.vendors;
        console.log(vendorOptions);
        
        const vendorNames = vendorOptions.map(vendor => vendor.vendorName);

        const vendorDropdown = document.getElementById('user_vendor');
        vendorDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Vendor --';
        vendorDropdown.appendChild(defaultOption);

        // Add options for each vendor
        for (let i = 0; i < vendorNames.length; i++) {
            const option = document.createElement('option');
            option.value = vendorNames[i];
            option.text = vendorNames[i];
            vendorDropdown.appendChild(option);
            // If you want to clone the options for another dropdown, do it here
            // vendorDropdown.appendChild(option.cloneNode(true));
        }
    } catch (error) {
        console.error('Error fetching vendor data:', error);
    }
}
const getUserEmail=() =>{
    const token = localStorage.getItem('token')
    const decodedToken =decodeToken(token)
    return decodedToken.userEmail
    }


    async function displayUsers(Write) {
        try {   
            console.log('WRITE:',Write)
            const writePermission = Write
            const userEmail = getUserEmail();
            const response = await axios.get("https://nemo.ivistaz.co/user/view-user", { headers: { "Authorization": token, "userEmail": userEmail } });
            const users = response.data.users;
    
            const userList = document.getElementById("user-list");
            userList.innerHTML = "";
            let sno = 1;
    
            users.forEach(user => {
                if (decodedToken.userGroup === 'admin' || user.userGroup === 'vendor') { // Check if userGroup is 'vendor' or if current user is admin
                    const isCurrentUser = decodedToken.userId === user.id;
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td style="font-size:12px">${sno}</td>
                        <td style="font-size:12px">${user.id}</td>
                        <td style="font-size:12px">${user.userName}</td>
                        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 2ch; font-size:13px;">${user.userEmail}</td>
                        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 2ch; font-size:13px;">${user.userPassword}</td>
                        <td style="font-size:12px">${user.userPhone}</td>
                        <td style="font-size:12px">${user.userGroup}</td>
                       
                        <td style="font-size:12px;">${user.createdBy}</td>
                        <td style="font-size:12px">${user.master_create}</td>
                        <td style='font-size:12px'>${user.reports}</td>
                        <td style='font-size:12px'>${user.reports_all}</td>
                        <td style='font-size:12px'>${user.deletes}</td>
                        <td style="font-size:12px">${user.staff}</td>

                        <td>
                        <button class="btn btn-sm m-0 p-0" ${!writePermission ? 'disabled' : ''} onclick="editUser(${user.id},'${user.userName}', '${user.lastName}', '${user.userEmail}','${user.userPassword}', '${user.userPhone}', '${user.userGroup}', '${user.userVendor}', '${user.userClient}', '${user.createdBy}', '${user.disableUser}', '${user.readOnly}', '${user.Write}', '${user.imports}', '${user.exports}','${user.userManagement}','${user.vendorManagement}', '${user.reports}','${user.reports_all}','${user.master_create}','${user.staff}','${user.deletes}')">
                            <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                        </button>
                        ${!isCurrentUser ? 
                            `<button class="btn btn-sm m-0 p-0" ${!writePermission ? 'disabled' : ''} onclick="deleteUser(${user.id})">
                                <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                            </button>`
                        : ''} 
                    </td>
                    `;
                    const userGroupCell = row.querySelector('td:nth-child(8)');
                    if (userGroupCell) {
                        userGroupCell.innerHTML = `<span class="badge ${user.userGroup === 'admin' ? 'bg-primary' : 'bg-warning'}">${user.userGroup}</span>`;
                    }
    
                    userList.appendChild(row);
                    sno++;
                }
                
            });
            
            
    
        } catch (error) {
            console.error('Error:', error);
        }
    }
    



    // Handling form submission

    async function editUser(id, userName, lastName, userEmail, userPassword, userPhone, userGroup, userVendor, userClient, createdBy, disableUser, readOnly, Write, imports, exports,userManagement,vendorManagement, reports,reports_all, master_create,staff,deletes,current_login,last_login,company_login,created_date) {
        console.log('Edit clicked for user ID:', id);
        const encodedUserVendor = encodeURIComponent(userVendor);
        const encodedUserClient = encodeURIComponent(userClient);
        const encodedMaster_Create = encodeURIComponent(master_create)
console.log(id, userName, lastName, userEmail, userPassword, userPhone, userGroup, userVendor, userClient, createdBy, disableUser, readOnly, Write, imports, exports, userManagement,vendorManagement, reports,reports_all,master_create,staff,deletes)
        // Redirect to the edit page with user details as query parameters
        window.location.href = `edit-user.html?id=${id}&userName=${userName}&lastName=${lastName}&userEmail=${userEmail}&userPassword=${userPassword}&userPhone=${userPhone}&userGroup=${userGroup}&userVendor=${encodedUserVendor}&userClient=${encodedUserClient}&createdBy=${createdBy}&disableUser=${disableUser}&readOnly=${readOnly}&Write=${Write}&imports=${imports}&exports=${exports}&userManagement=${userManagement}&vendorManagement=${vendorManagement}&reports=${reports}&reports_all=${reports_all}&master_create=${encodedMaster_Create}&deletes=${deletes}&current_login=${current_login}&last_login=${last_login}&company_login=${company_login}&created_date=${created_date}&staff=${staff}&deletes=${deletes}`;
    }
    
    async function deleteUser(id) {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                // Send a request to your server to delete the user with the specified ID
                const response = await axios.delete(`https://nemo.ivistaz.co/user/delete-user/${id}`, { headers: { "Authorization": token } });
    
                if (response.data.success) {
                    alert('User deleted successfully');
                    // Optionally, you can reload the user list or update the UI accordingly
                } else {
                    console.error('Error deleting user:', response.data.error);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    }
    
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