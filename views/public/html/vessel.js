const token = localStorage.getItem('token')

document.getElementById("vessel-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselName = document.getElementById("vessel_name").value.trim();

    try {
        // Add a new vessel
        await axios.post("https://nemo.ivistaz.co/others/create-vessel", { vesselName }, { headers: { "Authorization": token } });
        console.log('Vessel added successfully');
        // Refresh the vessel list after adding a new vessel
    } catch (error) {
        console.error('Error:', error);
    }
});

// Function to fetch data using Axios for companies
const fetchCompanyData = async () => {
    try {
        const response = await axios.get('https://nemo.ivistaz.co/company/dropdown-company');  // Adjust URL as per your backend setup
        const companies = response.data.companies;

        // Reference to the select element for companies
        const selectElement = document.getElementById('vsl_company');

        // Clear existing options
        selectElement.innerHTML = '<option value="" selected disabled>Select company</option>';

        // Populate dropdown with fetched data
        companies.forEach(company => {
            const option = document.createElement('option');
            option.value = company.company_id;  // Adjust based on your company object structure
            option.textContent = company.company_name; // Display text
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching company data:', error);
        // Handle error appropriately, e.g., show an alert
    }
};

// Call the fetchCompanyData function when the page loads or as needed
fetchCompanyData();


document.getElementById("vsl-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselName = document.getElementById("vessel_name_vsl").value;
    const vesselType = document.getElementById("vessel_type").value;
    const vsl_company = document.getElementById("vsl_company").value;
    const imoNumber = document.getElementById("imo_number").value;
    const vesselFlag = document.getElementById("vessel_flag").value;

    try {
        const serverResponse = await axios.post("https://nemo.ivistaz.co/others/create-vsl", {
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
  
window.onload = async function () {
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