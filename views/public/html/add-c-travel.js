function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token')

    const decodedToken = decodeToken(token);
    console.log(decodedToken)

const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
    const candidateId= localStorage.getItem('memId')
    const id = candidateId;
  
        document.getElementById('travelForm').addEventListener('submit', async function (event) {
            // Prevent the default form submission
            event.preventDefault();

            // Collect form data
            let travelDetails = {
                travel_date: document.getElementById('travel_date').value.trim(),
                travel_from: document.getElementById('travel_from').value.trim(),
                travel_to: document.getElementById('travel_to').value.trim(),
                travel_mode: document.getElementById('travel_mode').value.trim(),
                travel_status: document.getElementById('travel_status').value.trim(),
                ticket_number: document.getElementById('ticket_number').value.trim(),
                agent_name: document.getElementById('agent_name').value.trim(),
                portAgent: document.getElementById('portAgent').value.trim(),
                travel_amount: document.getElementById('travel_amount').value.trim(),
                reason: document.getElementById('reason').value.trim(),
                created_by:decodedToken.userId
            };

            try {
                // Make an Axios request to your backend API to add travel details
                const response = await axios.post(`https://nemonode.ivistaz.co/candidate/travel-details/${id}`,travelDetails, {headers:{"Authorization": token}});

                // Handle success response from the server
                console.log('Travel details added successfully:', response.data);
               await fetchAndDisplayTravelDetails()
                // Optionally, you can redirect or perform additional actions here
            } catch (error) {
                // Handle error response from the server
                console.error('Error adding travel details:', error);
            }
        });
   
        async function fetchAndDisplayTravelDetails() {
            try {
                // Make an Axios request to your backend API to get travel details
                const response = await axios.get(`https://nemonode.ivistaz.co/candidate/get-travel-details/${id}`, {
                    headers: { "Authorization": token }
                });

                // Clear existing table rows
                const travelTableBody = document.getElementById('travelTableBody');
                travelTableBody.innerHTML = '';

                // Iterate over the fetched data and append rows to the table
                response.data.forEach(travel => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${travel.travel_date}</td>
                        <td>${travel.travel_from}</td>
                        <td>${travel.travel_to}</td>
                        <td>${travel.travel_mode}</td>
                        <td>${travel.travel_status}</td>
                        <td>${travel.ticket_number}</td>
                        <td>${travel.agent_name}</td>
                        <td>${travel.portAgent}</td>
                        <td>${travel.reason}</td>
                        <td>${travel.created_by}</td>
                        <td>
                        <button class="btn border-0 m-0 p-0" onclick="editTravel('${travel.id}','${travel.travel_date}','${travel.travel_from}','${travel.travel_to}','${travel.travel_mode}','${travel.travel_status}','${travel.ticket_number}','${travel.agent_name}','${travel.portAgent}','${travel.travel_amount}','${travel.reason}','${travel.created_by}',event)">
                            <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                        </button>
                        <button class="btn border-0 m-0 p-0" onclick="deleteTravel('${travel.id}')">
                            <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                        </button>
                    </td>
                    
                    `;
                    travelTableBody.appendChild(row);
                });

            } catch (error) {
                console.error('Error fetching travel details:', error);
            }
        }

        const portAgentResponse = await axios.get("https://nemonode.ivistaz.co/others/view-port-agent", { headers: { "Authorization": token } });
            const portAgents = portAgentResponse.data.portAgents;
            console.log(portAgentResponse,portAgents)
            const portAgentname = portAgents.map(pa => pa.portAgentName);
            const portAgentDropdowns = document.getElementById('portAgent');
            portAgentDropdowns.innerHTML = '';
            for (let i = 0; i < portAgentname.length; i++) {
                const option = document.createElement('option');
                option.value = portAgentname[i];
                option.text = portAgentname[i];
                portAgentDropdowns.appendChild(option);
               
                
            }
        // Initial fetch and display of travel details
        await fetchAndDisplayTravelDetails();

        let dropdownItems = document.querySelectorAll(".dropdown-item");
    
        // Add click event listener to each dropdown item
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function() {
                // Get the id attribute of the clicked item
                var itemId = item.id;
                const memId= localStorage.getItem('memId')
                // Define the destination URLs based on the clicked item
                var destinationPage = "";
                switch (itemId) {
                    case "personnel":
                        destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                        break;
                    case "discussion":
                        destinationPage =`./edit-discussion.html?memId=${memId}`;
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
    
                // Redirect to the destination page¯
                if (destinationPage !== "") {
                    window.location.href = destinationPage;
                }
            });
        });
    });
    
    
    function editTravel(id, travel_date, travel_from, travel_to, travel_mode, travel_status, ticket_number, agent_name, portAgent, travel_amount,reason,created_by, event) {
        event.preventDefault();
        console.log('Edit clicked for travel ID:', id);
        window.location.href = `edit-c-travel.html?id=${id}&travel_date=${travel_date}&travel_from=${travel_from}&travel_to=${travel_to}&travel_mode=${travel_mode}&travel_status=${travel_status}&ticket_number=${ticket_number}&agent_name=${agent_name}&portAgent=${portAgent}&travel_amount=${travel_amount}&reason=${reason}&created_by=${created_by}`; // Include all parameters
        // ...
    }
    

    document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    localStorage.clear();
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    localStorage.clear()

    // Change the message and spinner after a delay
    setTimeout(function() {
        document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
    }, 1000);

    // Redirect after another delay
    setTimeout(function() {
        window.location.href = "loginpage.html";
    }, 2000);
});

    // ... At the end of your JavaScript code
async function deleteTravel(travelId) {
    const token = localStorage.getItem('token');

    try {
        // Make an Axios request to your backend API to delete the travel entry
        const response = await axios.delete(`https://nemonode.ivistaz.co/candidate/delete-travel/${travelId}`, {
            headers: { "Authorization": token }
        });

        // Handle success response from the server
        console.log('Travel deleted successfully:', response.data);
        
        // Fetch and display updated travel details
    } catch (error) {
        // Handle error response from the server
        console.error('Error deleting travel:', error);
    }
}
// ...


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
