// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page
alert('Please login to continue using Nemo');

  window.location.href = './loginpage.html';
}

document.addEventListener("DOMContentLoaded", function() {
    localStorage.clear();

    // Get the dropdown items
    let dropdownItems = document.querySelectorAll(".dropdown-item");

    // Add click event listener to each dropdown item
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function() {
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

document.addEventListener("DOMContentLoaded", function() {
    localStorage.clear();

    // Get the URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Get values by parameter name
    const id = urlParams.get('id');
    const kinName = urlParams.get('kinName');
    const kinRelation = urlParams.get('kinRelation');
    const kinContactNumber = urlParams.get('kinContactNumber');
    const kinContactAddress = urlParams.get('kinContactAddress');
    const kinPriority = urlParams.get('kinPriority');

    // Populate the form fields with the retrieved values
    document.getElementById('nkd_id').value=id;
    document.getElementById('nkd_kin_name').value = kinName;
    document.getElementById('nkd_kin_relationship').value = kinRelation;
    document.getElementById('nkd_kin_contact').value = kinContactNumber;
    document.getElementById('nkd_contact_address').value = kinContactAddress;
    document.getElementById('nkd_priority').value = kinPriority;

    document.getElementById('updateNkdButton').addEventListener('click', async function(e) 
    {
        e.preventDefault();
    
        try {
            // Collect form data
            const formData = {
                id:document.getElementById('nkd_id').value,
                kin_name: document.getElementById('nkd_kin_name').value,
                kin_relation: document.getElementById('nkd_kin_relationship').value,
                kin_contact_number: document.getElementById('nkd_kin_contact').value,
                kin_contact_address: document.getElementById('nkd_contact_address').value,
                kin_priority: document.getElementById('nkd_priority').value,
            };

            // Send data to the server using Axios with async/await for update
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-nkd/${id}`, formData, { headers: { "Authorization": token } });

            // Handle success
            console.log('NKD data updated successfully:', response.data);
            const urlParams = new URLSearchParams(window.location.search);
    
            // Get the candidateId from the URL parameter
            const memId = urlParams.get('memId');
        viewCandidate(memId)
            // You can perform additional actions here after a successful update
        } catch (error) {
            // Handle error
            console.error('Error updating NKD data:', error);
            // You can handle errors and display appropriate messages to the user
        }
    });
    // Now the form fields are populated with the retrieved values
});

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