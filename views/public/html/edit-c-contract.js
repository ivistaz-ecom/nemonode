const token = localStorage.getItem('token');
console.log(token)
// Assuming you have the necessary libraries and functions defined
function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}


document.addEventListener("DOMContentLoaded", function () {

  
   
    const decodedToken = decodeToken(token);
    console.log(decodedToken)

const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}



   
    const urlParams = new URLSearchParams(window.location.search);

    const contractId = localStorage.getItem('contractId');
  
    // Get the values using the parameter names

    // Get the values using the parameter names
    const id = urlParams.get('id');
    const ranks_contract = urlParams.get('rank')
    const company = urlParams.get('company');
    const vslName = urlParams.get('vslName');
    const vesselType = urlParams.get('vesselType');
    const sign_on_port = urlParams.get('sign_on_port');
    const sign_on = urlParams.get('sign_on');
    const sign_on_dg = urlParams.get('sign_on_dg');
    const wage_start = urlParams.get('wage_start');
    const eoc = urlParams.get('eoc');
    const wages = urlParams.get('wages');
    const currency = urlParams.get('currency');
    const wages_types = urlParams.get('wages_types');
    const sign_off = urlParams.get('sign_off');
    const sign_off_dg = urlParams.get('sign_off_dg');
    const sign_off_port = urlParams.get('sign_off_port');
    const reason_for_sign_off = urlParams.get('reason_for_sign_off');
    const aoa_number = urlParams.get('aoa_number');
    const emigrate_number = urlParams.get('emigrate_number');
    const documents = urlParams.get('documents');
    const aoa = urlParams.get('aoa');

    const openingBalance = urlParams.get('openingBalance');
    const basicWages = urlParams.get('basicWages');
    const leaveWages = urlParams.get('leaveWages');
    const overtimeWages = urlParams.get('overtimeWages');
    const leaveSubsistence = urlParams.get('leaveSubsistence');
    const consolidateAllowance = urlParams.get('consolidateAllowance');
    const fixedOvertime = urlParams.get('fixedOvertime');
    const subsistenceAllowance = urlParams.get('subsistenceAllowance');
    const uniformAllowance = urlParams.get('uniformAllowance');
    const miscAllowance = urlParams.get('miscAllowance');
    const otherAllowance = urlParams.get('otherAllowance');
    const onboardOtWages = urlParams.get('onboardOtWages');
    const joiningBasic = urlParams.get('joiningBasic');
    const tankCleaningBonus = urlParams.get('tankCleaningBonus');
    const additionalWorks = urlParams.get('additionalWorks');
    const prevMonthBalance = urlParams.get('prevMonthBalance');
    const reimbursement = urlParams.get('reimbursement');
    const radio = urlParams.get('radio');
    const onboardFinalSettlement = urlParams.get('onboardFinalSettlement');
    const otherDeductions = urlParams.get('otherDeductions');
    const training = urlParams.get('training');
    const bondStore = urlParams.get('bondStore');
    const cdc_passport = urlParams.get('cdc_passport');
    const contractExtension = urlParams.get('contractExtension');
    const contractExtensionDays = urlParams.get('contractExtensionDays');    
    const created_by = urlParams.get('created_by');

    

    
    document.getElementById('contractId').value = id;
    document.getElementById('editcontract_rank').value = ranks_contract;
    document.getElementById('editcontract_company').value = company;
    document.getElementById('editcontract_vsl').value = vslName;
    document.getElementById('editcontract_vesseltype').value = vesselType;
    document.getElementById('editcontract_signonport').value = sign_on_port;
    document.getElementById('editcontract_signon').value = formatDate(sign_on);
    document.getElementById('editcontract_signon_dg').value = formatDate(sign_on_dg);
    document.getElementById('editcontract_wage_start').value = formatDate(wage_start);
    document.getElementById('editcontract_eoc').value = formatDate(eoc);
    document.getElementById('editcontract_wages').value = wages;
    document.getElementById('editcontract_currency').value = currency;
    document.getElementById('editcontract_wagestype').value = wages_types;
    document.getElementById('editcontract_signoff').value = formatDate(sign_off);
    document.getElementById('editcontract_signoff_dg').value = formatDate(sign_off_dg);
    document.getElementById('editcontract_signoffport').value = sign_off_port;
    document.getElementById('editcontracts_reason').value = reason_for_sign_off;
    document.getElementById('editcontract_aoa_num').value = aoa_number;
    document.getElementById('editcontract_emigrate').value = emigrate_number;
    document.getElementById('prevDoc').value = documents;
    document.getElementById('prevAoa').value = aoa;
    document.getElementById('created_by').value = created_by;
    document.getElementById('contract_opening_balance').value = openingBalance;
document.getElementById('contract_basic_wages').value = basicWages;
document.getElementById('contract_leave_wages').value = leaveWages;
document.getElementById('contract_overtime_wages').value = overtimeWages;
document.getElementById('contract_leave_subsistence').value = leaveSubsistence;
document.getElementById('contract_consolidate_allowance').value = consolidateAllowance;
document.getElementById('contract_fixed_overtime').value = fixedOvertime;
document.getElementById('contract_subsistence_allowance').value = subsistenceAllowance;
document.getElementById('contract_uniform_allowance').value = uniformAllowance;
document.getElementById('contract_misc_allowance').value = miscAllowance;
document.getElementById('contract_other_allowance').value = otherAllowance;
document.getElementById('contract_onboard_ot_wages').value = onboardOtWages;
document.getElementById('contract_joining_basic').value = joiningBasic;
document.getElementById('contract_tank_cleaning_bonus').value = tankCleaningBonus;
document.getElementById('contract_additional_works').value = additionalWorks;
document.getElementById('contract_prev_month_balance').value = prevMonthBalance;
document.getElementById('contract_reimbursement').value = reimbursement;
document.getElementById('contract_radio').value = radio;
document.getElementById('contract_onboard_final_settlement').value = onboardFinalSettlement;
document.getElementById('contract_other_deductions').value = otherDeductions;
document.getElementById('contract_training').value = training;
document.getElementById('contract_bond_store').value = bondStore;
document.getElementById('cdc_passport').value = cdc_passport;
document.getElementById('contractExtension').value = contractExtension;
document.getElementById('contractExtensionDays').value = contractExtensionDays;




console.log('Opening Balance:', openingBalance);
console.log('Basic Wages:', basicWages);
console.log('Leave Wages:', leaveWages);
console.log('Overtime Wages:', overtimeWages);
console.log('Leave Subsistence:', leaveSubsistence);
console.log('Consolidate Allowance:', consolidateAllowance);
console.log('Fixed Overtime:', fixedOvertime);
console.log('Subsistence Allowance:', subsistenceAllowance);
console.log('Uniform Allowance:', uniformAllowance);
console.log('Miscellaneous Allowance:', miscAllowance);
console.log('Other Allowance:', otherAllowance);
console.log('Onboard OT Wages:', onboardOtWages);
console.log('Joining Basic:', joiningBasic);
console.log('Tank Cleaning Bonus:', tankCleaningBonus);
console.log('Additional Works:', additionalWorks);
console.log('Previous Month Balance:', prevMonthBalance);
console.log('Reimbursement:', reimbursement);
console.log('Radio:', radio);
console.log('Onboard Final Settlement:', onboardFinalSettlement);
console.log('Other Deductions:', otherDeductions);
console.log('Training:', training);
console.log('Bond Store:', bondStore);
console.log('CDC / passport:', cdc_passport);

    async function displayDropdown() {
        try {
            const rankResponse = await axios.get("https://nsnemo.com/others/get-ranks", {
                headers: { "Authorization": token }
            });
            const ranks = rankResponse.data.ranks;
            const rankSelect = document.getElementById("editcontract_rank");
    
            rankSelect.innerHTML = '<option value="" disabled selected>-- Select Rank --</option>';
    
            ranks.forEach((rank) => {
                const option = document.createElement("option");
                option.value = rank.rank;
                option.textContent = rank.rank;
                rankSelect.appendChild(option);
            });
            rankSelect.value=ranks_contract
        } catch (error) {
            console.error('Error fetching and displaying ranks:', error);
        }
    }

    const displayVesselDropdown = async function () {
        try {
            const vesselDropdown = document.getElementById('editcontract_vesseltype');
            vesselDropdown.innerHTML = ''; // Clear existing options
        
            // Add the default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '-- Select Vessel --';
            vesselDropdown.appendChild(defaultOption);
        
            const vesselResponse = await axios.get("https://nsnemo.com/others/get-vessel", { headers: { "Authorization": token } });
            const vessels = vesselResponse.data.vessels;
            const vesselNames = vessels.map(vessel => vessel.vesselName);
        
            for (let i = 0; i < vesselNames.length; i++) {
                const option = document.createElement('option');
                option.value = vesselNames[i];
                option.text = vesselNames[i];
                vesselDropdown.appendChild(option);
            }
            vesselDropdown.value = vesselType; // Make sure to set the selected value if needed
        } catch (error) {
            console.error('Error fetching vessels:', error);
        }
    }
    
    // Call the displayVesselDropdown function where needed, for example, after fetching the rank dropdown
   // Call the function to populate the vessel dropdown
    

   async function displayVesselTypeDropdown() {
    try {
        const serverResponse = await axios.get("https://nsnemo.com/others/get-vsls", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vessels;

        // Get the select element
        const vesselSelect = document.getElementById("editcontract_vsl");

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
            option.value = vessel.id;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option);
        });
        vesselSelect.value=vslName
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}
    
    // Call the displayVesselTypeDropdown function where needed, for example, after fetching the rank dropdown
    // Call the function to populate the vessel dropdown
    

async function fetchAndDisplayDropdowns() {
    try {
        // Fetch ports from the server
        const portsResponse = await axios.get("https://nsnemo.com/others/get-ports", { headers: { "Authorization": token } });
        const ports = portsResponse.data.ports;

        // Get the select elements
        const portSelect = document.getElementById("editcontract_signonport"); // Adjust the ID accordingly
        const portSelects = document.getElementById("editcontract_signoffport"); // Adjust the ID accordingly

        // Clear previous options
        portSelect.innerHTML = '';
        portSelects.innerHTML = '';

        // Add default options
        const defaultPortOption = document.createElement("option");
        defaultPortOption.value = "";
        defaultPortOption.text = "-- Select Port --";

        // Append default option to both dropdowns
        portSelect.appendChild(defaultPortOption.cloneNode(true));
        portSelects.appendChild(defaultPortOption.cloneNode(true));

        // Add ports to the port dropdowns
        ports.forEach((port) => {
            const option = document.createElement("option");
            option.value = port.id;
            option.text = port.portName;

            // Append individual port options to each dropdown
            portSelect.appendChild(option.cloneNode(true));
            portSelects.appendChild(option.cloneNode(true));
        });
        portSelect.value=sign_on_port;
        portSelects.value=sign_off_port

    } catch (error) {
        console.error('Error fetching and displaying dropdowns:', error);
    }
}


// Call the fetchAndDisplayDropdowns function wherever needed


// Modify the fetchAndDisplayDropdowns function
async function fetchAndDisplayCompanies() {
    try {
        const companyResponse = await axios.get("https://nsnemo.com/company/dropdown-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.companies; // Corrected property name
        const companyDropdown = document.getElementById('editcontract_company');
        companyDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Company --';
        companyDropdown.appendChild(defaultOption);

        // Add options for each company
        companyOptions.forEach(company => {
            const option = document.createElement('option');
            option.value = company.company_id; // Set the value to company ID
            option.text = company.company_name;
            companyDropdown.appendChild(option);
        });
        companyDropdown.value=company
        
    } catch (error) {
        console.error('Error fetching company data:', error);
    }
}

    // Add your code to use the parameters here
    // For example, you can update form fields with these values


    fetchAndDisplayDropdowns();
    fetchAndDisplayCompanies();
    displayDropdown(); 
    displayVesselDropdown()
    displayVesselTypeDropdown()

    // Get the dropdown items
    let dropdownItems = document.querySelectorAll(".dropdown-item");

    // Add click event listener to each dropdown item
    dropdownItems.forEach(function (item) {

        item.addEventListener("click", function () {
            // Get the id attribute of the clicked item
            var itemId = item.id;
            const urlParams = new URLSearchParams(window.location.search);
    
            // Get the candidateId from the URL parameter
            const memId = urlParams.get('memId');

            // Define the destination URLs based on the clicked item
            var destinationPage = "";
            switch (itemId) {
                case "personal":
                    destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                    break;
                case "discussion":
                    destinationPage = `./edit-discussion.html?memId=${memId}`;
                    break;
                case "contract":
                    destinationPage = `./edit-c-contract.html?memId=${memId}`;
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
                    case 'seaservice':
                        destinationPage=`./seaservicetable.html?memId=${memId};`;
                        break;
                default:
                    // Handle default case or do nothing
                    break;
            }

            // Redirect to the destination page
            if (destinationPage !== "") {
                window.location.href = destinationPage;
            }
        });
    });

    // Retrieve contract ID from local storage and fetch contract details
   

    // Call the fetchAndDisplayDropdowns function wherever needed
    // Assuming you have a function named displayDropdown
});



function formatDate(dateString) {
    if(dateString!=="" && dateString!=="null" && dateString!==null && dateString!=='0000-00-00') {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }
  }



  document.getElementById('contractForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const decodedToken = decodeToken(token);
    const contractId = document.getElementById('contractId').value;
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get('memId');
    const created_by = decodedToken.userId;

    const rank = document.getElementById('editcontract_rank').value.trim();
    const company = document.getElementById('editcontract_company').value.trim();
    const vslName = document.getElementById('editcontract_vsl').value.trim();
    const vesselType = document.getElementById('editcontract_vesseltype').value.trim();
    const signOnPort = document.getElementById('editcontract_signonport').value.trim();
    const signOnDate = document.getElementById('editcontract_signon').value.trim();
    const signOnDate_dg = document.getElementById('editcontract_signon_dg').value.trim();
    const wagesStart = document.getElementById('editcontract_wage_start').value.trim();
    const eoc = document.getElementById('editcontract_eoc').value.trim();
    const wages = document.getElementById('editcontract_wages').value.trim();
    const currency = document.getElementById('editcontract_currency').value.trim();
    const wagesType = document.getElementById('editcontract_wagestype').value.trim();
    const signOffDate = document.getElementById('editcontract_signoff').value.trim();
    const signOffDate_dg = document.getElementById('editcontract_signoff_dg').value.trim();
    const signOffPort = document.getElementById('editcontract_signoffport').value.trim();
    const reasonForSignOff = document.getElementById('editcontracts_reason').value.trim();
    const aoaNum = document.getElementById('editcontract_aoa_num').value.trim();
    const emigrateNumber = document.getElementById('editcontract_emigrate').value.trim();

    const documentFile = document.getElementById('editcontract_document').files[0];
    const aoaFile = document.getElementById('editcontract_aoa').files[0];

    let documentFileName = document.getElementById('editcontract_document').value.trim();
    let aoaFileName = document.getElementById('editcontract_aoa').value.trim();
    const openingBalance = document.getElementById('contract_opening_balance').value.trim();
    const basicWages = document.getElementById('contract_basic_wages').value.trim();
    const leaveWages = document.getElementById('contract_leave_wages').value.trim();
    const overtimeWages = document.getElementById('contract_overtime_wages').value.trim();
    const leaveSubsistence = document.getElementById('contract_leave_subsistence').value.trim();
    const consolidateAllowance = document.getElementById('contract_consolidate_allowance').value.trim();
    const fixedOvertime = document.getElementById('contract_fixed_overtime').value.trim();
    const subsistenceAllowance = document.getElementById('contract_subsistence_allowance').value.trim();
    const uniformAllowance = document.getElementById('contract_uniform_allowance').value.trim();
    const miscAllowance = document.getElementById('contract_misc_allowance').value.trim();
    const otherAllowance = document.getElementById('contract_other_allowance').value.trim();
    const onboardOtWages = document.getElementById('contract_onboard_ot_wages').value.trim();
    const joiningBasic = document.getElementById('contract_joining_basic').value.trim();
    const tankCleaningBonus = document.getElementById('contract_tank_cleaning_bonus').value.trim();
    const additionalWorks = document.getElementById('contract_additional_works').value.trim();
    const prevMonthBalance = document.getElementById('contract_prev_month_balance').value.trim();
    const reimbursement = document.getElementById('contract_reimbursement').value.trim();
    const radio = document.getElementById('contract_radio').value.trim();
    const onboardFinalSettlement = document.getElementById('contract_onboard_final_settlement').value.trim();
    const otherDeductions = document.getElementById('contract_other_deductions').value.trim();
    const training = document.getElementById('contract_training').value.trim();
    const bondStore = document.getElementById('contract_bond_store').value.trim();
    const cdc_passport = document.getElementById('cdc_passport').value.trim();
    const contractExtension = document.getElementById('contractExtension').value.trim();
    const contractExtensionDays = document.getElementById('contractExtensionDays').value.trim();    

    // Upload Document file if it exists
    if (documentFile) {
        const documentFormData = new FormData();
        documentFormData.append('file', documentFile);

        try {
            const response = await axios.post('/upload5', documentFormData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            documentFileName = response.data.filename
            console.log('Document file uploaded successfully');
        } catch (err) {
            console.error('Error uploading document file:', err);
            return;
        }
    }

    // Upload AOA file if it exists
    if (aoaFile) {
        const aoaFormData = new FormData();
        aoaFormData.append('file', aoaFile);

        try {
            const response = await axios.post('/upload6', aoaFormData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            aoaFileName =response.data.filename
            console.log('AOA file uploaded successfully');
        } catch (err) {
            console.error('Error uploading AOA file:', err);
            return;
        }
    }

    // Submit the rest of the form data
    const contractDetails = {
        rank,
        company,
        vslName,
        vesselType,
        signOnPort,
        signOnDate,
        signOnDate_dg,
        wagesStart,
        eoc,
        wages,
        currency,
        wagesType,
        signOffDate,
        signOffDate_dg,
        signOffPort,
        reasonForSignOff,
        documentFile: documentFileName,
        aoaFile: aoaFileName,
        aoaNum,
        emigrateNumber,
        created_by,
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
        contractExtensionDays
    };

    try {
        const response = await axios.put(`${config.APIURL}candidate/update-contract-details/${contractId}`, contractDetails, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        console.log('Contract updated successfully:', response.data);
        Swal.fire({
            icon: "success",
            title: "Success",
            text:"Selected Contract updated successfully!",
          });
        const urlParams = new URLSearchParams(window.location.search);
    
        // Get the candidateId from the URL parameter
        const memId = urlParams.get('candidateId');
        viewCandidate(memId)
    } catch (err) {
        const errorMsg = err?.response?.data?.message ?? err?.message;
        Swal.fire({
            icon: "error",
            title: "Alert",
            text: errorMsg,
        });
        console.error('Error updating contract:', err);
    }
})


function viewCandidate(id) {
    // Add your view logic here
    window.location.href=`./view-candidate.html?id=${id}`;

}





document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`https://nsnemo.com/user/${userId}/logout`)
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