// Client-side JavaScript with Axios

const countryTable = document.getElementById("country-code-table");
const token = localStorage.getItem('token')
async function displayCountryCodes() {
    try {
        const response = await axios.get('http://nemonode.ivistaz.co/others/country-codes',{headers:{"Authorization":token}});
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