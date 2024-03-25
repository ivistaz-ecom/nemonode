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
        const response = await axios.get(`https://nemonode.ivistaz.co/candidate/get-contract-details/${candidateId}`, {
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
                <td>${contract.company}</td>
                <td>${contract.vslName}</td>
                <td>${contract.vesselType}</td>
                <td>${contract.sign_on_port}</td>
                <td>${formatDate(contract.sign_on)}</td>
                <td>${formatDate(contract.wage_start)}</td>
                <td>${formatDate(contract.eoc)}</td>
                <td>${contract.wages}</td>
                <td>${contract.currency}</td>
                <td>${contract.wages_types}</td>
                <td>${formatDate(contract.sign_off)}</td>
                <td>${contract.sign_off_port}</td>
                <td>${contract.reason_for_sign_off}</td>
                <td>${contract.aoa_number}</td>
                <td>${contract.emigrate_number}</td>
                <td>${contract.documents}</td>
                <td>${contract.aoa}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editContract('${contract.id}','${contract.rank}','${contract.company}','${contract.vslName}','${contract.vesselType}','${contract.sign_on_port}','${contract.sign_on}','${contract.wage_start}','${contract.eoc}','${contract.wages}','${contract.currency}','${contract.wages_types}','${contract.sign_off}','${contract.sign_off_port}','${contract.reason_for_sign_off}','${contract.aoa_number}','${contract.emigrate_number}','${contract.documents}','${contract.aoa}',event)">
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

const editContract = async(id,rank,company,vslName,vesselType,sign_on_port,sign_on,wage_start,eoc,wages,currency,wages_types,sign_off,sign_off_port,reason_for_sign_off,aoa_number,emigrate_number,documents,aoa,event)=>{
    event.preventDefault();
    console.log(id,rank,company,vslName,vesselType,sign_on_port,sign_on,wage_start,eoc,wages,currency,wages_types,sign_off,sign_off_port,reason_for_sign_off,aoa_number,emigrate_number,documents,aoa)
        window.location.href = `edit-c-contract.html?id=${id}&rank=${rank}&company=${company}&vslName=${vslName}&vesselType=${vesselType}&sign_on_port=${sign_on_port}&sign_on=${sign_on}&wage_start=${wage_start}&eoc=${eoc}&wages=${wages}&currency=${currency}&wages_types=${wages_types}&sign_off=${sign_off}&sign_off_port=${sign_off_port}&reason_for_sign_off=${reason_for_sign_off}&aoa_number=${aoa_number}&emigrate_number=${emigrate_number}&documents=${documents}&aoa=${aoa}`; // Include all parameters
      

}

document.addEventListener('DOMContentLoaded', async function () {

   
    const decodedToken = decodeToken(token);
    console.log(decodedToken)

const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement) {
  document.getElementById('userManagementSection').style.display = 'block';
  document.getElementById('userManagementSections').style.display = 'block';

}
const candidateId= localStorage.getItem('memId')
    const id = candidateId;
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
        emigrateNumber
    };

    try {
        const response = await axios.post(`https://nemonode.ivistaz.co/candidate/contract-details/${candidateId}`, contractDetails, {
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

const displayDropdown = async function () {
    const rankDropdown = document.getElementById('candidate_c_rank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("https://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
    const rankOptions = rankResponse.data.ranks;
    const rankNames = rankOptions.map(rank => rank.rank);

    for (let i = 0; i < rankNames.length; i++) {
        const option = document.createElement('option');
        option.value = rankNames[i];
        option.text = rankNames[i];
        rankDropdown.appendChild(option);
    }
}

async function fetchAndDisplayVessels() {
    try {
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vsls;

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
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vessels", { headers: { "Authorization": token } });
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
            option.value = vessel.vesselName;
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
        const portsResponse = await axios.get("https://nemonode.ivistaz.co/others/view-port", { headers: { "Authorization": token } });
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
            option.value = port.portName;
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
        const companyResponse = await axios.get("https://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        const companies = companyResponse.data.company;
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
            option.value = company.company_name;
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

