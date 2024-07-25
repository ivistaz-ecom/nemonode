
document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
   
  
    localStorage.clear();
    
    // Change the message and spinner after a delay
    setTimeout(function() {
        document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
    }, 1000);
  
    // Redirect after another delay
    setTimeout(function() {
        window.location.href = "vendorlogin.html";
    }, 2000);
  });

 
  const token = localStorage.getItem('token')
  const decodedToken  = decodeToken(token)
  const userVendorValue = decodedToken.userVendor
  const userVendor = document.getElementById('userVendor')

  userVendor.value = userVendorValue
  console.log(userVendor.value)

  function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

fetchVessels(userVendor.value)

async function fetchVessels(companyId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/others/getcompanyviavsl/${companyId}`);
        
        const vessels = response.data;
        console.log(response)
        const dropdown = document.getElementById('vesselDropdown');
        dropdown.innerHTML = '<option value="">Select Vessel</option>'; // Reset dropdown

        vessels.forEach(vessel => {
            const option = document.createElement('option');
            option.value = vessel.id;
            option.textContent = vessel.vesselName;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}


async function handleOnBoardSubmit(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDateo').value;
        startDate = startDate + 'T00:00:00Z';
        // const companyname = document.getElementById('userVendor').value || null; // Updated to userVendor
        const vesselDropdown = document.getElementById('vesselDropdown').value || null; // Updated ID

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
            params: {
                startDate: startDate,
                vslName: vesselDropdown,
            },
            headers: {
                "Authorization": token// Ensure token is prefixed with Bearer if required
            }
        });

        const contracts = response.data.contracts;
      

    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
    }
}

document.getElementById('onBoardForm').addEventListener('submit', handleOnBoardSubmit);
