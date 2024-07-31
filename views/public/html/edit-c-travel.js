// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page
alert('Please login to continue using Nemo');

  window.location.href = './loginpage.html';
}

let travelId;
document.addEventListener('DOMContentLoaded', async function () {
    try {
            // Get the URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id')
            console.log(id)
            travelId=id;
            // Retrieve values using the parameter names
            const travel_date = urlParams.get('travel_date');
            const travel_from = urlParams.get('travel_from');
            const travel_to = urlParams.get('travel_to');
            const travel_mode = urlParams.get('travel_mode');
            const travel_status = urlParams.get('travel_status');
            const ticket_number = urlParams.get('ticket_number');
            const agent_name = urlParams.get('agent_name');
            const portAgent = urlParams.get('portAgent');
            const travel_amount = urlParams.get('travel_amount');
            const reason = urlParams.get('reason');
            const created_by = urlParams.get('created_by');

            // Set the values in the input fields
            document.getElementById('travel_date').value = formatDate(travel_date)
            document.getElementById('travel_from').value = travel_from;
            document.getElementById('travel_to').value = travel_to;
            document.getElementById('travel_mode').value = travel_mode;
            document.getElementById('travel_status').value = travel_status;
            document.getElementById('travel_ticket').value = ticket_number;
            document.getElementById('travel_agent_name').value = agent_name;
            // If 'portAgent' is an option in the dropdown, set its value
                document.getElementById('travel_port_agent').value = portAgent;
            
                document.getElementById('travel_amount').value = travel_amount;
                document.getElementById('reason').value = reason;
                document.getElementById('created_by').value = created_by;
    
            const portAgentResponse = await axios.get("https://nemo.ivistaz.co/others/view-port-agent", { headers: { "Authorization": token } });
            const portAgents = portAgentResponse.data.portAgents;
            console.log(portAgentResponse,portAgents)
            const portAgentname = portAgents.map(pa => pa.portAgentName);
            const portAgentDropdowns = document.getElementById('travel_port_agent');
            portAgentDropdowns.innerHTML = '';
            for (let i = 0; i < portAgentname.length; i++) {
                const option = document.createElement('option');
                option.value = portAgentname[i];
                option.text = portAgentname[i];
                portAgentDropdowns.appendChild(option);
               
                
            }
            portAgentDropdowns.value=portAgent
            console.log(portAgent)
        // Get the dropdown items
        let dropdownItems = document.querySelectorAll(".dropdown-item");

        
        // Add click event listener to each dropdown item
        dropdownItems.forEach(function (item) {
            item.addEventListener("click", function () {
                // Get the id attribute of the clicked item
                var itemId = item.id;
                const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const memId = urlParams.get('memId');
                // Define the destination URLs based on the clicked item
                var destinationPage = "";
                switch (itemId) {
                    case "personal":
                        destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                        break;
                    case "discussion":
                        destinationPage = `./edit-discussion.html?memId=${memId}`;
                        break;
                    case "contract":
                        destinationPage = `./add-c-contract.html?memId=${memId}`;
                        break;
                    case "document":
                        destinationPage = `./add-c-document.html?memId=${memId}`;
                        break;
                    case "bank":
                        destinationPage = `./add-c-bank.html?memId=${memId}`;
                        break;
                    case "travel":
                        destinationPage = `./add-c-travel.html?memId=${memId}`;
                        break;
                    case "medicals":
                        destinationPage = `./add-c-medicals.html?memId=${memId}`;
                        break;
                    case "nkd":
                        destinationPage = `./add-c-nkd.html?memId=${memId}`;
                        break;
                        case 'seaservice':
                        destinationPage=`./seaservicetable.html?memId=${memId};`;
                        break;
                    default:
                        // Handle default case or do nothing
                        break;
                }

                // Redirect to the destination page
                if (destinationPage !== "") {
                    window.location.href = destinationPage;
                }
            });
        });

        
    } catch (err) {
        console.error(err);
    }
});


function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  const updateForm = document.getElementById('travelForm');
  updateForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      try {
          // Collect updated values
          const updatedTravelData = {
              travel_date: document.getElementById('travel_date').value,
              travel_from: document.getElementById('travel_from').value,
              travel_to: document.getElementById('travel_to').value,
              travel_mode: document.getElementById('travel_mode').value,
              travel_status: document.getElementById('travel_status').value,
              ticket_number: document.getElementById('travel_ticket').value,
              agent_name: document.getElementById('travel_agent_name').value,
              portAgent: document.getElementById('travel_port_agent').value,
              reason: document.getElementById('reason').value,
              created_by: document.getElementById('created_by').value,
          };   

          // Make a request to update the travel data
          const updateResponse = await axios.put(`https://nemo.ivistaz.co/candidate/update-travel/${travelId}`, updatedTravelData, { headers: { "Authorization": token } });
          
          const urlParams = new URLSearchParams(window.location.search);
    
            // Get the candidateId from the URL parameter
            const memId = urlParams.get('memId');
            alert('Updated successfully!')
        viewCandidate(memId)
          // Handle the response, e.g., show a success message or redirect to another page
      } catch (err) {
          console.error(err);
  }})

  function viewCandidate(id) {
    // Add your view logic here
    window.location.href=`./view-candidate.html?id=${id}`;

}
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