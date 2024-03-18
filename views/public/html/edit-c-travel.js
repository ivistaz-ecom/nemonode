const token = localStorage.getItem('token')
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
    
            const portAgentResponse = await axios.get("http://nemonode.ivistaz.co:8000/others/view-port-agent", { headers: { "Authorization": token } });
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

        // Get the dropdown items
        let dropdownItems = document.querySelectorAll(".dropdown-item");

        
        // Add click event listener to each dropdown item
        dropdownItems.forEach(function (item) {
            item.addEventListener("click", function () {
                // Get the id attribute of the clicked item
                var itemId = item.id;
                const memId = localStorage.getItem('memId');
                // Define the destination URLs based on the clicked item
                var destinationPage = "";
                switch (itemId) {
                    case "personnel":
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
              travel_amount: document.getElementById('travel_amount').value,
          };

          // Make a request to update the travel data
          const updateResponse = await axios.put(`http://nemonode.ivistaz.co:8000/candidate/update-travel/${travelId}`, updatedTravelData, { headers: { "Authorization": token } });
          
          // Handle the response, e.g., show a success message or redirect to another page
          console.log(updateResponse);
      } catch (err) {
          console.error(err);
  }})

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