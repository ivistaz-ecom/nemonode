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
    const wage_start = urlParams.get('wage_start');
    const eoc = urlParams.get('eoc');
    const wages = urlParams.get('wages');
    const currency = urlParams.get('currency');
    const wages_types = urlParams.get('wages_types');
    const sign_off = urlParams.get('sign_off');
    const sign_off_port = urlParams.get('sign_off_port');
    const reason_for_sign_off = urlParams.get('reason_for_sign_off');
    const aoa_number = urlParams.get('aoa_number');
    const emigrate_number = urlParams.get('emigrate_number');
    const documents = urlParams.get('documents');
    const aoa = urlParams.get('aoa');
    const created_by = urlParams.get('created_by');

    console.log('ID:', id);
    console.log('Ranks Contract:', ranks_contract);
    console.log('Company:', company);
    console.log('Vessel Name:', vslName);
    console.log('Vessel Type:', vesselType);
    console.log('Sign On Port:', sign_on_port);
    console.log('Sign On:', sign_on);
    console.log('Wage Start:', wage_start);
    console.log('EOC:', eoc);
    console.log('Wages:', wages);
    console.log('Currency:', currency);
    console.log('Wages Types:', wages_types);
    console.log('Sign Off:', sign_off);
    console.log('Sign Off Port:', sign_off_port);
    console.log('Reason for Sign Off:', reason_for_sign_off);
    console.log('AOA Number:', aoa_number);
    console.log('Emigrate Number:', emigrate_number);
    console.log('Documents:', documents);
    console.log('AOA:', aoa);
    console.log('Created By:', created_by);

    
    document.getElementById('contractId').value = id;
    document.getElementById('editcontract_rank').value = ranks_contract;
    document.getElementById('editcontract_company').value = company;
    document.getElementById('editcontract_vsl').value = vslName;
    document.getElementById('editcontract_vesseltype').value = vesselType;
    document.getElementById('editcontract_signonport').value = sign_on_port;
    document.getElementById('editcontract_signon').value = formatDate(sign_on);
    document.getElementById('editcontract_wage_start').value = formatDate(wage_start);
    document.getElementById('editcontract_eoc').value = formatDate(eoc);
    document.getElementById('editcontract_wages').value = wages;
    document.getElementById('editcontract_currency').value = currency;
    document.getElementById('editcontract_wagestype').value = wages_types;
    document.getElementById('editcontract_signoff').value = formatDate(sign_off);
    document.getElementById('editcontract_signoffport').value = sign_off_port;
    document.getElementById('editcontracts_reason').value = reason_for_sign_off;
    document.getElementById('editcontract_aoa_num').value = aoa_number;
    document.getElementById('editcontract_emigrate').value = emigrate_number;
    document.getElementById('editcontract_document').value = documents;
    document.getElementById('editcontract_aoa').value = aoa;
    document.getElementById('created_by').value = created_by;

    const displayDropdown = async function () {
        const rankDropdown = document.getElementById('editcontract_rank');
        rankDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Rank --';
        rankDropdown.appendChild(defaultOption);
    
        const rankResponse = await axios.get("  https://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
        const rankOptions = rankResponse.data.ranks;
        const rankNames = rankOptions.map(rank => rank.rank);
    
        for (let i = 0; i < rankNames.length; i++) {
            const option = document.createElement('option');
            option.value = rankNames[i];
            option.text = rankNames[i];
            rankDropdown.appendChild(option);
        }
        rankDropdown.value = ranks_contract
    
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
        
            const vesselResponse = await axios.get("  https://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
            const vessels = vesselResponse.data.vsls;
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
    

    const displayVesselTypeDropdown = async function () {
        try {
            const vesselDropdown = document.getElementById('editcontract_vsl');
            vesselDropdown.innerHTML = ''; // Clear existing options
        
            // Add the default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '-- Select Vessel --';
            vesselDropdown.appendChild(defaultOption);
        
            const vesselResponse = await axios.get("  https://nemonode.ivistaz.co/others/view-vessels", { headers: { "Authorization": token } });
            const vessels = vesselResponse.data.vessels;
            const vesselNames = vessels.map(vessel => vessel.vesselName);
        
            for (let i = 0; i < vesselNames.length; i++) {
                const option = document.createElement('option');
                option.value = vesselNames[i];
                option.text = vesselNames[i];
                vesselDropdown.appendChild(option);
            }
            vesselDropdown.value = vslName; // Set the selected value if needed
        } catch (error) {
            console.error('Error fetching vessels:', error);
        }
    }
    
    // Call the displayVesselTypeDropdown function where needed, for example, after fetching the rank dropdown
    // Call the function to populate the vessel dropdown
    

async function fetchAndDisplayDropdowns() {
    try {
        // Fetch ports from the server
        const portsResponse = await axios.get("  https://nemonode.ivistaz.co/others/view-port", { headers: { "Authorization": token } });
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
            option.value = port.portName;
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
        // Fetch ports from the server
        // Fetch companies from the server
        const companyResponse = await axios.get("  https://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        const companies = companyResponse.data.company;
        console.log(companies)
        // Get the company select element
        const companySelect = document.getElementById("editcontract_company");

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
        companySelect.value = company;

        // Add event listener to update the selected value
       
    } catch (error) {
        console.error('Error fetching and displaying dropdowns:', error);
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
            const memId = localStorage.getItem('memId');

            // Define the destination URLs based on the clicked item
            var destinationPage = "";
            switch (itemId) {
                case "personnel":
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
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }



  document.getElementById('contractForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const contractId = document.getElementById('contractId').value;
        const rank = document.getElementById('editcontract_rank').value;
        const company = document.getElementById('editcontract_company').value;
        const vessel = document.getElementById('editcontract_vsl').value;
        const vesselType = document.getElementById('editcontract_vesseltype').value;
        const signOnPort = document.getElementById('editcontract_signonport').value;
        const signOnDate = document.getElementById('editcontract_signon').value;
        const wagesStart = document.getElementById('editcontract_wage_start').value;
        const eoc = document.getElementById('editcontract_eoc').value;
        const wages = document.getElementById('editcontract_wages').value;
        const currency = document.getElementById('editcontract_currency').value;
        const wagesType = document.getElementById('editcontract_wagestype').value;
        const signOffDate = document.getElementById('editcontract_signoff').value;
        const signOffPort = document.getElementById('editcontract_signoffport').value;
        const reasonForSignOff = document.getElementById('editcontracts_reason').value;
        const documentFile = document.getElementById('editcontract_document').value;
        const aoaFile = document.getElementById('editcontract_aoa').value;
        const aoaNum = document.getElementById('editcontract_aoa_num').value;
        const emigrateNumber = document.getElementById('editcontract_emigrate').value;
        const created_by = document.getElementById('created_by').value
        const formData = {
            rank: rank,
            company: company,
            vslName: vessel, 
            vesselType: vesselType,
            signOnPort: signOnPort,
            signOnDate: signOnDate,
            wagesStart: wagesStart,
            eoc: eoc,
            wages: wages,
            currency: currency,
            wagesType: wagesType,
            signOffDate: signOffDate,
            signOffPort: signOffPort,
            reasonForSignOff: reasonForSignOff,
            aoaNum: aoaNum ,
            emigrateNumber: emigrateNumber,
            documentFile:documentFile,
            aoaFile:aoaFile,
            created_by:created_by
            // Include other form fields as needed
        };
        console.log(formData)

        const config = {
            headers: {
                'Authorization': token, // Include your authorization token if required
                'Content-Type': 'application/json', // Set the content type based on your API's requirements
            },
        };

        // Append files to formData if they exist
        // if (documentFile) {
        //     formData.document = documentFile;
        // }

        // if (aoaFile) {
        //     formData.aoa = aoaFile;
        // }

        // Send a PUT request to update the contract in the database
        const response = await axios.put(`  https://nemonode.ivistaz.co/candidate/update-contract-details/${contractId}`, formData, config);

        // Handle the response from the server, e.g., show a success message
        console.log('Contract updated successfully:', response.data);
    } catch (error) {
        // Handle errors, e.g., show an error message
        console.error('Error updating contract:', error);
    }
});






 document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    localStorage.clear();
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    localStorage.clear()

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