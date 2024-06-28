let nationalityData = []; // Add this line to declare nationalityData globally
let portData=[];
let vslsData =[];
let companyData =[];

const token = localStorage.getItem('token')

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

async function fetchAndDisplayContractDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-contract-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });


        const contractDetails = response.data;

        // Assuming contractDetails is an array of objects
        const contractTableBody = document.getElementById('contractTableBody');
        contractTableBody.innerHTML = ''; // Clear existing rows

        contractDetails.forEach(contract => {
            const row = document.createElement('tr');
            // Add data to each cell
            row.innerHTML = `
                <td>${contract.rank}</td>
                <td>${getCompanyName(contract.company)}</td>
                <td>${getVesselName(contract.vslName)}</td>
                <td>${contract.vesselType}</td>
                <td>${getPortName(contract.sign_on_port)}</td>
                <td>${formatDate(contract.sign_on)}</td>
                <td>${formatDate(contract.wage_start)}</td>
                <td>${formatDate(contract.eoc)}</td>
                <td>${contract.wages}</td>
                <td>${contract.currency}</td>
                <td>${contract.wages_types}</td>
                <td>${formatDate(contract.sign_off)}</td>
                <td>${getPortName(contract.sign_off_port)}</td>
                <td>${contract.reason_for_sign_off}</td>
                <td>${contract.aoa_number}</td>
                <td>${contract.emigrate_number}</td>
                <td>${contract.documents}</td>
                <td>${contract.aoa}</td>
                <td>${contract.created_by}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editContract('${contract.id}','${contract.rank}','${contract.company}','${contract.vslName}','${contract.vesselType}','${contract.sign_on_port}','${contract.sign_on}','${contract.wage_start}','${contract.eoc}','${contract.wages}','${contract.currency}','${contract.wages_types}','${contract.sign_off}','${contract.sign_off_port}','${contract.reason_for_sign_off}','${contract.aoa_number}','${contract.emigrate_number}','${contract.documents}','${contract.aoa}','${contract.created_by}',event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteContract('${contract.id}',event)">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;

            // Append the row to the table body
            contractTableBody.appendChild(row);

        });
    } catch (err) {
        console.error(err);
    }
}

const editContract = async (id, rank, company, vslName, vesselType, sign_on_port, sign_on, wage_start, eoc, wages, currency, wages_types, sign_off, sign_off_port, reason_for_sign_off, aoa_number, emigrate_number, documents, aoa, created_by, event) => {
    event.preventDefault();

    // Encode documents and aoa parameters
    const encodedDocuments = encodeURIComponent(documents);
    const encodedAoa = encodeURIComponent(aoa);

    // Construct the URL with encoded parameters
    const url = `edit-c-contract.html?id=${id}&rank=${rank}&company=${company}&vslName=${vslName}&vesselType=${vesselType}&sign_on_port=${sign_on_port}&sign_on=${sign_on}&wage_start=${wage_start}&eoc=${eoc}&wages=${wages}&currency=${currency}&wages_types=${wages_types}&sign_off=${sign_off}&sign_off_port=${sign_off_port}&reason_for_sign_off=${reason_for_sign_off}&aoa_number=${aoa_number}&emigrate_number=${emigrate_number}&documents=${encodedDocuments}&aoa=${encodedAoa}&created_by=${created_by}`;

    // Redirect to the constructed URL
    window.location.href = url;
};

document.addEventListener('DOMContentLoaded', async function () {

   
    const decodedToken = decodeToken(token);
    console.log(decodedToken)

const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
const candidateId= localStorage.getItem('memId')
    const id = candidateId;
    await getReq();
    await fetchAndDisplayContractDetails(id);
    await displayDropdown();
    await fetchAndDisplayVessels();
    await fetchAndDisplayVesselType();
    await fetchAndDisplayDropdowns();
    await fetchAndDisplayCompanies();

    let dropdownItems = document.querySelectorAll(".dropdown-item");

    // Add click event listener to each dropdown item
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function() {
            // Get the id attribute of the clicked item
            var itemId = item.id;
            const memId= localStorage.getItem('memId')
            // Define the destination URLs based on the clicked item
            var destinationPage = "";
           switch (itemId) {
                case "personnel":
                    destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                    break;
                case "discussion":
                    destinationPage =`./edit-discussion.html?memId=${memId}`;
                    break;
                case "contract":
                    destinationPage = `./add-c-contract.html?memId=${memId}`;
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
                    case 'seaservice':
                        destinationPage=`./seaservicetable.html?memId=${memId};`;
                        break;
                default:
                    // Handle default case or do nothing
                    break;
            }

            // Redirect to the destination page¯
            if (destinationPage !== "") {
                window.location.href = destinationPage;
            }
        });
    });
});

async function handleContractForm(event) {
    event.preventDefault();
    const decodedToken = decodeToken(token)
    console.log(decodedToken.userId)
    const rank = document.getElementById('candidate_c_rank').value.trim();
    const company = document.getElementById('contract_company').value.trim();
    const vslName = document.getElementById('contract_vsl').value.trim();
    const vesselType = document.getElementById('candidate_c_vessel').value.trim();
    const signOnPort = document.getElementById('contract_signonport').value.trim();
    const signOn = document.getElementById('contract_signon').value.trim();
    const wageStart = document.getElementById('contract_wage_start').value.trim();
    const eoc = document.getElementById('contract_eoc').value.trim();
    const wages = document.getElementById('contract_wages').value.trim();
    const currency = document.getElementById('contract_currency').value.trim();
    const wagesType = document.getElementById('contract_wagestype').value.trim();
    const signOff = document.getElementById('contract_signoff').value.trim();
    const signOffPort = document.getElementById('contract_signoffport').value.trim();
    const reasonForSignOff = document.getElementById('contracts_reason').value.trim();
    const documentFile = document.getElementById('contract_document').value.trim();
    const aoaFile = document.getElementById('contract_aoa').value.trim();
    const aoaNumber = document.getElementById('contract_aoa_num').value.trim();
    const emigrateNumber = document.getElementById('contract_emigrate').value.trim();
    const candidateId= localStorage.getItem('memId')
    const created_by = decodedToken.userId

    const contractDetails = {
        rank,
        company,
        vslName,
        vesselType,
        signOnPort,
        signOn,
        wageStart,
        eoc,
        wages,
        currency,
        wagesType,
        signOff,
        signOffPort,
        reasonForSignOff,
        documentFile,
        aoaFile,
        aoaNumber,
        emigrateNumber,
        created_by
    };

    try {
        const response = await axios.post(`https://nemo.ivistaz.co/candidate/contract-details/${candidateId}`, contractDetails, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        await fetchAndDisplayContractDetails(candidateId);
        contractForm.reset();
    } catch (err) {
        console.error(err);
    }
}




// Attach the form submission handler to the form
const contractForm = document.getElementById('contractForm');
contractForm.addEventListener('submit', handleContractForm);

async function displayDropdown() {
    try {
        const rankResponse = await axios.get("https://nemo.ivistaz.co/others/get-ranks", {
            headers: { "Authorization": token }
        });
        const ranks = rankResponse.data.ranks;
        const rankSelect = document.getElementById("candidate_c_rank");

        rankSelect.innerHTML = '<option value="" disabled selected>-- Select Rank --</option>';

        ranks.forEach((rank) => {
            const option = document.createElement("option");
            option.value = rank.rank;
            option.textContent = rank.rank;
            rankSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching and displaying ranks:', error);
    }
}


async function fetchAndDisplayVessels() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vessel", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vessels;

        // Get the select element
        const vesselSelect = document.getElementById("candidate_c_vessel");

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
            option.value = vessel.vesselName;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

async function fetchAndDisplayVesselType() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vessels;

        // Get the select element
        const vesselSelect = document.getElementById("contract_vsl");

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
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

async function fetchAndDisplayDropdowns() {
    try {
        // Fetch ports from the server
        const portsResponse = await axios.get("https://nemo.ivistaz.co/others/get-ports", { headers: { "Authorization": token } });
        const ports = portsResponse.data.ports;

        // Get the select elements
        const portSelect = document.getElementById("contract_signonport"); // Adjust the ID accordingly
        const portSelects = document.getElementById("contract_signoffport"); // Adjust the ID accordingly

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
    } catch (error) {
        console.error('Error fetching and displaying dropdowns:', error);
    }
}


// Call the fetchAndDisplayDropdowns function wherever needed

let selectedCompanyValue = ''; // Variable to store the selected value for the Company dropdown

// Modify the fetchAndDisplayDropdowns function
async function fetchAndDisplayCompanies() {
    try {
        // Fetch ports from the server
        // Fetch companies from the server
        const companyResponse = await axios.get("https://nemo.ivistaz.co/company/dropdown-company", { headers: { "Authorization": token } });
        const companies = companyResponse.data.companies;
        console.log(companies)
        // Get the company select element
        const companySelect = document.getElementById("contract_company");

        // Clear previous options
        companySelect.innerHTML = '';

        // Add a default option
        const defaultCompanyOption = document.createElement("option");
        defaultCompanyOption.value = "";
        defaultCompanyOption.text = "-- Select Company --";
        companySelect.appendChild(defaultCompanyOption);

        // Add companies to the company dropdown
        companies.forEach((company) => {
            const option = document.createElement("option");
            option.value = company.company_id;
            option.text = company.company_name;
            companySelect.appendChild(option);
        });

        // Set the selected value for the Company dropdown
        companySelect.value = selectedCompanyValue;

        // Add event listener to update the selected value
        companySelect.addEventListener('change', function () {
            selectedCompanyValue = this.value;
        });
    } catch (error) {
        console.error('Error fetching and displaying dropdowns:', error);
    }
}

// Call the fetchAndDisplayDropdowns function wherever needed

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
  
  


function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }


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

async function getReq() {
    try {
        const token = localStorage.getItem('token');
        
        // Fetch nationality data
        const nationalityResponse = await axios.get("https://nemo.ivistaz.co/others/country-codes");
        nationalityData = nationalityResponse.data.countryCodes;
        
        // Fetch other necessary data
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls", { headers: { "Authorization": token } });
        console.log(serverResponse)
        vslsData= serverResponse.data.vessels
        const serverResponseUser = await axios.get('https://nemo.ivistaz.co/user/userdropdown');
        userData = serverResponseUser.data
        const serverResponsecomp = await axios.get('https://nemo.ivistaz.co/company/dropdown-company');
        companyData= serverResponsecomp.data.companies
        console.log(companyData)
        console.log('Data fetched successfully');

        const serverrespPort = await axios.get('https://nemo.ivistaz.co/others/get-ports')
        portData=serverrespPort.data.ports
    }
    catch(err){
        console.log(err);
    }
}
getReq()

function getNationalityName(code) {
    const nationality = nationalityData.find(nationality => nationality.code == code);
    return nationality ? nationality.country : code;
}
function getPortName(id) {
    const port = portData.find(port => port.id == id);
    return port ? port.portName : id;
}
function getVesselName(id) {
    const vessel = vslsData.find(vessel => vessel.id == id);
    return vessel ? vessel.vesselName : id;
}

function getCompanyName(id){
    const companies = companyData.find(companies=>companies.company_id ==id);
    return companies?companies.company_name:id
}