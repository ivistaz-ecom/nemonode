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
        window.location.href = "ownerlogin.html";
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

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nsnemo.com/candidate/onboard', {
            params: {
                startDate: startDate,
                vslName: vesselDropdown,
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
            const age = calculateAge(contract.dob);
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${contract.candidateId}</td>
                <td><button onclick="viewCandidate('${obfuscateId(contract.candidateId)}')" class="btn btn-link">${contract.name}</button></td>
                <td>${contract.birth_place}</td>
                <td>${contract.rank}</td>
                <td>${contract.country}</td>
                <td>${showDateFormat(contract.dob)}</td>
                <td>${age}</td>
                <td>${contract.company_name}</td>
                <td>${contract.currency}</td>
                <td>${showDateFormat(contract.eoc)}</td>
                <td>${showDateFormat(contract.sign_on)}</td>
                <td>${showDateFormat(contract.sign_off)}</td>
                <td>${contract.portName}</td>
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

function calculateAge(birthdate) {
    if(birthdate!=="" && birthdate!==null && birthdate!=='1970-01-01') {
        const currentDate = new Date();
        const birthDate = new Date(birthdate);

        let age = currentDate.getFullYear() - birthDate.getFullYear();

        if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
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
    window.open(`./ownerviewcandidate.html?id=${encodeURIComponent(obfuscatedId)}`, '_blank');
}