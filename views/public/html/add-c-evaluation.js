const token = localStorage.getItem('token');
function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
document.addEventListener('DOMContentLoaded', async function () {
      
    const decodedToken = decodeToken(token);
    console.log(decodedToken)
    displayDropdown()
    displayUserDropdown()
const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
    const candidateId = localStorage.getItem('memId');

        
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
                        case 'evaluation':
                        destinationPage=`./add-c-evaluation.html?memId=${memId};`;
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
    
// Function to fetch data from the server and populate the table


// Edit document function
// Edit document function


// Delete document function




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

const displayDropdown = async function () {
    const rankDropdown = document.getElementById('appliedRank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("https://nemo.ivistaz.co/others/get-ranks", { headers: { "Authorization": token } });
    const rankOptions = rankResponse.data.ranks;
    const rankNames = rankOptions.map(rank => rank.rank);

    for (let i = 0; i < rankNames.length; i++) {
        const option = document.createElement('option');
        option.value = rankNames[i];
        option.text = rankNames[i];
        rankDropdown.appendChild(option);
    }
}
const displayUserDropdown = async function () {
    try {
        const userDropdown = document.getElementById('interviewer_name');
        userDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select User --';
        userDropdown.appendChild(defaultOption);
        
        // Fetch user data from the server
        const userResponse = await axios.get("https://nemo.ivistaz.co/user/userdropdown");
        const users = userResponse.data;
    
        // Populate the user dropdown with fetched user names
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.userEmail; // Assuming 'id' is the correct attribute for user ID
            option.text = `${user.userName} ` // Assuming 'userName' and 'lastName' are the correct attributes for user name
            userDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


    const evaluationForm = document.getElementById('evaluationForm');

    evaluationForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const id = localStorage.getItem('memId')
        const evalType = document.getElementById('evalType').value;
        const appliedRank = document.getElementById('appliedRank').value;
        const appliedDate = document.getElementById('appliedDate').value;
        const time = document.getElementById('time').value;
        const remoteLink = document.getElementById('remoteLink').value;
        const interviewer_name = document.getElementById('interviewer_name').value;
        const decodedToken = decodeToken(token)
        const appliedBy = decodedToken.userName
        console.log(appliedBy)
        // Create evaluation object
        const evaluationData = {
            eval_type: evalType,
            applied_rank: appliedRank,
            applied_date: appliedDate,
            time: time,
            remote: remoteLink,
            interviewer_name: interviewer_name,
            applied_by:appliedBy
        };

        try {
            // Send evaluation data to the server using Axios
            const response = await axios.post(`https://nemo.ivistaz.co/candidate/evaluation/${id}`, evaluationData);

            // Handle success response from the server
            console.log('Evaluation dataset created successfully:', response.data);
            // Optionally, you can display a success message to the user
        } catch (error) {
            // Handle errors
            console.error('Error creating evaluation dataset:', error.message);
            // Optionally, you can display an error message to the user
        }
    });


// Call the function to attach the event listener

