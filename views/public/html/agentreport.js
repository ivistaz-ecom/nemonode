function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

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
        window.location.href = "agentlogin.html";
    }, 2000);
});

const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);
const userVendorValue = decodedToken.userVendor;
const userVendor = document.getElementById('userVendor');

userVendor.value = userVendorValue;
console.log(userVendor.value);

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

document.addEventListener('DOMContentLoaded', async function () {

    displayVesselTypeDropdown()
})

async function displayVesselTypeDropdown() {
    try {
        const serverResponse = await axios.get(`${config.APIURL}others/get-vsls`, { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vessels;

        // Get the select element
        const vesselSelect = document.getElementById("vesselDropdown");

        // Clear previous options
        vesselSelect.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "-- Select Vessel --";

        vesselSelect.appendChild(defaultOption);

        // Add vessels to the dropdown
        vessels.forEach((vessel) => {
            const option = document.createElement("option");
            option.value = vessel.id;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option);
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
        const vesselDropdown = document.getElementById('vesselDropdown').value || null;
        const decodedToken= decodeToken(token)
        const nationality = decodedToken.nationality
        console.log(decodedToken)

        // Send request to fetch onboard candidates with filters
        const response = await axios.get(`${config.APIURL}candidate/onboard3`, {
            params: {
                startDate: startDate,
                vslName: vesselDropdown,
                nationality:nationality
            },
            headers: {
                "Authorization": token
            }
        });

        const contracts = response.data.contracts;
        const tableBody = document.getElementById('onBoardTableBody');
        tableBody.innerHTML = ''; // Clear existing table rows

        contracts.forEach((contract, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><button onclick="viewCandidate('${obfuscateId(contract.candidateId)}')" class="btn btn-link">${contract.fname}</button></td>
                <td>${contract.lname}</td>
                <td>${contract.birth_place}</td>
                <td>${contract.rank}</td>
                <td>${contract.nationality}</td>
                <td>${contract.dob}</td>
                <td>${contract.age}</td>
                <td>${contract.company_name}</td>
                <td>${contract.currency}</td>
                <td>${contract.eoc}</td>
                <td>${contract.sign_on}</td>
                <td>${contract.sign_off}</td>
                <td>${contract.sign_on_port}</td>
                <td>${contract.vesselName}</td>
                <td>${contract.vesselType}</td>
                <td>${contract.wages}</td>
                <td>${contract.wages_types}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
    }
}

document.getElementById('onBoardForm').addEventListener('submit', handleOnBoardSubmit);

function obfuscateId(id) {
    // A simple obfuscation technique by reversing the string and Base64 encoding
    const reversedId = id.toString().split('').reverse().join('');
    return btoa(reversedId);
}

function deobfuscateId(obfuscatedId) {
    // Decode Base64 and reverse the string to get the original ID
    const reversedId = atob(obfuscatedId);
    return reversedId.split('').reverse().join('');
}

function viewCandidate(obfuscatedId) {
    window.open(`./agentviewcandidate.html?id=${encodeURIComponent(obfuscatedId)}`, '_blank');
}