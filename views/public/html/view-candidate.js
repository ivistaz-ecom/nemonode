// Check if the token is not present
if (!token) {
  // Redirect to the login page

  window.location.href = "./loginpage.html";
}

function formatDateNew(dateString) {
  if (dateString==="" || dateString===null || dateString === "1970-01-01" || dateString === "01-01-1970") {
    return ""; // Return empty string for invalid dates
  }

  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

function formatDate(dateString) {
  // Check for invalid date values
  if (dateString === "1970-01-01" || dateString === "01-01-1970") {
    return ""; // Return empty string for invalid dates
  }

  // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

function loadContent(section) {
  // Hide all content divs
  document.getElementById("personalContent").style.display = "none";
  document.getElementById("discussionContent").style.display = "none";
  document.getElementById("contractContent").style.display = "none";
  document.getElementById("documentContent").style.display = "none";
  document.getElementById("bankContent").style.display = "none";
  document.getElementById("travelContent").style.display = "none";
  document.getElementById("medicalContent").style.display = "none";
  document.getElementById("nkdContent").style.display = "none";
  document.getElementById("seaServiceContent").style.display = "none";
  document.getElementById("evaluationContent").style.display = "none";
  document.getElementById("filesContent").style.display = "none";
  document.getElementById("contractgenerationContent").style.display = "none";
  // Show the selected content div
  document.getElementById(`${section}Content`).style.display = "block";
  $("#contentContainer .btn").removeClass("active");
  $(`#tab-${section}`).addClass("active");
}

async function fetchAndDisplayDocumentDetails(candidateId) {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/get-document-details/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const documentDetails = response.data;
    const documentTableBody = document.getElementById("documentTableBody");
    documentTableBody.innerHTML = ""; // Clear existing rows

    const searchInput = document
      .getElementById("documentSearchInput")
      .value.toLowerCase(); // Get search input and convert to lowercase

    let index = 1;
    documentDetails.forEach((doc) => {
      // Check if search input matches any document details
      if (
        doc.document.toLowerCase().includes(searchInput) ||
        doc.document_number.toLowerCase().includes(searchInput) ||
        doc.issue_date.toLowerCase().includes(searchInput) ||
        doc.issue_place.toLowerCase().includes(searchInput) ||
        doc.stcw.toLowerCase().includes(searchInput) ||
        doc.expiry_date.toLowerCase().includes(searchInput)
      ) {
        const row = document.createElement("tr");

        // Add data to each cell
        row.innerHTML = `
                    <td>${index++}</td>
                    <td>${doc.document}</td>
                    <td>${doc.document_number}</td>
                    <td>${formatDateNew(doc.issue_date)}</td>
                    <td>${doc.issue_place}</td>
                    <td>${doc.document_files}</td>

                    <td><a href='${config.APIURL}views/public/files/${
          doc.document_files
        }' target="_blank">Click here to view!</a></td>
                    <td>${doc.stcw}</td>
                    <td>${formatDateNew(doc.expiry_date)}</td>
                    <td>
                        <button class="btn border-0 m-0 p-0" onclick="editDocument('${
                          doc.id
                        }','${doc.document}','${doc.document_number}','${
          doc.issue_date
        }','${doc.issue_place}','${doc.document_files}','${doc.stcw}','${
          doc.expiry_date
        }', event)">
                            <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                        </button>
                        <button class="btn border-0 m-0 p-0" onclick="deleteDocument('${
                          doc.id
                        }', event)">
                            <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                        </button>
                    </td>
                `;

        documentTableBody.appendChild(row);
      }
    });
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
}

const deleteDocument = async (documentId, event) => {
  event.preventDefault(); // Prevent default action of the event

  try {
    const response = await axios.delete(
      `${config.APIURL}document/delete/${documentId}`,
      {
        headers: {
          Authorization: token, // Assuming token is a valid authentication token
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      alert(response.data.message);
      // Optionally, refresh the document list or remove the deleted document's row from the table
    } else {
      alert(response.data.message);
    }
  } catch (error) {
    console.error("Error deleting document:", error);
    alert("Error deleting document");
  }
};

document
  .getElementById("documentSearchInput")
  .addEventListener("input", function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get("id");
    
    fetchAndDisplayDocumentDetails(candidateId);
  });

async function fetchAndDisplayBankDetails(candidateId) {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/get-bank-details/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const bankDetails = response.data;
    console.log(bankDetails);

    const generalBankList = document.getElementById("general-bank-list");
    const nriBankList = document.getElementById("nri-bank-list");

    generalBankList.innerHTML = ""; // Clear existing general bank list
    nriBankList.innerHTML = ""; // Clear existing NRI bank list

    let generalCount = 0;
    let nriCount = 0;

    bankDetails.forEach((bank, index) => {
      const bankDetailsHTML = `
                <li class="list-group-item">
                    <h5>S.no: ${index + 1}</h5>
                    <p><strong>Bank Name:</strong> ${bank.bank_name}</p>
                    <p><strong>Account Number:</strong> ${bank.account_num}</p>
                    <p><strong>Bank Address:</strong> ${bank.bank_addr}</p>
                    <p><strong>IFSC Code:</strong> ${bank.ifsc_code}</p>
                    <p><strong>Swift Code:</strong> ${bank.swift_code}</p>
                    <p><strong>Beneficiary:</strong> ${bank.beneficiary}</p>
                    <p><strong>Beneficiary Address:</strong> ${
                      bank.beneficiary_addr
                    }</p>
                    <p><strong>PAN Number:</strong> ${bank.pan_num}</p>
                    <p><strong>Passbook:</strong> <a href='${
                      config.APIURL
                    }views/public/bank_details/${
        bank.passbook
      }' target="_blank">View Document</a></p>
                    <p><strong>PAN Card:</strong> <a href='${
                      config.APIURL
                    }views/public/bank_details/pan_card/${
        bank.pan_card
      }' target="_blank">View Document</a></p>
                    <p><strong>Branch:</strong> ${bank.branch}</p>
                    <p><strong>Type:</strong> ${bank.types}</p>
                    <p><strong>Created By:</strong> ${bank.created_by}</p>
                    <div>
                        <button class="btn btn-primary btn-sm" onclick="editBank('${candidateId}','${
        bank.id
      }','${bank.bank_name}','${bank.account_num}','${bank.bank_addr}','${
        bank.ifsc_code
      }','${bank.swift_code}','${bank.beneficiary}','${
        bank.beneficiary_addr
      }','${bank.pan_num}','${bank.passbook}','${bank.pan_card}','${
        bank.branch
      }','${bank.types}', event)">
                            <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteBank('${
                          bank.id
                        }', event)">
                            <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i> Delete
                        </button>
                    </div>
                </li>
            `;

      if (bank.types.toLowerCase() === "nri") {
        nriBankList.innerHTML += bankDetailsHTML;
        nriCount++;
      } else if (bank.types.toLowerCase() === "general") {
        generalBankList.innerHTML += bankDetailsHTML;
        generalCount++;
      }
    });

    if (generalCount > 1) {
      alert("Invalid bank details. Contact admin.");
    }
  } catch (error) {
    console.error("Error fetching bank details:", error);
  }
}
function editBank(
  candidateId,
  id,
  bank_name,
  account_num,
  bank_addr,
  ifsc_code,
  swift_code,
  beneficiary,
  beneficiary_addr,
  pan_num,
  passbook,
  pan_card,
  branch,
  types,
  event
) {
  event.preventDefault();
  console.log("Edit clicked for bank ID:", id);

  // Construct the query parameters string
  const queryParams = `?memId=${candidateId}&id=${id}&bank_name=${encodeURIComponent(
    bank_name
  )}&account_num=${encodeURIComponent(
    account_num
  )}&bank_addr=${encodeURIComponent(bank_addr)}&ifsc_code=${encodeURIComponent(
    ifsc_code
  )}&swift_code=${encodeURIComponent(
    swift_code
  )}&beneficiary=${encodeURIComponent(
    beneficiary
  )}&beneficiary_addr=${encodeURIComponent(
    beneficiary_addr
  )}&pan_num=${encodeURIComponent(pan_num)}&passbook=${encodeURIComponent(
    passbook
  )}&pan_card=${encodeURIComponent(pan_card)}&branch=${encodeURIComponent(
    branch
  )}&types=${encodeURIComponent(types)}`;

  // Open edit-c-bank.html in a new tab with query parameters
  window.open(`edit-c-bank.html${queryParams}`, "_blank");
}

async function deleteBank(bankId) {
  const url = `${config.APIURL}candidate/delete-bank/${bankId}`; // Assuming the API endpoint is '/api/banks/:id'

  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: token, // Add authorization if needed
      },
    });

    // Handle success
    alert(response.data.message);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      alert(`Error: ${error.response.data.message}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      alert("No response received from the server.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
      alert("An error occurred while deleting the bank details.");
    }
  }
}

async function fetchAndDisplayTravelDetails(candidateId) {
  try {
    // Make an Axios request to your backend API to get travel details
    const response = await axios.get(
      `${config.APIURL}candidate/get-travel-details/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );
    let index = 1;
    // Clear existing table rows
    const travelTableBody = document.getElementById("travelTableBody");
    travelTableBody.innerHTML = "";

    // Iterate over the fetched data and append rows to the table
    response.data.forEach((travel) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${index++}</td>
                <td>${formatDateNew(travel.travel_date)}</td>
                <td>${travel.travel_from}</td>
                <td>${travel.travel_to}</td>
                <td>${travel.travel_mode}</td>
                <td>${travel.travel_status}</td>
                <td>${travel.ticket_number}</td>
                <td>${travel.agent_name}</td>
                <td>${travel.portAgent}</td>
                <td>${travel.travel_amount}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editTravel('${candidateId}','${
        travel.id
      }','${travel.travel_date}','${travel.travel_from}','${
        travel.travel_to
      }','${travel.travel_mode}','${travel.travel_status}','${
        travel.ticket_number
      }','${travel.agent_name}','${travel.portAgent}','${
        travel.travel_amount
      }',event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteTravel('${
                  travel.id
                }')">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;
      travelTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching travel details:", error);
  }
}

function editTravel(
  candidateId,
  id,
  travel_date,
  travel_from,
  travel_to,
  travel_mode,
  travel_status,
  ticket_number,
  agent_name,
  portAgent,
  travel_amount,
  event
) {
  event.preventDefault();
  console.log("Edit clicked for travel ID:", id);

  // Construct the query parameters string
  const queryParams = `?memId=${candidateId}&id=${id}&travel_date=${encodeURIComponent(
    travel_date
  )}&travel_from=${encodeURIComponent(
    travel_from
  )}&travel_to=${encodeURIComponent(
    travel_to
  )}&travel_mode=${encodeURIComponent(
    travel_mode
  )}&travel_status=${encodeURIComponent(
    travel_status
  )}&ticket_number=${encodeURIComponent(
    ticket_number
  )}&agent_name=${encodeURIComponent(
    agent_name
  )}&portAgent=${encodeURIComponent(
    portAgent
  )}&travel_amount=${encodeURIComponent(travel_amount)}`;

  // Open edit-c-travel.html in a new tab with query parameters
  window.open(`edit-c-travel.html${queryParams}`, "_blank");
}

// ... At the end of your JavaScript code
async function deleteTravel(travelId) {
  try {
    // Make an Axios request to your backend API to delete the travel entry
    const response = await axios.delete(
      `${config.APIURL}candidate/delete-travel/${travelId}`,
      {
        headers: { Authorization: token },
      }
    );

    // Handle success response from the server
    console.log("Travel deleted successfully:", response.data);

    // Fetch and display updated travel details
    await fetchAndDisplayTravelDetails();
  } catch (error) {
    // Handle error response from the server
    console.error("Error deleting travel:", error);
  }
}
// ...
function formatDates(dateString) {
  const parts = dateString.split("-"); // Split the date string into parts
  const year = parseInt(parts[0]); // Get the year
  const month = parseInt(parts[1]) - 1; // Get the month (months are 0-indexed in JavaScript)
  const day = parseInt(parts[2]); // Get the day

  // Construct the date object
  const date = new Date(year, month, day);

  // Now you can format the date as you need
  const formattedDate = date.toISOString().split("T")[0];

  return formattedDate;
}

async function fetchAndDisplayMedicalDetails(candidateId) {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/get-hospital-details/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const hospitalResponse = await axios.get(
      `${config.APIURL}others/get-hospital`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(hospitalResponse);
    const hospitalsmed = hospitalResponse.data.hospital;
    const hospitals = {}; // Map to store company details by ID
    hospitalsmed.forEach((hospital) => {
      hospitals[hospital.id] = hospital.hospitalName; // Store company details by ID
    });

    let index = 1;

    const medicalDetails = response.data;
    console.log(medicalDetails);
    const medicalTableBody = document.getElementById("hospitalTableBody");
    medicalTableBody.innerHTML = ""; // Clear existing rows

    medicalDetails.forEach((medical) => {
      const row = document.createElement("tr");

      const createCell = (value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        return cell;
      };
      const hospitalName = hospitals[medical.hospitalName];

      // Add data to each cell
      row.appendChild(createCell(index++));

      row.appendChild(createCell(hospitalName));
      row.appendChild(createCell(medical.place));
      row.appendChild(createCell(formatDateNew(medical.date)));
      row.appendChild(createCell(formatDateNew(medical.expiry_date))); // Update to match the Sequelize model
      row.appendChild(createCell(medical.done_by));
      row.appendChild(createCell(medical.status));
      row.appendChild(createCell(medical.amount));
      row.appendChild(createCell(medical.upload));

      const linkCell = document.createElement("td");
      const link = document.createElement("a");
      link.href = `${config.APIURL}views/public/uploads/medical/${medical.upload}`;
      link.textContent = "Click here to view!";
      linkCell.appendChild(link);
      row.appendChild(linkCell);

      const actionsCell = document.createElement("td");
      const editButton = document.createElement("button");
      editButton.className = "btn border-0 m-0 p-0";
      editButton.innerHTML =
        '<i class="fa fa-pencil" onMouseOver="this.style.color=\'seagreen\'" onMouseOut="this.style.color=\'gray\'"></i>';
      editButton.addEventListener("click", () =>
        editMedical(
          candidateId,
          medical.id,
          medical.hospitalName,
          medical.place,
          medical.date,
          medical.expiry_date,
          medical.done_by,
          medical.status,
          medical.amount,
          medical.upload
        )
      );

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn border-0 m-0 p-0";
      deleteButton.innerHTML =
        '<i class="fa fa-trash" onMouseOver="this.style.color=\'red\'" onMouseOut="this.style.color=\'gray\'"></i>';
      deleteButton.addEventListener("click", () => deleteMedical(medical.id));

      actionsCell.appendChild(editButton);
      actionsCell.appendChild(deleteButton);
      row.appendChild(actionsCell);

      // Append the row to the table body
      medicalTableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

const editMedical = async (
  candidateId,
  id,
  hospitalName,
  place,
  date,
  expiryDate,
  done_by,
  status,
  amount,
  uploadFile
) => {
  event.preventDefault();
  console.log(
    id,
    hospitalName,
    place,
    date,
    expiryDate,
    done_by,
    status,
    amount,
    uploadFile
  );

  // Format the expiryDate parameter using formatDate function if needed
  const formattedExpiryDate = formatDate(expiryDate); // Assuming formatDate function is defined and formats the date appropriately

  // Construct the query parameters string
  const queryParams = `?memId=${candidateId}&id=${id}&hospitalName=${encodeURIComponent(
    hospitalName
  )}&place=${encodeURIComponent(place)}&date=${encodeURIComponent(
    date
  )}&expiry_date=${encodeURIComponent(
    formattedExpiryDate
  )}&done_by=${encodeURIComponent(done_by)}&status=${encodeURIComponent(
    status
  )}&amount=${encodeURIComponent(amount)}&upload=${encodeURIComponent(
    uploadFile
  )}`;

  // Open edit-c-medicals.html in a new tab with query parameters
  window.open(`edit-c-medicals.html${queryParams}`, "_blank");
};

const deleteMedical = async (id) => {
  try {
    const confirmDelete = confirm(
      "Are you sure you want to delete this medical entry?"
    );
    if (confirmDelete) {
      const response = await axios.delete(
        `${config.APIURL}candidate/delete-medical/${id}`,
        { headers: { Authorization: token } }
      );
      console.log(response.data);
      // Fetch and display medical details again after deletion
      fetchAndDisplayMedicalDetails(candidateId);
    }
  } catch (error) {
    console.error("Error deleting medical entry:", error);
  }
};

const fetchAndDisplayNkdData = async (candidateId) => {
  try {
    const response = await axios.get(
      `${config.APIURL}candidate/get-nkd-details/${candidateId}`,
      { headers: { Authorization: token } }
    );

    // Assuming response.data contains an array of NKD objects
    const nkdData = response.data;
    let index = 1;
    // Get the table body element
    const tableBody = document.getElementById("nkdTableBody");
    tableBody.innerHTML = ""; // Clear existing table content

    // Iterate through the NKD data and append rows to the table
    nkdData.forEach((nkd) => {
      const row = tableBody.insertRow();
      row.insertCell(0).innerText = index++;
      row.insertCell(1).innerText = nkd.kin_name;
      row.insertCell(2).innerText = nkd.kin_relation;
      row.insertCell(3).innerText = nkd.kin_contact_number;
      row.insertCell(4).innerText = nkd.kin_contact_address;

      // Create a new cell for kin_priority with the specified class
      const priorityCell = row.insertCell(5);
      priorityCell.innerHTML = `<span class="badge ${getPriorityClass(
        nkd.kin_priority
      )}">${nkd.kin_priority}</span>`;

      const editButton = document.createElement("button");
      editButton.className = "btn border-0 m-0 p-0";
      editButton.innerHTML =
        '<i class="fa fa-pencil" onMouseOver="this.style.color=\'seagreen\'" onMouseOut="this.style.color=\'gray\'"></i>';
      editButton.addEventListener("click", () =>
        editNkd(
          candidateId,
          nkd.id,
          nkd.kin_name,
          nkd.kin_relation,
          nkd.kin_contact_number,
          nkd.kin_contact_address,
          nkd.kin_priority
        )
      );

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn border-0 m-0 p-0";
      deleteButton.innerHTML =
        '<i class="fa fa-trash" onMouseOver="this.style.color=\'red\'" onMouseOut="this.style.color=\'gray\'"></i>';
      deleteButton.addEventListener("click", () => deleteNkd(nkd.id));

      // Add buttons to the row
      const cell = row.insertCell(6);
      cell.appendChild(editButton);
      cell.appendChild(deleteButton);
    });
  } catch (error) {
    console.error("Error fetching NKD data:", error);
  }
};

// Function to determine the class based on priority value
function getPriorityClass(priority) {
  // Adjust this logic as needed based on your priority criteria
  if (priority === "HIGH") {
    return "bg-danger";
  } else if (priority === "MID") {
    return "bg-warning";
  } else {
    return "bg-info";
  }
}

function editNkd(
  candidateId,
  id,
  kinName,
  kinRelation,
  kinContactNumber,
  kinContactAddress,
  kinPriority
) {
  console.log(`Editing NKD with ID: ${id}`);

  // Construct the query parameters string
  const queryParams = `?memId=${candidateId}&id=${id}&kinName=${encodeURIComponent(
    kinName
  )}&kinRelation=${encodeURIComponent(
    kinRelation
  )}&kinContactNumber=${encodeURIComponent(
    kinContactNumber
  )}&kinContactAddress=${encodeURIComponent(
    kinContactAddress
  )}&kinPriority=${encodeURIComponent(kinPriority)}`;

  // Open edit-c-nkd.html in a new tab with query parameters
  window.open(`edit-c-nkd.html${queryParams}`, "_blank");
}
// Function to delete NKD entry
async function deleteNkd(id) {
  try {
    const confirmDelete = confirm(
      "Are you sure you want to delete this NKD entry?"
    );
    if (confirmDelete) {
      const response = await axios.delete(
        `${config.APIURL}candidate/delete-nkd/${id}`,
        { headers: { Authorization: token } }
      );
      console.log(response.data);
      // Fetch and display NKD data again after deletion
      fetchAndDisplayNkdData();
    }
  } catch (error) {
    console.error("Error deleting NKD entry:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    function getCandidateIdFromUrl() {
      // Get the query parameters from the current URL
      const urlParams = new URLSearchParams(window.location.search);

      // Retrieve the candidateId from the query parameters
      const candidateId = urlParams.get("id");
      document.title=`${candidateId} | Manage Candidate | Nsnemo`;
      return candidateId;
    }

    // Example usage
    const candidateId = getCandidateIdFromUrl();
    if (candidateId !== "") {
      showLoader("personalContent");
    }
    $("#applicationURL").val(
      `${config.APIURL}views/public/html/applicationform.html?id=${candidateId}`
    );

    console.log(`Candidate ID from URL: ${candidateId}`);
    memId.textContent = candidateId;
    await fetchAndDisplayDiscussions(candidateId);
    await displayCandidateDetails();
    await fetchAndDisplayContractDetails(candidateId);
    await fetchAndDisplayDocumentDetails(candidateId);
    await fetchAndDisplayBankDetails(candidateId);
    await fetchAndDisplayTravelDetails(candidateId);
    await fetchAndDisplayMedicalDetails(candidateId);
    await fetchAndDisplayNkdData(candidateId);
    await fetchAndDisplaySeaService(candidateId);
    await fetchAndDisplayEvaluationData(candidateId);
    updateCandidatePhoto(candidateId);
    fetchAndDisplayFiles(candidateId);
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== "vendor") {
      document.getElementById("userManagementSection").style.display = "block";
      document.getElementById("userManagementSections").style.display = "block";
    }
    if (vendorManagement) {
      document.getElementById("vendorManagementSection").style.display =
        "block";
      document.getElementById("vendorManagementSections").style.display =
        "block";
    }

    // You can call loadContent function here if needed
    // loadContent('personal'); // Example: Load personal information by default
    async function nationalityFetch(nationalityId) {
      try {
        console.log(nationalityId);
        const nationality = await axios.get(
          `${config.APIURL}others/country-codes`
        );
        const countries = nationality.data.countryCodes;
        let id = nationalityId;
        for (const country of countries) {
          if (id == country.code) {
            return country.country;
          }
        }

        // If no match found
      } catch (error) {
        console.error("Error fetching nationality:", error);
        return null; // or throw error based on your preference
      }
    }

    async function displayCandidateDetails() {
      try {
        // Fetch candidate data based on the candidate ID
        const urlParams = new URLSearchParams(window.location.search);

        // Get the candidateId from the URL parameter
        const id = urlParams.get("id");
        console.log(id);
        const response = await axios.get(
          `${config.APIURL}candidate/get-candidate/${id}`,
          { headers: { Authorization: token } }
        );
        const candidateData = response.data.candidate;
        hideLoader("personalContent");
        document.getElementById("creator").textContent =
          candidateData.createdby;
        document.getElementById("editor").textContent = candidateData.editedby;
        document.getElementById("candidateId").value =
          candidateData.candidateId;
        document.getElementById("edit_candidate_c_rank").value =
          candidateData.c_rank;
        nationalityFetch(candidateData.nationality)
          .then((nationality) => {
            document.getElementById("edit_candidate_nationality").value =
              nationality;
          })
          .catch((error) => {
            console.error("Error setting nationality:", error);
            // Handle error
          });
        document.getElementById("edit_candidate_c_vessel").value =
          candidateData.c_vessel;
        document.getElementById("edit_candidate_experience").value =
          candidateData.experience;
        document.getElementById("edit_candidate_grade").value =
          candidateData.grade;
        // document.getElementById('edit_candidate_I_country').value = candidateData.l_country;

        document.getElementById("edit_candidate_fname").value =
          candidateData.fname;
        document.getElementById("edit_candidate_lname").value =
          candidateData.lname;
        document.getElementById("edit_candidate_avb_date").value = formatDate(
          candidateData.avb_date
        );
        document.getElementById("edit_candidate_dob").value = formatDate(
          candidateData.dob
        );
        document.getElementById("edit_candidate_company_status").value =
          candidateData.company_status;
        document.getElementById("edit_candidate_birth_place").value =
          candidateData.birth_place;
        document.getElementById("edit_candidate_work_nautilus").value =
          candidateData.work_nautilus;
        document.getElementById("edit_candidate_experience").value =
          candidateData.experience;
        document.getElementById("edit_candidate_zone").value =
          candidateData.zone;

        document.getElementById("edit_candidate_boiler_suit_size").value =
          candidateData.boiler_suit_size;
        document.getElementById("edit_candidate_safety_shoe_size").value =
          candidateData.safety_shoe_size;
        document.getElementById("edit_candidate_height").value =
          candidateData.height;
        document.getElementById("edit_candidate_weight").value =
          candidateData.weight;
        document.getElementById("edit_candidate_p_mobi1").value =
          candidateData.p_mobi1;
        nationalityFetch(candidateData.l_country)
          .then((nationality) => {
            document.getElementById("edit_candidate_I_country").value =
              nationality;
          })
          .catch((error) => {
            console.error("Error setting nationality:", error);
            // Handle error
          });
        document.getElementById("edit_candidate_indos_number").value =
          candidateData.indos_number;
        document.getElementById("edit_company_status").value =
          candidateData.m_status;
        document.getElementById("edit_candidate_group").value =
          candidateData.group;
        document.getElementById("edit_candidate_nemo_source").value =
          candidateData.nemo_source;
        document.getElementById("edit_candidate_active_details").value =
          candidateData.active_details === 1 ? "Active" : "Inactive";
      
          $("#viewApplication")
            .show()
            .attr(
              "href",
              `${config.APIURL}views/public/html/viewapplicationform.html?id=${candidateId}`
            );
        // Assuming you have the candidateData object available
        const photoName = candidateData.photos;
        const resumeName = candidateData.resume;

        const prevPhotoButton = document.getElementById("prevPhoto");
        const prevResButton = document.getElementById("prevRes");
       /*  if (photoName) {
          prevPhotoButton.value = photoName;
          prevPhotoButton.onclick = function () {
            window.open(
              `${config.APIURL}views/public/files/photos/${photoName}`,
              "_blank"
            );
          };
          $("#imageContainer img").show();
        } else {

          prevPhotoButton.value = "No photo available";
          prevPhotoButton.onclick = function () {
            alert("No photo available");
          };
        } */

        if (resumeName) {
          prevResButton.value = resumeName;
          prevResButton.onclick = function () {
            window.open(
              `${config.APIURL}views/public/files/resume/${resumeName}`,
              "_blank"
            );
          };
        } else {
          prevResButton.value = "No resume available";
          prevResButton.onclick = function () {
            alert("No resume available");
          };
        }

        document.getElementById("edit_candidate_c_ad1").value =
          candidateData.c_ad1;
        document.getElementById("edit_candidate_city").value =
          candidateData.c_city;
        document.getElementById("edit_candidate_state").value =
          candidateData.c_state;
        document.getElementById("edit_candidate_pin").value =
          candidateData.c_pin;
        document.getElementById("edit_candidate_c_mobi1").value =
          candidateData.c_mobi1;
        document.getElementById("nearest_airport").value =
          candidateData.nearestAirport;
        document.getElementById("totalChild").value =
          candidateData.totalChild;
        document.getElementById("edit_candidate_email1").value =
          candidateData.email1;
        document.getElementById("edit_candidate_c_tel1").value =
          candidateData.c_tel1;
        document.getElementById("edit_candidate_c_ad2").value =
          candidateData.c_ad2;
        document.getElementById("edit_candidate_p_city").value =
          candidateData.p_city;
        document.getElementById("edit_candidate_c_state").value =
          candidateData.p_state;
        document.getElementById("edit_candidate_p_pin").value =
          candidateData.p_pin;
        document.getElementById("edit_candidate_c_mobi2").value =
          candidateData.c_mobi2;
        document.getElementById("edit_candidate_c_tel2").value =
          candidateData.c_tel2;
        document.getElementById("edit_candidate_email2").value =
          candidateData.email2;
        document.getElementById("edit_candidate_us_visa").value =
          candidateData.us_visa;

        // Call the function to update the photo

        // Hidden fields
      } catch (error) {
        console.error("Error displaying candidate details:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching and displaying data:", error);
  }
});

async function editCandidate() {
  // Get values from the form
  var id = document.getElementById("candidateId").value; // Add the ID value if applicable

  // Construct the URL with the values
  var url = `edit-candidate-2.html?memId=${id}`;

  // Redirect to the edit-candidate-2.html page
  window.location.href = url;
}

// Add an event listener to the form submission
document
  .getElementById("view-candidate-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    editCandidate();
  });

function editDocument(
  documentId,
  documents,
  documentNumber,
  issueDate,
  issuePlace,
  documentFiles,
  stcw
) {
  // Retrieve memId from localStorage
  const urlParams = new URLSearchParams(window.location.search);

  // Get the candidateId from the URL parameter
  const candidateId = urlParams.get("id");

  // Construct the query parameters string
  const queryParams = `?memId=${candidateId}&documentId=${documentId}&documents=${encodeURIComponent(
    documents
  )}&documentNumber=${encodeURIComponent(
    documentNumber
  )}&issueDate=${encodeURIComponent(issueDate)}&issuePlace=${encodeURIComponent(
    issuePlace
  )}&documentFiles=${encodeURIComponent(
    documentFiles
  )}&stcw=${encodeURIComponent(stcw)}`;

  // Open edit-c-document.html in a new tab with query parameters
  window.open(`./edit-c-document.html${queryParams}`, "_blank");
}

function updateDateTime() {
  const dateTimeElement = document.getElementById("datetime");
  const now = new Date();

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    ordinal: "numeric",
  };

  const dateTimeString = now.toLocaleString("en-US", options);

  dateTimeElement.textContent = dateTimeString;
}

// Update date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);

async function fetchAndDisplayContractDetails(id) {
  try {
    const candidateId = id;
    const response = await axios.get(
      `${config.APIURL}candidate/get-contract-details/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const companyResponse = await axios.get(
      `${config.APIURL}company/dropdown-company`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const companies = {};
    companyResponse.data.companies.forEach((company) => {
      companies[company.company_id] = company.company_name;
    });

    const portsResponse = await axios.get(`${config.APIURL}others/get-ports`, {
      headers: {
        Authorization: token,
      },
    });
    const ports = {};
    portsResponse.data.ports.forEach((port) => {
      ports[port.id] = port.portName;
    });

    const vesselsResponse = await axios.get(`${config.APIURL}others/get-vsls`, {
      headers: {
        Authorization: token,
      },
    });
    const vessels = {};
    vesselsResponse.data.vessels.forEach((vessel) => {
      vessels[vessel.id] = vessel.vesselName;
    });

    const contractDetails = response.data;
    contractDetails.sort((a, b) => b.id - a.id);

    const contractTableBody = document.getElementById("contractTableBody");
    contractTableBody.innerHTML = "";
    let index = 1;
    contractDetails.forEach((contract) => {
      const row = document.createElement("tr");

      const companyName = companies[contract.company];
      const signOffPortName = ports[contract.sign_off_port];
      const signOnPortName = ports[contract.sign_on_port];
      const vesselName = vessels[contract.vslName];

      // Calculate duration between sign_on and sign_off dates
      let badgeText = "";
      if (contract.sign_off === "1970-01-01") {
        // Calculate duration from sign_on to today's date
        const signOnDate = new Date(contract.sign_on);
        const today = new Date();
        const diffTime = Math.abs(today - signOnDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        badgeText = `${months} months and ${days} days`;
      } else {
        // Calculate duration between sign_on and sign_off
        const signOnDate = new Date(contract.sign_on);
        const signOffDate = new Date(contract.sign_off);
        const diffTime = Math.abs(signOffDate - signOnDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        badgeText = `${months} months and ${days} days`;
      }

      function calculateContractDuration(signOn, eoc) {
        if (
          !signOn ||
          signOn === "1970-01-01" ||
          !eoc ||
          eoc === "1970-01-01"
        ) {
          return "Both sign_on and eoc must be updated for duration of contract to reflect";
        }

        const signOnDate = new Date(signOn);
        const endDate = new Date(eoc);
        const diffTime = Math.abs(endDate - signOnDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        return `${months} months and ${days} days`;
      }

      const contractDuration = calculateContractDuration(
        contract.sign_on,
        contract.eoc
      );

      row.innerHTML = `
                <td>${index++}</td>
                <td>${contract.rank}</td>
                <td>${companyName}</td>
                <td>${vesselName}</td>
                <td>${contract.vesselType}</td>
                <td>${signOnPortName}</td>
                <td>${formatDateNew(contract.sign_on)}</td>
                <td>${formatDateNew(contract.sign_on_dg)}</td>
                <td>${formatDateNew(contract.wage_start)}</td>
                <td>${formatDateNew(contract.eoc)}</td>
                <td>${contract.contractExtension}</td>
                <td>${contract.contractExtensionDays}</td>
                <td>${contract.wages}</td>
                <td>${contract.currency}</td>
                <td>${contract.wages_types}</td>
                <td>${formatDateNew(contract.sign_off)}</td>
                <td>${formatDateNew(contract.sign_off_dg)}</td>
                <td>${signOffPortName}</td>
                <td>${contract.reason_for_sign_off}</td>
                <td>${contract.aoa_number}</td>
                <td>${contract.emigrate_number}</td>
                <td>${contract.documents}</td>
                <td><a href='${config.APIURL}views/public/uploads/contract/${
        contract.documents
      }' target="_blank">Click here to view Document!</a></td>
                <td>${contract.aoa}</td>
                <td><a href='${config.APIURL}views/public/uploads/aoa/${
        contract.aoa
      }' target="_blank">Click here to view AOA!</a></td>
                <td>${contract.openingBalance}</td>
                <td>${contract.basicWages}</td>
                <td>${contract.leaveWages}</td>
                <td>${contract.overtimeWages}</td>
                <td>${contract.leaveSubsistence}</td>
                <td>${contract.consolidateAllowance}</td>
                <td>${contract.fixedOvertime}</td>
                <td>${contract.subsistenceAllowance}</td>
                <td>${contract.uniformAllowance}</td>
                <td>${contract.miscAllowance}</td>
                <td>${contract.otherAllowance}</td>
                <td>${contract.onboardOtWages}</td>
                <td>${contract.joiningBasic}</td>
                <td>${contract.tankCleaningBonus}</td>
                <td>${contract.additionalWorks}</td>
                <td>${contract.prevMonthBalance}</td>
                <td>${contract.reimbursement}</td>
                <td>${contract.radio}</td>
                <td>${contract.onboardFinalSettlement}</td>
                <td>${contract.otherDeductions}</td>
                <td>${contract.training}</td>
                <td>${contract.bondStore}</td>
                <td>${contract.cdc_passport}</td>
                <td>${contractDuration}</td>
                <td >${badgeText}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editContract(
                    '${candidateId}',
                    '${contract.id}',
                    '${contract.rank}',
                    '${contract.company}',
                    '${contract.vslName}',
                    '${contract.vesselType}',
                    '${contract.sign_on_port}',
                    '${contract.sign_on}',
                    '${contract.sign_on_dg}',
                    '${contract.wage_start}',
                    '${contract.eoc}',
                    '${contract.wages}',
                    '${contract.currency}',
                    '${contract.wages_types}',
                    '${contract.sign_off}',
                    '${contract.sign_off_dg}',
                    '${contract.sign_off_port}',
                    '${contract.reason_for_sign_off}',
                    '${contract.aoa_number}',
                    '${contract.aoa}',
                   
                    '${contract.emigrate_number}',
    
                    '${contract.documents}',

                    '${contract.openingBalance}',
                    '${contract.basicWages}',
                    '${contract.leaveWages}',
                    '${contract.overtimeWages}',
                    '${contract.leaveSubsistence}',
                    '${contract.consolidateAllowance}',
                    '${contract.fixedOvertime}',
                    '${contract.subsistenceAllowance}',
                    '${contract.uniformAllowance}',
                    '${contract.miscAllowance}',
                    '${contract.otherAllowance}',
                    '${contract.onboardOtWages}',
                    '${contract.joiningBasic}',
                    '${contract.tankCleaningBonus}',
                    '${contract.additionalWorks}',
                    '${contract.prevMonthBalance}',
                    '${contract.reimbursement}',
                    '${contract.radio}',
                    '${contract.onboardFinalSettlement}',
                    '${contract.otherDeductions}',
                    '${contract.training}',
                    '${contract.bondStore}',
                    '${contract.cdc_passport}',
                    '${contract.contractExtension}',
                    '${contract.contractExtensionDays}',
                    '${contract.created_by}')">                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteContract('${
                      contract.id
                    }',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                    <td>
                <button class="btn btn-danger p-0 ps-1 pe-1" onclick="generatePayslip('${candidateId}', '${
        contract.id
      }')"><small>Pay Slip</small></button>
            </td>
                </td>
            `;

      contractTableBody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

async function generatePayslip(candidateId, contractId) {
  try {
    const response = await axios.post(
      `${config.APIURL}candidate/generate-payslip`,
      {
        candidateId: candidateId,
        contractId: contractId,
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      alert("Payslips generated successfully");
      window.location.href = `./payslips.html?contractId=${contractId}`;
    } else {
      alert("Failed to generate payslips");
    }
  } catch (err) {
    console.error(err);
    alert("Error generating payslips");
  }
}

function editContract(
  candidateId,
  id,
  rank,
  company,
  vslName,
  vesselType,
  sign_on_port,
  sign_on,
  sign_on_dg,
  wage_start,
  eoc,
  wages,
  currency,
  wages_types,
  sign_off,
  sign_off_dg,
  sign_off_port,
  reason_for_sign_off,
  aoa_number,
  aoa,
  emigrate_number,
  documents,
  openingBalance,
  basicWages,
  leaveWages,
  overtimeWages,
  leaveSubsistence,
  consolidateAllowance,
  fixedOvertime,
  subsistenceAllowance,
  uniformAllowance,
  miscAllowance,
  otherAllowance,
  onboardOtWages,
  joiningBasic,
  tankCleaningBonus,
  additionalWorks,
  prevMonthBalance,
  reimbursement,
  radio,
  onboardFinalSettlement,
  otherDeductions,
  training,
  bondStore,
  cdc_passport,
  contractExtension,
  contractExtensionDays,
  created_by
) {
  // Construct the query parameters string
  const queryParams = `?candidateId=${candidateId}&id=${id}&rank=${encodeURIComponent(
    rank
  )}&company=${encodeURIComponent(company)}&vslName=${encodeURIComponent(
    vslName
  )}&vesselType=${encodeURIComponent(
    vesselType
  )}&sign_on_port=${encodeURIComponent(
    sign_on_port
  )}&sign_on=${encodeURIComponent(sign_on)}&sign_on_dg=${encodeURIComponent(sign_on_dg)}&wage_start=${encodeURIComponent(
    wage_start
  )}&eoc=${encodeURIComponent(eoc)}&wages=${encodeURIComponent(
    wages
  )}&currency=${encodeURIComponent(currency)}&wages_types=${encodeURIComponent(
    wages_types
  )}&sign_off=${encodeURIComponent(
    sign_off
  )}&sign_off_dg=${encodeURIComponent(
    sign_off_dg
  )}&sign_off_port=${encodeURIComponent(
    sign_off_port
  )}&reason_for_sign_off=${encodeURIComponent(
    reason_for_sign_off
  )}&aoa_number=${encodeURIComponent(aoa_number)}&aoa=${encodeURIComponent(
    aoa
  )}&emigrate_number=${encodeURIComponent(
    emigrate_number
  )}&documents=${encodeURIComponent(
    documents
  )}&openingBalance=${encodeURIComponent(
    openingBalance
  )}&basicWages=${encodeURIComponent(
    basicWages
  )}&leaveWages=${encodeURIComponent(
    leaveWages
  )}&overtimeWages=${encodeURIComponent(
    overtimeWages
  )}&leaveSubsistence=${encodeURIComponent(
    leaveSubsistence
  )}&consolidateAllowance=${encodeURIComponent(
    consolidateAllowance
  )}&fixedOvertime=${encodeURIComponent(
    fixedOvertime
  )}&subsistenceAllowance=${encodeURIComponent(
    subsistenceAllowance
  )}&uniformAllowance=${encodeURIComponent(
    uniformAllowance
  )}&miscAllowance=${encodeURIComponent(
    miscAllowance
  )}&otherAllowance=${encodeURIComponent(
    otherAllowance
  )}&onboardOtWages=${encodeURIComponent(
    onboardOtWages
  )}&joiningBasic=${encodeURIComponent(
    joiningBasic
  )}&tankCleaningBonus=${encodeURIComponent(
    tankCleaningBonus
  )}&additionalWorks=${encodeURIComponent(
    additionalWorks
  )}&prevMonthBalance=${encodeURIComponent(
    prevMonthBalance
  )}&reimbursement=${encodeURIComponent(
    reimbursement
  )}&radio=${encodeURIComponent(
    radio
  )}&onboardFinalSettlement=${encodeURIComponent(
    onboardFinalSettlement
  )}&otherDeductions=${encodeURIComponent(
    otherDeductions
  )}&training=${encodeURIComponent(training)}&bondStore=${encodeURIComponent(
    bondStore
  )}&cdc_passport=${cdc_passport}&contractExtension=${contractExtension}&contractExtensionDays=${contractExtensionDays}&created_by=${encodeURIComponent(
    created_by
  )}}`;

  // Open edit-c-contract.html in a new tab with query parameters
  window.open(`edit-c-contract.html${queryParams}`, "_blank");
}

async function deleteContract(contractId) {
  try {
    const response = await axios.delete(
      `${config.APIURL}candidate/delete-contract/${contractId}`,
      {
        headers: {
          Authorization: `${localStorage.getItem("token")}`, // Include any necessary authentication tokens here
        },
      }
    );

    console.log("Success:", response.data.message);
    // Optionally, update the UI or inform the user about the successful deletion
  } catch (error) {
    if (error.response) {
      // The request was made, and the server responded with a status code
      console.error(
        "Error:",
        error.response.data.message || "Error deleting contract"
      );
      // Display an error message to the user (e.g., using an alert or updating the UI)
    } else {
      // Something happened in setting up the request that triggered an error
      console.error("Error:", error.message);
    }
  }
}

async function fetchAndDisplaySeaService(candidateId) {
  try {
    let index = 1;
    const response = await axios.get(
      `${config.APIURL}candidate/get-sea-service/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );

    const seaServices = response.data;

    // Check if seaServices is an array
    if (Array.isArray(seaServices)) {
      const seaServiceList = document.getElementById("seaServiceList");
      seaServiceList.innerHTML = ""; // Clear existing data

      seaServices.forEach((seaService) => {
        const seaServiceRow = document.createElement("tr");
        seaServiceRow.innerHTML = `
                <td>${index++}</td>
                    <td>${formatDateNew(seaService.from1)}</td>
                    <td>${formatDateNew(seaService.to1)}</td>
                  <td>${(seaService.company!==null)?seaService.company:''}</td>
                  <td>${(seaService.rank!==null)?seaService.rank:''}</td>
                  <td>${(seaService.vessel!==null)?seaService.vessel:''}</td>
                  <td>${(seaService.Flag!==null)?seaService.Flag:''}</td>
                  <td>${(seaService.KWT!==null)?seaService.KWT:''}</td>
                  <td>${(seaService.GRT!==null)?seaService.GRT:''}</td>
                  <td>${(seaService.DWT!==null)?seaService.DWT:''}</td>
                  <td>${(seaService.Engine!==null)?seaService.Engine:''}</td>
                  <td>${(seaService.type!==null)?seaService.type:''}</td>
                  <td>${(seaService.total_MMDD!==null)?seaService.total_MMDD:''}</td>
                  <td>${(seaService.reason_for_sign_off!==null)?seaService.reason_for_sign_off:''}</td>
                    <td>
                      
                        <button class="btn border-0 m-0 p-0" onclick="editSeaService('${candidateId}','${
          seaService.id
        }')">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteSeaService('${
                      seaService.id
                    }',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                    </td>
                `;
        seaServiceList.appendChild(seaServiceRow);
      });
    } else {
      console.error(
        "Sea service data is not in the expected format:",
        seaServices
      );
    }
  } catch (error) {
    console.error("Error fetching and displaying sea service records:", error);
  }
}

async function deleteSeaService(id) {

  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want to delete this sea service record?",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    preConfirm: () => {
      Swal.showLoading();
      return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Resolve or reject based on your condition
            resolve("Success");
            // Or use reject("Error message") for failure
        }, 2000);
    }).catch(error => {
        Swal.showValidationMessage(`Error: ${error}`);
    });
  }
}).then(async(result) => {
  if (result.value) {
    try {
    await axios.delete(
      `${config.APIURL}candidate/delete-sea-service/${id}`,
      { headers: { Authorization: token } }
    );
    const urlParams = new URLSearchParams(window.location.search);
    Swal.fire({
        title: 'Done!',
        text: 'Deleted successful.',
        icon: 'success',
      });
    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get("id");
      // Remove the corresponding row from the table
    fetchAndDisplaySeaService(candidateId)
    } catch (error) {
      console.error("Error deleting sea service record:", error);
    }
  }
})
}

function editSeaService(candidateId, id) {
  // Open seaserviceedit.html in a new tab with the ID parameter
  window.open(`seaservicetable.html?memId=${candidateId}&id=${id}`, "_blank");
}

async function fetchAndDisplayDiscussions(candidateId) {
  try {
    const serverResponse = await axios.get(
      `${config.APIURL}candidate/get-discussionplus-details/${candidateId}`,
      { headers: { Authorization: token } }
    );
    let discussions = serverResponse.data.discussions;

    // Sort discussions by created_date in descending order
    discussions.sort(
      (a, b) => new Date(b.created_date) - new Date(a.created_date)
    );

    // Assuming you have an element in your HTML to display discussions
    const discussionsContainer = document.getElementById("fetchedcomments");
    discussionsContainer.innerHTML = ""; // Clear previous discussions

    for (const discussion of discussions) {
      const discussionElement = document.createElement("div");
      discussionElement.classList.add("discussion"); // Add CSS class for styling

      // Fetch username based on user ID (post_by value)
      const usernameResponse = await axios
        .get(`${config.APIURL}user/get-user/${discussion.post_by}`, {
          headers: { Authorization: token },
        })
        .catch((e) => {});
      const username = usernameResponse?.data?.user?.userName || "Admin";

      // Format the created date
      const createdDate = new Date(discussion.created_date);
      const formattedDate = `${createdDate.getDate()}/${
        createdDate.getMonth() + 1
      }/${createdDate.getFullYear()}`;

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
    console.error("Error fetching discussions:", error);
  }
}

// Fetch and display evaluation data for the candidate
async function fetchAndDisplayEvaluationData() {
  try {
    // Fetch evaluation data from the server
    const urlParams = new URLSearchParams(window.location.search);

    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get("id");

    const response = await axios.get(
      `${config.APIURL}candidate/evaluation-data/${id}`
    );

    // Extract evaluation data from the response
    const evaluationData = response.data; // Access data property

    // Display evaluation data in a table
    displayEvaluationData(evaluationData);
  } catch (error) {
    console.error("Error fetching evaluation data:", error.message);
    // Optionally, you can display an error message to the user
  }
}

// Function to display evaluation data in a table
function displayEvaluationData(evaluationData) {
  const tableBody = document.getElementById("evaluationTableBody");
  let index = 1;
  // Clear existing table rows
  tableBody.innerHTML = "";

  // Iterate over evaluation data and create table rows
  evaluationData.forEach((evaluation) => {
    const row = tableBody.insertRow();

    const indexrow = row.insertCell();
    indexrow.textContent = index++;
    // Insert cells into the row
    const evalTypeCell = row.insertCell();
    evalTypeCell.textContent = evaluation.eval_type;

    const interviewerNameCell = row.insertCell();
    interviewerNameCell.textContent = evaluation.interviewer_name;

    const appliedRankCell = row.insertCell();
    appliedRankCell.textContent = evaluation.applied_rank;

    const appliedDateCell = row.insertCell();
    appliedDateCell.textContent = evaluation.applied_date;

    const timeCell = row.insertCell();
    timeCell.textContent = evaluation.time;

    const remoteCell = row.insertCell();
    remoteCell.textContent = evaluation.remote;

    const appliedByCell = row.insertCell();
    appliedByCell.textContent = evaluation.applied_by;
  });
}

// Call the function to fetch and display evaluation data
fetchAndDisplayEvaluationData();

async function updateCandidatePhoto(id) {
  // Simulate fetching the photo value from a database or other source
  // Set the fetched photo value to the input field

  const response = await axios.get(
    `${config.APIURL}candidate/get-candidate/${id}`,
    { headers: { Authorization: token } }
  );
  const fetchedPhotoValue = response.data.candidate.photos;
  // Fetch the photo value from the form
  const photoValue = fetchedPhotoValue;

  // Extract the photo name from the photo value
  const photoName = photoValue.substring(photoValue.lastIndexOf("/") + 1);
  // Update the src attribute of the img tag
  const imageContainer = document.getElementById("imageContainer");
  if (photoName !== "") {
    const image = imageContainer.querySelector("img");
    image.src = "../files/photos/" + photoName;
    image.alt = "Description of the image"; // Add alt attribute if needed
    $('#imageContainer img').show();
  } else {
    const image = imageContainer.querySelector("img");
    image.src = "no-images.png";
    image.alt = "Description of the image"; // Add alt attribute if needed
    $('#imageContainer img').show();
  }
}

// Call the function to update the photo
async function fetchAndDisplayEvaluationData(candidateId) {
  try {
    // Fetch evaluation data from the server
    const response = await axios.get(
      `${config.APIURL}candidate/evaluation-data/${candidateId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const evaluationDetails = response.data;
    console.log(evaluationDetails);

    const tableBody = document.getElementById("evaluationTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    evaluationDetails.forEach((evaluation) => {
      const row = document.createElement("tr");

      // Add data to each cell
      row.innerHTML = `
                <td>${evaluation.id}</td>
                <td>${evaluation.eval_type}</td>
                <td>${evaluation.interviewer_name}</td>
                <td>${evaluation.applied_rank}</td>
                <td>${evaluation.applied_date}</td>
                <td>${evaluation.time}</td>
                <td><a href="${
                  evaluation.remote || "#"
                }" target="_blank">View Link</a></td>
                <td>${evaluation.applied_by}</td>
                <button class="btn border-0 m-0 p-0" onclick="viewEvaluation('${candidateId}', '${
        evaluation.id
      }', '${evaluation.time}','${evaluation.eval_type}', event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-eye"></i>
                    </button>
            `;
      // <td>
      //     <button class="btn border-0 m-0 p-0" onclick="editEvaluation('${candidateId}', '${evaluation.id}', '${evaluation.eval_type}', '${evaluation.applied_rank}', '${evaluation.applied_date}', '${evaluation.time}', '${evaluation.remote}', '${evaluation.interviewer_name}', '${evaluation.applied_by}', event)">
      //         <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
      //     </button>
      //     <button class="btn border-0 m-0 p-0" onclick="deleteEvaluation('${evaluation.id}', event)">
      //         <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
      //     </button>
      // </td>
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching evaluation data:", error.message);
  }
}
function viewEvaluation(candidateId, id, time, formType, event) {
  event.preventDefault(); // Prevent default behavior if necessary

  // Create a query string with the IDs and serialized values
  const queryString = `candidateId=${candidateId}&id=${id}&time=${time}`;

  // Define a mapping of form types to URLs
  const formUrls = {
    "Officers Engine": "./Evaluation-OfficersEngineForm.html",
    "Officers Deck": "./Evaluation-OfficersDeckForm.html",
    "Engine Officers": "./Evaluation-EngineOfficersForm.html",
    "Engine Ratings": "./Evaluation-EngineRatingsForm.html",
    "Galley Officers": "./Evaluation-GalleyOfficersForm.html",
  };

  // Determine the URL to redirect to based on formType
  const redirectUrl = formUrls[formType]; // Default to a fallback form if formType is not recognized

  // Redirect to the selected form with the query string
  window.location.href = `${redirectUrl}?${queryString}`;
}

function uploadFile(file, uploadUrl) {
  const formData = new FormData();
  formData.append("file", file);

  return axios
    .post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        alert("Resume uploaded succesfully");
        return response.data; // You can return any data from the response if needed
      } else {
        console.error("Error uploading file:", response.statusText);
        throw new Error("Upload failed");
      }
    })
    .catch((error) => {
      console.error("Error uploading file:", error.message);
      throw error;
    });
}

async function fetchAndDisplayFiles(candidateId) {
  try {
    // Fetch photos
    const photosResponse = await axios.get(`/fetch-files1/${candidateId}`);
    const photos = photosResponse.data;
    const photosContainer = document.getElementById("photosPresent");
    photosContainer.innerHTML = ""; // Clear previous content
    photos.forEach((photo) => {
      const imgElement = document.createElement("img");
      imgElement.src = photo;
      imgElement.alt = "Candidate Photo";
      photosContainer.appendChild(imgElement);
    });

    // Fetch resumes
    const resumesResponse = await axios.get(`/fetch-files2/${candidateId}`);
    const resumes = resumesResponse.data;
    const resumesContainer = document.getElementById("resumesPresent");
    resumesContainer.innerHTML = ""; // Clear previous content
    resumes.forEach((resume) => {
      const linkElement = document.createElement("a");
      linkElement.href = resume;
      linkElement.textContent = "View Resume";

      resumesContainer.appendChild(linkElement);
    });

    // Optionally, you can handle tickets similarly if needed
    // const ticketsResponse = await axios.get(`/fetch-files3/${candidateId}`);
    // const tickets = ticketsResponse.data;
    // const ticketsContainer = document.getElementById('ticketsPresent');
    // ticketsContainer.innerHTML = ''; // Clear previous content
    // tickets.forEach(ticket => {
    //   const linkElement = document.createElement('a');
    //   linkElement.href = ticket;
    //   linkElement.textContent = 'View Ticket';
    //   ticketsContainer.appendChild(linkElement);
    // });
  } catch (error) {
    console.error("Error fetching files:", error);
  }
}
function addDiscussion() {
  openInNewTab("addDisc", "./edit-discussion.html");
}
function addContract() {
  openInNewTab("addCont", "./add-c-contract.html");
}

function addDocument() {
  openInNewTab("addDoc", "./add-c-document.html");
}

function addBank() {
  openInNewTab("addBank", "./add-c-bank.html");
}

function addMedical() {
  openInNewTab("addMed", "./add-c-medicals.html");
}

function addTravel() {
  openInNewTab("addTravel", "./add-c-travel.html");
}

function addNkd() {
  openInNewTab("addNkd", "./add-c-nkd.html");
}

function addSeaservice() {
  openInNewTab("addSeaservice", "./seaservicetable.html");
}

function addEval() {
  openInNewTab("addEval", "./add-c-evaluation.html");
}
function openInNewTab(elementId, baseUrl) {
  // Get the query parameters from the current URL
  const urlParams = new URLSearchParams(window.location.search);

  // Get the candidateId from the URL parameter
  const candidateId = urlParams.get("id");

  // Check if candidateId exists in the URL
  if (candidateId) {
    // Update href attribute with candidateId
    const addDiscButton = document.getElementById(elementId);
    const url = `${baseUrl}?memId=${candidateId}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  } else {
    console.error("Candidate ID not found in URL parameters");
  }
}

const updateURL = () => {
  const candidateId = new URLSearchParams(window.location.search).get("id"); // Get the candidateId
  const dropdown = document.getElementById("contractDropdown");

  dropdown.addEventListener("change", (event) => {
    let newUrl = "";

    switch (event.target.value) {
      case "1":
        newUrl = `./JSWINFRA-contract.html?id=${candidateId}`;
        break;
      case "2":
        newUrl = `./JSWSHIPPING-contract.html?id=${candidateId}`;
        break;
      case "3":
        newUrl = `./ETERNALLIGHT-contract.html?id=${candidateId};`;
        break;
      case "4":
        newUrl = `./GARUDA-contract.html?id=${candidateId};`;
        break;
      case "5":
        newUrl = `./LIBAI-contract.html?id=${candidateId};`;
        break;
      case "6":
        newUrl = `./NEGMAR-contract.html?id=${candidateId};`;
        break;
      case "7":
        newUrl = `./SANGLOBE-contract.html?id=${candidateId};`;
        break;
      case "8":
        newUrl = `./SANMARRAGA-contract.html?id=${candidateId};`;
        break;
      case "9":
        newUrl = `./SANMARREGENT-contract.html?id=${candidateId};`;
        break;
      case "10":
        newUrl = `./SANMARROYAL-contract.html?id=${candidateId};`;
        break;
      case "11":
        newUrl = `./SCLMERCURY-contract.html?id=${candidateId};`;
        break;
      case "12":
        newUrl = `./SIVAGANGAI-contract.html?id=${candidateId};`;
        break;
      case "13":
        newUrl = `./YANGTZE-contract.html?id=${candidateId};`;
        break;

      default:
        return; // Do nothing if the selected value is empty
    }

    window.location.href = newUrl; // Redirect to the new URL
  });
};

// Call the function to set up the event listener
updateURL();


async function sendApplicationMali() {
  const urlParams = new URLSearchParams(window.location.search);

  // Get the candidateId from the URL parameter
  const candidateId = urlParams.get("id");
  $("#sendMailBtn")
    .html(
      '<span class="spinner-grow me-1" role="status" aria-hidden="true"></span>Loading...'
    )
    .attr("disabled");
  const response = await axios.post(
    `${config.APIURL}candidate/sendApplicationMail`,
    {
      candidateId: candidateId,
      applicationURL: $("#applicationURL").val(),
      candidateName: $("#edit_candidate_fname").val(),
      candidateEmail: $("#edit_candidate_email1").val(),
    },
    {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );
  $("#sendMailBtn").html("Send Application").removeAttr("disabled");
  const sendMail = response.data;
  if (response.status === 200) {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Mail Successfully Send!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Mail not send try again!",
    });
  }
}
