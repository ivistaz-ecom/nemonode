// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page
alert('Please login to continue using Nemo');

  window.location.href = './loginpage.html';
}


window.onload = async function () {
    const queryParams = new URLSearchParams(window.location.search);

    // Get values using parameter names
    const companyId = queryParams.get('companyId');
    const companyName = queryParams.get('companyname');
    // const businessType = queryParams.get('b_type');
    const contactPerson = queryParams.get('contact_person');
    const email = queryParams.get('email');
    const address = queryParams.get('address');
    const management = queryParams.get('management');
    const phone = queryParams.get('phone');
    const lastUpdate = queryParams.get('last_update');

    // Set values into the input fields
    document.getElementById("u_company_id").value = companyId;
    document.getElementById("u_company_name").value = companyName;

    // Set the radio button based on the businessType value (converted to lowercase)
    // document.getElementById(`u_${businessType.toLowerCase()}`).checked = true;

    document.getElementById("u_company_contact").value = contactPerson;
    document.getElementById("u_company_email").value = email;
    document.getElementById("u_company_address").value = address;
    document.getElementById("u_company_management").value = management;
    document.getElementById("u_company_phone").value = phone;
    document.getElementById("u_company_last_update").value = lastUpdate;
};


const updateCompanyButton = document.getElementById("update-company-form");
updateCompanyButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const companyId = document.getElementById("u_company_id").value;
    
    const selectedBusinessType = document.querySelector('input[name="u_business_type"]:checked');
    const businessType = selectedBusinessType ? selectedBusinessType.value : null;

    const updatedCompanyDetails = {
        company_id: companyId,
        c_name: document.getElementById("u_company_name").value,
        b_type: businessType || null, // Use the businessType here
        c_contact: document.getElementById("u_company_contact").value,
        c_email: document.getElementById("u_company_email").value,
        c_addr: document.getElementById("u_company_address").value,
        c_mgmt: document.getElementById("u_company_management").value,
        c_ph: document.getElementById("u_company_phone").value,
        c_last_update: document.getElementById("u_company_last_update").value,
    };

    try {
        const response = await axios.put(`https://nemo.ivistaz.co/company/update-company/${companyId}`, updatedCompanyDetails, { headers: { "Authorization": token } });
        console.log('Response:', response.data);
        alert("Company Updated Successfully!");
        window.location.href='./view-company.html'
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