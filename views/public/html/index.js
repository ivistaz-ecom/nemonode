document.addEventListener('DOMContentLoaded', function () {
    // Attach click event to the search button
    const userDisplay = document.getElementById("user_name");
    userDisplay.innerHTML += localStorage.getItem('username');
    const hasUserManagement = decodedToken.userManagement;

    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
  
   ;
  });
  



function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const token = localStorage.getItem('token'); // Get the JWT token from storage
const decodedToken = decodeToken(token);
const userRole = decodedToken.userGroup; // Assuming your user role is stored in userGroup
const hasUserManagement = decodedToken.userManagement; // Assuming userManagement is a boolean in the JWT payload
const hasReport = decodedToken.reports
const ReadOnly = decodedToken.readOnly
const WriteOnly = decodedToken.Write
console.log(decodedToken)
console.log(userRole,'UM :', hasUserManagement,"R :", ReadOnly,"W :",WriteOnly)
// switch (userRole) {
//     case 'admin':
//         document.getElementById('adminSection').style.display = 'block';
//         break;
//     case 'vendor':
//         document.getElementById('vendorSection').style.display = 'block';
//         if (hasUserManagement) {
//             const userLink = document.createElement('a');
//             userLink.href = '../user/user.html';
//             userLink.innerHTML = '<i class="fas fa-user-plus"></i> &nbsp; Create User';
//             document.getElementById('vendorSection').appendChild(userLink);
//         }
//         if (hasReport) {
//             const userLink = document.createElement('a');
//             userLink.href = '../report/report.html';
//             userLink.innerHTML = '<i class="fas fa-file-alt"></i> &nbsp; Generate Report';
//             document.getElementById('vendorSection').appendChild(userLink);
//         }
//         break;
//     // case 'user':
//     //     document.getElementById('userSection').style.display = 'block';
//     //     break;
//     default:
//         console.error('Unknown user role:', userRole);
// }

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

// This JavaScript part fetches the data from the server and updates the counts dynamically.


const fetchCandidates = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/candidate/view-candidate`, { headers: { "Authorization": token } });
    const candidateData = response.data;

    // Filter candidates based on company_status and count active and inactive candidates
    const activeCandidates = candidateData.candidates.filter(candidate => candidate.company_status === 'active');
    const inactiveCandidates = candidateData.candidates.filter(candidate => candidate.company_status !== 'active');

    // Update the active and inactive counts in the HTML
    document.getElementById('activeCount').textContent = activeCandidates.length;
    document.getElementById('inactiveCount').textContent = inactiveCandidates.length;
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
};

// Call the fetchCandidates function when the component loads
fetchCandidates();
