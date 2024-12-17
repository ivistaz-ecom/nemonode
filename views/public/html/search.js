if (!token) {
  window.location.href = "./loginpage.html";
}
const rowsPerPage = 10;
var candiateList = [];
document
  .getElementById("search_btn")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    // Get the value from the input field
    const searchValue = document.getElementById("search_input").value.trim();
    if (searchValue.length == 0) {
      alert("Blank Field! Enter some value to continue!");
      return;
    }
    $('html, body').animate({
        scrollTop: $("#candidatedatas").offset().top
    }, 500);
    // Get the user group from wherever it's stored in your client-side code
    const userGroup = getUserGroup(); // Modify this to get the user group

    try {
      showLoader('candidatedatas')
      const id = decodedToken.userId;
      console.log(id);
      // Send an asynchronous request to the server using Axios with async/await
      const response = await axios.post(
        `${config.APIURL}search`,
        {
          search: searchValue,
          userId: id,
          userGroup: userGroup, // Pass the user group value in the request body
        },
        { headers: { Authorization: token } }
      );
      hideLoader('candidatedatas')
      // Handle the response from the server (e.g., display search results)
      console.log(response.data);
      candiateList = response.data;
      populateTables(response.data);
    } catch (error) {
      console.error("Error in search request:", error);
    }
  });
const getUserGroup = () => {
  return decodedToken.userGroup;
};

const resultContainer = document.getElementById("result-container"); // Get the result container div
const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get values from all form fields
  const nemoId = document.getElementById("nemoId").value.trim();
  const name = document.getElementById("name").value.trim();
  const rank = document.getElementById("rank").value.trim();
  const vsl = document.getElementById("vsl").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const grade = document.getElementById("grade").value.trim();
  const status = document.getElementById("status").value.trim();
  const availableFrom = document.getElementById("availableFrom").value.trim();
  const availableTo = document.getElementById("availableTo").value.trim();
  const license = document.getElementById("license").value.trim();
  const zone = document.getElementById("zone").value.trim();
  const group = document.getElementById("groupSearch").value;
  const fromAge = document.getElementById("fromAge").value.trim();
  const toAge = document.getElementById("toAge").value.trim();
  const c_mobi1 = document.getElementById("c_mobi1").value.trim();
  const email1 = document.getElementById("email1").value.trim();
  $('html, body').animate({
    scrollTop: $("#candidatedatas").offset().top
}, 500);
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
    group: group,
    c_mobi1: c_mobi1,
    email1: email1,
  };

  // Add age range if provided
  if (fromAge) {
    searchData.fromAge = fromAge;
  }
  if (toAge) {
    searchData.toAge = toAge;
  }
  showLoader('candidatedatas')
  // Make a POST request using Axios
  axios
    .post(`${config.APIURL}searchspl`, searchData, {
      headers: { Authorization: token },
    })
    .then(function (response) {
      // Handle the successful response
      const searchResults = response.data;
      console.log(response);
      // Process and display the search results in the table
      populateTable(searchResults);
      hideLoader('candidatedatas')

      console.log(response.data); // Log the retrieved data to the console
    })
    .catch(function (error) {
      // Handle errors
      console.error("Error:", error);
      hideLoader('candidatedatas')
      // You can update the UI to show an error message or perform other error handling
    });
});

function populateTable(results) {
  const tableBody = document.getElementById("table-body");

  // Clear existing rows
  tableBody.innerHTML = "";

  // Iterate over results and append rows to the table
  results.forEach((result) => {
    const row = document.createElement("tr");
    const fieldsToDisplay = [
      "candidateId",
      "fname",
      "lname",
      "c_rank",
      "c_vessel",
      "c_mobi1",
      "dob",
      "email1",
      "resume",
    ];
   
    fieldsToDisplay.forEach((field) => {
      const cell = document.createElement("td");
      // Format date fields if needed
      if (field === "dob" || field === "avb_date" || field === "las_date") {
        const date = new Date(result[field]).toLocaleDateString();
        cell.textContent = date;
      } else if (field === "candidateId") {
        // Create a clickable link for candidateId
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = result[field];
        link.onclick = (event) => {
          event.preventDefault(); // Prevent default link behavior
          viewCandidate(result[field]);
        };

        // Hover event to show discussion popup
        link.addEventListener("mouseenter", () =>
          showDiscussionPopup(link, result[field])
        );
        link.addEventListener("mouseleave", () => hideDiscussionPopup());

        cell.appendChild(link);
      } else {
        cell.textContent = result[field];
      }
      row.appendChild(cell);
    });

    // Add buttons for delete, edit, and view
    const deleteButton = createButton(
      "fa-trash",
      () => handleDelete(result.candidateId),
      "Delete"
    );
    const editButton = createButton(
      "fa-pencil-alt",
      () => handleEdit(result.candidateId),
      "Edit"
    );
    const viewButton = createButton(
      "fa-eye",
      () => handleView(result.candidateId),
      "View"
    );

    const buttonsCell = document.createElement("td");
    buttonsCell.appendChild(deleteButton);
    buttonsCell.appendChild(editButton);
    buttonsCell.appendChild(viewButton);

    row.appendChild(buttonsCell);

    tableBody.appendChild(row);
  });
}

let discussionTimeout; // Variable to store timeout ID
async function showDiscussionPopup(link, candidateId) {
  try {
    // Clear any existing timeout to prevent premature hiding
    clearTimeout(discussionTimeout);

    // Replace with your logic to fetch and display discussions related to candidateId
    const discussions = await fetchDiscussions(candidateId); // Example function to fetch discussions

    // Create Bootstrap card
    const card = document.createElement("div");
    card.className = "card discussion-popup-card";

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Header with candidate ID
    const header = document.createElement("h5");
    header.className = "card-title";
    header.textContent = `Discussions for Candidate ID: ${candidateId}`;
    cardBody.appendChild(header);

    // Discussions content
    discussions.forEach((discussion) => {
      const discussionItem = document.createElement("p");
      discussionItem.className = "card-text";
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

    card.style.position = "absolute";
    card.style.top = `${topPosition}px`;
    card.style.left = `${leftPosition}px`;

    // Append card to the body
    document.body.appendChild(card);
  } catch (error) {
    console.error("Error showing discussion popup:", error);
  }
}

// Function to hide discussion popup
function hideDiscussionPopup() {
  const card = document.querySelector(".discussion-popup-card");
  if (card) {
    card.remove();
  }
}

// Event listener to show discussion popup on hover
document.addEventListener("mouseover", (event) => {
  const link = event.target;
  if (link.tagName === "A" && link.classList.contains("candidate-link")) {
    const candidateId = link.textContent;
    showDiscussionPopup(link, candidateId);
  }
});

// Event listener to hide discussion popup when mouse leaves
document.addEventListener("mouseleave", (event) => {
  const link = event.target;
  if (link.tagName === "A" && link.classList.contains("candidate-link")) {
    hideDiscussionPopup();
  }
});

// Example function to fetch discussions (placeholder)
async function fetchDiscussions(candidateId) {
  try {
    // Replace with actual fetch logic from your data source
    const response = await axios.post(
      `${config.APIURL}candidate/hover-disc/${candidateId}`
    );
    const discussions = response.data;

    // Check if discussions is an array (or convert if necessary based on actual API response structure)
    if (Array.isArray(discussions)) {
      return discussions.map((discussion) => discussion.discussion);
    } else {
      // If discussions is not an array, handle it accordingly
      return [];
    }
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return []; // Return an empty array or handle the error as needed
  }
}

// Function to hide discussion popup

function viewCandidate(candidateId) {
  // Construct the URL with query parameter
  let url = "./view-candidate.html?id=" + candidateId;

  // Open the URL in a new tab/window
  window.open(url, "_blank");
}

function createButton(iconClass, onClickHandler, buttonText = null) {
  const button = document.createElement("button");
  button.classList.add("btn", "btn-primary", "btn-sm", "mx-1");

  if (buttonText !== null) {
    button.textContent = buttonText;
  }

  const icon = document.createElement("i");
  icon.classList.add("fa", iconClass);

  button.appendChild(icon);

  button.addEventListener("click", onClickHandler);

  return button;
}

// Usage

// Example event handlers
async function handleDelete(candidateId) {
  // Display a confirmation dialog
  const confirmDelete = window.confirm(
    `Are you sure you want to delete candidate with ID ${candidateId}?`
  );

  // Check if the user clicked OK in the confirmation dialog
  if (confirmDelete) {
    try {
      console.log(`Deleting candidate with ID ${candidateId}`);
      // Add your delete logic here
      await axios.delete(
        `${config.APIURL}candidate/delete-candidate/${candidateId}`,
        { headers: { Authorization: token } }
      );
      console.log(`Candidate with ID ${candidateId} successfully deleted.`);
    } catch (error) {
      console.error(`Error deleting candidate with ID ${candidateId}:`, error);
      // Handle the error, e.g., show an alert or log it
    }
  } else {
    console.log("Delete operation canceled.");
  }
}

function handleEdit(candidateId) {
  console.log(`Edit button clicked for candidateId ${candidateId}`);

  const canEdit = decodedToken.Write;
  if (canEdit) {
    console.log("Edited:", candidateId);
    window.open(`./edit-candidate-2.html?memId=${candidateId}`, "_blank");
    // Add your logic for editing here
  } else {
    alert("You do not have permission to edit this candidate.");
  }
}

function handleView(candidateId) {
  console.log(`View button clicked for candidateId ${candidateId}`);

  // Construct the URL with query parameter
  let url = `./view-candidate.html?id=${candidateId}`;

  // Open the URL in a new tab/window
  window.open(url, "_blank");
}

function populateTables(data) {
  // Clear existing rows
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";
  
  // Display candidateResults in the main table
  if (candiateList.candidateResults && candiateList.candidateResults.length > 0) {
    displayCandidateResults(candiateList.candidateResults);
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
function displayCandidateResults(results, page=1) {
  const tableBody = document.getElementById("table-body");
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedCandidates = results.slice(start, end);
  console.log(paginatedCandidates, 'paginatedCandidates')
  // Iterate over results and append rows to the table
  paginatedCandidates.forEach((result) => {
    const row = document.createElement("tr");
    const fieldsToDisplay = [
      "candidateId",
      "fname",
      "lname",
      "c_rank",
      "c_vessel",
      "c_mobi1",
      "dob",
      "email1",
      "resume",
    ];

    fieldsToDisplay.forEach((field) => {
      const cell = document.createElement("td");
      // Format date fields if needed
      if (field === "dob" || field === "avb_date" || field === "las_date") {
        const date = new Date(result[field]).toLocaleDateString();
        cell.textContent = date;
      } else if (field === "candidateId") {
        // Create a clickable link for candidateId
        const link = document.createElement("a");
        link.href = "#"; // Replace '#' with actual link or leave it as '#' if it's handled by click event
        link.textContent = result[field];
        link.onclick = (event) => {
          event.preventDefault(); // Prevent default anchor behavior
          viewCandidate(result[field]);
        };

        // Hover event to show discussion popup
        link.addEventListener("mouseenter", () =>
          showDiscussionPopup(link, result[field])
        );
        link.addEventListener("mouseleave", () => hideDiscussionPopup());

        cell.appendChild(link);
      } else {
        cell.textContent = result[field];
      }
      row.appendChild(cell);
    });

    // Add buttons for delete, edit, and view
    const deleteButton = createButton(
      "fa-trash",
      () => handleDelete(result.candidateId),
      "Delete"
    );
    const editButton = createButton(
      "fa-pencil-alt",
      () => handleEdit(result.candidateId),
      "Edit"
    );
    const viewButton = createButton(
      "fa-eye",
      () => handleView(result.candidateId),
      "View"
    );

    const buttonsCell = document.createElement("td");
    buttonsCell.appendChild(deleteButton);
    buttonsCell.appendChild(editButton);
    buttonsCell.appendChild(viewButton);

    row.appendChild(buttonsCell);

    tableBody.appendChild(row);
  });
  if(results.length>0) {
    var totalPages = Math.ceil(results.length)/10
    loadPagenation("paginationContainer",page, totalPages, results.length, 'candidate')
  }
  

}

async function loadPageData(page, tableType) {
  if(tableType==='candidate') {
    console.log(candiateList, 'candiateList')
    displayCandidateResults(candiateList.candidateResults, page);
  }
  
}

// Function to display bankResults in a separate table
function displayBankResults(bankResults) {
  const candidateIds = bankResults.map((result) => result.candidateId);

  // Check if there are candidateIds to fetch
  if (candidateIds.length > 0) {
    // Fetch candidate data for the unique candidateIds
    fetchCandidateData(candidateIds)
      .then((candidateData) => {
        // Display candidate data in the main table
        displayCandidateResults(candidateData.candidateResults);
      })
      .catch((error) => {
        console.error("Error fetching candidate data:", error);
      });
  }
}

// Function to display cdocumentsResults in a separate table
function displayCDocumentsResults(cdocumentsResults) {
  // Similar implementation to displayBankResults
}

async function showDiscussionPopup(link, candidateId) {
  try {
    // Clear any existing timeout to prevent premature hiding
    clearTimeout(discussionTimeout);
    hideAllDiscussionPopups(); // Ensure only one popup is open at a time

    // Fetch discussions data
    const discussions = await fetchDiscussions(candidateId);

    // Create Bootstrap card
    const card = document.createElement("div");
    card.className = "card discussion-popup-card";

    // Card body
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    // Header with candidate ID
    const header = document.createElement("h5");
    header.className = "card-title";
    header.textContent = `Discussions for Candidate ID: ${candidateId}`;
    cardBody.appendChild(header);

    // Discussions content
    discussions.forEach((discussion) => {
      const discussionItem = document.createElement("p");
      discussionItem.className = "card-text";
      discussionItem.textContent = `${
        discussion.discussion
      } - Created: ${new Date(discussion.created_date).toLocaleDateString()}`;
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

    card.style.position = "absolute";
    card.style.top = `${topPosition}px`;
    card.style.left = `${leftPosition}px`;

    // Append card to the body
    document.body.appendChild(card);

    // Set a timeout to hide the popup after 3 seconds
    discussionTimeout = setTimeout(() => {
      hideDiscussionPopup();
    }, 5000);
  } catch (error) {
    console.error("Error showing discussion popup:", error);
  }
}

// Function to hide discussion popup
function hideDiscussionPopup() {
  const card = document.querySelector(".discussion-popup-card");
  if (card) {
    card.remove();
  }
}
function hideAllDiscussionPopups() {
  const existingPopups = document.querySelectorAll(".discussion-popup-card");
  existingPopups.forEach((popup) => popup.remove());
}

// Example function to fetch discussions (placeholder)
async function fetchDiscussions(candidateId) {
  try {
    // Replace with actual fetch logic from your data source
    const response = await axios.post(
      `${config.APIURL}candidate/hover-disc/${candidateId}`
    );
    const discussionsData = response.data;

    // Check if discussionsData has discussions array
    if (Array.isArray(discussionsData)) {
      return discussionsData.map((discussion) => ({
        discussion: discussion.discussion,
        created_date: discussion.created_date,
      }));
    } else {
      return []; // Return empty array if no discussions found
    }
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return []; // Return empty array on error
  }
}

async function fetchCandidateData(candidateIds) {
  try {
    // Check if candidateIds is defined and not empty
    if (candidateIds && candidateIds.length > 0) {
      const response = await axios.get(
        `${config.APIURL}candidate/get-candidate/${candidateIds}`,
        { headers: { Authorization: token } }
      );
      console.log(response);
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
  const rankResponse = await axios.get(`${config.APIURL}others/get-ranks`, {
    headers: { Authorization: token },
  });
  const rankOptions = rankResponse?.data?.ranks || [];
  if(rankOptions.length>0) {
    const rankNames = rankOptions.map((rank) => rank.rank);
    loadDropdown("rank", rankNames, rankNames);
  }
  
};
displayDropdown();

const displayVesselTypeDropdown = async function () {
  try {
    const vesselResponse = await axios.get(
      `${config.APIURL}others/get-vessel`,
      { headers: { Authorization: token } }
    );
    const vessels = vesselResponse.data?.vessels || [];
    if(vessels.length>0) {
      const vesselNames = vessels.map((vessel) => vessel.vesselName);
      loadDropdown("vsl", vesselNames, vesselNames);
    }
   
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
};
displayVesselTypeDropdown();

async function fetchAndDisplayExp() {
  try {
    const serverResponse = await axios.get(
      `${config.APIURL}others/view-experience`,
      { headers: { Authorization: token } }
    );
    const experiences = serverResponse?.data?.experiences || []; // Access the array using response.data.experiences
    if(experiences.length>0) {
      const experince = experiences.map((item) => item.experience);
      loadDropdown("experience", experince, experince);
    }
  } catch (error) {
    console.error("Error fetching experiences:", error);
    // Handle error as needed
  }
}

fetchAndDisplayExp();

async function fetchAndDisplayGrades() {
  try {
    const serverResponse = await axios.get(
      `${config.APIURL}others/get-grades`,
      { headers: { Authorization: token } }
    );
    const grades = serverResponse?.data?.grades || [];
    if(grades.length>0) {
      const grade = grades.map((item) => item.gradeExp);
      loadDropdown("grade", grade, grade);
    }
    // Now the dropdown is populated with grade values
  } catch (error) {
    console.error("Error fetching grades:", error);
    // Handle error as needed
  }
}
fetchAndDisplayGrades();

const displayCountryDropdown = async function () {
  try {
    // Assuming the country data is an array of objects with the property "country"
    const countryResponse = await axios.get(
      `${config.APIURL}others/country-codes`,
      { headers: { Authorization: token } }
    );
    const countries = countryResponse?.data?.countryCodes || []; // Assuming the array is directly returned

    if(countries.length>0) {
      const country = countries.map((item) => item.country);
      loadDropdown("license", country, country);
    }

  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};
displayCountryDropdown();

window.onload = async function () {};

// Add event listener to the search input field
document
  .getElementById("clientSearchInput")
  .addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();
    filterTable(searchText);
  });

// Function to filter table rows based on search input
function filterTable(searchText) {
  const tableRows = document.querySelectorAll("#table-body tr");

  tableRows.forEach((row) => {
    const textContent = row.textContent.toLowerCase();
    if (textContent.includes(searchText)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
