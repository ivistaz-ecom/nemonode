const token = localStorage.getItem('token');
let currentCandidateId;
const discussionContainer= document.getElementById('discussionContainer')
function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
document.getElementById('discussionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get form data
    const formData = {
        avb_date: formatDate(document.getElementById('avb_date').value.trim()) || '1970-01-01',
        las_date: formatDate(document.getElementById('las_date').value.trim()) || '1970-01-01',
        last_salary: document.getElementById('last_salary').value.trim() || null,
        last_company: document.getElementById('last_company').value.trim() || null,
        rank: document.getElementById('rank').value.trim() || null,
        vessel_types: document.getElementById('vessel_types').value.trim() || null,
        status: document.getElementById('status').value.trim() || null,
        ntbr: document.getElementById('reemploymentStatus').value.trim() || null
    };
    console.log(formData)
    try {
        // Send form data to the backend using Axios
        const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-candidate/${currentCandidateId}`, formData, { headers: { "Authorization": token } });
        console.log("Response:", response.data);
        // Handle the response as needed
    } catch (error) {
        // Handle errors
        console.error("Error submitting form:", error);
    }
});

function formatDate(dateString) {
    if (!dateString || dateString === '0000-00-00') {
        return '1970-01-01';
    }

    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return '1970-01-01';
    }
    
    // Extract year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}




document.addEventListener("DOMContentLoaded", async function () {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
    const candidateId = localStorage.getItem('memId');
    currentCandidateId = candidateId;
    console.log(currentCandidateId)
    await displayDropdown();
    await fetchAndDisplayVessels();
    await fetchAndDisplayCompanies();
    await fetchAndDisplayDiscussions(candidateId);
    goBack(candidateId);

    // Move fetchSpecialComments call here
    // await fetchSpecialComments(currentCandidateId, token);

    let dropdownItems = document.querySelectorAll(".dropdown-item");

    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
            let itemId = item.id;
            const memId = localStorage.getItem('memId');
            let destinationPage = "";
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
                default:
                    // Handle default case or do nothing
                    break;
            }
            if (destinationPage !== "") {
                window.location.href = destinationPage;
            }
        });
    });
});

document.getElementById('discussionPlusForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Fetch basic comments value
    let basicCommentsValue = document.getElementById('basic_comments').value;
    
    // Get the selected status
    let status;
    if (document.getElementById('proposed').checked) {
        status = 'Proposed';
    } else if (document.getElementById('joined').checked) {
        status = 'Joined';
    } else if (document.getElementById('approved').checked) {
        status = 'Approved';
    } else if (document.getElementById('rejected').checked) {
        status = 'Rejected';
    }

    // Get company name input value
    const companyName = document.getElementById('company_name').value;

    // Get company dropdown text
    const companyDropdown = document.getElementById('company_name');
    const company_dropdown_text = companyDropdown.options[companyDropdown.selectedIndex].text;

    // Get status date input value
    const statusDate = document.getElementById('status_date').value;

    // Get reminder date input value
    const r_date = document.getElementById('reminder_date').value;

    // Get reason input value
    const reason = document.getElementById('reason').value;

    // Check if special comment checkbox is checked
    if (document.getElementById('special_comments_checkbox').checked) {
        basicCommentsValue = document.getElementById('basic_comments').value;

        // Update basic comments value in candidate table
        try {
            await axios.put(`https://nemo.ivistaz.co/candidate/update-candidates/${currentCandidateId}`, { basicCommentsValue }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating basic comments value:', error);
        }
    }

    // Get reference check text value
    let referenceCheckText = null;
    if (document.getElementById('reference_check_checkbox').checked) {
        referenceCheckText = document.getElementById('reference_check_text').value;
        
        // Update reference check text value in candidate table
        try {
            await axios.put(`https://nemo.ivistaz.co/candidate/update-candidates/${currentCandidateId}`, { referenceCheckText }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating reference check text value:', error);
        }
    }

    // Update comments section
    const commentsSection = document.getElementById('comments-section');
    if (status === 'Rejected') {
        commentsSection.textContent = `${status}: ${basicCommentsValue} Reason: ${reason} Date: ${statusDate} Company Name: ${company_dropdown_text}`;
    } else if (status) {
        commentsSection.textContent = `${status}: ${basicCommentsValue} Date: ${statusDate} Company Name: ${company_dropdown_text}`;
    } else {
        commentsSection.textContent = `${basicCommentsValue}`;
    }

    // Create discussion plus data object
    const discussionPlusData = {
        post_by: localStorage.getItem('userId'),
        discussion: commentsSection.textContent,
        r_date: r_date || null,
        reminder: document.getElementById('set_reminder_checkbox').checked,
        companyname: companyName,
        reason: reason,
        join_date: null, // Ensure this is handled correctly on the server side if necessary
        created_date: new Date(),
    };

    // If Special Comment checkbox is checked, include special comment data
    if (document.getElementById('special_comments_checkbox').checked) {
        discussionPlusData.special_comment = basicCommentsValue;
        discussionPlusData.basic_comments = null; // Reset basic comments if special comments are stored
    }

    // If Reference Check checkbox is checked, include reference check data
    if (document.getElementById('reference_check_checkbox').checked) {
        discussionPlusData.reference_check = true;
        discussionPlusData.reference_check_text = referenceCheckText;
    }

    try {
        const response = await axios.post(`https://nemo.ivistaz.co/candidate/discussion-plus-detail/${currentCandidateId}`, discussionPlusData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
        console.log('Discussion plus detail created:', response.data);
        event.target.reset(); // Reset form after successful submission
    } catch (error) {
        console.error('Error creating discussion:', error);
        // Handle error feedback to the user if needed
    }
});




async function fetchAndDisplayDiscussions(candidateId) {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get(`https://nemo.ivistaz.co/candidate/get-discussionplus-details/${candidateId}`, { headers: { "Authorization": token } });
        let discussions = serverResponse.data.discussions;

        // Sort discussions by created_date in descending order
        discussions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

        // Assuming you have an element in your HTML to display discussions
        const discussionsContainer = document.getElementById('fetchedcomments');
        discussionsContainer.innerHTML = ''; // Clear previous discussions

        for (const discussion of discussions) {
            const discussionElement = document.createElement('div');
            discussionElement.classList.add('discussion'); // Add CSS class for styling
            
            // Fetch username based on user ID (post_by value)
            const usernameResponse = await axios.get(`https://nemo.ivistaz.co/user/get-user/${discussion.post_by}`, { headers: { "Authorization": token } });
            const username = usernameResponse.data.user.userName;

            // Format the created date
            const createdDate = new Date(discussion.created_date);
            const formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

            // Display username, discussion content, and created date with proper styling
            discussionElement.innerHTML = `
                <div class="discussion-content">
                    <strong class='text-primary'>${username}</strong>: ${discussion.discussion}
                </div>
                <div class="created-date text-success badge ">
                    ${formattedDate}
                </div>
            `;
            discussionsContainer.appendChild(discussionElement);
        }
    } catch (error) {
        console.error('Error fetching discussions:', error);
    }
}





// Call fetchAndDisplayDiscussions with the candidateId






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

updateDateTime();


setInterval(updateDateTime, 1000);

const displayDropdown = async function () {
    const rankDropdown = document.getElementById('rank');
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

async function fetchAndDisplayVessels() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vessel", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vessels;

        // Get the select element
        const vesselSelect = document.getElementById("vessel_types");

        // Clear previous options
        vesselSelect.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "-- Select Vessel --";

        vesselSelect.appendChild(defaultOption);

        // Add vessels to the dropdown
        vessels.forEach((vessel) => {
            const option = document.createElement("option");
            option.value = vessel.vesselName;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}
async function fetchAndDisplayCompanies() {
    try {
        const companyResponse = await axios.get("https://nemo.ivistaz.co/company/dropdown-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.companies; // Corrected property name
        const companyDropdown = document.getElementById('company_name');
        companyDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Company --';
        companyDropdown.appendChild(defaultOption);

        // Add options for each company
        companyOptions.forEach(company => {
            const option = document.createElement('option');
            option.value = company.company_id; // Set the value to company ID
            option.text = company.company_name;
            companyDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching company data:', error);
    }
}



function formatDiscussionDate(dateString) {
    const date = new Date(dateString);

    const options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

    return formattedDate;
}





const proposedCheckbox = document.getElementById('proposed');
    const approvedCheckbox = document.getElementById('approved');
    const joinedCheckbox = document.getElementById('joined');
    const rejectedCheckbox = document.getElementById('rejected');
    const companyDropdown = document.getElementById('companyDropdown');
    const dateInput = document.getElementById('dateInput');
    const reasonInput = document.getElementById('reasonInput');

    proposedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            companyDropdown.style.display = 'block';
            dateInput.style.display = 'block';
            reasonInput.style.display = 'none'; // Hide reason input for other statuses
        } else {
            companyDropdown.style.display = 'none';
            dateInput.style.display = 'none';
        }
    });

    approvedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            companyDropdown.style.display = 'block';
            dateInput.style.display = 'block';
            reasonInput.style.display = 'none'; // Hide reason input for other statuses
        } else {
            companyDropdown.style.display = 'none';
            dateInput.style.display = 'none';
        }
    });

    joinedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            companyDropdown.style.display = 'block';
            dateInput.style.display = 'block';
            reasonInput.style.display = 'none'; // Hide reason input for other statuses
        } else {
            companyDropdown.style.display = 'none';
            dateInput.style.display = 'none';
        }
    });

    rejectedCheckbox.addEventListener('change', function () {
        if (this.checked) {
            companyDropdown.style.display = 'block';
            dateInput.style.display = 'block';
            reasonInput.style.display = 'block';
        } else {
            reasonInput.style.display = 'none';
        }
    });





    function handleCheckboxChanges() {
        const setReminderCheckbox = document.getElementById('set_reminder_checkbox');
        const referenceCheckCheckbox = document.getElementById('reference_check_checkbox');
        const reminderDateInput = document.getElementById('reminder_date_input');
        
        const referenceCheckTextInput = document.getElementById('reference_check_text_input');
    
        // Function to hide all additional input fields
        function hideAdditionalFields() {
            reminderDateInput.style.display = 'none';
            referenceCheckTextInput.style.display = 'none';
        }
    
        // Event listener for Set Reminder checkbox
        setReminderCheckbox.addEventListener('change', function () {
            if (this.checked) {
                reminderDateInput.style.display = 'block';
                
            } else {
                reminderDateInput.style.display = 'none';
            }
        });
    
        // Event listener for Reference Check checkbox
        referenceCheckCheckbox.addEventListener('change', function () {
            if (this.checked) {
                referenceCheckTextInput.style.display = 'block';
            } else {
                referenceCheckTextInput.style.display = 'none';
            }
        });
    }
    
    // Call the function to set up event listeners
    handleCheckboxChanges();
    

    // function goBack(candidateId){

    //     localStorage.setItem('memId', candidateId);
    //     // Open the link in a new window
    //     window.location.href='./view-candidate.html';
    // }

    function goBack(candidateId) {
        document.getElementById('goback').addEventListener('click', () => {
            localStorage.setItem('memId', candidateId);
            window.location.href = './view-candidate.html';
        });
    }
    
    
    