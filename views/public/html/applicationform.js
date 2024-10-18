//const { JSON } = require("sequelize");

document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const candidateId = urlParams.get("id");
  const token = localStorage.getItem("token")||'';
  if(token!=="") {
    $('#applicationLogin').hide();
    $('#applicationFrm').show();
    currentCandidateId = candidateId;
    if (candidateId) {
      if(formType==='edit') {
        const countries = await fetchAndDisplayNationalities();
        const nationalitySelect = document.getElementById("nationality");
        await displayDropdownOptions(nationalitySelect, countries, "Nationality");
        await displayDropdown(token);
        await fetchCountryCodes();  
        await fetchAndDisplayDocumentDetails(candidateId, token);
      }
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
function addFrontZero(value) {
  if(value!=="") {
    if(parseInt(value)<10) {
        return '0'+value;
    }else {
      return value;
    }
  }
}
async function displayCandidateDetails(candidateData) {
  try {
    const userName = localStorage.getItem("username");
    if(formType==='view' && candidateData.applicationDatas!=="") {
      candidateData = JSON.parse(candidateData.applicationDatas);
      $('#totalChild').val(candidateData.totalChild);
      $('#nearest_airport').val(candidateData.nearest_airport);
      $('#kin_name').val(candidateData.kin_name);
      $('#kin_relation').val(candidateData.kin_relation);
      $('#kin_contact_number').val(candidateData.kin_contact_number);
      $('#kin_email').val(candidateData.kin_email);
      $('#kin_contact_address').val(candidateData.kin_contact_address);

      postdate = new Date(candidateData.postdate);
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const createDate = addFrontZero(postdate.getDate())+'-'+month[postdate.getMonth()]+'-'+postdate.getFullYear()
      $('#postdate').html(createDate);
      const documentTableBody1 = document.getElementById("documentTableBody");
      documentTableBody1.innerHTML = "";
      const documentType = [
        { key: "passport", name: "PASSPORT" },
        { key: "seamanbook", name: "SEAMANS BOOK" },
        { key: "seamanid", name: "SEAFARER ID" },
        { key: "coc", name: "COC" },
        { key: "dceoil", name: "DCE OIL" },
        { key: "dcegas", name: "DCE GAS" },
        { key: "dcechem", name: "DCE CHEM" },
      ];
      let inputType = "text"
      if(formType==='edit') {
        inputType = "date";
      }
      documentType.map((doc) => {
        let docnumbers = candidateData[`document_${doc.key}_numbers`] || "";
        let issuedate = candidateData[`document_${doc.key}_issuedate`] || "";
        let issueplace = candidateData[`document_${doc.key}_issueplace`] || "";
        let validuntill = candidateData[`document_${doc.key}_validuntill`] || "";
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
              <p>${doc.name}</p>
            </td>
            <td width="151">
              <input type="text" name="document_${doc.key}_numbers" value="${docnumbers}" />
            </td>
            <td width="50">
              <input type="${inputType}" name="document_${doc.key}_issuedate" value="${issuedate}"/>
            </td>
            <td width="198">
              <input type="text" name="document_${doc.key}_issueplace" value="${issueplace}"/>
            </td>
            <td width="50">
              <input type="${inputType}" name="document_${doc.key}_validuntill" value="${validuntill}"/>
            </td>`;
        documentTableBody.appendChild(row);
      });

      
      if(candidateData.exp_from.length>0) {
        const eperienceTableBody = document.getElementById("preveperience");
        eperienceTableBody.innerHTML = `
        <tr>
              <td width="61">
                <p><strong>From</strong></p>
              </td>
              <td width="61">
                <p><strong>To</strong></p>
              </td>
              <td width="122">
                <p><strong>Vessel Name</strong></p>
              </td>
              <td width="61">
                <p><strong>Flag</strong></p>
              </td>
              <td width="61">
                <p><strong>DWT</strong></p>
              </td>
              <td width="61">
                <p><strong>KWT</strong></p>
              </td>
              <td width="61">
                <p><strong>Engine</strong></p>
              </td>
              <td width="61">
                <p><strong>Type of Vessel</strong></p>
              </td>
              <td width="62">
                <p><strong>Position</strong></p>
              </td>
              <td width="65">
                <p><strong>Remarks</strong></p>
              </td>
            </tr>`;
        candidateData.exp_from.map((doc, index) => {
          const row = document.createElement("tr");
          let exp_to = candidateData.exp_to[index]||'';
          let exp_vesselname = candidateData.exp_vesselname[index]||'';
          let exp_flag = candidateData.exp_flag[index]||'';
          let exp_DWT = candidateData.exp_DWT[index]||'';
          let exp_KWT = candidateData.exp_KWT[index]||'';
          let exp_Engine = candidateData.exp_Engine[index]||'';
          let exp_typeofvessel = candidateData.exp_typeofvessel[index]||'';
          let exp_Position = candidateData.exp_Position[index]||'';
          let exp_remarks = candidateData.exp_remarks[index]||'';
          row.innerHTML = `
          <td width="61">
                <input readonly type="text" name="exp_from" value="${doc}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_to" value="${exp_to}" />
              </td>
              <td width="122">
                <input readonly type="text" name="exp_vesselname" value="${exp_vesselname}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_flag" value="${exp_flag}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_DWT" value="${exp_DWT}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_KWT" value="${exp_KWT}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_Engine" value="${exp_Engine}" />
              </td>
              <td width="61">
                <input readonly type="text" name="exp_typeofvessel" value="${exp_typeofvessel}" />
              </td>
              <td width="62">
                <input readonly type="text" name="exp_Position" value="${exp_Position}" />
              </td>
              <td width="65">
                <input readonly type="text" name="exp_remarks" value="${exp_remarks}" />
              </td>`;
            eperienceTableBody.appendChild(row);
        });
      }
    }
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
    let inputType = "text"
    if(formType==='edit') {
      inputType = "date";
    }
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
                <input type="${inputType}" name="document_${
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
                <input type="${inputType}" name="document_${
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
    candidate_details['postdate'] = new Date();

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
