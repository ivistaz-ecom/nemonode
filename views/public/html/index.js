document.addEventListener('DOMContentLoaded', async function () {
  // Show spinner
  // document.getElementById('spinner').style.display = 'flex';
  await fetchCandidates();

  console.log('updated')
  // Attach click event to the search button

  const token = localStorage.getItem('token');

  // Fetch discussion counts
  const discussionCountsResponse = await fetch('https://nemonode.ivistaz.co/candidate/discussion-count', {
    headers: { "Authorization": token }
  });
  const discussionCountsData = await discussionCountsResponse.json();
  document.getElementById('proposedCount').innerText = discussionCountsData.proposedCount;
  document.getElementById('approvedCount').innerText = discussionCountsData.approvedCount;
  document.getElementById('joinedCount').innerText = discussionCountsData.joinedCount;

  // Fetch call count
  const callCountResponse = await fetch('https://nemonode.ivistaz.co/candidate/call-count', {
    headers: { "Authorization": token }
  });
  const callCountData = await callCountResponse.json();
  document.getElementById('callCount').innerText = callCountData.call_count;
  document.getElementById('callCount').className = '  btn-primary badge';

  const userDisplay = document.getElementById("user_name");
  userDisplay.innerHTML += localStorage.getItem('username');
  const hasUserManagement = decodedToken.userManagement;
  const vendorManagement = decodedToken.vendorManagement;
  console.log(vendorManagement);
  const userGroup = decodedToken.userGroup;
  console.log(userGroup)
  if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
  }
  if (vendorManagement) {
    document.getElementById('vendorManagementSection').style.display = 'block';
    document.getElementById('vendorManagementSections').style.display = 'block';
  }
 
  // Hide spinner after everything is done
  document.getElementById('spinner').style.display = 'none';
  await populateCandidatesTable();


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
const master_create = decodedToken.master_create
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



// Update date and time initially and every second


document.getElementById("logout").addEventListener("click", function() {
  // Display the modal with initial message
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
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


function updateDateTime() {
  const dateTimeElement = document.getElementById('datetime');
  const now = new Date();

  const options = {
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true,
      month: 'long',
      day: 'numeric',
      // ordinal: 'numeric',
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
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token)
    console.log(decodedToken)
    const response = await axios.get(`https://nemonode.ivistaz.co/candidate/view-candidate`, { headers: { "Authorization": token } });
    const candidateData = response.candidates;
    console.log(candidateData)
    // Filter candidates based on company_status and count active and inactive candidates
    const activeCandidates = candidateData.candidates.filter(candidate => candidate.active_details === 1);
    const inactiveCandidates = candidateData.candidates.filter(candidate => candidate.active_details === 0);
    console.log("check if its working",activeCandidates,inactiveCandidates)

    // Update the active and inactive counts in the HTML
    document.getElementById('activeCount').textContent = activeCandidates.length;
    document.getElementById('inactiveCount').textContent = inactiveCandidates.length;
  } catch (error) {
    console.error('Error fetching candidates:', error);
  }
};

// Call the fetchCandidates function when the component loads

async function populateCandidatesTable() {
  try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://nemonode.ivistaz.co/candidate/view-candidate`, { headers: { "Authorization": token } });
      const responseData = response.data;
      let candidates = responseData.candidates; // Accessing the candidates array
      // Sort candidates based on availability status
      
      // Generate doughnut charts for ranks
      generateDoughnutCharts(candidates); // Display only the first 5 ranks
  } catch (error) {
      console.error(error);
  }
}

// Function to generate doughnut charts for ranks
// Function to generate doughnut charts for top 5 ranks
function generateDoughnutCharts(candidates) {
  const ranksData = {};
  candidates.forEach(candidate => {
      if (getStatus(candidate.avb_date) !== "Not available") {
          if (ranksData[candidate.c_rank]) {
              ranksData[candidate.c_rank]++;
          } else {
              ranksData[candidate.c_rank] = 1;
          }
      }
  });

  // Sort ranks based on count in descending order
  const sortedRanks = Object.keys(ranksData).sort((a, b) => ranksData[b] - ranksData[a]).slice(0, 5);

  const rankLabels = sortedRanks;
  const rankCounts = sortedRanks.map(rank => ranksData[rank]);

  const rankChartsContainer = document.getElementById('rankCharts');
  rankChartsContainer.innerHTML = '<canvas id="rankDoughnutChart"></canvas>';

  const rankDoughnutChartCanvas = document.getElementById('rankDoughnutChart').getContext('2d');

  new Chart(rankDoughnutChartCanvas, {
      type: 'doughnut',
      data: {
          labels: rankLabels.map((label, index) => `${label}: ${rankCounts[index]}`), // Include count in label
          datasets: [{
              data: rankCounts,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8A2BE2', '#FFA500']
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
              display: true,
              position: 'right',
              labels: {
                  generateLabels: function(chart) {
                      const data = chart.data;
                      if (data.labels.length && data.datasets.length) {
                          return data.labels.map(function(label, i) {
                              const color = data.datasets[0].backgroundColor[i];
                              return {
                                  text: label,
                                  fillStyle: color,
                                  strokeStyle: color,
                                  lineWidth: 2,
                                  hidden: false,
                                  index: i
                              };
                          });
                      }
                      return [];
                  }
              }
          },
          title: {
              display: true,
              text: 'Top 5 Candidate Ranks Distribution (Available Candidates)'
          }
      }
  });
}


// Function to determine the status order
function getStatusOrder(avb_date) {
  const today = new Date();
  const avbDate = new Date(avb_date);
  const diffTime = avbDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  if (diffDays === 0) {
      return 1; // Available
  } else if (diffDays < 0) {
      return 3; // Not available
  } else {
      return 2; // Available in __ days
  }
}

// Function to determine the status based on avb_date
function getStatus(avb_date) {
  const today = new Date();
  const avbDate = new Date(avb_date);
  const diffTime = avbDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  if (diffDays === 0) {
      return "Available";
  } else if (diffDays < 0) {
      return "Not available";
  } else {
      return `Available in ${diffDays} days`;
  }
}

// Function to determine the Bootstrap badge class based on avb_date
function getStatusBadgeClass(avb_date) {
  const today = new Date();
  const avbDate = new Date(avb_date);
  const diffTime = avbDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  if (diffDays === 0) {
      return "bg-success";
  } else if (diffDays < 0) {
      return "bg-danger";
  } else {
      return "bg-primary";
  }
}

// Call the function to populate the table when the page loads
