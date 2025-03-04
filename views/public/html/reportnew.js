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
  } else if(reportType==='onboard') {
    handleOnBoardSubmit(1)
  } else if(reportType==='reliefPlan') {
    handlereliefPlanSubmit(1);
  } else if(reportType==='signon') {
    handlesignonSubmit(1);
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
   newProfileCustom.style.display = "inherit";
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
  callsMadeCustom.style.display = "inherit";
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
  proposedCustom.style.display = "inherit";
  document.getElementById('paginationControlspro').style.display = "inherit";
  if(loadHeader===true) {
    loadHeader = false;
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
  onboardCustom.style.display = "inherit";
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
  signonCustom.style.display = "inherit";
  if(loadHeader===true) {
    loadHeader = false;
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
   reliefPlan.style.display = "inherit";
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
   /*  paginatedData.forEach(async(item, index) => {     */
        let row = document.createElement("tr");
        for (const headerText of fieldName) {
        /* await fieldName.forEach(async(headerText) => { */
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
            }else {
              td.textContent = item[headerText];
            }
            row.appendChild(td);
        }/* ) */;

        tbody.appendChild(row);
    }/* ) */;
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
  }  else if (tableType === "signon") {
    handlesignonSubmit(page)
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


document.getElementById("exportToExcelBtnob").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN("Onboard");
});

document.getElementById("exportreliefPlan").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Relief Plan');
});

document.getElementById("exportToExcelBtnnp").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('New Profile');
});

document.getElementById("exportToExcelBtncm").addEventListener("click", async (event) => {
  event.preventDefault();
  exportFN('Calls Made');
});

document.getElementById("exportToExcelBtnpro").addEventListener("click", async (event) => {
  event.preventDefault();
  let status = document.getElementById("status").value;
  exportFN(status);
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