const token = localStorage.getItem('token');

async function fetchData() {
    try {
        const response = await axios.get('http://nemonode.ivistaz.co/candidate/view-candidate', {
            headers: { "Authorization": token }
        });

        const responseData = response.data;
        console.log('Fetched data:', responseData); // Log the fetched data

        if (responseData.success && Array.isArray(responseData.candidates)) {
            const candidates = responseData.candidates;
            // Update the table with the fetched data
            updateTable(candidates);
        } else {
            console.error('Invalid response format:', responseData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
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
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

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
            const response = await axios.delete(`http://nemonode.ivistaz.co/candidate/delete-candidate/${candidateId}`, {
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