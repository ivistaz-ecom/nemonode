// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = "./loginpage.html";
}

const displayDropdown = async function () {
 
  const rankResponse = await axios.get(`${config.APIURL}others/view-rank`, {
    headers: { Authorization: token },
  });
  const rankOptions = rankResponse.data.ranks;
  
  if(rankOptions.length>0) {
    const rankNames = rankOptions.map((rank) => rank.rank);
    loadDropdown("candidate_c_rank", rankOptions, rankNames);
  }
};

const displayVesselDropdown = async function () {
  try {
    const vesselResponse = await axios.get(`${config.APIURL}others/view-vsl`, {
      headers: { Authorization: token },
    });
    const vessels = vesselResponse.data.vsls;
    console.log(vessels, 'vesselsvessels')
    if(vessels.length>0) {
    const vesselNames = vessels.map((vessel) => vessel.vesselName);
    loadDropdown("vsl", vesselNames, vesselNames);
    }
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
};

// Call the displayVesselDropdown function where needed, for example, after fetching the rank dropdown
// Call the function to populate the vessel dropdown

const displayVesselTypeDropdown = async function () {
  try {
    const vesselDropdown = document.getElementById("vesseltype");
    vesselDropdown.innerHTML = ""; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Vessel Type --";
    vesselDropdown.appendChild(defaultOption);

    const vesselResponse = await axios.get(
      `${config.APIURL}others/view-vessels`,
      { headers: { Authorization: token } }
    );
    const vessels = vesselResponse.data.vessels;
    const vesselNames = vessels.map((vessel) => vessel.vesselName);

    for (let i = 0; i < vesselNames.length; i++) {
      const option = document.createElement("option");
      option.value = vesselNames[i];
      option.text = vesselNames[i];
      vesselDropdown.appendChild(option);
    }
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  fetchAndDisplayCrewPlannerDetails();
  displayDropdown();
  displayVesselDropdown();
  displayVesselTypeDropdown();
  displayCountryDropdown();
  createCompanyDropdown();
  const dojInput = document.getElementById("doj");
  const immediateCheckbox = document.getElementById("immediate");

  dojInput.addEventListener("input", function () {
    // Disable "Immediate" if "Date of Joining" is selected
    immediateCheckbox.disabled = dojInput.value !== "";
  });

  immediateCheckbox.addEventListener("input", function () {
    // Disable "Date of Joining" if "Immediate" is selected
    dojInput.disabled = immediateCheckbox.checked;
  });
});

const displayCountryDropdown = async function () {
  try {
    const countryDropdown = document.getElementById("cocAccepted");
    countryDropdown.innerHTML = ""; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Country --";
    countryDropdown.appendChild(defaultOption);

    // Assuming the country data is an array of objects with the property "country"
    const countryResponse = await axios.get(
      `${config.APIURL}others/country-codes`,
      { headers: { Authorization: token } }
    );
    const countries = countryResponse.data.countryCodes; // Assuming the array is directly returned

    for (let i = 0; i < countries.length; i++) {
      const option = document.createElement("option");
      option.value = countries[i].country; // Assuming the country name is in the "country" property
      option.text = countries[i].country; // Assuming the country name is in the "country" property
      countryDropdown.appendChild(option);
      // If you want to clone the options for another dropdown, do it here
      // licenseDropdown.appendChild(option.cloneNode(true));
    }
  } catch (error) {
    console.error("Error fetching countries:", error);
  }
};

const addCrewPlanner = async (e) => {
  e.preventDefault();

  // Get form data
  const formData = {
    rank: document.getElementById("candidate_c_rank").value.trim(),
    client: document.getElementById("client").value.trim(),
    vesselType: document.getElementById("vesseltype").value.trim(),
    vesselName: document.getElementById("vsl").value.trim(),
    cocAccepted: document.getElementById("cocAccepted").value.trim(),
    trading: document.getElementById("trading").value.trim(),
    wages: document.getElementById("wages").value.trim(),
    otherInfo: document.getElementById("otherInfo").value.trim(),
    status: document.getElementById("status").value.trim(),
    created_by: decodedToken.userId,
  };
  console.log(formData);

  // Check if "doj" or "immediate" should be included
  const dojInput = document.getElementById("doj");
  const immediateCheckbox = document.getElementById("immediate");

  if (dojInput.value && !immediateCheckbox.checked) {
    formData.doj = dojInput.value;
  } else {
    formData.doj = "immediate";
  }

  try {
    // Send data to the server using Axios
    const response = await axios.post(
      `${config.APIURL}others/add-crew-planner`,
      formData,
      { headers: { Authorization: token } }
    );

    // Handle the response as needed
    console.log(response.data);

    // Reset the form or perform other actions if necessary
  } catch (error) {
    // Handle errors
    console.error("Error submitting data:", error);
  }
};

// Attach the function to the form submit event
document
  .getElementById("addCrewForm")
  .addEventListener("submit", addCrewPlanner);
//                <td>${crewPlanner.created_by}</td>

async function fetchAndDisplayCrewPlannerDetails() {
  try {
    const response = await axios.get(`${config.APIURL}others/get-crewplanner`);

    const crewPlannerDetails = response.data.crewPlanner;
    console.log(crewPlannerDetails);

    const crewPlannerTableBody = document.getElementById(
      "crewPlannerTableBody"
    );
    crewPlannerTableBody.innerHTML = ""; // Clear existing rows

    // Check if crewPlannerDetails is an array and not empty
    if (Array.isArray(crewPlannerDetails) && crewPlannerDetails.length > 0) {
      crewPlannerDetails.forEach((crewPlanner) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${crewPlanner.id}</td>
                    <td>${crewPlanner.rank}</td>
                    <td>${crewPlanner.client}</td>
                    <td>${crewPlanner.vesselType}</td>
                    <td>${crewPlanner.vesselName}</td>
                    <td>${crewPlanner.cocAccepted}</td>
                    <td>${crewPlanner.trading}</td>
                    <td>${crewPlanner.wages}</td>
                    <td>${crewPlanner.doj}</td>
                    <td>${crewPlanner.otherInfo}</td>
                    <td>${crewPlanner.status}</td>
                    <td>
                        <button class="btn border-0 m-0 p-0" onclick="editCrewPlanner('${crewPlanner.id}', '${crewPlanner.rank}', '${crewPlanner.client}', '${crewPlanner.vesselType}', '${crewPlanner.vesselName}', '${crewPlanner.cocAccepted}', '${crewPlanner.trading}', '${crewPlanner.wages}', '${crewPlanner.doj}', '${crewPlanner.otherInfo}', '${crewPlanner.status}','${crewPlanner.created_by}', event)">
                            <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                        </button>
                        <button class="btn border-0 m-0 p-0" onclick="deleteCrewPlanner('${crewPlanner.id}')">
                            <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
        crewPlannerTableBody.appendChild(row);
      });
    } else {
      // Handle case where no crew planners are returned
      crewPlannerTableBody.innerHTML =
        '<tr><td colspan="12">No crew planners found</td></tr>';
    }
  } catch (error) {
    console.error("Error fetching crew planner details:", error);
  }
}

function editCrewPlanner(
  id,
  rank,
  client,
  vesselType,
  vesselName,
  cocAccepted,
  trading,
  wages,
  doj,
  otherInfo,
  status,
  created_by,
  event
) {
  event.preventDefault();
  console.log("Edit clicked for crew planner ID:", id);

  // Encode parameters to handle special characters
  rank = encodeURIComponent(rank);
  client = encodeURIComponent(client);
  vesselType = encodeURIComponent(vesselType);
  vesselName = encodeURIComponent(vesselName);
  otherInfo = encodeURIComponent(otherInfo);

  // Construct the query parameters string
  const queryParams = `?id=${id}&rank=${rank}&client=${client}&vesselType=${vesselType}&vesselName=${vesselName}&cocAccepted=${cocAccepted}&trading=${trading}&wages=${wages}&doj=${doj}&otherInfo=${otherInfo}&status=${status}&created_by=${created_by}`;

  // Open edit-crew-planner.html in a new tab with the constructed query parameters
  window.open(`edit-crew-planner.html${queryParams}`, "_blank");
}

function deleteCrewPlanner(crewPlannerId) {
  // Implement your delete functionality here using the crewPlannerId
  console.log("Delete clicked for crew planner ID:", crewPlannerId);
}

async function createCompanyDropdown() {
  const companyResponse = await axios.get(
    `${config.APIURL}company/dropdown-company`,
    { headers: { Authorization: token } }
  );
  const companyOptions = companyResponse.data.companies;
  const companyNames = companyOptions.map((company) => company.company_name);

  const companyDropdown = document.getElementById("client");
  companyDropdown.innerHTML = ""; // Clear existing options

  // Add the default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "-- Select Company --";
  companyDropdown.appendChild(defaultOption);

  // Add options for each company
  for (let i = 0; i < companyNames.length; i++) {
    const option = document.createElement("option");
    option.value = companyNames[i];
    option.text = companyNames[i];
    companyDropdown.appendChild(option);
    // If you want to clone the options for another dropdown, do it here
    // companyDropdown.appendChild(option.cloneNode(true));
  }
}
