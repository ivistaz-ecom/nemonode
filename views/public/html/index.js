function decodeToken(token) {
  // Implementation depends on your JWT library
  // Here, we're using a simple base64 decode
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(atob(base64));
}
document.addEventListener('DOMContentLoaded', async function () {
  // Show spinner
  // document.getElementById('spinner').style.display = 'flex';
  

  // Attach click event to the search button

  const token = localStorage.getItem('token');

  // Fetch discussion counts
// JavaScript code to fetch data and populate HTML
try {
  // Get the current year
  const currentYear = new Date().getFullYear();

  const discussionCountsResponse = await axios.get('https://nemo.ivistaz.co/candidate/discussion-count', {
    headers: { "Authorization": token }
  });
  const discussionCountsData = discussionCountsResponse.data;

  // Extract quarters and counts from the data
  const quarters = discussionCountsData.map(quarterData => `Quarter ${quarterData.quarter} (${currentYear})`);
  const proposedCounts = discussionCountsData.map(quarterData => quarterData.proposedCount);
  const approvedCounts = discussionCountsData.map(quarterData => quarterData.approvedCount);
  const joinedCounts = discussionCountsData.map(quarterData => quarterData.joinedCount);

  // Create a new canvas element to render the chart
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Append the canvas element to the discussionCountsList
  const discussionCountsList = document.getElementById('discussionCounts');
  discussionCountsList.appendChild(canvas);

  // Create the chart
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: quarters,
      datasets: [
        {
          label: 'Proposed',
          data: proposedCounts,
          backgroundColor: '#00222F', // Red color
        },
        {
          label: 'Approved',
          data: approvedCounts,
          backgroundColor: 'rgba(54, 162, 235, 0.5)', // Blue color
        },
        {
          label: 'Joined',
          data: joinedCounts,
          backgroundColor: '#008E9C', // Yellow color
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              var label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
              }
              return label;
            }
          }
        }
      }
    }
  });
} catch (error) {
  console.error('Error fetching discussion counts:', error);
}



  // Fetch call count
  try {
    const callCountResponse = await axios.get('https://nemo.ivistaz.co/candidate/call-count', {
        headers: { "Authorization": token }
    });
    
    const callCountData = callCountResponse.data;
    const callCountFromAPI = callCountData.call_count;

    // Get the call count from the calls model
    const callCountFromModelResponse = await axios.get('https://nemo.ivistaz.co/candidate/percentage');
    const callCountFromModel = callCountFromModelResponse.data.call_count;
    
    // Calculate the difference in percentages
    const percentageChange = callCountFromAPI - callCountFromModel;

    // Display the percentage change
    console.log('Percentage change:', percentageChange);
    
    // Update the UI with the call count
    document.getElementById('callCount').innerText = callCountData.call_count; // Displaying call count
    document.getElementById('callCount').className = 'text-dark';

    // Update the UI with the percentage change
    const percentageChangeElement = document.getElementById('percentageChange');
    percentageChangeElement.textContent = `${Math.abs(percentageChange)}`;

    // Update the color of the arrow based on the value of percentageChange
    const arrowIcon = document.getElementById('arrowIcon');
    if (percentageChange > 0) {
        arrowIcon.className = 'bx bx-up-arrow-alt text-success'; // Green arrow
    } else if (percentageChange < 0) {
        arrowIcon.className = 'bx bx-down-arrow-alt text-danger'; // Red arrow
    } else {
        arrowIcon.className = 'bx bx-minus text-secondary'; // Grey arrow
    }
} catch (error) {
    console.error('Error fetching call count:', error);
}

try {
  // Fetch status count data
  const statusCountResponse = await axios.get('https://nemo.ivistaz.co/candidate/statuscount', {
        headers: { "Authorization": token }
    });
    const statusCountData = statusCountResponse.data.counts[0]; // Accessing the first element of the counts array
    console.log(statusCountData);

    const proposedCountFromAPI = statusCountData.proposed_count;
    const approvedCountFromAPI = statusCountData.approved_count;
    const joinedCountFromAPI = statusCountData.joined_count;
    const rejectedCountFromAPI = statusCountData.rejected_count;
  // Fetch percentage data
  const callCountFromModelResponse = await axios.get('https://nemo.ivistaz.co/candidate/percentage');
  const callCountFromModel = callCountFromModelResponse.data.call_count;
  console.log(callCountFromModelResponse)
  // Calculate the difference in percentages  
  const proposedPercentageChange = proposedCountFromAPI - callCountFromModelResponse.data.proposed_count;
  const approvedPercentageChange = approvedCountFromAPI - callCountFromModelResponse.data.approved_count;
  const joinedPercentageChange = joinedCountFromAPI - callCountFromModelResponse.data.joined_count;
  const rejectedPercentageChange = rejectedCountFromAPI - callCountFromModelResponse.data.rejected_count;

  // Display the percentage changes
  document.getElementById('proposedPercentageChange').innerText = Math.abs(proposedPercentageChange)
  document.getElementById('approvedPercentageChange').innerText = Math.abs(approvedPercentageChange)
  document.getElementById('joinedPercentageChange').innerText = Math.abs(joinedPercentageChange)
  document.getElementById('rejectedPercentageChange').innerText = Math.abs(rejectedPercentageChange)


  // Update the UI with the percentage changes (You'll have to adapt this part based on your UI structure)
  // For example:
  document.getElementById('proposedCount').innerText = proposedCountFromAPI;
  document.getElementById('approvedCount').innerText = approvedCountFromAPI;
  document.getElementById('joinedCount').innerText = joinedCountFromAPI;
  document.getElementById('rejectedCount').innerText = rejectedCountFromAPI;

  // Update the UI based on the percentage changes (You'll have to adapt this part based on your UI structure)
  // For example:
  // Update the color of the arrow based on the value of percentageChange
  const proposedArrowIcon = document.getElementById('proposedArrowIcon');
  const approvedArrowIcon = document.getElementById('approvedArrowIcon');
  const joinedArrowIcon = document.getElementById('joinedArrowIcon');
  const rejectedArrowIcon = document.getElementById('rejectedArrowIcon');

  if (proposedPercentageChange > 0) {
    proposedArrowIcon.className = 'bx bx-up-arrow-alt text-success'; // Green arrow
} else if (proposedPercentageChange < 0) {
    proposedArrowIcon.className = 'bx bx-down-arrow-alt text-danger'; // Red arrow
} else {
    proposedArrowIcon.className = 'bx bx-minus text-secondary'; // Grey arrow
}


 if (approvedPercentageChange > 0) {
  approvedArrowIcon.className = 'bx bx-up-arrow-alt text-success'; // Green arrow
} else if (approvedPercentageChange < 0) {
  approvedArrowIcon.className = 'bx bx-down-arrow-alt text-danger'; // Red arrow
} else {
  approvedArrowIcon.className = 'bx bx-minus text-secondary'; // Grey arrow
}


if (joinedPercentageChange > 0) {
  joinedArrowIcon.className = 'bx bx-up-arrow-alt text-success'; // Green arrow
} else if (joinedPercentageChange < 0) {
  joinedArrowIcon.className = 'bx bx-down-arrow-alt text-danger'; // Red arrow
} else {
  joinedArrowIcon.className = 'bx bx-minus text-secondary'; // Grey arrow
}


if (rejectedPercentageChange > 0) {
  rejectedArrowIcon.className = 'bx bx-up-arrow-alt text-success'; // Green arrow
} else if (rejectedPercentageChange < 0) {
  rejectedArrowIcon.className = 'bx bx-down-arrow-alt text-danger'; // Red arrow
} else {
  rejectedArrowIcon.className = 'bx bx-minus text-secondary'; // Grey arrow
}
  // Similarly, do for approved, joined, and rejected counts.

} catch (error) {
  console.error('Error fetching status count:', error);
}


// Call the function to fetch percentage change
  const userDisplay = document.getElementById("user_name");
  userDisplay.innerHTML += localStorage.getItem('username');
  const hasUserManagement = decodedToken.userManagement;
  const vendorManagement = decodedToken.vendorManagement;
  const staff = decodedToken.staff
  console.log(staff)
  // console.log(vendorManagement);
  const userGroup = decodedToken.userGroup;
  // console.log(userGroup)
  if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
  }
  if (vendorManagement) {
    document.getElementById('vendorManagementSection').style.display = 'block';
    document.getElementById('vendorManagementSections').style.display = 'block';
  }
//  if(staff)
//  {
//   document.getElementById('settingsContainer').style.display = 'none';
//  }
  // Hide spinner after everything is done
  document.getElementById('spinner').style.display = 'none';
  await fetchCandidates();
  await fetchAndLogRankCounts();
  await fetchAndGenerateRankChart()

  function getFirstLetterFromName() {
    return decodedToken.userName.charAt(0).toUpperCase();
}

// Function to get a color based on the first character of the user's name
function getColorFromName() {
    const colors = ["#FF5733", "#33FFB8", "#3388FF", "#FF33E9", "#7D33FF", "#33FFD6", "#FFE333"];
    const charCode = decodedToken.userName.charCodeAt(0);
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
}

// Render initials and background color
const userAvatar = document.getElementById('user-avatar');
userAvatar.innerHTML = `<span class="initials">${getFirstLetterFromName()}</span>`;
userAvatar.style.backgroundColor = getColorFromName();

const userAvatar1 = document.getElementById('user-avatar1');
userAvatar1.innerHTML = `<span class="initials">${getFirstLetterFromName()}</span>`;
userAvatar1.style.backgroundColor = getColorFromName();

document.getElementById('user-group').textContent = decodedToken.userGroup

});
const fetchAndGenerateRankChart = async () => {
  try {
    // Make an HTTP GET request to your server endpoint
    const response = await axios.get('https://nemo.ivistaz.co/candidate/getGraph',{headers:{"Authorization":token}});
    
    // Extract rankCounts from the response data
    const rankCounts = response.data.rankCounts;
    
    // Generate doughnut chart with the retrieved data
    generateDoughnutChart(rankCounts);
  } catch (error) {
    console.error('Error fetching rank counts:', error);
  }
};


function generateDoughnutChart(rankCounts) {
  // Sort the rank counts by count in descending order
  const sortedRankCounts = rankCounts.sort((a, b) => b.count - a.count);

  // Select top 5 ranks or less if there are fewer than 5 ranks
  const topRankCounts = sortedRankCounts.slice(0, 5);

  const rankLabels = topRankCounts.map(rank => `${rank.c_rank} : ${rank.count}`);
  const rankData = topRankCounts.map(rank => rank.count);

  const totalCount = rankCounts.reduce((total, rank) => total + rank.count, 0);

  const rankChartsContainer = document.getElementById('rankCharts');
  rankChartsContainer.innerHTML = '<canvas id="rankDoughnutChart"></canvas>';

  const rankDoughnutChartCanvas = document.getElementById('rankDoughnutChart').getContext('2d');
  

  new Chart(rankDoughnutChartCanvas, {
      type: 'doughnut',
      data: {
          labels: rankLabels,
          datasets: [{
              label: 'Rank Counts',
              data: rankData,
              backgroundColor:['#00222F', 'rgba(39, 139, 222, 0.6)', 'rgba(0, 149, 211, 0.6)', '#008E9C', 'rgba(0, 153, 204, 0.6)']
,
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
              display: true,
              position: 'right'
          },
          title: {
              display: true,
              text: `Top 5 Candidate Ranks`,
              fontSize: 18,
              padding: 20,
              fontStyle: 'normal', // Ensure the total count is not italicized
              fontColor: '#333', // Specify the color for the total count
              // Add custom function to generate the title text
              text: (tooltipItems) => {
                const tooltipItem = tooltipItems[0]; // Just using the first item from the tooltip
                return [
                  `Top 5 Candidate Ranks`,
                  `Total: ${totalCount}`
                ];
              },
          },
          layout: {
              padding: {
                  left: 20,
                  right: 20,
                  top: 20,
                  bottom: 20
              }
          }
      }
  });
  
}









const fetchAndLogRankCounts = async () => {
  try {
    // Make an HTTP GET request to your server endpoint
    const response = await axios.get('https://nemo.ivistaz.co/candidate/getGraph',{headers:{"Authorization":token}});
    
    // Extract rankCounts from the response data
    const rankCounts = response.data.rankCounts;
    
    // Log the output
    // console.log("Rank Counts:");
    // rankCounts.forEach(rank => {
    //   console.log(`Rank: ${rank.c_rank}, Count: ${rank.count}`);
    // });
  } catch (error) {
    console.error('Error fetching rank counts:', error);
  }
};

// Call the function





const token = localStorage.getItem('token'); // Get the JWT token from storage
const decodedToken = decodeToken(token);
const userRole = decodedToken.userGroup; // Assuming your user role is stored in userGroup
const hasUserManagement = decodedToken.userManagement; // Assuming userManagement is a boolean in the JWT payload
const hasReport = decodedToken.reports
const ReadOnly = decodedToken.readOnly
const WriteOnly = decodedToken.Write
const master_create = decodedToken.master_create
console.log(decodedToken)
// console.log(userRole,'UM :', hasUserManagement,"R :", ReadOnly,"W :",WriteOnly)



document.getElementById("logout").addEventListener("click", function() {
  // Display the modal with initial message
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
  
  // Send request to update logged status to false
  const userId = localStorage.getItem('userId');
  if (userId) {
    axios.put(`https://nemo.ivistaz.co/user/${userId}/logout`)
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


async function fetchCandidates() {
  try {
      const response = await axios.get('https://nemo.ivistaz.co/candidate/getCount', {
          headers: { "Authorization": token }
      });
      const { activeCount, inactiveCount } = response.data;
      // console.log('Active Count:', activeCount);
      // console.log('Inactive Count:', inactiveCount);
      document.getElementById('activeCount').innerHTML = activeCount;
      document.getElementById('inactiveCount').innerHTML = inactiveCount;
      return { activeCount, inactiveCount };
  } catch (error) {
      console.error('Error fetching candidate details counts:', error);
      return { activeCount: 0, inactiveCount: 0 }; // Return default values in case of error
  }
}








// Call the function to fetch and generate rank chart


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
// Function to determine whether it's day or night
function isDayTime() {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  return hours >= 6 && hours < 18; // Assume day time is between 6 AM and 6 PM
}

// Function to set the icon based on day or night
function setIcon() {
  const iconElement = document.getElementById('icon');
  const isDay = isDayTime();
  if (isDay) {
      iconElement.classList.add('bx-sun');
      iconElement.classList.remove('bx-moon');
  } else {
      iconElement.classList.add('bx-moon');
      iconElement.classList.remove('bx-sun');
  }
}

// Call setIcon function initially
setIcon();
