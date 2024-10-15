document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("id");
  const token = localStorage.getItem("token")||'';
  if(token!=="") {
    $('#applicationLogin').hide();
    $('#applicationFrm').show();
    currentCandidateId = candidateId;
    if (candidateId) {
      const countries = await fetchAndDisplayNationalities();
      const nationalitySelect = document.getElementById("nationality");
      await displayDropdownOptions(nationalitySelect, countries, "Nationality");
      await displayDropdown(token);
      await fetchCountryCodes();      
      await fetchAndDisplayDocumentDetails(candidateId, token);
      await fetchAndDisplayCandidate(candidateId, token);
    } else {
      console.error("Invalid URL. Missing memId parameter.");
    }
  }else {
    $('#applicationFrm').hide();
    $('#applicationLogin').show();    
  }
});

async function fetchCountryCodes() {
  try {
      const response = await axios.get('https://nsnemo.com/fetch-nationality');
      const countries = response.data.countries;
      // Clear existing options
      var select2 = document.getElementById("countryCodeSelect2");
      select2.innerHTML = '<option value="">Code</option>';
      // Populate the dropdown options
      countries.forEach(function(country) {
          var option = document.createElement("option");
          option.value = country.phone_code; // Set the value to phone_code
          option.text = country.phone_code; // Display only the phone_code
          select2.appendChild(option.cloneNode(true))
      });
  } catch (error) {
      console.error('Error fetching country codes:', error);
  }
}

const form = document.getElementById("login-form");
form.addEventListener("submit", login);

async function login(e) {
    e.preventDefault(); // Prevent default form submission
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get("id");
    const loginCredentials = {
        userName: user_id.value.trim(),
        candidateId: candidateId,
    };

    try {
        const response = await axios.post(
            `${config.APIURL}user/canditatelogin`,
            loginCredentials
        );

        if (response.data.success) {
            const token = response.data.token;
            // Save token and other data to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("loginType", 'canditate');
            setTimeout(() => {
                window.location.href = `applicationform.html?id=${candidateId}`;
            }, 850);
        } else {
          Swal.fire({
            icon: "error",
            title: "Alert",
            text: response.data.message,
          });
           // handleLoginError();
        }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Alert",
        text: error?.response?.data?.message||error.message,
      });
        console.error("Error during login:", error.response.data, error.message);
     //   handleLoginError();
    }
}


async function fetchAndDisplayCandidate(candidateId, token) {
  try {
    const serverResponse = await axios.get(
      `${config.APIURL}candidate/get-candidate/${candidateId}`,
      {
        headers: { Authorization: token },
      }
    );

    const candidateData = serverResponse.data.candidate;
    console.log(candidateData);
    displayCandidateDetails(candidateData);
  } catch (error) {
    console.error("Error fetching candidate data:", error);
    // Handle error as needed
  }
}
function formatDate(dateString) {
  const date = new Date(dateString);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}

async function displayCandidateDetails(candidateData) {
  try {
    const userName = localStorage.getItem("username");
    $("#lname").val(candidateData.lname);
    $("#fname").val(candidateData.fname);
    const avb_date = candidateData?.avb_date
      ? formatDate(candidateData.avb_date)
      : "";
    $("#avb_date").val(avb_date);
    const dob = candidateData?.dob ? formatDate(candidateData.dob) : "";
    $("#dob").val(dob);
    $("#birth_place").val(candidateData.birth_place);
    $("#nationality").val(candidateData.nationality);
    $("#c_ad1").val(candidateData.c_ad1);
    $("#m_status").val(candidateData.m_status);
    $("#weight").val(candidateData.weight);
    $("#height").val(candidateData.height);
    $("#m_status").val(candidateData.m_status);
    $("#candidate_c_rank").val(candidateData.c_rank);
    let mobile_code1 = '+'+(candidateData.mobile_code1.replace('+',''));
    $('#countryCodeSelect2').val(mobile_code1)
    $("#c_mobi1").val(candidateData.c_mobi1);
    $("#religion").val(candidateData.religion);
    $("#nearest_airport").val(candidateData.nearestAirport);
    $("#totalChild").val(candidateData.totalChild);
  } catch (error) {
    console.error("Error displaying candidate details:", error);
  }
}

async function fetchAndDisplayNationalities() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${config.APIURL}fetch-nationality`, {
      headers: { Authorization: token },
    });
    const countries = response.data.countries; // Access the array using response.data.countries
    return countries; // Return the fetched countries
  } catch (error) {
    console.error("Error fetching countries:", error);
    return []; // Return an empty array in case of an error
  }
}

function displayDropdownOptions(dropdown, options, placeholder) {
  dropdown.innerHTML = ""; // Clear existing options

  // Add a default option
  const defaultOption = document.createElement("option");
  defaultOption.value = ""; // Set the default value (empty in this case)
  defaultOption.text = `-- Select ${placeholder} --`; // Set the default display text
  dropdown.appendChild(defaultOption);

  // Check if options is an array before using forEach
  if (Array.isArray(options)) {
    options.forEach((option) => {
      const dropdownOption = document.createElement("option");
      dropdownOption.value = option.code; // Use the appropriate ID or value from your data
      dropdownOption.text = option.country; // Use the appropriate property from your data
      dropdown.appendChild(dropdownOption);
    });

    return true;
  } else {
    console.error(`Invalid or empty options for ${placeholder}:`, options);
    return true;
  }
}

const displayDropdown = async function (token) {
  const rankDropdown = document.getElementById("candidate_c_rank");
  rankDropdown.innerHTML = ""; // Clear existing options

  // Add the default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "-- Select Rank --";
  rankDropdown.appendChild(defaultOption);

  const rankResponse = await axios.get(`${config.APIURL}others/get-ranks`, {
    headers: { Authorization: token },
  });
  const rankOptions = rankResponse.data.ranks;
  const rankNames = rankOptions.map((rank) => rank.rank);

  for (let i = 0; i < rankNames.length; i++) {
    const option = document.createElement("option");
    option.value = rankNames[i];
    option.text = rankNames[i];
    rankDropdown.appendChild(option);
  }
};

async function fetchAndDisplayDocumentDetails(candidateId, token) {
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

    let exitpassport = [];
    await documentDetails.forEach((doc) => {
      exitpassport[doc.document] = doc;
    });
   
    const documentType = [
      { key: "passport", name: "PASSPORT" },
      { key: "seamanbook", name: "SEAMANS BOOK" },
      { key: "seamanid", name: "SEAFARER ID" },
      { key: "coc", name: "COC" },
      { key: "dceoil", name: "DCE OIL" },
      { key: "dcegas", name: "DCE GAS" },
      { key: "dcechem", name: "DCE CHEM" },
    ];
    documentType.map((doc) => {
      let chekcingDoct = exitpassport[doc.name] || "";
      const row = document.createElement("tr");
      row.innerHTML = `
           <td>
                <p>${doc.name}</p>
              </td>
              <td width="151">
                <input type="text" name="document_${doc.key}_numbers" value="${
        chekcingDoct !== "" ? chekcingDoct.document_number : ""
      }" />
              </td>
              <td width="50">
                <input type="date" name="document_${
                  doc.key
                }_issuedate" value="${
        chekcingDoct !== "" ? chekcingDoct.issue_date : ""
      }"/>
              </td>
              <td width="198">
                <input type="text" name="document_${
                  doc.key
                }_issueplace" value="${
        chekcingDoct !== "" ? chekcingDoct.issue_place : ""
      }"/>
              </td>
              <td width="50">
                <input type="date" name="document_${
                  doc.key
                }_validuntill" value="${
        chekcingDoct !== "" ? chekcingDoct.expiry_date : ""
      }"/>
              </td>`;

      documentTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching document details:", error);
  }
}

document
  .getElementById("application-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    var formData = $("#application-form").serializeArray();
    var candidate_details = {};
    $.each(formData, function () {
      if (candidate_details[this.name]) {
        if (!candidate_details[this.name].push) {
          candidate_details[this.name] = [candidate_details[this.name]];
        }
        candidate_details[this.name].push(this.value || "");
      } else {
        candidate_details[this.name] = this.value || "";
      }
    });

    try {     
      const token = localStorage.getItem("token");
      const urlParams1 = new URLSearchParams(window.location.search);
      const candidateId1 = urlParams1.get("id");
      await axios.post(
        `${config.APIURL}candidate/submit-application/${candidateId1}`,
        { applicationDatas: JSON.stringify(candidate_details) },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text:"Your Information Updated Successfully!",
      });
    } catch (error) {
      console.error("Error updating candidate:", error);
    }
  });
