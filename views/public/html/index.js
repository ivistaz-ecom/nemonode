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
    callCount: document.getElementById('callCount'),
    datetime: document.getElementById('datetime'),
    icon: document.querySelector('link[rel="icon"]')
  };

  showSkeletonLoading(elements);

  try {
    const [
      discussionCountsResponse,
      callCountResponse,
      statusCountResponse,
      candidateCountsResponse,
      rankCountsResponse
    ] = await Promise.all([
      axios.get('https://nsnemo.com/candidate/discussion-count', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/call-count', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/statuscount', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/getCount', { headers: { "Authorization": token } }),
      axios.get('https://nsnemo.com/candidate/getGraph', { headers: { "Authorization": token } })
    ]);

    hideSkeletonLoading(elements);

    const discussionCountsData = discussionCountsResponse.data;
    const callCountData = callCountResponse.data;
    const statusCountData = statusCountResponse.data.counts[0];
    const rankCounts = rankCountsResponse.data.rankCounts;
    const candidateCounts = candidateCountsResponse.data;

    updateDiscussionCounts(discussionCountsData, elements);
    updateCallCounts(callCountData, elements);
    updateStatusCounts(statusCountData, elements);
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
  
  if (decodedToken.userManagement) {
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

  function updateCallCounts(callCountData, elements) {
    const callCountFromAPI = callCountData.call_count;

    if (elements.callCount) {
      elements.callCount.textContent = callCountFromAPI;
      elements.callCount.className = 'text-dark';
    } else {
      console.error('Call count element is missing in the DOM.');
    }
  }

  function updateStatusCounts(statusCountData, elements) {
    elements.proposedCount.textContent = statusCountData.proposed_count;
    elements.approvedCount.textContent = statusCountData.approved_count;
    elements.joinedCount.textContent = statusCountData.joined_count;
    elements.rejectedCount.textContent = statusCountData.rejected_count;
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
          padding: { left: 40, right: 40, top: 0, bottom: 40 }
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
    window.location.href = '../index.html';
  }, 1500);
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


document.getElementById("logout").addEventListener("click", function() {
  // Display the modal with initial message
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
  
  // Send request to update logged status to false
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
  
  // Change the message and spinner after a delay
  setTimeout(function() {
      document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
  }, 1000);

  // Redirect after another delay
  setTimeout(function() {
      window.location.href = "loginpage.html";
  }, 2000);
});