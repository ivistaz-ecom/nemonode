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

const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);
const userVendorValue = decodedToken.userClient;
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

fetchVessels(userVendor.value);

async function fetchVessels(companyId) {
    try {
        const response = await axios.get(`https://nsnemo.com/others/getcompanyviavsl/${companyId}`);
        
        const vessels = response.data;
        console.log(response);
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
        const vesselDropdown = document.getElementById('vesselDropdown').value || null;
        const userId = localStorage.getItem('userId')
        const decodedToken = decodeToken(token)
        const companyName = decodedToken.userClient
        // const companyname = localStorage.getItem('')

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nsnemo.com/candidate/onboard2', {
            params: {
                companyname:companyName ,
                startDate: startDate,
                vslName: vesselDropdown,
                userId: userId
            },
            headers: {
                "Authorization": token
            }
        });

        console.log(response)

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
    window.open(`./vendorviewcandidate.html?id=${encodeURIComponent(obfuscatedId)}`, '_blank');
}
