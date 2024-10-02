// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = "./loginpage.html";
}

document.getElementById("vessel-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const vesselName = document.getElementById("vessel_name").value.trim();

  try {
    // Add a new vessel
    await axios.post(
      `${config.APIURL}others/create-vessel`,
      { vesselName },
      { headers: { Authorization: token } }
    );
    console.log("Vessel added successfully");
    // Refresh the vessel list after adding a new vessel
  } catch (error) {
    console.error("Error:", error);
  }
});

// Function to fetch data using Axios for companies
const fetchCompanyData = async () => {
  try {
    const response = await axios.get(
      `${config.APIURL}company/dropdown-company`
    ); // Adjust URL as per your backend setup
    const companies = response.data.companies;

    // Reference to the select element for companies
    const selectElement = document.getElementById("vsl_company");

    // Clear existing options
    selectElement.innerHTML =
      '<option value="" selected disabled>Select company</option>';

    // Populate dropdown with fetched data
    companies.forEach((company) => {
      const option = document.createElement("option");
      option.value = company.company_id; // Adjust based on your company object structure
      option.textContent = company.company_name; // Display text
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching company data:", error);
    // Handle error appropriately, e.g., show an alert
  }
};

// Call the fetchCompanyData function when the page loads or as needed
fetchCompanyData();

document.getElementById("vsl-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const vesselName = document.getElementById("vessel_name_vsl").value;
  const vesselType = document.getElementById("vessel_type").value;
  const vsl_company = document.getElementById("vsl_company").value;
  const imoNumber = document.getElementById("imo_number").value;
  const vesselFlag = document.getElementById("vessel_flag").value;

  try {
    const serverResponse = await axios.post(
      `${config.APIURL}others/create-vsl`,
      {
        vesselName,
        vesselType,
        vsl_company,
        imoNumber,
        vesselFlag,
      },
      { headers: { Authorization: token } }
    );
    console.log("Response:", serverResponse.data);
  } catch (error) {
    console.error("Error:", error);
  }
});

document.getElementById("logout").addEventListener("click", function () {
  // Display the modal with initial message
  var myModal = new bootstrap.Modal(document.getElementById("logoutModal"));
  myModal.show();

  // Send request to update logged status to false
  const userId = localStorage.getItem("userId");
  if (userId) {
    axios
      .put(`${config.APIURL}user/${userId}/logout`)
      .then((response) => {
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  } else {
    console.error("User ID not found in localStorage");
  }

  localStorage.clear();

  // Change the message and spinner after a delay
  setTimeout(function () {
    document.getElementById("logoutMessage").textContent =
      "Shutting down all sessions...";
  }, 1000);

  // Redirect after another delay
  setTimeout(function () {
    window.location.href = "loginpage.html";
  }, 2000);
});

const displayVesselTypeDropdown = async function () {
  try {
    const vesselDropdown = document.getElementById("vessel_type"); // Get the select element
    vesselDropdown.innerHTML = ""; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "-- Select Vessel Type --";
    vesselDropdown.appendChild(defaultOption);

    // Fetch vessel types from the API
    const vesselResponse = await axios.get(
      `${config.APIURL}others/get-vessel`,
      {
        headers: { Authorization: token }, // Make sure `token` is defined elsewhere
      }
    );
    const vessels = vesselResponse.data.vessels;
    const vesselNames = vessels.map((vessel) => vessel.vesselName);

    // Add options to the dropdown
    vesselNames.forEach((vesselName) => {
      const option = document.createElement("option");
      option.value = vesselName;
      option.text = vesselName;
      vesselDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching vessels:", error);
  }
};

// Call this function when needed to populate the dropdown
displayVesselTypeDropdown();
