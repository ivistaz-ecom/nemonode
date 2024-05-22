// document.addEventListener('DOMContentLoaded', async function () {
//   const token = localStorage.getItem('token');

//   const elements = {
//     userName: document.getElementById('user_name'),
//     userAvatar: document.getElementById('user-avatar'),
//     userAvatar1: document.getElementById('user-avatar1'),
//     userGroup: document.getElementById('user-group'),
//     activeCount: document.getElementById('activeCount'),
//     inactiveCount: document.getElementById('inactiveCount'),
//     rankCharts: document.getElementById('rankCharts'),
//     proposedCount: document.getElementById('proposedCount'),
//     approvedCount: document.getElementById('approvedCount'),
//     joinedCount: document.getElementById('joinedCount'),
//     rejectedCount: document.getElementById('rejectedCount'),
//     proposedPercentageChange: document.getElementById('proposedPercentageChange'),
//     approvedPercentageChange: document.getElementById('approvedPercentageChange'),
//     joinedPercentageChange: document.getElementById('joinedPercentageChange'),
//     rejectedPercentageChange: document.getElementById('rejectedPercentageChange'),
//     proposedArrowIcon: document.getElementById('proposedArrowIcon'),
//     approvedArrowIcon: document.getElementById('approvedArrowIcon'),
//     joinedArrowIcon: document.getElementById('joinedArrowIcon'),
//     rejectedArrowIcon: document.getElementById('rejectedArrowIcon'),
//     callCount: document.getElementById('callCount'),
//     percentageChange: document.getElementById('percentageChange'),
//     arrowIcon: document.getElementById('arrowIcon'),
//     datetime: document.getElementById('datetime'),
//     icon: document.querySelector('link[rel="icon"]')
//   };

//   try {
//     const [
//       discussionCountsResponse,
//       callCountResponse,
//       statusCountResponse,
//       callCountFromModelResponse,
//       rankCountsResponse,
//       candidateCountsResponse
//     ] = await Promise.all([
//       axios.get('https://nemo.ivistaz.co/candidate/discussion-count', { headers: { "Authorization": token } }),
//       axios.get('https://nemo.ivistaz.co/candidate/call-count', { headers: { "Authorization": token } }),
//       axios.get('https://nemo.ivistaz.co/candidate/statuscount', { headers: { "Authorization": token } }),
//       axios.get('https://nemo.ivistaz.co/candidate/percentage', { headers: { "Authorization": token } }),
//       axios.get('https://nemo.ivistaz.co/candidate/getGraph', { headers: { "Authorization": token } }),
//       axios.get('https://nemo.ivistaz.co/candidate/getCount', { headers: { "Authorization": token } })
//     ]);

//     const discussionCountsData = discussionCountsResponse.data;
//     const callCountData = callCountResponse.data;
//     const statusCountData = statusCountResponse.data.counts[0];
//     const percentageData = callCountFromModelResponse.data;
//     const rankCounts = rankCountsResponse.data.rankCounts;
//     const candidateCounts = candidateCountsResponse.data;

//     updateDiscussionCounts(discussionCountsData, elements);
//     updateCallCounts(callCountData, percentageData, elements);
//     updateStatusCounts(statusCountData, percentageData, elements);
//     fetchAndGenerateRankChart(rankCounts);
//     updateCandidatesCounts(candidateCounts, elements);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }

//   const decodedToken = decodeToken(token);
//   updateUserDetails(decodedToken, elements);
//   updateDateTime(elements.datetime);
//   setInterval(() => updateDateTime(elements.datetime), 1000);
//   setIcon(elements.icon);

//   document.getElementById("logout").addEventListener("click", function () {
//     var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
//     myModal.show();
    
//     const userId = localStorage.getItem('userId');
//     if (userId) {
//       axios.put(`https://nemo.ivistaz.co/user/${userId}/logout`)
//         .then(response => {
//           console.log('Logged out successfully');
//         })
//         .catch(error => {
//           console.error('Error logging out:', error);
//         });
//     } else {
//       console.error('User ID not found in localStorage');
//     }

//     localStorage.clear();
    
//     setTimeout(function () {
//       document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
//     }, 1000);

//     setTimeout(function () {
//       window.location.href = "loginpage.html";
//     }, 2000);
//   });

//   function decodeToken(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace('-', '+').replace('_', '/');
//     return JSON.parse(atob(base64));
//   }

//   function updateDiscussionCounts(discussionCountsData, elements) {
//     const quarters = discussionCountsData.map(quarterData => `Quarter ${quarterData.quarter} (${new Date().getFullYear()})`);
//     const proposedCounts = discussionCountsData.map(quarterData => quarterData.proposedCount);
//     const approvedCounts = discussionCountsData.map(quarterData => quarterData.approvedCount);
//     const joinedCounts = discussionCountsData.map(quarterData => quarterData.joinedCount);

//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     const discussionCountsList = document.getElementById('discussionCounts');
//     discussionCountsList.appendChild(canvas);

//     new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: quarters,
//         datasets: [
//           { label: 'Proposed', data: proposedCounts, backgroundColor: '#00222F' },
//           { label: 'Approved', data: approvedCounts, backgroundColor: 'rgba(54, 162, 235, 0.5)' },
//           { label: 'Joined', data: joinedCounts, backgroundColor: '#008E9C' }
//         ]
//       },
//       options: {
//         scales: { y: { beginAtZero: true } },
//         plugins: {
//           tooltip: {
//             enabled: true,
//             mode: 'index',
//             intersect: false,
//             callbacks: {
//               label: function (context) {
//                 var label = context.dataset.label || '';
//                 if (label) label += ': ';
//                 if (context.parsed.y !== null) label += context.parsed.y;
//                 return label;
//               }
//             }
//           }
//         }
//       }
//     });
//   }

//   function updateCallCounts(callCountData, percentageData, elements) {
//     const callCountFromAPI = callCountData.call_count;
//     const callCountFromModel = percentageData.call_count;
//     const percentageChange = callCountFromAPI - callCountFromModel;

//     if (elements.callCount && elements.percentageChange && elements.arrowIcon) {
//       elements.callCount.textContent = callCountFromAPI;
//       elements.callCount.className = 'text-dark';

//       elements.percentageChange.textContent = `${Math.abs(percentageChange)}`;

//       if (percentageChange > 0) {
//         elements.arrowIcon.className = 'bx bx-up-arrow-alt text-success';
//       } else if (percentageChange < 0) {
//         elements.arrowIcon.className = 'bx bx-down-arrow-alt text-danger';
//       } else {
//         elements.arrowIcon.className = 'bx bx-minus text-secondary';
//       }
//     } else {
//       console.error('One or more elements are missing in the DOM.');
//     }
//   }

//   function updateStatusCounts(statusCountData, percentageData, elements) {
//     const proposedPercentageChange = statusCountData.proposed_count - percentageData.proposed_count;
//     const approvedPercentageChange = statusCountData.approved_count - percentageData.approved_count;
//     const joinedPercentageChange = statusCountData.joined_count - percentageData.joined_count;
//     const rejectedPercentageChange = statusCountData.rejected_count - percentageData.rejected_count;

//     elements.proposedCount.textContent = statusCountData.proposed_count;
//     elements.approvedCount.textContent = statusCountData.approved_count;
//     elements.joinedCount.textContent = statusCountData.joined_count;
//     elements.rejectedCount.textContent = statusCountData.rejected_count;

//     updateArrowIcon(elements.proposedArrowIcon, elements.proposedPercentageChange, proposedPercentageChange);
//     updateArrowIcon(elements.approvedArrowIcon, elements.approvedPercentageChange, approvedPercentageChange);
//     updateArrowIcon(elements.joinedArrowIcon, elements.joinedPercentageChange, joinedPercentageChange);
//     updateArrowIcon(elements.rejectedArrowIcon, elements.rejectedPercentageChange, rejectedPercentageChange);
//   }

//   function updateArrowIcon(arrowIconElement, percentageChangeElement, percentageChange) {
//     percentageChangeElement.textContent = Math.abs(percentageChange);

//     if (percentageChange > 0) {
//       arrowIconElement.className = 'bx bx-up-arrow-alt text-success';
//     } else if (percentageChange < 0) {
//       arrowIconElement.className = 'bx bx-down-arrow-alt text-danger';
//     } else {
//       arrowIconElement.className = 'bx bx-minus text-secondary';
//     }
//   }

//   function updateCandidatesCounts(candidateCounts, elements) {
//     elements.activeCount.textContent = candidateCounts.activeCount;
//     elements.inactiveCount.textContent = candidateCounts.inactiveCount;
//   }

//   async function fetchAndGenerateRankChart (rankCount){
//     try {
//       const rankCounts1 = rankCount
//       // Make an HTTP GET request to your server endpoint
//       const response = await axios.get('https://nemo.ivistaz.co/candidate/getGraph',{headers:{"Authorization":token}});
      
//       // Extract rankCounts from the response data
//       const rankCounts = response.data.rankCounts;
      
//       // Generate doughnut chart with the retrieved data
//       generateDoughnutChart(rankCounts1);
//     } catch (error) {
//       console.error('Error fetching rank counts:', error);
//     }
//   };
  
  
//   function generateDoughnutChart(rankCounts) {
//     // Sort the rank counts by count in descending order
//     const sortedRankCounts = rankCounts.sort((a, b) => b.count - a.count);
  
//     // Select top 5 ranks or less if there are fewer than 5 ranks
//     const topRankCounts = sortedRankCounts.slice(0, 5);
  
//     const rankLabels = topRankCounts.map(rank => `${rank.c_rank} : ${rank.count}`);
//     const rankData = topRankCounts.map(rank => rank.count);
  
//     const totalCount = rankCounts.reduce((total, rank) => total + rank.count, 0);
  
//     const rankChartsContainer = document.getElementById('rankCharts');
//     rankChartsContainer.innerHTML = '<canvas id="rankDoughnutChart"></canvas>';
  
//     const rankDoughnutChartCanvas = document.getElementById('rankDoughnutChart').getContext('2d');
    
  
//     new Chart(rankDoughnutChartCanvas, {
//         type: 'doughnut',
//         data: {
//             labels: rankLabels,
//             datasets: [{
//                 label: 'Rank Counts',
//                 data: rankData,
//                 backgroundColor:['#00222F', 'rgba(39, 139, 222, 0.6)', 'rgba(0, 149, 211, 0.6)', '#008E9C', 'rgba(0, 153, 204, 0.6)']
//   ,
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             legend: {
//                 display: true,
//                 position: 'right'
//             },
//             title: {
//                 display: true,
//                 text: `Top 5 Candidate Ranks`,
//                 fontSize: 18,
//                 padding: 20,
//                 fontStyle: 'normal', // Ensure the total count is not italicized
//                 fontColor: '#333', // Specify the color for the total count
//                 // Add custom function to generate the title text
//                 text: (tooltipItems) => {
//                   const tooltipItem = tooltipItems[0]; // Just using the first item from the tooltip
//                   return [
//                     `Top 5 Candidate Ranks`,
//                     `Total: ${totalCount}`
//                   ];
//                 },
//             },
//             layout: {
//                 padding: {
//                     left: 20,
//                     right: 20,
//                     top: 20,
//                     bottom: 20
//                 }
//             },
//             animation: {
//               duration: 0, // Disable animation
//           },
//         }
        
//     });
    
//   }
  
  

//   function updateUserDetails(decodedToken, elements) {
//     elements.userName.textContent = decodedToken.userName;
//     if(decodedToken.staff)
//     {
//       elements.userGroup.textContent='Member Staff'
//     }
//     else
//     elements.userGroup.textContent = decodedToken.userGroup;
//   }

//   function updateDateTime(datetimeElement) {
//     const now = new Date();
//     datetimeElement.textContent = now.toLocaleString();
//   }

//   function setIcon(iconElement) {
//     iconElement.href = 'path_to_icon';
//   }
  
//   const datetimeElement = document.getElementById('datetime');
//   if (datetimeElement) {
//     updateDateTime(datetimeElement);
//     setInterval(() => updateDateTime(datetimeElement), 1000);
//   } else {
//     console.error('Element with id "datetime" not found.');
//   }
// });

// function updateDateTime(element) {
//   const now = new Date();
//   console.log(now)
//   const formattedDate = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
//   const formattedTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//   element.textContent = `${formattedDate} ${formattedTime}`;
// }

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

  try {
    const [
      discussionCountsResponse,
      callCountResponse,
      statusCountResponse,
      callCountFromModelResponse,
      rankCountsResponse,
      candidateCountsResponse
    ] = await Promise.all([
      axios.get('https://nemo.ivistaz.co/candidate/discussion-count', { headers: { "Authorization": token } }),
      axios.get('https://nemo.ivistaz.co/candidate/call-count', { headers: { "Authorization": token } }),
      axios.get('https://nemo.ivistaz.co/candidate/statuscount', { headers: { "Authorization": token } }),
      axios.get('https://nemo.ivistaz.co/candidate/percentage', { headers: { "Authorization": token } }),
      axios.get('https://nemo.ivistaz.co/candidate/getGraph', { headers: { "Authorization": token } }),
      axios.get('https://nemo.ivistaz.co/candidate/getCount', { headers: { "Authorization": token } })
    ]);

    const discussionCountsData = discussionCountsResponse.data;
    const callCountData = callCountResponse.data;
    const statusCountData = statusCountResponse.data.counts[0];
    const percentageData = callCountFromModelResponse.data;
    const rankCounts = rankCountsResponse.data.rankCounts;
    const candidateCounts = candidateCountsResponse.data;

    updateDiscussionCounts(discussionCountsData, elements);
    updateCallCounts(callCountData, percentageData, elements);
    updateStatusCounts(statusCountData, percentageData, elements);
    fetchAndGenerateRankChart(rankCounts);
    updateCandidatesCounts(candidateCounts, elements);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const decodedToken = decodeToken(token);
  updateUserDetails(decodedToken, elements);
  updateDateTime(elements.datetime);
  setInterval(() => updateDateTime(elements.datetime), 1000);
  setIcon(elements.icon);

  document.getElementById("logout").addEventListener("click", function () {
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
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
    
    setTimeout(function () {
      document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
    }, 1000);

    setTimeout(function () {
      window.location.href = "loginpage.html";
    }, 2000);
  });

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
        animation: {
          duration: 0, // Disable animation
      },
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

  async function fetchAndGenerateRankChart (rankCount){
    try {
      const rankCounts1 = rankCount
      // Make an HTTP GET request to your server endpoint
      // const response = await axios.get('https://nemo.ivistaz.co/candidate/getGraph',{headers:{"Authorization":token}});
      
      // // Extract rankCounts from the response data
      // const rankCounts = response.data.rankCounts;
      
      // Generate doughnut chart with the retrieved data
      generateDoughnutChart(rankCounts1);
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
            },
            animation: {
              duration: 0, // Disable animation
          },
        }
        
    });
    
  }
  
  

  function updateUserDetails(decodedToken, elements) {
    elements.userName.textContent = decodedToken.userName;
    if(decodedToken.staff)
    {
      elements.userGroup.textContent='Member Staff'
    }
    else
    elements.userGroup.textContent = decodedToken.userGroup;
  }

  function updateDateTime(datetimeElement) {
    const now = new Date();
    datetimeElement.textContent = now.toLocaleString();
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
  console.log(now)
  const formattedDate = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  element.textContent = `${formattedDate} ${formattedTime}`;
}
