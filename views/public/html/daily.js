document.addEventListener('DOMContentLoaded',async ()=>{
  const token = localStorage.getItem('token')
  try {
    const response = await axios.get('https://nemo.ivistaz.co/candidate/signups');
    const signupCount = response.data.signupCount;
    console.log(response)
    document.getElementById('signupCount').innerText = signupCount;
  } catch (error) {
    console.error('Error fetching signup count:', error);
    document.getElementById('signupCount').innerText = 'Error';
  }
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
    const callCountResponse = await axios.get('https://nemo.ivistaz.co/candidate/call-count', { headers: { "Authorization": token } });
    const statusCountResponse = await axios.get('https://nemo.ivistaz.co/candidate/statuscount', { headers: { "Authorization": token } });
    const callCountFromModelResponse = await axios.get('https://nemo.ivistaz.co/candidate/percentage', { headers: { "Authorization": token } });
  
    const callCountData = callCountResponse.data;
    const statusCountData = statusCountResponse.data.counts[0];
    const percentageData = callCountFromModelResponse.data;
  

    updateCallCounts(callCountData, percentageData, elements);
    updateStatusCounts(statusCountData, percentageData, elements);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const decodedToken = decodeToken(token);
  updateDateTime(elements.datetime);
  setInterval(() => updateDateTime(elements.datetime), 1000);


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

  try {
    const response = await axios.get('https://nemo.ivistaz.co/candidate/signondaily');
    console.log('Sign on',response)
    const candidates = response.data.candidates ;
    const contractsDiv = document.getElementById('contracts');
    
      const candidateElement = document.createElement('div');
      candidateElement.innerText = JSON.stringify(candidates);
      contractsDiv.appendChild(candidateElement);
    
  } catch (error) {
    console.error('Error fetching contracts:', error);
    document.getElementById('contracts').innerText = 'Error fetching contracts';
  }

})
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
  function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }
  function updateDateTime(element) {
    const now = new Date();
  
    // Format time
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedTime = now.toLocaleTimeString('en-IN', options);
  
    // Get day of the week
    const dayOfWeek = now.toLocaleDateString('en-IN', { weekday: 'long' });
  
    // Update the element's text content
    element.textContent = `Indian Time: ${formattedTime}, ${dayOfWeek}`;
  }