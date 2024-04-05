const token = localStorage.getItem('token');

async function fetchData(page = 1, limit = 10, candidateId) {
    try {
        let url;
        let params = { page, limit };

        // If candidateId is provided, fetch the page containing that candidate
        if (candidateId) {
            const response = await axios.get(`https://nemonode.ivistaz.co/candidate/find-candidate-page`, {
                headers: { "Authorization": token },
                params: { candidateId, limit }
            });

            const { page } = response.data;
            params.page = page;
        }

        const response = await axios.get('https://nemonode.ivistaz.co/candidate/view-candidate', {
            headers: { "Authorization": token },
            params
        });

        const responseData = response.data;
        console.log('Fetched data:', responseData); // Log the fetched data

        const candidates = responseData.candidates;
        // Update the table with the fetched data
        updateTable(candidates);

        // Update pagination controls
        const totalPages = responseData.totalPages;
        const currentPage = responseData.currentPage;
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;

        // Enable/disable pagination buttons based on current page
        document.getElementById('prev-page-btn').disabled = currentPage === 1;
        document.getElementById('next-page-btn').disabled = currentPage === totalPages;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function jumpToCandidate(candidateId) {
    fetchData(undefined, undefined, candidateId);
}


function nextPage() {
    const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1]);
    fetchData(currentPage + 1);
}

function prevPage() {
    const currentPage = parseInt(document.getElementById('page-info').textContent.split(' ')[1]);
    fetchData(currentPage - 1);
}

// Function to update the table with data
function updateTable(candidates) {
    const tableBody = document.getElementById('candidate-table');

    // Clear existing rows
    tableBody.innerHTML = '';

    // Populate the table with the fetched data
  // ...
candidates.forEach((candidate, index) => {
    const dob = new Date(candidate.dob); // Convert dob to a Date object
    const age = calculateAge(dob); // Calculate age using the function

    const row = `
        <tr>
            <td>${index + 1}</td>
            <td>${candidate.candidateId}</td>
            <td>${candidate.fname} ${candidate.lname}</td>
            <td>${candidate.c_rank}</td>
            <td>${candidate.c_vessel}</td>
            <td>${candidate.c_mobi1}</td>
            <td>${age}</td> 
            <td>
            <button class="btn m-0 p-0" onclick="viewCandidate('${candidate.candidateId}')">
                        <i class="fa fa-eye p-0 m-0 " onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" ></i>
                    </button>
                    <button class="btn m-0 p-0" onclick="editCandidate('${candidate.candidateId}')">
                        <i class="fa fa-pencil p-0 m-0" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn m-0 p-0" onclick="deleteCandidate('${candidate.candidateId}')">
                        <i class="fa fa-trash p-0 m-0" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    </td>
        </tr>
    `;

    tableBody.innerHTML += row;
});
// ...

    }

    function viewCandidate(candidateId) {
        localStorage.setItem('memId', candidateId);
        window.location.href = './view-candidate.html';
    }
function calculateAge(birthdate) {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

// Example usage:
const birthdate = '2000-01-01'; // Replace this with the actual birthdate
const age = calculateAge(birthdate);

console.log('Age:', age);


// Fetch data when the page loads
document.addEventListener('DOMContentLoaded',()=>{
    fetchData()
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
} );

function editCandidate(memId) {
    console.log('memId:', memId);
    localStorage.setItem('memId',memId);
    const canEdit = decodedToken.Write;
    if (canEdit) {
        console.log('Edited:', memId);
        window.location.href = `./edit-candidate-2.html?memId=${memId}`;
        // Add your logic for editing here
    } else {
        alert('You do not have permission to edit this candidate.');
    }
}

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

const decodedToken = decodeToken(token);

// Delete document function
async function deleteCandidate(candidateId, event) {
    const confirmDelete = confirm('Are you sure you want to delete this candidate?');

    if (confirmDelete) {
        try {
            const response = await axios.delete(`https://nemonode.ivistaz.co/candidate/delete-candidate/${candidateId}`, {
                headers: { "Authorization": token }
            });

            const responseData = response.data;
            console.log('Delete response:', responseData);

            // Fetch data again to update the table
            fetchData();
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    }
}

    

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