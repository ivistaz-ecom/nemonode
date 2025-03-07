let resultData = [];
let loadHeader = true;
let headerData = [];
let fieldName = [];

function changePageLimit(reportType) {
 if(reportType==='newProfile') {
    handleNewProfileSubmit(1);
  } else if(reportType==='callsMade') {
    handleCallsMadeSubmit(1);
  } else if(reportType==='proposed') {
    handleProposedSubmit(1);
  } else if(reportType==='reliefPlan') {
    handlereliefPlanSubmit(1);
  } else if(reportType==='signon') {
    handlesignonSubmit(1);
  } else if(reportType==='signoff') {
    handlesignoffSubmit(1);
  } else if(reportType==='dueForsignoff') {
    handledueForsignoffSubmit(1);
  } else if(reportType==='availCandidate') {
    handleavailCandidateSubmit(1);
  } else if(reportType==='onboard') {
    handleOnBoardSubmit(1)
  } else if(reportType==='crewListMonthWise') {
    handlecrewListMonthWiseSubmit(1);
  } else if(reportType==='imocrewListMonthWise') {
    handleimocrewListMonthWiseSubmit(1);
  } 
}


/* New Profile Report */
var newProfile = [{candidateId:'Candidate ID', fname:'Name', c_rank:'Rank', country:'Nationality', c_vessel:'Vessel Type', c_ad1:'Address', c_city:'City', c_mobi1:'Contact Number', last_company:'Previous Company', email1:'Email', last_salary:'Last Salary', experience:'Experience', dob:'Date of Birth', avb_date:'Availability', height:'Height', weight:'Weight', safety_shoe_size:'Safety Shoe Size', boiler_suit_size:'Boiler Suit Size', createdby:'Created BY'}];
var displyFilters = "";
newProfile.forEach((item)=> {
    Object.keys(item).forEach((key) => {
        const value = item[key];
        const checked = (['candidateId', 'fname', 'c_rank', 'country', 'c_vessel'].indexOf(key)>=0)?'checked="checked"':'';
        displyFilters+=
        `<div class="form-check me-3">
            <input
                class="form-check-input"
                type="checkbox"
                id="${key}"
                name="${key}"
                ${checked}
            />
            <label
                class="form-check-label"
                for="${key}"
                >${value}</label
            >
        </div>`;
    })
})
document.getElementById("newprofileFilter").innerHTML = displyFilters;

document.getElementById("newprofilesubmit").addEventListener("submit", (event) => {
  event.preventDefault();
  handleNewProfileSubmit(1, true)
});

async function handleNewProfileSubmit(pageNumber, generateNew=false) {
  let newProfileCustom = document.getElementById("newProfileCustom");
  newProfileCustom.style.display = "none";
  if(generateNew===true) {
    loadHeader = true;
    showLoader("newProfileBtn");
 
    let startDate = document.getElementById("startDate").value;
    startDate = startDate + "T00:00:00Z";
    let endDate = document.getElementById("endDate").value;
    endDate = endDate + "T23:59:59Z";
    const user = document.getElementById("appliedBy1").value;
    const category = document.getElementById("category").value;

    // Gather selected fields
    selectedFields = {}; // Clear previous selectedFields
    const checkboxes = document.querySelectorAll(
      '#newProfileContent input[type="checkbox"]'
    );
    headerData = ['S.No.'];
    fieldName = ['sno']
    checkboxes.forEach((checkbox) => {
        selectedFields[checkbox.id] = checkbox.checked; // Store checkbox state in selectedFields object
        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        selectedFieldsName[checkbox.id] = (label)?label.textContent.trim():checkbox.name;
        console.log(checkbox.id, 'checkbox.id')
        if(checkbox.checked===true) {
          headerData.push(newProfile[0][checkbox.id]);
          fieldName.push(checkbox.id);
        }
        
    });
   
    // Send data to server using Axios
    const response = await axios.post(
      `${config.APIURL}candidate/reports/view-new-profile`,
      {
        startDate: startDate,
        endDate: endDate,
        id: user,
        category: category,
        selectedFields: selectedFields,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    let allCandidates = response.data.candidates;
    resultData = allCandidates; 
   }
   
   hideLoader("newProfileBtn");
   const rowsPerPage5 = parseInt(document.getElementById('pageNewProfile').value);
   const searchKeyword = document.getElementById('searchNewProfile').value;
   displayTableDetails('newProfileTablehead', headerData, loadHeader, 'newProfileTableBody', fieldName, resultData, pageNumber, rowsPerPage5, 'paginationControlsnp', 'newProfile', searchKeyword, 'newProfileCount')
   newProfileCustom.style.removeProperty("display");
   if(loadHeader===true) {
     loadHeader = false;
   }
}


/* Calls Made Report */
document.getElementById("callsMadeForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleCallsMadeSubmit(1, true)
});


async function handleCallsMadeSubmit(pageNumber, generateNew=false) {
 let callsMadeCustom = document.getElementById("callsMadeCustom");
 callsMadeCustom.style.display = "none";
 if(generateNew===true) {
  loadHeader = true;
  showLoader("callsMadeFormBtn");
  let fromDate = document.getElementById("fromDate").value;
    fromDate = fromDate + "T00:00:00Z";
    let toDate = document.getElementById("toDate").value;
    toDate = toDate + "T23:59:59Z";

    const user = document.getElementById("appliedBy").value;
    const category = document.getElementById("categoryc").value;
   
    // Send data to server using Axios
    const response = await axios.post(
      `${config.APIURL}candidate/reports/callsmade`,
      {
        startDate: fromDate,
        endDate: toDate,
        userId: user,
        category: category,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const callsMade = response.data.callsMade;
    resultData = callsMade
  }
  hideLoader("callsMadeFormBtn");
  headerData = ['S.No.', 'Candidate ID', 'Name', 'Rank', 'Nationality', 'Vessel Name', 'User', 'Reminder Date', 'Availability', 'Discussion'];
  fieldName = ['sno', 'candidateId', 'name', 'c_rank', 'country', 'c_vessel', 'userName', 'r_date', 'avb_date', 'discussion'];
  const rowsPerPage5 = parseInt(document.getElementById('rowsPerCallsMade').value);
  const searchKeyword = document.getElementById('searchCallsMade').value;
 
  displayTableDetails('callsMadeTablehead', headerData, loadHeader, 'callsMadeTableBody', fieldName, resultData, pageNumber, rowsPerPage5, 'paginationControlscm', 'callsMade', searchKeyword, 'callsMadeCount')
  callsMadeCustom.style.removeProperty("display");
  if(loadHeader===true) {
    loadHeader = false;
  }
}


/* Proposed Report */
document.getElementById("proposedForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleProposedSubmit(1, true)
});


async function handleProposedSubmit(pageNumber, generateNew=false) {
 let proposedCustom = document.getElementById("proposedCustom");
 proposedCustom.style.display = "none";
 if(generateNew===true) {
  loadHeader = true;
  document.getElementById('paginationControlspro').style.display = "none";
  showLoader("proposedFormBtn");
  const status = document.getElementById("status").value;
  let startDate = document.getElementById("startDates").value;
  let endDate = document.getElementById("endDates").value;
  const category = document.getElementById("categoryp").value;
  const companyName = document.getElementById("user_client").value;
  document.getElementById('proposedTablehead').innerHTML = "";  
  document.getElementById('proposedTableBody').innerHTML = "";
  
  

  // Send data to server using Axios with the GET method and query parameters
  const response = await axios.get(
    `${config.APIURL}candidate/reports/proposals`,
      {
        params: {
          status: status,
          startDate: startDate,
          endDate: endDate,
          category: category,
          companyName: companyName,
        },
      }
    );

    let candidates = response.data.candidates;
    resultData = candidates
  }
  hideLoader("proposedFormBtn");
  headerData = ['S.No.', 'Candidate ID', 'Name', 'Rank', 'Nationality', 'Vessel', 'User', 'Join Date', 'Company Name'];
  fieldName = ['sno', 'candidateId', 'name', 'c_rank', 'country', 'c_vessel', 'userName', 'join_date', 'company_name'];
  const rowsPerPage5 = parseInt(document.getElementById('rowsPerProposed').value);
  const searchKeyword = document.getElementById('searchProposed').value;

  displayTableDetails('proposedTablehead', headerData, loadHeader, 'proposedTableBody', fieldName, resultData, pageNumber, rowsPerPage5, 'paginationControlspro', 'proposed', searchKeyword, 'proposedCount')
  proposedCustom.style.removeProperty("display");
  document.getElementById('paginationControlspro').style.removeProperty("display");
  if(loadHeader===true) {
    loadHeader = false;
  }
}

/* Sign On Report */
document.getElementById("signOnForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handlesignonSubmit(1, true)
});

async function handlesignonSubmit(pageNumber, generateNew=false) {
 let signonCustom = document.getElementById("signonCustom");
 signonCustom.style.display = "none";
 if(generateNew===true) {
  loadHeader = true;
  showLoader("signonFormBtn");
  const startDate =
      document.getElementById("startDatec").value + "T00:00:00Z";
    const endDate = document.getElementById("endDatec").value + "T23:59:59Z";
    const companyName = document.getElementById("user_client1").value;
    const vessel_type = document.getElementById("candidate_c_vessel").value;
    const category = document.getElementById("categoryso").value;

    const params = {
      startDate: startDate,
      endDate: endDate,
      vessel_type: vessel_type,
      companyname: companyName,
      category: category,
    };

    // Send data to server using Axios
    const response = await axios.get(
      `${config.APIURL}candidate/reports/sign-on`,
      {
        params: params,
      }
    );

    let contracts = response.data.contracts;
    resultData = contracts;
  }
  hideLoader("signonFormBtn");
  headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Name", "Vessel Type", "Sign On", "Sign On Port", "Sign Off",  "EOC", "Emigrate Number", "AOA Number", "Currency", "Wages", "Wages Types", "Reason for Sign Off", "IMO Number", "Vessel Flag", "Company Name", "Bank Name",  "Account Number", "Bank Address", "IFSC Code", "SWIFT Code", "Beneficiary","Beneficiary Address", "Branch", "Bank Types", "Passbook", "Bank PAN Number", "INDOS Number", 'CDC Number', "Passport Number", "PAN Card", "User Name"];
  fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'vesselName', 'vesselType', 'sign_on', 'portName', 'sign_off', 'eoc', 'emigrate_number', 'aoa_number', 'currency', 'wages', 'wages_types', 'reason_for_sign_off', 'imoNumber', 'vesselFlag', 'company_name', 'bank_name', 'account_num', 'bank_addr', 'ifsc_code', 'swift_code', 'beneficiary', 'beneficiary_addr', 'branch', 'types', 'passbook', 'pan_num', 'indos_number', 'cdcnumber', 'pasportnumber', 'pan_card', 'userName'];
  const rowsPerPage = parseInt(document.getElementById('rowsPerSignon').value);
  const searchKeyword = document.getElementById('searchSignon').value;
  displayTableDetails('signonTablehead', headerData, loadHeader, 'signonTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlssignon', 'signon', searchKeyword, 'signonCount')
  signonCustom.style.removeProperty("display");
  if(loadHeader===true) {
    loadHeader = false;
  }
}

/* Sign Off Report */
document.getElementById("signOffForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handlesignoffSubmit(1, true)
});

async function handlesignoffSubmit(pageNumber, generateNew=false) {
  try {
  let signoffCustom = document.getElementById("signoffCustom");
  signoffCustom.style.display = "none";
  if(generateNew===true) {
    loadHeader = true;
    showLoader("signoffFormBtn");
      let startDate = document.getElementById("startDateoff").value;
      let endDate = document.getElementById("endDateoff").value;
      const companyName = document.getElementById("user_client2").value;
      const vesselType = document.getElementById("candidate_c_vessel1").value;
      const category = document.getElementById("categorysoff").value;

      startDate = startDate + "T00:00:00Z";
      endDate = endDate + "T23:59:59Z";
      const params = {
        startDate: startDate,
        endDate: endDate,
        vessel_type: vesselType,
        companyname: companyName,
        category: category,
      };
      
      // Send data to server using Axios
      const response = await axios.get(
        `${config.APIURL}candidate/reports/sign-off`,
        {
          params: params,
        }
      );
      const contracts = response.data.contracts;
      resultData = contracts;
    }
    hideLoader("signoffFormBtn");
    headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Name", "Vessel Type", "Sign On", "Sign On Port", "Sign Off", "Sign Off Port", "EOC", "Emigrate Number", "AOA Number", "Currency", "Wages", "Wages Types", "Reason for Sign Off", "IMO Number", "Vessel Flag", "Company Name", "Bank Name",  "Account Number", "Bank Address", "IFSC Code", "SWIFT Code", "Beneficiary","Beneficiary Address", "Branch", "Bank Types", "Passbook", "PAN Number", "INDOS Number", 'CDC Number', "Passport Number", "PAN Card", "User Name"];

    fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'vesselName', 'vesselType', 'sign_on', 'portName', 'sign_off', 'sign_on_port', 'eoc', 'emigrate_number', 'aoa_number', 'currency', 'wages', 'wages_types', 'reason_for_sign_off', 'imoNumber', 'vesselFlag', 'company_name', 'bank_name', 'account_num', 'bank_addr', 'ifsc_code', 'swift_code', 'beneficiary', 'beneficiary_addr', 'branch', 'types', 'passbook', 'pan_num', 'indos_number', 'cdcnumber', 'pasportnumber', 'pan_card', 'userName'];
    const rowsPerPage = parseInt(document.getElementById('rowsPerSignoff').value);
    const searchKeyword = document.getElementById('searchSignoff').value;
    displayTableDetails('signoffTablehead', headerData, loadHeader, 'signoffTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlssignoff', 'signoff', searchKeyword, 'signoffCount')
    signoffCustom.style.removeProperty("display");
    if(loadHeader===true) {
      loadHeader = false;
    }
  } catch (error) {
    console.error(error);
    hideLoader("signoffFormBtn");
  }
}

/* Due For Sign Off Report */
document.getElementById("dueforsignoffform").addEventListener("submit", (event) => {
  event.preventDefault();
  handledueForsignoffSubmit(1, true)
});

async function handledueForsignoffSubmit(pageNumber, generateNew=false) {
  try {
  let dueForsignoffCustom = document.getElementById("dueForsignoffCustom");
  dueForsignoffCustom.style.display = "none";
  if(generateNew===true) {
    loadHeader = true;
    showLoader("dueForsignoffFormBtn");
    let startDate = document.getElementById("startDated").value;
    let endDate = document.getElementById("endDated").value;
    const companyName = document.getElementById("user_client3").value;
    const vessel_type = document.getElementById("candidate_c_vessel2").value;
    const category = document.getElementById("categorydue").value;

    startDate = startDate + "T00:00:00Z";
    endDate = endDate + "T23:59:59Z";

    const params = {
      startDate: startDate,
      endDate: endDate,
      companyname: companyName,
      vessel_type: vessel_type,
      category: category,
    };

    // Send data to server using Axios
    const response = await axios.get(
      `${config.APIURL}candidate/dueforsignoff`,
      {
        params: params,
      }
    );

    const contracts = response.data.contracts;
    resultData = contracts;
  }
    hideLoader("dueForsignoffFormBtn");
    headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Name", "EOC-Date", "Company", "Status"];

    fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'vesselName', 'eoc', 'company_name', 'eoc_status'];
    const rowsPerPage = parseInt(document.getElementById('rowsPerdueForSignoff').value);
    const searchKeyword = document.getElementById('searchdueForSignoff').value;
    displayTableDetails('dueForsignoffTablehead', headerData, loadHeader, 'dueForsignoffTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlsdueForsignoff', 'dueForsignoff', searchKeyword, 'dueForsignoffCount')
    dueForsignoffCustom.style.removeProperty("display");
    if(loadHeader===true) {
      loadHeader = false;
    }
  } catch (error) {
    console.error(error);
    hideLoader("dueForsignoffFormBtn");
  }
}


/* Available Candidates Report */
document.getElementById("availableCandidatesForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleavailCandidateSubmit(1, true)
});

async function handleavailCandidateSubmit(pageNumber, generateNew=false) {
  try {
  let availCandidateCustom = document.getElementById("availCandidateCustom");
  availCandidateCustom.style.display = "none";
  if(generateNew===true) {
    loadHeader = true;
    showLoader("availCandidateFormBtn");
    let startDate = document.getElementById("startDatea").value;
    startDate = startDate + "T00:00:00Z";
    let endDate = document.getElementById("endDatea").value;
    endDate = endDate + "T23:59:59Z";
    const avbrank = document.getElementById("avbrank").value;
    const category = document.getElementById("categoryavb").value;

    const params = {
      startDate: startDate,
      endDate: endDate,
      avbrank: avbrank,
      category: category,
    };

    // Send data to server using Axios
    const response = await axios.get(
      `${config.APIURL}candidate/reports/avb-date`,
      {
        params: params,
      }
    );

    const candidates = response.data.candidates;
    resultData = candidates;
  }
    hideLoader("availCandidateFormBtn");
    headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Type", "Available Date"];

    fieldName = ['sno', 'candidateId', 'name', 'c_rank', 'country', 'c_vessel', 'avb_date'];
    const rowsPerPage = parseInt(document.getElementById('rowsPeravailCandidate').value);
    const searchKeyword = document.getElementById('searchavailCandidate').value;
    displayTableDetails('availCandidateTablehead', headerData, loadHeader, 'availCandidateTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlsavailCandidate', 'availCandidate', searchKeyword, 'availCandidateCount')
    availCandidateCustom.style.removeProperty("display");
    if(loadHeader===true) {
      loadHeader = false;
    }
  } catch (error) {
    console.error(error);
    hideLoader("availCandidateFormBtn");
  }
}

/* Onboard Report */
document.getElementById("onBoardForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleOnBoardSubmit(1, true)
});

async function handleOnBoardSubmit(pageNumber, generateNew=false) {
 let onboardCustom = document.getElementById("onboardCustom");
 onboardCustom.style.display = "none";
 if(generateNew===true) {
  loadHeader = true;
  showLoader("onBoardFormBtn");
  let startDate = document.getElementById("startDateo").value;
  startDate = startDate + "T00:00:00Z";
  const companyname = document.getElementById("user_client4").value || null;
  const vesselDropdown = document.getElementById("vsl1").value || null;
  const category = document.getElementById("categoryob").value;

  // Send request to fetch onboard candidates with filters
  const response = await axios.get(`${config.APIURL}candidate/onboard`, {
    params: {
      startDate: startDate,
      companyname: companyname,
      vslName: vesselDropdown,
      category: category,
    },
    headers: {
      Authorization: token,
    },
    });
    resultData = response.data?.contracts
  }
  hideLoader("onBoardFormBtn");
  headerData = ['S.No.', 'Candidate ID', 'Name', 'Rank', 'Nationality', 'Company Name', 'Vessel Name', 'Sign On', 'Sign Off', 'Wages', 'Pasport Number', 'CDC Number', 'Indos Number'];
  fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'company_name', 'vesselName', 'sign_on', 'sign_off', 'wages', 'pasportnumber', 'cdcnumber', 'indos_number'];
  const rowsPerPage5 = parseInt(document.getElementById('rowsPerPage5').value);
  const searchKeyword = document.getElementById('searchInput5').value;
 
  displayTableDetails('onBoardTablehead', headerData, loadHeader, 'onBoardTableBody', fieldName, resultData, pageNumber, rowsPerPage5, 'paginationControls5', 'onboard', searchKeyword, 'onboardCount')
  onboardCustom.style.removeProperty("display");
  if(loadHeader===true) {
    loadHeader = false;
  }
}

/* Reminder Report */
document.getElementById("dateFilterForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleReminder(event)
});

const handleReminder = async (event) => {
  event.preventDefault(); // Prevent default form submission behavior
  try {
    showLoader("reminderFormBtn");
    let startDate = document.getElementById("startDatedr").value;
    startDate += "T00:00:00Z";

    let endDate = document.getElementById("endDatedr").value;
    endDate = endDate + "T23:59:59Z";

    // Function to fetch discussion reminders based on date filters
    const fetchData = async (startDate, endDate) => {
      try {
        const url = `${config.APIURL}candidate/reminder?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(url);
        hideLoader("reminderFormBtn");
        return response.data.discussions;
      } catch (error) {
        console.error("Error fetching discussion reminders:", error);
        hideLoader("reminderFormBtn");
        return [];
      }
    };

    // Function to render discussion reminders
    const renderDiscussionReminders = (discussions) => {
      const discussionList = document.getElementById("discussionList");
      discussionList.innerHTML = ""; // Clear existing items

      // Display the number of fetched data items
      const discussionCount = document.getElementById("discussionCount");
      discussionCount.textContent = `Displaying ${discussions.length} number(s) of Data`;

      discussions.forEach((discussion) => {
        // Calculate the status based on the r_date
        const reminderDate = new Date(discussion.r_date);
        const today = new Date();
        let status = "";

        if (reminderDate < today) {
          status = "Expired";
        } else if (reminderDate.toDateString() === today.toDateString()) {
          status = "Today";
        } else {
          status = "Upcoming";
        }

        // Render each discussion reminder item
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="mb-1 d-flex align-items-center">Candidate ID: <button class="btn btn-link candidate-btn" data-candidate-id="${
                              discussion.candidateId
                            }">${discussion.candidateId}</button></h5>
                            <p class="mb-1">Discussion: ${
                              discussion.discussion
                            }</p>
                        </div>
                        <div>
                            <span class="badge align-content-center h-25 ${getBadgeColor(
                              status
                            )}">${status}</span>
                        </div>
                    </div>
                    <small class="text-muted">Reminder Date: ${
                      discussion.r_date
                    }</small>
                `;
        discussionList.appendChild(listItem);

        // Add event listener to candidate ID button
        listItem
          .querySelector(".candidate-btn")
          .addEventListener("click", () => {
            const candidateId = discussion.candidateId;
            localStorage.setItem("memId", candidateId);
            // Redirect to view-candidate page with candidateId
            window.location.href = `view-candidate.html?id=${candidateId}`;
          });
      });
    };

    // Function to determine badge color based on discussion status
    const getBadgeColor = (status) => {
      switch (status) {
        case "Expired":
          return "bg-danger";
        case "Today":
          return "bg-warning";
        case "Upcoming":
          return "bg-primary";
        default:
          return "";
      }
    };

    // Fetch discussion reminders based on date filters
    const discussions = await fetchData(startDate, endDate);
    // Render discussion reminders
    renderDiscussionReminders(discussions);
  } catch (error) {
    console.error("Error handling reminder:", error);
  }
};

/* crew List Month Wise Report */
document.getElementById("crewListMonthWiseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handlecrewListMonthWiseSubmit(1, true)
});

async function handlecrewListMonthWiseSubmit(pageNumber, generateNew=false) {
  try {
    let crewListMonthWiseCustom = document.getElementById("crewListMonthWiseCustom");
    crewListMonthWiseCustom.style.display = "none";
    if(generateNew===true) {
      loadHeader = true;
      showLoader("crewListMonthWiseBtn");
      let startDate = document.getElementById("startDatecl").value;
      startDate = startDate + "T00:00:00Z";
      let endDate = document.getElementById("endDatecl").value;
      endDate = endDate + "T23:59:59Z";

      // Check if startDate and endDate are empty
      if (!startDate || !endDate) {
        console.error("Start date and end date are required");
        // Show a message to the user indicating that start date and end date are required
        return;
      }

      const vslName = document.getElementById("vsl").value || null;
      const companyname = document.getElementById("user_client5").value || null;

      const params = {
        startDate: startDate,
        endDate: endDate,
        vslName: vslName,
        company: companyname,
      };

      const response = await axios.get(`${config.APIURL}candidate/crewlist`, {
        params: params,
      });
      const crewlist = response.data;
      resultData = crewlist;
    }
    hideLoader("crewListMonthWiseBtn");
    headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Name", "Vessel Type", "Sign On", "Sign On Port", "Sign Off", "Sign Off Port", "Reason for Sign Off", "EOC", "Currency", "Wages", "Wages Types", "IMO Number", "Vessel Flag", "Company Name", "Bank Name",  "Account Number", "Bank Address", "IFSC Code", "SWIFT Code", "Beneficiary","Beneficiary Address", "Branch", "Bank Types", "Passbook", "PAN Number", "INDOS Number", 'CDC Number', "Passport Number", "PAN Card"];

    fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'vesselName', 'vesselType', 'sign_on', 'portName', 'sign_off', 'signOffPortName', 'reason_for_sign_off', 'eoc', 'currency', 'wages', 'wages_types', 'imoNumber', 'vesselFlag', 'company_name', 'bank_name', 'account_num', 'bank_addr', 'ifsc_code', 'swift_code', 'beneficiary', 'beneficiary_addr', 'branch', 'types', 'passbook', 'pan_num', 'indos_number', 'cdcnumber', 'pasportnumber', 'pan_card'];
    const rowsPerPage = parseInt(document.getElementById('rowsPercrewListMonthWise').value);
    const searchKeyword = document.getElementById('searchcrewListMonthWise').value;
    displayTableDetails('crewListMonthWiseTablehead', headerData, loadHeader, 'crewListMonthWiseTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlscrewListMonthWise', 'crewListMonthWise', searchKeyword, 'crewListMonthWiseCount')
    crewListMonthWiseCustom.style.removeProperty("display");
    if(loadHeader===true) {
      loadHeader = false;
    }
  } catch (error) {
      console.error(error);
      hideLoader("crewListMonthWiseBtn");
  }
}

/* IMO crew List Month Wise Report */
document.getElementById("imocrewListMonthWiseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handleimocrewListMonthWiseSubmit(1, true)
});

async function handleimocrewListMonthWiseSubmit(pageNumber, generateNew=false) {
  try {
    let imocrewListMonthWiseCustom = document.getElementById("imocrewListMonthWiseCustom");
    imocrewListMonthWiseCustom.style.display = "none";
    if(generateNew===true) {
      loadHeader = true;
      showLoader("imocrewListMonthWiseBtn");
      
      let startDate = document.getElementById("startDatec2").value;
      startDate = startDate + "T00:00:00Z";
      let endDate = document.getElementById("endDatec2").value;
      endDate = endDate + "T23:59:59Z";

      // Check if startDate and endDate are empty
      if (!startDate || !endDate) {
        console.error("Start date and end date are required");
        // Show a message to the user indicating that start date and end date are required
        return;
      }
      const vslName = document.getElementById("vsl2").value || null;
      const companyname = document.getElementById("user_client6").value || null;

      const params = {
        startDate: startDate,
        endDate: endDate,
        vslName: vslName,
        company: companyname,
      };

      const response = await axios.get(`${config.APIURL}candidate/crewlist`, {
        params: params,
      });
      const crewlist = response.data; // Adjust according to your API response structure
      resultData = crewlist;
      

      const portofRegistry = document.getElementById("portofRegistry").value || '';
      const portarrivedfrom = document.getElementById("portarrivedfrom").value || '';
      const portName = document.getElementById("portName").value || '';
      const arrival = document.getElementById("arrival").checked || '';
      const arrival_ = (arrival===true)?'Yes':'No';
      const departure = document.getElementById("departure").checked || '';
      const departure_ = (departure===true)?'Yes':'No';

      const exportButton = document.getElementById("exportToExcelBtnimocrewListMonthWise");
      exportButton.addEventListener("click", () => {
        window.open(
          `viewimoreport.html?startDate=${startDate}&endDate=${endDate}&vslName=${vslName}&companyname=${companyname}&portofRegistry=${portofRegistry}&portarrivedfrom=${portarrivedfrom}&portName=${portName}&arrival=${arrival_}&departure=${departure_}`,
          '_blank'
        );
      })

    }
    hideLoader("imocrewListMonthWiseBtn");
    headerData = ["S.No", "Candidate ID", "Name",  "Rank", "Nationality", "Vessel Name", "Vessel Type", 'Date Of Birth',
    'Place of birth', "Company Name", "Sign On", "Sign On Port", 'CDC Number', "Passport Number"];

    fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'vesselName', 'vesselType', 'dob', 'birth_place', 'company_name', 'sign_on', 'portName', 'cdcnumber', 'pasportnumber'];
    const rowsPerPage = parseInt(document.getElementById('rowsPerimocrewListMonthWise').value);
    const searchKeyword = document.getElementById('searchimocrewListMonthWise').value;
    displayTableDetails('imocrewListMonthWiseTablehead', headerData, loadHeader, 'imocrewListMonthWiseTableBody', fieldName, resultData, pageNumber, rowsPerPage, 'paginationControlsimocrewListMonthWise', 'imocrewListMonthWise', searchKeyword, 'imocrewListMonthWiseCount')
    imocrewListMonthWiseCustom.style.removeProperty("display");
    if(loadHeader===true) {
      loadHeader = false;
    }
  } catch (error) {
      console.error(error);
      hideLoader("imocrewListMonthWiseBtn");
  }
}



/* Relief Plan Report */
document.getElementById("reliefPlanForm").addEventListener("submit", (event) => {
  event.preventDefault();
  handlereliefPlanSubmit(1, true)
}
);

async function handlereliefPlanSubmit(pageNumber, generateNew=false) {
  let reliefPlan = document.getElementById("reliefPlan");
  reliefPlan.style.display = "none";
  if(generateNew===true) {
    loadHeader = true;
    showLoader("ReliefPlanFormBtn");
 
    let startDate = document.getElementById("reliefPlanDate").value;
    startDate = startDate + "T00:00:00Z";
    // Get today's date as the end date
    const endDate = new Date().toISOString();

    // Fetch relief plan data based on start date and today's date as end date
    const url = `${config.APIURL}candidate/reliefplan?startDate=${startDate}&endDate=${endDate}`;
    const response = await axios.get(url, {headers: {
      Authorization: token,
    }});
    const reliefPlanData = response.data.contracts;
    console.log(reliefPlanData, 'reliefPlanDatareliefPlanData')
    resultData = reliefPlanData; 
   }
   
   hideLoader("ReliefPlanFormBtn");
   headerData = ['S.No.', 'Candidate ID', 'Name', 'Rank', 'Nationality', 'Company Name', 'Vessel Name', 'End of Contract'];
   fieldName = ['sno', 'candidateId', 'name', 'rank', 'country', 'company_name', 'vesselName', 'eoc'];
   const rowsPerPage5 = parseInt(document.getElementById('rowsPerPageSelectrpc').value);
   const searchKeyword = document.getElementById('searchreliefPlan').value;
  
   displayTableDetails('reliefPlanTablehead', headerData, loadHeader, 'reliefPlanTableBody', fieldName, resultData, pageNumber, rowsPerPage5, 'paginationControlsrpc', 'reliefPlan', searchKeyword, 'reliefPlanCount')
   reliefPlan.style.removeProperty("display");
   if(loadHeader===true) {
     loadHeader = false;
   }
 }



async function displayTableDetails(theadID, headerData, loadHeader, tbodyId, fieldName, result, pageNumber, recordsPerPage, paginationID, tableType, searchKeyword, displyCountID) {
  if(loadHeader===true) {
    let headerRow = document.getElementById(theadID);
    headerRow.innerHTML = "";
    headerData.forEach(headerText => {
        let th = document.createElement("th");
        th.textContent = headerText;
        th.classList.add("fw-bolder"); 
        th.classList.add("text-white"); 
        th.style.backgroundColor = "#201e43"; 
        headerRow.appendChild(th);
    });
  }
  let tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";
  const filteredData = (searchKeyword!=="")? result.filter(item => {
    return Object.values(item).some(val => {
      // Handle null/undefined values by converting them to empty strings
      return val?.toString().toLowerCase().includes(searchKeyword.toLowerCase());
    });
  }):result;


  
  const totalRecord = filteredData.length;
  let startIndex = (pageNumber - 1) * recordsPerPage;
  let endIndex = startIndex + recordsPerPage;
  const totalPage = Math.ceil(totalRecord/recordsPerPage);
  document.getElementById(displyCountID).innerHTML = `<span class='text-success'>${totalRecord}</span> Matches found`;
  

  let paginatedData = filteredData.slice(startIndex, endIndex);
  if(filteredData.length>0) {
    for (const [index, item] of paginatedData.entries()) {
        let row = document.createElement("tr");
        for (const headerText of fieldName) {
            let td = document.createElement("td");
            if(headerText==='sno') {
              td.textContent = parseFloat(startIndex) + parseFloat(index) + 1 ;
            } else if(headerText==='candidateId') {
              const link = document.createElement("a");
              link.href = "#";
              link.textContent = item[headerText];
              link.onclick = (event) => {
                  event.preventDefault(); 
                  viewCandidate(item[headerText]);
              };           
              td.appendChild(link);
            } else if(headerText==='passbook') {
              const link = document.createElement("a");
              link.href = `${config.APIURL}views/public/bank_details/${item[headerText]}`;
              link.textContent = item[headerText]; 
              link.target = '_blank';
              td.appendChild(link);
            } else if(headerText==='pan_card') {
              const link = document.createElement("a");
              link.href = `${config.APIURL}views/public/bank_details/pan_card/${item[headerText]}`;
              link.textContent = item[headerText]; 
              link.target = '_blank';
              td.appendChild(link);
            } else if(['sign_on', 'sign_off', 'eoc', 'avb_date', 'dob', 'r_date'].indexOf(headerText)>=0) {
              td.textContent = showDateFormat(item[headerText]);
            } else if(headerText==='pasportnumber') {
              const pasportNumber = await checkingDocument(item.document, 'passport') ;
              td.textContent = (pasportNumber!=="" && pasportNumber!==null)?pasportNumber.document_number :'';
            } else if(headerText==='cdcnumber') {
              let docTypes = 'indian cdc';
              if(item['country']==='Cyprus') {
                docTypes='cyprus cdc';
              }else if(item['country']==='Marshall Islands') {
                docTypes='marshall islands cdc';
              }else if(item['country']==='Thailand') {
                docTypes='thailand cdc';
              }else if(item['country']==='Palau') {
                docTypes='palau cdc';
              }else if(item['country']==='Bangladesh') {
                docTypes='bangladesh cdc';
              }else if(item['country']==='Ethiopia') {
                docTypes='ethiopia cdc';
              }else if(item['country']==='Ukraine') {
                docTypes='ukraine cdc';
              }else if(item['country']==='Egypt') {
                docTypes='egypt cdc';
              }else if(item['country']==='China') {
                docTypes='china cdc';
              }else if(item['country']==='Russia') {
                docTypes='russia cdc';
              }else if(item['country']==='Philippines') {
                docTypes='philippines cdc';
              }else if(item['country']==='Gabon') {
                docTypes='Gabon cdc';
              }              
              const pasportNumber = await checkingDocument(item.document, docTypes) ;
              td.textContent = (pasportNumber!=="" && pasportNumber!==null)?pasportNumber.document_number :'';
            } else if(headerText=='eoc_status') {
              const status = calculateStatus_(item.eoc);
              const badge = document.createElement("span");
              badge.textContent = status.status;
              badge.classList.add("badge", "bg-" + status.color);
              td.classList.add("text-center");
              td.appendChild(badge);
            }else {
              td.textContent = item[headerText];
            }
            row.appendChild(td);
        };

        tbody.appendChild(row);
    };
  }else {
    let row = document.createElement("tr");
    let td = document.createElement("td");
    td.setAttribute("colspan", headerData.length);
    td.style.textAlign = "center";
    td.style.fontWeight = "bold";
    td.textContent = 'No Record Found';
    row.appendChild(td);
    tbody.appendChild(row);

  }
  loadPagenation(paginationID, pageNumber, totalPage, totalRecord, tableType)
}

async function loadPageData(page, tableType) {
  if (tableType === "onboard") {
    handleOnBoardSubmit(page)
  } else if (tableType === "reliefPlan") {
    handlereliefPlanSubmit(page)
  } else if (tableType === "newProfile") {
    handleNewProfileSubmit(page)
  }  else if (tableType === "callsMade") {
    handleCallsMadeSubmit(page)
  } else if (tableType === "proposed") {
    handleProposedSubmit(page)
  } else if (tableType === "signon") {
    handlesignonSubmit(page)
  } else if (tableType === "signoff") {
    handlesignoffSubmit(page)
  } else if (tableType === "dueForsignoff") {
    handledueForsignoffSubmit(page)
  } else if(tableType==='availCandidate') {
    handleavailCandidateSubmit(page);
  } else if (tableType === "crewListMonthWise") {
    handlecrewListMonthWiseSubmit(page)
  } else if (tableType === "imocrewListMonthWise") {
    handleimocrewListMonthWiseSubmit(page)
  } else {
    var currentPage = document.getElementById("currentPage").value;
    if (currentPage != page) {
      document.getElementById("currentPage").value = page;
      displayStats(false, page);
    }
  }
  
  
  
}

function viewCandidate(candidateId) {
  // Construct the URL with query parameter
  let url = "./view-candidate.html?id=" + candidateId;
  // Open the URL in a new tab/window
  window.open(url, "_blank");
}

async function checkingDocument(documentList, documentType) {
  if (Array.isArray(documentList) && documentList.length > 0 && documentType) {
    return documentList.find(doc => doc.document.toLowerCase() === documentType) || null;
  }
  return null;
}

document.getElementById("exportToExcelBtnnewProfile").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('New Profile');
});
document.getElementById("exportToExcelBtncallsMade").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Calls Made');
});
document.getElementById("exportToExcelBtnproposed").addEventListener("click", async (event) => {
  event.preventDefault();
  let status = document.getElementById("status").value;
  exportFN(status);
});
document.getElementById("exportToExcelBtnsignon").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Sign On');
});
document.getElementById("exportToExcelBtnsignoff").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Sign Off');
});
document.getElementById("exportToExcelBtndueForsignoff").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Due For Sign Off');
});
document.getElementById("exportToExcelBtnavailCandidate").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Available Candidates');
});
document.getElementById("exportToExcelBtnob").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN("Onboard");
});
document.getElementById("exportToExcelBtncrewListMonthWise").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Crew List Month Wise');
});


document.getElementById("exportreliefPlan").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Relief Plan');
});










async function exportFN(excelName)  {
  try {
    const finalData = await flattenData();
    let totalREcord = [];
    for (const headerText of fieldName) {      
      if(headerText==='sno') {
        totalREcord.push(`-------------Total Records ${finalData.length}-------------`)
      } else {
        totalREcord.push('')
      }
    }
    finalData.push(totalREcord);
    exportToExcel(headerData, finalData, excelName);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function flattenData() {
  let finalReturnData = []
  let startIndex = 0
  if(resultData.length>0) {
    for (const [index, item] of resultData.entries()) { 
      let columnData = [];
      for (const headerText of fieldName) {        
        if(headerText==='sno') {
          columnData.push(parseFloat(startIndex) + parseFloat(index) + 1) ;
        }else if(['sign_on', 'sign_off', 'eoc', 'avb_date', 'dob', 'r_date'].indexOf(headerText)>=0) {
          columnData.push(showDateFormat(item[headerText]));
        }else if(headerText==='pasportnumber') {
          const pasportNumber = await checkingDocument(item.document, 'passport') ;
          columnData.push((pasportNumber!=="" && pasportNumber!==null)?pasportNumber.document_number :'');
        } else if(headerText==='cdcnumber') {
          let docTypes = 'indian cdc';
          if(item['country']==='Cyprus') {
            docTypes='cyprus cdc';
          }else if(item['country']==='Marshall Islands') {
            docTypes='marshall islands cdc';
          }else if(item['country']==='Thailand') {
            docTypes='thailand cdc';
          }else if(item['country']==='Palau') {
            docTypes='palau cdc';
          }else if(item['country']==='Bangladesh') {
            docTypes='bangladesh cdc';
          }else if(item['country']==='Ethiopia') {
            docTypes='ethiopia cdc';
          }else if(item['country']==='Ukraine') {
            docTypes='ukraine cdc';
          }else if(item['country']==='Egypt') {
            docTypes='egypt cdc';
          }else if(item['country']==='China') {
            docTypes='china cdc';
          }else if(item['country']==='Russia') {
            docTypes='russia cdc';
          }else if(item['country']==='Philippines') {
            docTypes='philippines cdc';
          }else if(item['country']==='Gabon') {
            docTypes='Gabon cdc';
          }              
          const pasportNumber = await checkingDocument(item.document, docTypes) ;
          columnData.push((pasportNumber!=="" && pasportNumber!==null)?pasportNumber.document_number :'');
        } else if(headerText=='eoc_status') {
          const status = calculateStatus_(item.eoc);
          columnData.push(status.status);
        }else {
          columnData.push(item[headerText]);
        }
      };
      finalReturnData.push(columnData)
    }
  }
  return finalReturnData;

}

async function exportToExcel(headers, data, fileName) {
  if (!Array.isArray(data) || data.length === 0) {
      console.error("Invalid data: Must be a non-empty array");
      return;
  }
  // Create a new worksheet and manually insert headers
  const worksheet = XLSX.utils.aoa_to_sheet([headers]); 
  // Convert data and append it below headers
  XLSX.utils.sheet_add_json(worksheet, data, { origin: "A2", skipHeader: true });
  worksheet["!merges"] = [{ s: { r: data.length, c: 0 }, e: { r: data.length, c: headers.length-1 } }];
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
  // Save the file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

function calculateStatus_(eocDate) {
  const today = new Date();
  const eoc = new Date(eocDate);
  const diffTime = Math.abs(eoc - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (eoc < today) {
    return { status: "Overdue", color: "danger" };
  } else if (diffDays <= 30) {
    return { status: "Due Soon", color: "warning" };
  } else {
    return { status: "On Track", color: "success" };
  }
}