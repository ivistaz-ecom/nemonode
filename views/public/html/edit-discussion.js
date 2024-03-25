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
        avb_date: document.getElementById('avb_date').value,
        las_date: document.getElementById('las_date').value,
        last_salary: document.getElementById('last_salary').value,
        last_company: document.getElementById('last_company').value,
        rank: document.getElementById('rank').value,
        vessel_types: document.getElementById('vessel_types').value,
        status: document.getElementById('status').value,
        ntbr: document.getElementById('reemploymentStatus').value
    };

    try {
        // Send form data to the backend using Axios
        const response = await axios.put(`https://nemonode.ivistaz.co/candidate/update-candidate/${currentCandidateId}`, formData,{headers:{"Authorization":token}});
        console.log("Response:", response.data);
        // Handle the response as needed
    } catch(error) {
        // Handle errors
        console.error("Error submitting form:", error);
    }
});


document.addEventListener("DOMContentLoaded", async function () {
    const decodedToken = decodeToken(token);
    console.log(decodedToken);
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    if (vendorManagement) {
      document.getElementById('vendorManagement').style.display = 'block';
      document.getElementById('vendorManagementSections').style.display = 'block';

    }
    const candidateId = localStorage.getItem('memId');
    currentCandidateId = candidateId;
    console.log(currentCandidateId)
    await displayDropdown();
    await fetchAndDisplayVessels();
    await fetchAndDisplayCompanies();
    // Move fetchSpecialComments call here
    // await fetchSpecialComments(currentCandidateId, token);

    let dropdownItems = document.querySelectorAll(".dropdown-item");

    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
            let itemId = item.id;
            const memId = localStorage.getItem('memId');
            let destinationPage = "";
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
    const basicCommentsValue = document.getElementById('basic_comments').value;

    const discussionPlusData = {
        added_by: localStorage.getItem('username'),
        proposed: document.getElementById('proposed').checked,
        approved: document.getElementById('approved').checked,
        joined: document.getElementById('joined').checked,
        rejected: document.getElementById('rejected').checked,
        basic_comments: basicCommentsValue,
        special_comments: null,
        set_reminder: null,
        reminder_date: null,
        reminder_text:null,
        reference_check: null,
        reference_check_text: null,
        company_name: null,
        status_date: null,
        reason: null
    };

    // If Special Comment checkbox is checked, include special comment data
    if (document.getElementById('special_comments_checkbox').checked) {
        discussionPlusData.special_comments = basicCommentsValue;
        discussionPlusData.basic_comments = null; // Reset basic comments if special comments are stored
    }

    // If Set Reminder checkbox is checked, include reminder data
    if (document.getElementById('set_reminder_checkbox').checked) {
        discussionPlusData.set_reminder = document.getElementById('reminder_date').value;
        discussionPlusData.reminder_date = document.getElementById('reminder_date').value;
        discussionPlusData.reminder_text = document.getElementById('reminder_text').value;
    }

    // If Reference Check checkbox is checked, include reference check data
    if (document.getElementById('reference_check_checkbox').checked) {
        discussionPlusData.reference_check = true;
        discussionPlusData.reference_check_text = document.getElementById('reference_check_text').value;
    }

    // Get company dropdown value if applicable
    if (document.getElementById('companyDropdown').style.display !== 'none') {
        discussionPlusData.company_name = document.getElementById('company_name').value;
    }

    // Get date value if applicable
    if (document.getElementById('dateInput').style.display !== 'none') {
        discussionPlusData.status_date = document.getElementById('status_date').value;
    }

    // Get reason value if applicable
    if (document.getElementById('reasonInput').style.display !== 'none') {
        discussionPlusData.reason = document.getElementById('reason').value;
    }

    try {
        const response = await axios.post(`https://nemonode.ivistaz.co/candidate/discussion-plus-detail/${currentCandidateId}`, discussionPlusData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data);
        event.target.reset();
    } catch (error) {
        console.error(error);
    }
});




// async function fetchSpecialComments(candidateId, token) {
//     const specialCommentsUrl = `https://nemonode.ivistaz.co/candidate/get-discussionplus-details/${candidateId}`;
//     const candidateUrl = `https://nemonode.ivistaz.co/candidate/get-candidate/${candidateId}`;
//     try {
//         const response = await axios.get(specialCommentsUrl, { headers: { 'Authorization': token } });
//         const candidateResponse = await axios.get(candidateUrl, { headers: { 'Authorization': token } });

//         const candidateArray = candidateResponse.data.candidate;
//         const discussionArray = response.data.discussion;

//         console.log('Discussion Details:', discussionArray);
//         console.log('Candidate Details:', candidateArray);

//         if (discussionArray && Array.isArray(discussionArray)) { // Check if discussionArray is defined and an array
//             // Process each discussion item
//             discussionArray.forEach(discussion => {
//                 const discussionElement = document.createElement('div');
//                 const formattedDate = formatDiscussionDate(discussion.discussion_date);
//                 document.getElementById('reemploymentStatus').value = discussion.ntbr;
//                 discussionElement.innerHTML = `<strong>${discussion.userName}:</strong><a style="color:gray;font-size:13px;text-decoration:none" class="float-end">${formattedDate}</a><br><br>`;
//                 discussionContainer.appendChild(discussionElement);
//             });
//         } else {
//             console.error('Discussion details are either undefined or not an array');
//         }

//         // Update candidate details if available
//         if (candidateArray) {
//             const formattedDate = formatDate(candidateArray.avb_date);
//             console.log(formattedDate);
//             document.getElementById('avb_date').value = formattedDate;
//             document.getElementById('las_date').value = formatDate(candidateArray.las_date);
//             document.getElementById('last_salary').value = candidateArray.last_salary;
//             document.getElementById('last_company').value = candidateArray.last_company;
//             const rankDropdown = document.getElementById('rank');
//             const vesselDropdown = document.getElementById('vessel_types');
//             const statusDropdown = document.getElementById('status');
//             document.getElementById('reemploymentStatus').value=candidateArray.ntbr
//             function setValueAndHighlight(dropdown, fetchedValue) {
//                 for (let i = 0; i < dropdown.options.length; i++) {
//                     const option = dropdown.options[i];
//                     if (option.value == fetchedValue) {
//                         dropdown.value = fetchedValue;
//                         break;
//                     }
//                 }
//             }
//             try {
//                 setValueAndHighlight(rankDropdown, candidateArray.c_rank);
//                 setValueAndHighlight(vesselDropdown, candidateArray.c_vessel);
//                 setValueAndHighlight(statusDropdown, candidateArray.m_status);
//             } catch (err) {
//                 console.log(err)
//             }
//         } else {
//             console.log('Candidate details not found');
//         }
//     } catch (error) {
//         console.error('Error fetching discussion details:', error);
//     }
// }


function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

document.getElementById('logout').addEventListener('click', function () {
    localStorage.clear();
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

    const rankResponse = await axios.get("https://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
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
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vsls;

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
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        const companies = serverResponse.data.company;

        // Get the select element
        const companySelect = document.getElementById("company_name");

        // Clear previous options
        companySelect.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "-- Select Company --";

        companySelect.appendChild(defaultOption);

        // Add companies to the dropdown
        companies.forEach((company) => {
            const option = document.createElement("option");
            option.value = company.company_name;
            option.text = company.company_name;
            companySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching companies:', error);
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
    