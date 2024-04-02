// Client-side JavaScript with Axios

const countryTable = document.getElementById("country-code-table");
const token = localStorage.getItem('token')
async function displayCountryCodes() {
    try {
        const response = await axios.get('http://localhost:4000/others/country-codes',{headers:{"Authorization":token}});
        const data = response.data;

        if (data.countryCodes && data.countryCodes.length > 0) {
            let sno = 1;

            data.countryCodes.forEach(country => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${sno}</td>
                    <td>${country.country_code}</td>
                    <td>${country.country}</td>
                    <td>${country.phone_code}</td>
                    
                `;
                countryTable.appendChild(row);
                sno++;
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



window.onload = async function () {
     await displayCountryCodes();
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
};




function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);


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