const token = localStorage.getItem('token')
document.getElementById('search_btn').addEventListener('click', async function (e) {
  e.preventDefault();
  // Get the value from the input field
  const searchValue = document.getElementById('search_input').value.trim();
  if (searchValue.length == 0) {
      alert('Blank Field! Enter some value to continue!');
      return;
  }

  // Get the user group from wherever it's stored in your client-side code
  const userGroup = getUserGroup(); // Modify this to get the user group

  try {
    const id = decodedToken.userId;
    console.log(id)
      // Send an asynchronous request to the server using Axios with async/await
      const response = await axios.post('https://nemo.ivistaz.co/search', { 
          search: searchValue,
          userId:id,
          userGroup: userGroup // Pass the user group value in the request body
      }, { headers: { 'Authorization': token } });

      // Handle the response from the server (e.g., display search results)
      console.log(response.data);
      populateTables(response.data);
  } catch (error) {
      console.error('Error in search request:', error);
  }
});
const getUserGroup=() =>{
const token = localStorage.getItem('token')
const decodedToken =decodeToken(token)
return decodedToken.userGroup
}

  const resultContainer = document.getElementById('result-container'); // Get the result container div
  const searchForm = document.getElementById('search-form');
  
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get values from all form fields
    const nemoId = document.getElementById('nemoId').value.trim();
    const name = document.getElementById('name').value.trim();
    const rank = document.getElementById('rank').value.trim();
    const vsl = document.getElementById('vsl').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const grade = document.getElementById('grade').value.trim();
    const status = document.getElementById('status').value.trim();
    const availableFrom = document.getElementById('availableFrom').value.trim();
    const availableTo = document.getElementById('availableTo').value.trim();
    const license = document.getElementById('license').value.trim();
    const zone = document.getElementById('zone').value.trim();
    const group = document.getElementById('groupSearch').value;
    const fromAge = document.getElementById('fromAge').value.trim();
    const toAge = document.getElementById('toAge').value.trim();

    // Prepare data for the POST request
    const searchData = {
        nemoId: nemoId,
        name: name,
        rank: rank,
        vsl: vsl,
        experience: experience,
        grade: grade,
        status: status,
        avb_date: availableFrom,
        las_date: availableTo,
        license: license,
        zone: zone,
        group: group
    };

    // Add age range if provided
    if (fromAge) {
        searchData.fromAge = fromAge;
    }
    if (toAge) {
        searchData.toAge = toAge;
    }

    // Make a POST request using Axios
    axios.post('https://nemo.ivistaz.co/searchspl', searchData, { headers: { 'Authorization': token } })
        .then(function (response) {
            // Handle the successful response
            const searchResults = response.data;
            console.log(response);
            // Process and display the search results in the table
            populateTable(searchResults);

            console.log(response.data); // Log the retrieved data to the console
        })
        .catch(function (error) {
            // Handle errors
            console.error('Error:', error);
            // You can update the UI to show an error message or perform other error handling
        });
});



// function populateTable(results) {
//   const tableBody = document.getElementById('table-body');

//   // Clear existing rows
//   tableBody.innerHTML = '';

//   // Iterate over results and append rows to the table
//   results.forEach(result => {
//       const row = document.createElement('tr');
//       const fieldsToDisplay = ['candidateId', 'fname', 'lname', 'c_rank', 'c_vessel', 'c_mobi1', 'dob'];

//       fieldsToDisplay.forEach(field => {
//           const cell = document.createElement('td');
//           // Format date fields if needed
//           if (field === 'dob' || field === 'avb_date' || field === 'las_date') {
//               const date = new Date(result[field]).toLocaleDateString();
//               cell.textContent = date;
//           } else if (field === 'candidateId') {
//               // Create a clickable link for candidateId
//               const link = document.createElement('a');
//               link.href = '#';
//               link.textContent = result[field];
//               link.onclick = () => viewCandidate(result[field]);
//               cell.appendChild(link);
//           } else {
//               cell.textContent = result[field];
//           }
//           row.appendChild(cell);
//       });

//       // Add buttons for delete, edit, and view
//       const deleteButton = createButton('fa-trash', () => handleDelete(result.candidateId), 'Delete');
//       const editButton = createButton('fa-pencil-alt', () => handleEdit(result.candidateId), 'Edit');
//       const viewButton = createButton('fa-eye', () => handleView(result.candidateId), 'View');

//       const buttonsCell = document.createElement('td');
//       buttonsCell.appendChild(deleteButton);
//       buttonsCell.appendChild(editButton);
//       buttonsCell.appendChild(viewButton);

//       row.appendChild(buttonsCell);

//       tableBody.appendChild(row);
//   });
// }
function populateTable(results) {
  const tableBody = document.getElementById('table-body');

  // Clear existing rows
  tableBody.innerHTML = '';

  // Iterate over results and append rows to the table
  results.forEach(result => {
    const row = document.createElement('tr');
    const fieldsToDisplay = ['candidateId', 'fname', 'lname', 'c_rank', 'c_vessel', 'c_mobi1', 'dob','email1','resume'];

    fieldsToDisplay.forEach(field => {
      const cell = document.createElement('td');
      // Format date fields if needed
      if (field === 'dob' || field === 'avb_date' || field === 'las_date') {
        const date = new Date(result[field]).toLocaleDateString();
        cell.textContent = date;
      } else if (field === 'candidateId') {
        // Create a clickable link for candidateId
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = result[field];
        link.onclick = () => viewCandidate(result[field]);

        // Hover event to show discussion popup
        link.addEventListener('mouseenter', () => showDiscussionPopup(link, result[field]));
        link.addEventListener('mouseleave', () => hideDiscussionPopup());

        cell.appendChild(link);
      } else {
        cell.textContent = result[field];
      }
      row.appendChild(cell);
    });

    // Add buttons for delete, edit, and view
    const deleteButton = createButton('fa-trash', () => handleDelete(result.candidateId), 'Delete');
    const editButton = createButton('fa-pencil-alt', () => handleEdit(result.candidateId), 'Edit');
    const viewButton = createButton('fa-eye', () => handleView(result.candidateId), 'View');

    const buttonsCell = document.createElement('td');
    buttonsCell.appendChild(deleteButton);
    buttonsCell.appendChild(editButton);
    buttonsCell.appendChild(viewButton);

    row.appendChild(buttonsCell);

    tableBody.appendChild(row);
  });
}

// Function to show discussion popup inside a Bootstrap card
// Function to show discussion popup inside a Bootstrap card
let discussionTimeout; // Variable to store timeout ID

// Function to show discussion popup inside a Bootstrap card
async function showDiscussionPopup(link, candidateId) {
  try {
    // Clear any existing timeout to prevent premature hiding
    clearTimeout(discussionTimeout);

    // Replace with your logic to fetch and display discussions related to candidateId
    const discussions = await fetchDiscussions(candidateId); // Example function to fetch discussions

    // Create Bootstrap card
    const card = document.createElement('div');
    card.className = 'card discussion-popup-card';

    // Card body
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    // Header with candidate ID
    const header = document.createElement('h5');
    header.className = 'card-title';
    header.textContent = `Discussions for Candidate ID: ${candidateId}`;
    cardBody.appendChild(header);

    // Discussions content
    discussions.forEach(discussion => {
      const discussionItem = document.createElement('p');
      discussionItem.className = 'card-text';
      discussionItem.textContent = discussion;
      cardBody.appendChild(discussionItem);
    });

    card.appendChild(cardBody);

    // Position relative to the link
    const linkRect = link.getBoundingClientRect();
    const popupWidth = card.offsetWidth;
    const popupHeight = card.offsetHeight;

    // Calculate position above and to the right of the link
    const topPosition = linkRect.top + window.scrollY - popupHeight;
    const leftPosition = linkRect.left + window.scrollX + link.offsetWidth;

    card.style.position = 'absolute';
    card.style.top = `${topPosition}px`;
    card.style.left = `${leftPosition}px`;

    // Append card to the body
    document.body.appendChild(card);
  } catch (error) {
    console.error('Error showing discussion popup:', error);
  }
}

// Function to hide discussion popup
function hideDiscussionPopup() {
  const card = document.querySelector('.discussion-popup-card');
  if (card) {
    card.remove();
  }
}

// Event listener to show discussion popup on hover
document.addEventListener('mouseover', (event) => {
  const link = event.target;
  if (link.tagName === 'A' && link.classList.contains('candidate-link')) {
    const candidateId = link.textContent;
    showDiscussionPopup(link, candidateId);
  }
});

// Event listener to hide discussion popup when mouse leaves
document.addEventListener('mouseleave', (event) => {
  const link = event.target;
  if (link.tagName === 'A' && link.classList.contains('candidate-link')) {
    hideDiscussionPopup();
  }
});

// Example function to fetch discussions (placeholder)
async function fetchDiscussions(candidateId) {
  try {
    // Replace with actual fetch logic from your data source
    const response = await axios.post(`https://nemo.ivistaz.co/candidate/hover-disc/${candidateId}`);
    const discussions = response.data;

    // Check if discussions is an array (or convert if necessary based on actual API response structure)
    if (Array.isArray(discussions)) {
      return discussions.map(discussion => discussion.discussion);
    } else {
      // If discussions is not an array, handle it accordingly
      return [];
    }
  } catch (error) {
    console.error('Error fetching discussions:', error);
    return []; // Return an empty array or handle the error as needed
  }
}



// Function to hide discussion popup


function viewCandidate(candidateId) {
  localStorage.setItem('memId', candidateId);
  window.location.href = './view-candidate.html';
}

  

  
    
  function createButton(iconClass, onClickHandler, buttonText = null) {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm', 'mx-1');
  
    if (buttonText !== null) {
        button.textContent = buttonText;
    }
  
    const icon = document.createElement('i');
    icon.classList.add('fa', iconClass);
  
    button.appendChild(icon);
  
    button.addEventListener('click', onClickHandler);
  
    return button;
}

  
  
  
  // Usage
 
    
    // Example event handlers
    async function handleDelete(candidateId) {
        // Display a confirmation dialog
        const confirmDelete = window.confirm(`Are you sure you want to delete candidate with ID ${candidateId}?`);
    
        // Check if the user clicked OK in the confirmation dialog
        if (confirmDelete) {
            try {
                console.log(`Deleting candidate with ID ${candidateId}`);
                // Add your delete logic here
                await axios.delete(`https://nemo.ivistaz.co/candidate/delete-candidate/${candidateId}`, { headers: { "Authorization": token } });
                console.log(`Candidate with ID ${candidateId} successfully deleted.`);
            } catch (error) {
                console.error(`Error deleting candidate with ID ${candidateId}:`, error);
                // Handle the error, e.g., show an alert or log it
            }
        } else {
            console.log('Delete operation canceled.');
        }
    }
    function decodeToken(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(atob(base64));
  }
  
  const decodedToken = decodeToken(token);
  
    
    function handleEdit(candidateId) {
        console.log(`Edit button clicked for candidateId ${candidateId}`);
          console.log('memId:', candidateId);
          localStorage.setItem('memId',candidateId);
          const canEdit = decodedToken.Write;
          if (canEdit) {
              console.log('Edited:', candidateId);
              window.location.href = `./edit-candidate-2.html?memId=${candidateId}`;
              // Add your logic for editing here
          } else {
              alert('You do not have permission to edit this candidate.');
          }
      
    }
    
    function handleView(candidateId) {
      console.log(`View button clicked for candidateId ${candidateId}`);
      // Add your view logic here
      localStorage.setItem('memId', candidateId);
      
      // Open the page in a new tab
      window.open('./view-candidate.html', '_blank');
  }
  
    
      
    
    function populateTables(data) {
      // Clear existing rows
      const tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';
    
      // Display candidateResults in the main table
      if (data.candidateResults && data.candidateResults.length > 0) {
        displayCandidateResults(data.candidateResults);
      }
    
      // Display bankResults in a separate table
      if (data.bankResults && data.bankResults.length > 0) {
        displayBankResults(data.bankResults);
      }
    
      // Display cdocumentsResults in a separate table
      if (data.cdocumentsResults && data.cdocumentsResults.length > 0) {
        displayCDocumentsResults(data.cdocumentsResults);
      }
    
      // Add more sections for other types of results as needed
    }
    
    // Function to display candidateResults in the main table
    function displayCandidateResults(results) {
      const tableBody = document.getElementById('table-body');
    
      // Iterate over results and append rows to the table
      results.forEach(result => {
        const row = document.createElement('tr');
        const fieldsToDisplay = ['candidateId', 'fname', 'lname', 'c_rank', 'c_vessel', 'c_mobi1', 'dob','email1','resume'];
    
        fieldsToDisplay.forEach(field => {
          const cell = document.createElement('td');
          // Format date fields if needed
          if (field === 'dob' || field === 'avb_date' || field === 'las_date') {
            const date = new Date(result[field]).toLocaleDateString();
            cell.textContent = date;
          } else if (field === 'candidateId') {
            // Create a clickable link for candidateId
            const link = document.createElement('a');
            link.href = '#';
            link.textContent = result[field];
            link.onclick = () => viewCandidate(result[field]);
    
            // Hover event to show discussion popup
            link.addEventListener('mouseenter', () => showDiscussionPopup(link, result[field]));
            link.addEventListener('mouseleave', () => hideDiscussionPopup());
    
            cell.appendChild(link);
          } else {
            cell.textContent = result[field];
          }
          row.appendChild(cell);
        });
    
        // Add buttons for delete, edit, and view
        const deleteButton = createButton('fa-trash', () => handleDelete(result.candidateId), 'Delete');
        const editButton = createButton('fa-pencil-alt', () => handleEdit(result.candidateId), 'Edit');
        const viewButton = createButton('fa-eye', () => handleView(result.candidateId), 'View');
    
        const buttonsCell = document.createElement('td');
        buttonsCell.appendChild(deleteButton);
        buttonsCell.appendChild(editButton);
        buttonsCell.appendChild(viewButton);
    
        row.appendChild(buttonsCell);
    
        tableBody.appendChild(row);
      });
    }
    
    // Function to display bankResults in a separate table
    function displayBankResults(bankResults) {
      const candidateIds = bankResults.map(result => result.candidateId);
    
      // Check if there are candidateIds to fetch
      if (candidateIds.length > 0) {
        // Fetch candidate data for the unique candidateIds
        fetchCandidateData(candidateIds)
          .then(candidateData => {
            // Display candidate data in the main table
            displayCandidateResults(candidateData.candidateResults);
          })
          .catch(error => {
            console.error('Error fetching candidate data:', error);
          });
      }
    }
    
    // Function to display cdocumentsResults in a separate table
    function displayCDocumentsResults(cdocumentsResults) {
      // Similar implementation to displayBankResults
    }
    
    // Function to show discussion popup inside a Bootstrap card
    
    async function showDiscussionPopup(link, candidateId) {
      try {
        // Clear any existing timeout to prevent premature hiding
        clearTimeout(discussionTimeout);
    
        // Replace with your logic to fetch and display discussions related to candidateId
        const discussions = await fetchDiscussions(candidateId); // Example function to fetch discussions
    
        // Create Bootstrap card
        const card = document.createElement('div');
        card.className = 'card discussion-popup-card';
    
        // Card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
    
        // Header with candidate ID
        const header = document.createElement('h5');
        header.className = 'card-title';
        header.textContent = `Discussions for Candidate ID: ${candidateId}`;
        cardBody.appendChild(header);
    
        // Discussions content
        discussions.forEach(discussion => {
          const discussionItem = document.createElement('p');
          discussionItem.className = 'card-text';
          discussionItem.textContent = discussion;
          cardBody.appendChild(discussionItem);
        });
    
        card.appendChild(cardBody);
    
        // Position relative to the link
        const linkRect = link.getBoundingClientRect();
        const popupWidth = card.offsetWidth;
        const popupHeight = card.offsetHeight;
    
        // Calculate position above and to the right of the link
        const topPosition = linkRect.top + window.scrollY - popupHeight;
        const leftPosition = linkRect.left + window.scrollX + link.offsetWidth;
    
        card.style.position = 'absolute';
        card.style.top = `${topPosition}px`;
        card.style.left = `${leftPosition}px`;
    
        // Append card to the body
        document.body.appendChild(card);
      } catch (error) {
        console.error('Error showing discussion popup:', error);
      }
    }
    
    // Function to hide discussion popup
    function hideDiscussionPopup() {
      const card = document.querySelector('.discussion-popup-card');
      if (card) {
        card.remove();
      }
    }
    
    // Example function to fetch discussions (placeholder)
    async function fetchDiscussions(candidateId) {
      try {
        // Replace with actual fetch logic from your data source
        const response = await axios.post(`https://nemo.ivistaz.co/candidate/hover-disc/${candidateId}`);
        const discussions = response.data;
    
        // Check if discussions is an array (or convert if necessary based on actual API response structure)
        if (Array.isArray(discussions)) {
          return discussions.map(discussion => discussion.discussion);
        } else {
          // If discussions is not an array, handle it accordingly
          return [];
        }
      } catch (error) {
        console.error('Error fetching discussions:', error);
        return []; // Return an empty array or handle the error as needed
      }
    }
    

// Function to fetch candidate data based on candidateIds
// Function to fetch candidate data based on candidateIds
async function fetchCandidateData(candidateIds) {
  try {
    // Check if candidateIds is defined and not empty
    if (candidateIds && candidateIds.length > 0) {
      const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-candidate/${candidateIds}`, { headers: { "Authorization": token } });
      console.log(response)
      return response.data;
    } else {
      // If candidateIds is undefined or empty, return an empty object
      return { candidateResults: [] };
    }
  } catch (error) {
    throw error;
  }
}


      // Function to display cdocumentsResults in a separate table
      function displayCDocumentsResults(cdocumentsResults) {
        // Similar to displayCandidateResults, create a new table or modify the existing table for cdocumentsResults
      }

  const displayDropdown = async function () {
    const rankDropdown = document.getElementById('rank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '';
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
displayDropdown()

const displayVesselTypeDropdown = async function () {
    try {
        const vesselDropdown = document.getElementById('vsl');
        vesselDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '';
        vesselDropdown.appendChild(defaultOption);
    
        const vesselResponse = await axios.get("https://nemo.ivistaz.co/others/get-vessel", { headers: { "Authorization": token } });
        const vessels = vesselResponse.data.vessels;
        const vesselNames = vessels.map(vessel => vessel.vesselName);
    
        for (let i = 0; i < vesselNames.length; i++) {
            const option = document.createElement('option');
            option.value = vesselNames[i];
            option.text = vesselNames[i];
            vesselDropdown.appendChild(option);
        }
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}
displayVesselTypeDropdown()

async function fetchAndDisplayExp() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/view-experience", { headers: { "Authorization": token } });
        const experiences = serverResponse.data.experiences; // Access the array using response.data.experiences

        // Check if experiences is an array
        if (Array.isArray(experiences)) {
            // Get the dropdown element by its ID
            const expDropdown = document.getElementById('experience');

            // Clear existing options
            expDropdown.innerHTML = '';

            // Create and append a default option (optional)
            const defaultOption = document.createElement('option');
            defaultOption.text = '';
            expDropdown.add(defaultOption);

            // Iterate through experiences and add them as options
            experiences.forEach((exp) => {
                const option = document.createElement('option');
                option.value = exp.experience; // Use the appropriate property from your data
                option.text = exp.experience; // Use the appropriate property from your data
                expDropdown.add(option);
            });

            // Now the dropdown is populated with experience values
        } else {
            console.error('Invalid or empty experiences:', experiences);
        }
    } catch (error) {
        console.error('Error fetching experiences:', error);
        // Handle error as needed
    }
}

fetchAndDisplayExp()

async function fetchAndDisplayGrades() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-grades", { headers: { "Authorization": token } });
        const grades = serverResponse.data.grades;

        // Get the dropdown element by its ID
        const gradeDropdown = document.getElementById('grade');

        // Clear existing options
        gradeDropdown.innerHTML = '';

        // Create and append a default option (optional)
        const defaultOption = document.createElement('option');
        defaultOption.text = '';
        gradeDropdown.add(defaultOption);

        // Iterate through grades and add them as options
        grades.forEach((grade) => {
            const option = document.createElement('option');
            option.value = grade.gradeExp;
            option.text = grade.gradeExp;
            gradeDropdown.add(option);
        });

        // Now the dropdown is populated with grade values
    } catch (error) {
        console.error('Error fetching grades:', error);
        // Handle error as needed
    }
}
fetchAndDisplayGrades()

const displayCountryDropdown = async function () {
    try {
        const countryDropdown = document.getElementById('license');
        countryDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '';
        countryDropdown.appendChild(defaultOption);

        // Assuming the country data is an array of objects with the property "country"
        const countryResponse = await axios.get("https://nemo.ivistaz.co/others/country-codes", { headers: { "Authorization": token } });
        const countries = countryResponse.data.countryCodes; // Assuming the array is directly returned

        for (let i = 0; i < countries.length; i++) {
            const option = document.createElement('option');
            option.value = countries[i].country; // Assuming the country name is in the "country" property
            option.text = countries[i].country; // Assuming the country name is in the "country" property
            countryDropdown.appendChild(option);
            // If you want to clone the options for another dropdown, do it here
            // licenseDropdown.appendChild(option.cloneNode(true));
        }
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}
displayCountryDropdown()

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

window.onload = async function () {
    
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
};



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

// Add event listener to the search input field
document.getElementById('clientSearchInput').addEventListener('input', function () {
    const searchText = this.value.toLowerCase().trim();
    filterTable(searchText);
});

// Function to filter table rows based on search input
function filterTable(searchText) {
    const tableRows = document.querySelectorAll('#table-body tr');

    tableRows.forEach(row => {
        const textContent = row.textContent.toLowerCase();
        if (textContent.includes(searchText)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}
