document.addEventListener('DOMContentLoaded', async function () {
  const token = localStorage.getItem('token');


  const elements = {
    userName: document.getElementById('user_name'),
    userAvatar: document.getElementById('user-avatar'),
    userAvatar1: document.getElementById('user-avatar1'),
    userGroup: document.getElementById('user-group'),
    activeCount: document.getElementById('activeCount'),
    inactiveCount: document.getElementById('inactiveCount'),
    rankCharts: document.getElementById('rankCharts'),
    proposedCount: document.getElementById('proposedCount'),
    approvedCount: document.getElementById('approvedCount'),
    joinedCount: document.getElementById('joinedCount'),
    rejectedCount: document.getElementById('rejectedCount'),
    proposedPercentageChange: document.getElementById('proposedPercentageChange'),
    approvedPercentageChange: document.getElementById('approvedPercentageChange'),
    joinedPercentageChange: document.getElementById('joinedPercentageChange'),
    rejectedPercentageChange: document.getElementById('rejectedPercentageChange'),
    proposedArrowIcon: document.getElementById('proposedArrowIcon'),
    approvedArrowIcon: document.getElementById('approvedArrowIcon'),
    joinedArrowIcon: document.getElementById('joinedArrowIcon'),
    rejectedArrowIcon: document.getElementById('rejectedArrowIcon'),
    callCount: document.getElementById('callCount'),
    percentageChange: document.getElementById('percentageChange'),
    arrowIcon: document.getElementById('arrowIcon'),
    datetime: document.getElementById('datetime'),
    icon: document.querySelector('link[rel="icon"]')
  };

  showSkeletonLoading(elements);


  try {
    const [
      discussionCountsResponse,
      callCountResponse,
      statusCountResponse,
      callCountFromModelResponse,
      candidateCountsResponse,
      rankCountsResponse
    ] = await Promise.all([
      axios.get('https://nsnemo.com/candidate/discussion-count', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/call-count', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/statuscount', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/percentage', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/getCount', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/getGraph', { headers: { "Authorization": token } })
    ]);
    hideSkeletonLoading(elements);

    const discussionCountsData = discussionCountsResponse.data;
    const callCountData = callCountResponse.data;
    const statusCountData = statusCountResponse.data.counts[0];
    const percentageData = callCountFromModelResponse.data;
    const rankCounts = rankCountsResponse.data.rankCounts;
    const candidateCounts = candidateCountsResponse.data;

    updateDiscussionCounts(discussionCountsData, elements);
    updateCallCounts(callCountData, percentageData, elements);
    updateStatusCounts(statusCountData, percentageData, elements);
    generateDoughnutChart(rankCounts, elements.rankCharts);
    updateCandidatesCounts(candidateCounts, elements);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const decodedToken = decodeToken(token);
  updateUserDetails(decodedToken, elements);
  updateDateTime(elements.datetime);
  setInterval(() => updateDateTime(elements.datetime), 1000);
  setIcon(elements.icon);
  const hasUserManagement = decodedToken.userManagement;
const currentuserId = decodedToken.userId
console.log(currentuserId)
console.log(hasUserManagement)
if (hasUserManagement) {
  document.getElementById('userManagementSection').style.display = 'block';
  document.getElementById('userManagementSections').style.display = 'block';

}

  document.getElementById("logout").addEventListener("click", handleLogout);

  function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  function updateDiscussionCounts(discussionCountsData, elements) {
    const quarters = discussionCountsData.map(quarterData => `Quarter ${quarterData.quarter} (${new Date().getFullYear()})`);
    const proposedCounts = discussionCountsData.map(quarterData => quarterData.proposedCount);
    const approvedCounts = discussionCountsData.map(quarterData => quarterData.approvedCount);
    const joinedCounts = discussionCountsData.map(quarterData => quarterData.joinedCount);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const discussionCountsList = document.getElementById('discussionCounts');
    discussionCountsList.appendChild(canvas);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: quarters,
        datasets: [
          { label: 'Proposed', data: proposedCounts, backgroundColor: '#00222F' },
          { label: 'Approved', data: approvedCounts, backgroundColor: 'rgba(54, 162, 235, 0.5)' },
          { label: 'Joined', data: joinedCounts, backgroundColor: '#008E9C' }
        ]
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: {
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function (context) {
                var label = context.dataset.label || '';
                if (label) label += ': ';
                if (context.parsed.y !== null) label += context.parsed.y;
                return label;
              }
            }
          }
        },
        animation: { duration: 0 }
      }
    });
  }

  function updateCallCounts(callCountData, percentageData, elements) {
    const callCountFromAPI = callCountData.call_count;
    const callCountFromModel = percentageData.call_count;
    const percentageChange = callCountFromAPI - callCountFromModel;

    if (elements.callCount && elements.percentageChange && elements.arrowIcon) {
      elements.callCount.textContent = callCountFromAPI;
      elements.callCount.className = 'text-dark';
      elements.percentageChange.textContent = `${Math.abs(percentageChange)}`;

      if (percentageChange > 0) {
        elements.arrowIcon.className = 'bx bx-up-arrow-alt text-success';
      } else if (percentageChange < 0) {
        elements.arrowIcon.className = 'bx bx-down-arrow-alt text-danger';
      } else {
        elements.arrowIcon.className = 'bx bx-minus text-secondary';
      }
    } else {
      console.error('One or more elements are missing in the DOM.');
    }
  }

  function updateStatusCounts(statusCountData, percentageData, elements) {
    const proposedPercentageChange = statusCountData.proposed_count - percentageData.proposed_count;
    const approvedPercentageChange = statusCountData.approved_count - percentageData.approved_count;
    const joinedPercentageChange = statusCountData.joined_count - percentageData.joined_count;
    const rejectedPercentageChange = statusCountData.rejected_count - percentageData.rejected_count;

    elements.proposedCount.textContent = statusCountData.proposed_count;
    elements.approvedCount.textContent = statusCountData.approved_count;
    elements.joinedCount.textContent = statusCountData.joined_count;
    elements.rejectedCount.textContent = statusCountData.rejected_count;

    updateArrowIcon(elements.proposedArrowIcon, elements.proposedPercentageChange, proposedPercentageChange);
    updateArrowIcon(elements.approvedArrowIcon, elements.approvedPercentageChange, approvedPercentageChange);
    updateArrowIcon(elements.joinedArrowIcon, elements.joinedPercentageChange, joinedPercentageChange);
    updateArrowIcon(elements.rejectedArrowIcon, elements.rejectedPercentageChange, rejectedPercentageChange);
  }

  function updateArrowIcon(arrowIconElement, percentageChangeElement, percentageChange) {
    percentageChangeElement.textContent = Math.abs(percentageChange);

    if (percentageChange > 0) {
      arrowIconElement.className = 'bx bx-up-arrow-alt text-success';
    } else if (percentageChange < 0) {
      arrowIconElement.className = 'bx bx-down-arrow-alt text-danger';
    } else {
      arrowIconElement.className = 'bx bx-minus text-secondary';
    }
  }

  function updateCandidatesCounts(candidateCounts, elements) {
    elements.activeCount.textContent = candidateCounts.activeCount;
    elements.inactiveCount.textContent = candidateCounts.inactiveCount;
  }

  function generateDoughnutChart(rankCounts, rankChartsContainer) {
    const sortedRankCounts = rankCounts.sort((a, b) => b.count - a.count);
    const topRankCounts = sortedRankCounts.slice(0, 5);

    const rankLabels = topRankCounts.map(rank => `${rank.c_rank} : ${rank.count}`);
    const rankData = topRankCounts.map(rank => rank.count);
    const totalCount = rankCounts.reduce((total, rank) => total + rank.count, 0);

    rankChartsContainer.innerHTML = '<canvas id="rankDoughnutChart"></canvas>';
    const rankDoughnutChartCanvas = document.getElementById('rankDoughnutChart').getContext('2d');

    new Chart(rankDoughnutChartCanvas, {
      type: 'doughnut',
      data: {
        labels: rankLabels,
        datasets: [{
          label: 'Rank Counts',
          data: rankData,
          backgroundColor: ['#00222F', 'rgba(39, 139, 222, 0.6)', 'rgba(0, 149, 211, 0.6)', '#008E9C', 'rgba(0, 153, 204, 0.6)'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: true, position: 'right' },
        title: {
          display: true,
          text: `Top 5 Candidate Ranks\nTotal: ${totalCount}`,
          fontSize: 18,
          padding: 20,
          fontStyle: 'normal',
          fontColor: '#333'
        },
        layout: {
          padding: { left: 20, right: 20, top: 20, bottom: 20 }
        },
        animation: { duration: 0 }
      }
    });
  }

  function updateUserDetails(decodedToken, elements) {
    elements.userName.textContent = decodedToken.userName;
    elements.userGroup.textContent = decodedToken.staff ? 'Staff' : decodedToken.userGroup;
  }

  function setIcon(iconElement) {
    iconElement.href = 'path_to_icon';
  }

  const datetimeElement = document.getElementById('datetime');
  if (datetimeElement) {
    updateDateTime(datetimeElement);
    setInterval(() => updateDateTime(datetimeElement), 1000);
  } else {
    console.error('Element with id "datetime" not found.');
  }
});

function updateDateTime(element) {
  const now = new Date();
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedTime = now.toLocaleTimeString('en-IN', options);
  const dayOfWeek = now.toLocaleDateString('en-IN', { weekday: 'long' });

  element.textContent = `Indian Time: ${formattedTime}, ${dayOfWeek}`;
}

function handleLogout() {
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();

  const userId = localStorage.getItem('userId');
  if (userId) {
    axios.put(`https://nsnemo.com/user/${userId}/logout`)
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

  setTimeout(() => {
    document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
  }, 1000);

  setTimeout(() => {
    window.location.href = "loginpage.html";
  }, 2000);
}
function showSkeletonLoading() {
  const skeletonElements = document.getElementsByClassName('skeleton-loading');
  for (let i = 0; i < skeletonElements.length; i++) {
    skeletonElements[i].style.display = 'block';
  }
}

function hideSkeletonLoading() {
  const skeletonElements = document.getElementsByClassName('skeleton-loading');
  for (let i = 0; i < skeletonElements.length; i++) {
    skeletonElements[i].style.display = 'none';
  }
}

function updateIconBasedOnTime() {
  const icon = document.getElementById('icon');
  
  // Get the current hour
  const currentHour = new Date().getHours();
  
  // Check if it's daytime (6 AM to 6 PM)
  if (currentHour >= 6 && currentHour < 18) {
      icon.classList.add('bx-sun'); // Add sun icon class
      icon.classList.add('text-warning')
      icon.classList.remove('bx-moon'); // Remove moon icon class if present
  } else {
      icon.classList.add('bx-moon'); // Add moon icon class
      icon.classList.add('text-success')
      icon.classList.remove('bx-sun'); // Remove sun icon class if present
  }
}

// Call the function when the DOM is fully loaded
 updateIconBasedOnTime()
