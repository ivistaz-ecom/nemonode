const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);

window.onload = async function () {

    try {
        await displayCandidates();
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
    } catch (err) {
        console.log('No entries present');
        console.log(err);
    }
};

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

async function fetchData(url) {
    try {
        const response = await axios.get(url, { headers: { "Authorization": token } });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
document.getElementById('search-input').addEventListener('input', function() {
    searchCandidates(this.value);
});

async function searchCandidates(query) {
    try {
        const url = `http://localhost:8001/candidate/search?search=${query}`;
        const responseData = await fetchData(url);
        const candidates = responseData.candidates;
        const candidateTable = document.getElementById("candidate-table");
        candidateTable.innerHTML = ""; // Clear existing table content

        let sno = 1;

        candidates.forEach(candidate => {
            const dob = new Date(candidate.dob);
            const age = calculateAge(dob);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td><button onclick="viewCandidate('${obfuscateId(candidate.candidateId)}')" class="btn btn-link">${candidate.fname}</button></td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.c_vessel}</td>
                <td>${candidate.c_mobi1}</td>
                <td>${age}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="viewCandidate('${obfuscateId(candidate.candidateId)}')">
                        <i class="fa fa-eye" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                  
                </td>`;
            candidateTable.appendChild(row);
            sno++;
        });

        updatePagination(responseData.totalPages, 1, 10, query);

    } catch (error) {
        console.error('Error:', error);
    }
}


async function displayCandidates(page = 1, limit = 10, search = '') {
    try {
        const url = `http://localhost:8001/candidate/view-candidate?page=${page}&limit=${limit}&search=${search}`;
        const responseData = await fetchData(url);
        const candidates = responseData.candidates;
        const candidateTable = document.getElementById("candidate-table");
        candidateTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        candidates.forEach(candidate => {
            const dob = new Date(candidate.dob);
            const age = calculateAge(dob);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td><button onclick="viewCandidate('${obfuscateId(candidate.candidateId)}')" class="btn btn-link">${candidate.fname}</button></td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.c_vessel}</td>
                <td>${candidate.c_mobi1}</td>
                <td>${age}</td>
               `;
            candidateTable.appendChild(row);
            sno++;
        });


    } catch (error) {
        console.error('Error:', error);
    }
}




async function deleteCandidate(candidateId, event) {
    event.preventDefault();
    let id = candidateId;
    console.log(id);
    const url = `http://localhost:8001/candidate/delete-candidate/${id}`;
    console.log(url);
    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayCandidates();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

function calculateAge(birthdate) {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}





document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`http://localhost:8001/user/${userId}/logout`)
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
