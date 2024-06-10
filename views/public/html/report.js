let nationalityData; // Variable to store nationality data globally
let vslsData;
let userData;
let companyData;




// Function to export table data to Excel
function exportToExcel(table, fileName) {
    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
    XLSX.writeFile(wb, fileName);
}


// Function to handle form submission for fetching discussions


function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}




// Add event listener to the discussion form


// Function to handle submission of New Profile form
async function handleNewProfileSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const user = document.getElementById('appliedBy1').value;

        const decodedToken = decodeToken(token);

        // Gather selected fields
        const selectedFields = {};
        const checkboxes = document.querySelectorAll('#newProfileContent input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked; // Store checkbox state in selectedFields object
        });

        // Send data to server using Axios
        const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/view-new-profile', {
            startDate: startDate,
            endDate: endDate,
            user:user,
            selectedFields: selectedFields,
        }, {
            headers: {
                "Authorization": token
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Clear existing table, if any
        const tableContainer = document.getElementById('candidateTable');
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table');
        table.classList.add('table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Add Serial Number column header
        const snHeader = document.createElement('th');
        snHeader.textContent = 'S.No';
        snHeader.classList = 'fw-bolder bg-dark text-white';
        headerRow.appendChild(snHeader);

        // Add other field columns
        for (const field in selectedFields) {
            if (selectedFields[field]) {
                const th = document.createElement('th');
                th.textContent = field;
                th.classList = 'fw-bolder bg-dark text-white';
                headerRow.appendChild(th);
            }
        }
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');
        candidates.forEach((candidate, index) => {
            const row = document.createElement('tr');

            // Add Serial Number cell
            const snCell = document.createElement('td');
            snCell.textContent = index + 1; // Serial Number starts from 1
            row.appendChild(snCell);

            // Add other field cells
            for (const field in selectedFields) {
                if (selectedFields[field]) {
                    const cell = document.createElement('td');
                    if (field === 'nationality' && candidate[field]) {
                        // Replace code with nationality name
                        const nationalityName = getNationalityName(candidate[field]);
                        cell.textContent = nationalityName;
                    } else {
                        cell.textContent = candidate[field];
                    }
                    row.appendChild(cell);
                }
            }
            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);

        // Append table to container
        tableContainer.appendChild(table);

        // Create "Export to Excel" button if user has permission
        if (decodedToken.reports) {
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2','text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(table, 'candidates.xlsx');
            });
            // Append export button
            tableContainer.appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}

// Function to get nationality name from code


// Function to handle submission of Calls Made form
// Function to handle submission of Calls Made form
// Update the handleCallsMadeSubmit function
// Update the handleCallsMadeSubmit function
async function handleCallsMadeSubmit(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        let fromDate = document.getElementById('fromDate').value;
        fromDate = fromDate + 'T00:00:00Z';
        let toDate = document.getElementById('toDate').value;
        toDate = toDate + 'T23:59:59Z';
        console.log('from', fromDate);
        console.log('to', toDate);

        const user = document.getElementById('appliedBy').value;
        const category = document.getElementById('category').value;
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        // Fetch necessary data including nationality
        await getReq();

        // Send data to server using Axios
        const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/callsmade', {
            startDate: fromDate,
            endDate: toDate,
            userId: user,
            category: category
        }, {
            headers: {
                "Authorization": token
            }
        });

        console.log(response.data); // Check the server response structure

        // Display calls made in a table
        const tableContainer = document.getElementById('callsMadeTable');
        tableContainer.innerHTML = '';

        // Check if reports is true
        if (reports === true) {
            // Create export button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
            exportButton.style = 'width:300px;';
            exportButton.addEventListener('click', function () {
                exportToExcel(table, 'callsMade.xlsx');
            });

            // Append export button before table
            tableContainer.appendChild(exportButton);
        }

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Add Serial Number column header
        const snHeader = document.createElement('th');
        snHeader.textContent = 'S.No';
        snHeader.classList = 'fw-bolder bg-warning text-white';
        headerRow.appendChild(snHeader);

        // Add candidateId as the first column
        const candidateIdTh = document.createElement('th');
        candidateIdTh.textContent = 'candidateId';
        candidateIdTh.classList = 'fw-bolder bg-warning text-white';
        headerRow.appendChild(candidateIdTh);

        // Add other attributes of the Candidate model to the header
        Object.keys(response.data.callsMade[0].Candidate).forEach(field => {
            if (field !== 'candidateId') {
                const th = document.createElement('th');
                th.textContent = field;
                th.classList = 'fw-bolder bg-warning text-white';
                headerRow.appendChild(th);
            }
        });

        // Add nationality column header
        const nationalityHeader = document.createElement('th');
        nationalityHeader.textContent = 'Nationality';
        nationalityHeader.classList = 'fw-bolder bg-warning text-white';
        headerRow.appendChild(nationalityHeader);

        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');
        response.data.callsMade.forEach((call, index) => {
            const row = document.createElement('tr');
            
            // Add Serial Number cell
            const snCell = document.createElement('td');
            snCell.textContent = index + 1; // Serial Number starts from 1
            row.appendChild(snCell);

            // Add candidateId from discussion as the first cell in each row
            const candidateIdCell = document.createElement('td');
            candidateIdCell.textContent = call.candidateId || 'N/A';
            row.appendChild(candidateIdCell);

            // Add other attributes of the Candidate model to each row
            Object.values(call.Candidate).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value || 'N/A';
                row.appendChild(cell);
            });

            // Add nationality cell
            const nationalityCell = document.createElement('td');
            nationalityCell.textContent = getNationalityName(call.Candidate.nationality);
            row.appendChild(nationalityCell);

            tableBody.appendChild(row);
        });

        table.appendChild(tableBody);

        // Append table to container
        tableContainer.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}



async function createCompanyDropdown() {

    const token = localStorage.getItem('token')
    const companyResponse = await axios.get("https://nemo.ivistaz.co/company/dropdown-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.companies;
        // console.log(companyOptions)
        const companyNames = companyOptions.map(company => company.company_name);
        const companyId = companyOptions.map(company => company.company_id);


    const companyDropdown = document.getElementById('user_client');
    companyDropdown.innerHTML = ''; // Clear existing options
    const companyDropdown1 = document.getElementById('user_client1');
    companyDropdown1.innerHTML = ''; 
    const companyDropdown2 = document.getElementById('user_client2');
    companyDropdown2.innerHTML = ''; 
    const companyDropdown3 = document.getElementById('user_client3');
    companyDropdown3.innerHTML = ''; 
    const companyDropdown4 = document.getElementById('user_client4');
    companyDropdown4.innerHTML = ''; 
    const companyDropdown5 = document.getElementById('user_client5');
    companyDropdown5.innerHTML = ''; 
    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Company --';
    companyDropdown.appendChild(defaultOption.cloneNode(true));
    companyDropdown1.appendChild(defaultOption.cloneNode(true));
    companyDropdown2.appendChild(defaultOption.cloneNode(true));
    companyDropdown3.appendChild(defaultOption.cloneNode(true));
    companyDropdown4.appendChild(defaultOption.cloneNode(true));
    companyDropdown5.appendChild(defaultOption.cloneNode(true));

    // Add options for each company
    for (let i = 0; i < companyNames.length; i++) {
        const option = document.createElement('option');
        option.value = companyId[i];
        option.text = companyNames[i];
        companyDropdown.appendChild(option.cloneNode(true));
        companyDropdown1.appendChild(option.cloneNode(true));
        companyDropdown2.appendChild(option.cloneNode(true));
        companyDropdown3.appendChild(option.cloneNode(true));
        companyDropdown4.appendChild(option.cloneNode(true));
        companyDropdown5.appendChild(option.cloneNode(true));
        // If you want to clone the options for another dropdown, do it here
        // companyDropdown.appendChild(option.cloneNode(true));
    }
}
createCompanyDropdown()
// Function to export table data to Excel
function exportToExcel(table, fileName) {
    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
    XLSX.writeFile(wb, fileName);
}

// Add event listener to the "Generate Calls Made Report" button
document.getElementById('callsMadeContent').addEventListener('submit', handleCallsMadeSubmit);

// Add event listener to the New Profile form
document.getElementById('newprofilesubmit').addEventListener('submit', handleNewProfileSubmit);


// Function to handle form submission for fetching discussions
async function handleDiscussionSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const status = document.getElementById('status').value;
        let startDate = document.getElementById('startDates').value;
        let endDate = document.getElementById('endDates').value;

        // Format dates to include time
        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';
        
        const companyName = document.getElementById('user_client').value;

        // Send data to server using Axios with the GET method and query parameters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/proposals', {
            params: {
                status: status,
                startDate: startDate,
                endDate: endDate,
                companyName: companyName
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;
        
        // Check if reports is true
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const reports = decodedToken.reports;

        // Display discussions and candidates in a table
        const discussionResults = document.getElementById('discussionResults');
        discussionResults.innerHTML = ''; // Clear existing results

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 'Vessel', 'Category', 'Nationality', 'Join Date'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.scope = 'col';
            header.classList.add('text-center');
            headerRow.appendChild(header);
        });
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');
        candidates.forEach((candidate, index) => {
            const row = document.createElement('tr');
            const fields = [
                index + 1, // Serial Number (S.No)
                candidate.candidateId,
                candidate.Candidate.fname,
                candidate.Candidate.lname,
                candidate.Candidate.c_rank,
                candidate.Candidate.c_vessel,
                candidate.Candidate.category,
                candidate.Candidate.nationality,
                candidate.join_date
            ];
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                cell.classList.add('text-center');
                row.appendChild(cell);
            });
            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);

        // Append table to discussionResults container
        discussionResults.appendChild(table);

        // Check if reports is true
        if (reports) {
            // Create "Export to Excel" button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(table, 'discussionData.xlsx');
            });
            discussionResults.parentNode.insertBefore(exportButton, discussionResults.nextSibling);
        }

    } catch (error) {
        console.error(error);
    }
}





async function fetchAndDisplayVessels() {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls", { headers: { "Authorization": token } });
        // console.log(serverResponse);
        const vessels = serverResponse.data;

        // Get the select elements
        const vesselSelect = document.getElementById("candidate_c_vessel");
        const vesselSelect1 = document.getElementById("candidate_c_vessel1");
        const vesselSelect2 = document.getElementById("candidate_c_vessel2");

        // Clear previous options
        vesselSelect.innerHTML = '';
        vesselSelect1.innerHTML = '';
        vesselSelect2.innerHTML = '';

        // Add a default option to each select element
        const defaultOption = document.createElement("option");
        defaultOption.value = '';
        defaultOption.text = "-- Select Vessel --";

        vesselSelect.appendChild(defaultOption.cloneNode(true));
        vesselSelect1.appendChild(defaultOption.cloneNode(true));
        vesselSelect2.appendChild(defaultOption.cloneNode(true));

        // Add vessels to the dropdowns
        vessels.forEach((vessel) => {
            const option = document.createElement("option");
            option.value = vessel.id;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option.cloneNode(true));
            vesselSelect1.appendChild(option.cloneNode(true));
            vesselSelect2.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

fetchAndDisplayVessels()

// Add event listener to the discussion form
document.getElementById('discussionForm').addEventListener('submit', handleDiscussionSubmit);

// Function to handle submission of Sign On form
async function handleSignOnSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDatec').value;
        let endDate = document.getElementById('endDatec').value;
        const companyName = document.getElementById('user_client1').value;
        const vessel_type = document.getElementById('candidate_c_vessel').value;
        
        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';
        const params = {
            startDate: startDate,
            endDate: endDate,
            vessel_type: vessel_type,
            companyname: companyName
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const contracts = response.data.contracts;

        // Clear existing table body, if any
        const tableBody = document.getElementById('signOnTableBody');
        tableBody.innerHTML = '';

        // Append values to table body
        let index = 1;
        contracts.forEach((contract) => {
            const row = document.createElement('tr');
            const fields = [
                index++,
                contract.candidateId,
                contract.rank,
                contract.vesselType,
                contract.sign_on,
                contract.wages,
                contract.wages_types,
                contract.company,
                contract.aoa_number,
                contract.currency,
                contract.emigrate_number,
                contract.eoc,
                contract.reason_for_sign_off,
                contract.created_by,
                contract.Candidate.fname,
                contract.Candidate.nationality,
                contract.Candidate.indos_number,
            ];
        
            // Check if 'Indian CDC' exists in cDocuments and add document_files if found
            const indianCdcDocument = contract.Candidate.cDocuments.find(doc => doc.document === 'Indian CDC');
            if (indianCdcDocument) {
                fields.push(indianCdcDocument.document, indianCdcDocument.document_files);
            } else {
             
                fields.push(''); // Add empty fields if 'Indian CDC' is not found
                fields.push(''); // Add empty fields if 'Indian CDC' is not found
            }
            const hasCdcDocument = contract.Candidate.cDocuments.some(doc => doc.document.includes('CDC'));
            if (hasCdcDocument) {
                fields.push('PRESENT - press CandidateId for more');
            } else {
                fields.push(''); // Add an empty field if 'CDC' is not found
            }
            const bankDetails = contract.Candidate.Banks[0]; // Assuming there's at least one bank entry
            if (bankDetails && bankDetails.pan_num) {
                fields.push(bankDetails.pan_num);
            } else {
                fields.push(''); // Add an empty field if pan_num is not found
            }
            const passportDocument = contract.Candidate.cDocuments.find(doc => doc.document.includes('PASSPORT'));
            if (passportDocument) {
                fields.push(passportDocument.document, passportDocument.document_files);
            } else {
                fields.push(''); // Add empty fields if 'PASSPORT' is not found
                fields.push(''); // Add empty fields if 'PASSPORT' is not found
            }
        
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                cell.classList.add('text-center');
                row.appendChild(cell);
            });
        
            tableBody.appendChild(row);
        });
        
        // Check if reports is true
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Create "Export to Excel" button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(tableBody, 'signOnData.xlsx');
            });
            // Append export button after the table
            const tableContainer = document.getElementById('signOnContent');
            tableContainer.appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}




// Add event listener to the Sign On form
document.getElementById('signOnForm').addEventListener('submit', handleSignOnSubmit);


async function handleSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDateoff').value;
        let endDate = document.getElementById('endDateoff').value;
        const companyName = document.getElementById('user_client2').value;
        const vessel_type = document.getElementById('candidate_c_vessel1').value;
        
        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';
        const params = {
            startDate: startDate,
            endDate: endDate,
            vessel_type: vessel_type,
            companyname: companyName
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-off', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const contracts = response.data.contracts;

        // Clear existing table body, if any
        const tableBody = document.getElementById('signOffTableBody');
        tableBody.innerHTML = '';

        // Append values to table body
        let index = 1;
        contracts.forEach((contract) => {
            const row = document.createElement('tr');
            const fields = [
                index++,
                contract.candidateId,
                contract.rank,
                contract.vesselType, // Replace this with the actual name if needed
                contract.sign_off,
                contract.wages,
                contract.wages_types,
                contract.company, // Replace this with the actual name if needed
                contract.aoa_number,
                contract.currency,
                contract.emigrate_number,
                contract.eoc,
                contract.reason_for_sign_off,
                contract.created_by, // Replace this with the actual name if needed
                contract.Candidate.fname,
                contract.Candidate.nationality, // Replace this with the actual name if needed
                contract.Candidate.indos_number,
            ];
        
            // Check if 'Indian CDC' exists in cDocuments and add document_files if found
            const indianCdcDocument = contract.Candidate.cDocuments.find(doc => doc.document === 'Indian CDC');
            if (indianCdcDocument) {
                fields.push(indianCdcDocument.document, indianCdcDocument.document_files);
            } else {
                fields.push(''); // Add empty fields if 'Indian CDC' is not found
                fields.push(''); // Add empty fields if 'Indian CDC' is not found
            }

            const hasCdcDocument = contract.Candidate.cDocuments.some(doc => doc.document.includes('CDC'));
            if (hasCdcDocument) {
                fields.push('PRESENT - press CandidateId for more');
            } else {
                fields.push(''); // Add an empty field if 'CDC' is not found
            }

            const bankDetails = contract.Candidate.Banks[0]; // Assuming there's at least one bank entry
            if (bankDetails && bankDetails.pan_num) {
                fields.push(bankDetails.pan_num);
            } else {
                fields.push(''); // Add an empty field if pan_num is not found
            }
            const passportDocument = contract.Candidate.cDocuments.find(doc => doc.document.includes('PASSPORT'));
if (passportDocument) {
    fields.push(passportDocument.document, passportDocument.document_files);
} else {
    fields.push(''); // Add empty fields if 'PASSPORT' is not found
    fields.push(''); // Add empty fields if 'PASSPORT' is not found
}

            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                cell.classList.add('text-center');
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });

        // Check if reports is true
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Create "Export to Excel" button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(tableBody, 'signOffData.xlsx');
            });
            // Append export button after the table
            const tableContainer = document.getElementById('signOffContent');
            tableContainer.appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}






// Add event listener to the Sign On form
document.getElementById('signOffForm').addEventListener('submit', handleSignOffSubmit);


async function handleDueforSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDated').value;
        let endDate = document.getElementById('endDated').value;
        const companyName = document.getElementById('user_client3').value;
        const vessel_type = document.getElementById('candidate_c_vessel2').value;

        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';

        const params = {
            startDate: startDate,
            endDate: endDate,
            companyname: companyName,
            vessel_type: vessel_type,
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/dueforsignoff', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const contracts = response.data.contracts;

        // Clear existing table, if any
        const tableContainer = document.getElementById('DuesignOffTable');
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['S.no', 'CandidateId', 'First Name', 'Nationality', 'Rank', 'Vessel', 'EOC-Date','Company', 'Status'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.scope = 'col';
            header.classList.add('text-center');
            headerRow.appendChild(header);
        });
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');

        // Process each contract and add candidates to the table
        contracts.forEach((contract, index) => {
            const row = document.createElement('tr');
            row.classList.add('border'); // Adding border to the row
            const fields = [
                index + 1, // Serial number (sno)
                contract.Candidate.candidateId,
                contract.Candidate.fname,
                contract.Candidate.nationality,
                contract.rank,
                contract.vslname,
                contract.eoc, // Access the EOC date from the contract
                contract.company
            ];
            fields.forEach((field, index) => {
                const cell = document.createElement('td');
                if (index === 0) {
                    cell.textContent = field; // Serial number
                } else if (index === headers.length - 2) {
                    cell.textContent = new Date(field).toLocaleDateString();
                } else {
                    cell.textContent = field;
                }
                cell.classList.add('text-center');
                row.appendChild(cell);
            });

            // Calculate status based on EOC date
            const status = calculateStatus(contract.eoc);
            const statusCell = document.createElement('td');
            const badge = document.createElement('span');
            badge.textContent = status.status;
            badge.classList.add('badge', 'bg-' + status.color);
            statusCell.classList.add('text-center');
            statusCell.appendChild(badge);
            row.appendChild(statusCell);

            tableBody.appendChild(row);
        });
        table.appendChild(tableBody);

        // Append table to container
        tableContainer.appendChild(table);

        // Check if reports is true
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export to Excel button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', async () => {
                try {
                    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
                    await XLSX.writeFile(wb, 'dueSignOffCandidates.xlsx');
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                }
            });
            tableContainer.appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}

// Function to calculate status based on sign-off date
function calculateStatus(signOffDate) {
    const today = new Date();
    const signOff = new Date(signOffDate);
    const diffTime = signOff - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (diffDays < 0) {
        return { status: `Overdue by ${Math.abs(diffDays)} days`, color: 'danger' };
    } else if (diffDays <= 30) {
        return { status: `Need to Renew in ${diffDays} days`, color: 'warning' };
    } else {
        return { status: 'Valid', color: 'success' };
    }
}



document.getElementById('dueforsignoffform').addEventListener('submit', handleDueforSignOffSubmit);

async function handleAvailableCandidatesSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDatea').value;
        const endDate = document.getElementById('endDatea').value;
        const avbrank = document.getElementById('avbrank').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
            avbrank: avbrank
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/avb-date', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Clear existing table, if any
        const tableContainer = document.getElementById('availableCandidatesTableBody');
        tableContainer.innerHTML = '';

        // Populate table with candidates data
        candidates.forEach((candidate, index) => {
            const row = document.createElement('tr');
            const fields = [
                index + 1, // Serial number (s.no)
                candidate.candidateId,
                candidate.fname,
                candidate.c_rank,
                candidate.c_vessel,
                candidate.avb_date
            ];
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = field;
                cell.classList.add('text-center');
                row.appendChild(cell);
            });
            tableContainer.appendChild(row);
        });

        // Check if the user has access to reports
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const reports = decodedToken.reports;
        if (reports === true) {
            // Add export to Excel button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', async () => {
                try {
                    // Create table element
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-bordered');

                    // Create table header
                    const tableHeader = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    const headers = ['S.no', 'Candidate ID', 'Name', 'Rank', 'Vessel', 'Available Date'];
                    headers.forEach(headerText => {
                        const header = document.createElement('th');
                        header.textContent = headerText;
                        header.scope = 'col';
                        header.classList.add('text-center');
                        headerRow.appendChild(header);
                    });
                    tableHeader.appendChild(headerRow);
                    table.appendChild(tableHeader);

                    // Create table body
                    const tableBody = document.createElement('tbody');
                    candidates.forEach((candidate, index) => {
                        const row = document.createElement('tr');
                        const fields = [
                            index + 1, // Serial number (s.no)
                            candidate.candidateId,
                            candidate.fname,
                            candidate.c_rank,
                            candidate.c_vessel,
                            candidate.avb_date
                        ];
                        fields.forEach(field => {
                            const cell = document.createElement('td');
                            cell.textContent = field;
                            cell.classList.add('text-center');
                            row.appendChild(cell);
                        });
                        tableBody.appendChild(row);
                    });
                    table.appendChild(tableBody);

                    // Export to Excel
                    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
                    await XLSX.writeFile(wb, 'availableCandidates.xlsx');
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                }
            });
            tableContainer.parentNode.insertBefore(exportButton, tableContainer.nextSibling);
        }

    } catch (error) {
        console.error(error);
    }
}




document.getElementById('availableCandidatesForm').addEventListener('submit', handleAvailableCandidatesSubmit);


async function handleDueForRenewalSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDater').value;
        const endDate = document.getElementById('endDater').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/renewal', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const documentCandidates = response.data.documentCandidates;
        const medicalCandidates = response.data.medicalCandidates;

        // Function to create table row with serial number
        const createRowWithSerialNumber = (candidate, fields) => {
            const row = document.createElement('tr');
            const snCell = document.createElement('td');
            snCell.textContent = fields.sn++;
            snCell.classList.add('text-center');
            row.appendChild(snCell);

            fields.keys.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = candidate[field];
                cell.classList.add('text-center');
                row.appendChild(cell);
            });
            
            const statusCell = document.createElement('td');
            const expiryDate = new Date(candidate['expiry_date']);
            const today = new Date();
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            let statusText, statusClass;
            if (expiryDate < today) {
                statusText = 'Expired';
                statusClass = 'bg-danger';
            } else if (expiryDate.toDateString() === today.toDateString()) {
                statusText = 'Expiring today';
                statusClass = 'bg-warning';
            } else {
                statusText = `Expires in ${daysUntilExpiry} days`;
                statusClass = 'bg-success';
            }
            const badge = document.createElement('span');
            badge.textContent = statusText;
            badge.classList.add('badge', statusClass);
            statusCell.appendChild(badge);
            statusCell.classList.add('text-center');
            row.appendChild(statusCell);

            return row;
        };

        // Function to create table row for document candidates
        const createDocumentRow = (candidate, fields) => {
            return createRowWithSerialNumber(candidate, fields);
        };

        // Function to create table row for medical candidates
        const createMedicalRow = (candidate, fields) => {
            return createRowWithSerialNumber(candidate, fields);
        };

        // Clear existing tables, if any
        const documentTableBody = document.getElementById('documentCandidatesTableBody');
        const medicalTableBody = document.getElementById('medicalCandidatesTableBody');
        documentTableBody.innerHTML = '';
        medicalTableBody.innerHTML = '';

        // Populate table with documentCandidates data
        let documentFields = { keys: ['document', 'expiry_date'], sn: 1 };
        documentCandidates.forEach(candidate => {
            documentTableBody.appendChild(createDocumentRow(candidate, documentFields));
        });

        // Populate table with medicalCandidates data
        let medicalFields = { keys: ['hospitalName', 'place', 'expiry_date'], sn: 1 };
        medicalCandidates.forEach(candidate => {
            medicalTableBody.appendChild(createMedicalRow(candidate, medicalFields));
        });

        // Check if the user has access to reports
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        // Hide export buttons if the user has access to reports
        if (reports) {
            document.getElementById('exportDocumentCandidates').style.display = 'block';
            document.getElementById('exportMedicalCandidates').style.display = 'block';
        }

    } catch (error) {
        console.error(error);
        // Display error message
        alert('An error occurred while fetching data. Please try again later.');
    }
}




document.getElementById('dueForRenewalForm').addEventListener('submit', handleDueForRenewalSubmit);
async function handleOnBoardSubmit(event) {
    event.preventDefault();
    let index =0;
    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDateo').value;
        const companyname = document.getElementById('user_client4').value || null;
        const vesselDropdown = document.getElementById('vsl1').value || null;

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
            params: {
                startDate: startDate,
                companyname: companyname,
                vslName: vesselDropdown,
            },
            headers: {
                "Authorization": token
            }
        });

        const contracts = response.data.contracts;
        const tableBody = document.getElementById('onBoardTableBody');
        tableBody.innerHTML = ''; // Clear existing table rows

        const rows = contracts.map(contract => {
            const candidate = contract.Candidate || {};
            return `
                <tr>
                <td style="font-size: 8px;">${index++}</td>
                <td ><button onclick="viewCandidate(${contract.candidateId})" class="btn btn-link">${contract.candidateId}</button></td>
                <td style="font-size: 8px;">${candidate.fname}</td>
                    <td style="font-size: 8px;">${contract.rank}</td>
                    <td style="font-size: 8px;">${candidate.nationality}</td>
                    <td style="font-size: 8px;">${candidate.dob}</td>
                    <td style="font-size: 8px;">${calculateAge(candidate.dob)}</td>
                    <td style="font-size: 8px;">${contract.sign_on}</td>
                    <td style="font-size: 8px;">${contract.sign_on_port}</td>
                    <td style="font-size: 8px;">${contract.vslname}</td>
                </tr>
            `;
        }).join('');

        tableBody.innerHTML = rows;

        // Check if the user has access to reports
        const decodedToken = decodeToken(token);
        const reports = decodedToken ? decodedToken.reports : false;

        if (reports && !document.getElementById('exportButton')) {
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.id = 'exportButton';
            exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
            exportButton.addEventListener('click', exportToExcel);

            const tableContainer = document.getElementById('onBoardTable');
            tableContainer.parentNode.insertBefore(exportButton, tableContainer);
        }
    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
        // Handle error (e.g., display a message to the user)
    }
}




async function exportToExcel() {
    try {
        const table = document.getElementById('onBoardTable');
        const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
        await XLSX.writeFile(wb, 'onboardCandidates.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}


function viewCandidate(candidateId) {
    localStorage.setItem('memId', candidateId);
    window.location.href = './view-candidate.html';
}

// Function to calculate age based on date of birth
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
document.getElementById('onBoardForm').addEventListener('submit', handleOnBoardSubmit);

const handleReminder = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDatedr').value;
        startDate+='T00:00:00Z';

        let endDate = document.getElementById('endDatedr').value;
        endDate = endDate + 'T23:59:59Z';

        // Function to fetch discussion reminders based on date filters
        const fetchData = async (startDate, endDate) => {
            try {
                const url = `https://nemo.ivistaz.co/candidate/reminder?startDate=${startDate}&endDate=${endDate}`;
                const response = await axios.get(url);
                return response.data.discussions;
            } catch (error) {
                console.error('Error fetching discussion reminders:', error);
                return [];
            }
        }

        // Function to render discussion reminders
        const renderDiscussionReminders = (discussions) => {
            const discussionList = document.getElementById('discussionList');
            discussionList.innerHTML = ''; // Clear existing items
        
            discussions.forEach(discussion => {
                // Calculate the status based on the r_date
                const reminderDate = new Date(discussion.r_date);
                const today = new Date();
                let status = '';
        
                if (reminderDate < today) {
                    status = 'Expired';
                } else if (reminderDate.toDateString() === today.toDateString()) {
                    status = 'Today';
                } else {
                    status = 'Upcoming';
                }
        
                // Render each discussion reminder item
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <div>
                            <h5 class="mb-1 d-flex align-items-center">Candidate ID: <button class="btn btn-link candidate-btn" data-candidate-id="${discussion.candidateId}">${discussion.candidateId}</button></h5>
                            <p class="mb-1">Discussion: ${discussion.discussion}</p>
                        </div>
                        <div>
                            <span class="badge align-content-center h-25 ${getBadgeColor(status)}">${status}</span>
                        </div>
                    </div>
                    <small class="text-muted">Reminder Date: ${discussion.r_date}</small>
                `;
                discussionList.appendChild(listItem);
        
                // Add event listener to candidate ID button
                listItem.querySelector('.candidate-btn').addEventListener('click', () => {
                    const candidateId = discussion.candidateId;
                    localStorage.setItem('memId', candidateId)
                    // Redirect to view-candidate page with candidateId
                    window.location.href = `view-candidate.html?id=${candidateId}`;
                });
            });
        }
        
        // Function to determine badge color based on discussion status
        const getBadgeColor = (status) => {
            switch (status) {
                case 'Expired':
                    return 'bg-danger';
                case 'Today':
                    return 'bg-warning';
                case 'Upcoming':
                    return 'bg-primary';
                default:
                    return '';
            }
        }

        // Fetch discussion reminders based on date filters
        const discussions = await fetchData(startDate, endDate);
        // Render discussion reminders
        renderDiscussionReminders(discussions);

    } catch (error) {
        console.error('Error handling reminder:', error);
    }
}

const dateFilterForm = document.getElementById('dateFilterForm');
dateFilterForm.addEventListener('submit', handleReminder);


// async function handleCrewList(event) {
//     event.preventDefault();
//     try {
//         const startDate = document.getElementById('startDatecl').value;
//         const endDate = document.getElementById('endDatecl').value;
//         const vslName = document.getElementById('vsl').value || null;
//         const companyname = document.getElementById('user_client5').value || null;
//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vslName: vslName,
//             company: companyname
//         };

//         const response = await axios.get('https://nemo.ivistaz.co/candidate/crewlist', {
//             params: params
//         });
        
//         const crewlistCandidates = response.data.contracts; // Accessing the contracts array

//         // Render crew list table
//         const crewListTableBody = document.getElementById('crewListTableBody');
//         crewListTableBody.innerHTML = ''; // Clear existing rows

//         if (crewlistCandidates && crewlistCandidates.length > 0) {
//             let index = 1;
//             crewlistCandidates.forEach(contract => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td style='font-size:8px;'>${index++}</td>
//                     <td style="font-size: 8px;">${contract.candidateId}</td>
//                     <td style="font-size: 8px;">${contract.Candidate ? contract.Candidate.firstName : ''}</td>
//                     <td style="font-size: 8px;">${contract.Candidate ? contract.Candidate.nationality : ''}</td>
//                     <td style="font-size: 8px;">${contract.rank}</td>
//                     <td style="font-size: 8px;">${contract.vslname}</td>
//                     <td>${contract.wages}</td>
//                     <td>${contract.wages_types}</td>
//                     <td>${contract.sign_on}</td>
//                     <td>${contract.sign_off}</td>
//                     <td style="font-size: 8px;">${getDocumentNumber(contract, 'Passport')}</td>
//                     <td style="font-size: 8px;">${getDocumentNumber(contract, 'INDIAN CDC')}</td>
//                     <td style="font-size: 8px;">${getDocumentNumber(contract, 'INDOS')}</td>
//                 `;
//                 crewListTableBody.appendChild(row);
//             });
//         } else {
//             // No data message
//             crewListTableBody.innerHTML = '<tr><td colspan="13">No data available</td></tr>';
//         }

//         // Check if the user has access to reports
//         const token = localStorage.getItem('token');
//         const decodedToken = decodeToken(token);
//         const reports = decodedToken.reports;

//         if (reports === true) {
//             // Add export to Excel button above the table
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
//             exportButton.addEventListener('click', () => {
//                 exportCrewListToExcel(crewlistCandidates);
//             });

//             const crewListTable = document.getElementById('crewlisttable');
//             crewListTable.parentNode.insertBefore(exportButton, crewListTable);
//         }
//     } catch (error) {
//         console.error("Error handling crew list:", error);
//         // Handle error here, maybe show an error message to the user
//     }
// }


async function handleCrewList(event) {
    event.preventDefault();
    try {
        const startDate = document.getElementById('startDatecl').value;
        const endDate = document.getElementById('endDatecl').value;
        
        // Check if startDate and endDate are empty
        if (!startDate || !endDate) {
            console.error("Start date and end date are required");
            // Show a message to the user indicating that start date and end date are required
            return;
        }

        const vslName = document.getElementById('vsl').value || null;
        const companyname = document.getElementById('user_client5').value || null;

        const params = {
            startDate: startDate,
            endDate: endDate,
            vslName: vslName,
            company: companyname
        };

        const response = await axios.get('https://nemo.ivistaz.co/candidate/crewlist', {
            params: params
        });
        
        const crewlistCandidates = response.data.contracts; // Accessing the contracts array

        const crewListTableBody = document.getElementById('crewListTableBody');
        crewListTableBody.innerHTML = ''; // Clear existing rows
        
        if (crewlistCandidates && crewlistCandidates.length > 0) {
            let index = 1;
            crewlistCandidates.forEach(contract => {
                console.log(contract);
        
                // Check if contract.Candidate exists and has valid properties
            
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index++}</td>
                    <td>${contract.candidateId}</td>
                   
                    <td>${contract.rank}</td>
                    <td>${contract.vesselType}</td>
                    <td>${contract.wages}</td>
                    <td>${contract.wages_types}</td>
                    <td>${contract.sign_on}</td>
                    <td>${contract.sign_off}</td>
                 
                `;
                crewListTableBody.appendChild(row);
            });
        } else {
            // No data message
            crewListTableBody.innerHTML = '<tr><td colspan="13">No data available</td></tr>';
        }
        
    } catch (error) {
        console.error("Error handling crew list:", error);
        // Handle error here, maybe show an error message to the user
    }
}





// function exportCrewListToExcel(crewlistCandidates) {
//     try {
//         // Create table element
//         const table = document.createElement('table');
//         table.classList.add('table', 'table-bordered');

//         // Create table header
//         const tableHeader = document.createElement('thead');
//         const headerRow = document.createElement('tr');
//         const headers = ['Candidate ID', 'Name', 'Nationality', 'Rank', 'Vessel', 'Wages', 'Wages Types', 'Sign On Date', 'Sign Off Date', 'Passport', 'INDIAN CDC', 'INDOS'];
//         headers.forEach(headerText => {
//             const header = document.createElement('th');
//             header.textContent = headerText;
//             header.scope = 'col';
//             header.classList.add('text-center');
//             headerRow.appendChild(header);
//         });
//         tableHeader.appendChild(headerRow);
//         table.appendChild(tableHeader);

//         // Create table body
//         const tableBody = document.createElement('tbody');
//         crewlistCandidates.forEach(candidate => {
//             const row = document.createElement('tr');
//             const fields = [
//                 candidate.candidateId,
//                 candidate.fname,
//                 candidate.nationality,
//                 candidate.c_rank,
//                 candidate.c_vessel,
//                 candidate.Contracts.length > 0 ? candidate.Contracts[0].wages : '',
//                 candidate.Contracts.length > 0 ? candidate.Contracts[0].wages_types : '',
//                 candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : '',
//                 candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_off : '',
//                 getDocumentNumber(candidate, 'Passport'),
//                 getDocumentNumber(candidate, 'INDIAN CDC'),
//                 getDocumentNumber(candidate, 'INDOS')
//             ];
//             fields.forEach(field => {
//                 const cell = document.createElement('td');
//                 cell.textContent = field;
//                 cell.classList.add('text-center');
//                 row.appendChild(cell);
//             });
//             tableBody.appendChild(row);
//         });
//         table.appendChild(tableBody);

//         // Export to Excel
//         const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
//         XLSX.writeFile(wb, 'crewlistCandidates.xlsx');
//     } catch (error) {
//         console.error('Error exporting to Excel:', error);
//     }
// }


function getDocumentNumber(candidate, documentType) {
    const doc = candidate.cDocuments.find(doc => doc.document === documentType);
    return doc ? doc.document_number : '';
}

const handleCrewListForm = document.getElementById('crewListMonthWiseForm').addEventListener('submit',handleCrewList)

// Function to fetch vessel names from the server
const displayVesselDropdown = async function () {
    try {
        const vesselDropdown = document.getElementById('vsl');
        const vesselDropdown1 = document.getElementById('vsl1');
        vesselDropdown.innerHTML = ''; // Clear existing options
        vesselDropdown1.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Vessel --';
        vesselDropdown.appendChild(defaultOption);
        vesselDropdown1.appendChild(defaultOption.cloneNode(true));
        
        // Fetch vessel names from the server
        const vesselResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls")
        const vessels = vesselResponse.data;
    
        // Populate the vessel dropdown with fetched vessel names
        vessels.forEach(vessel => {
            const option = document.createElement('option');
            option.value = vessel.id; // Assuming vesselName is the correct attribute
            option.text = vessel.vesselName; // Assuming vesselName is the correct attribute
            vesselDropdown.appendChild(option);
            vesselDropdown1.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}


displayVesselDropdown();


const handleReliefPlan = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('reliefPlanDate').value;

        // Get today's date as the end date
        const endDate = new Date().toISOString().split('T')[0];

        // Fetch relief plan data based on start date and today's date as end date
        const reliefPlanData = await fetchReliefPlan(startDate, endDate);

        // Display relief plan data in the table
        displayReliefPlanTable(reliefPlanData);
        
        // Check if the user has access to reports
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export button dynamically
            addExportButton();
        }
    } catch (error) {
        console.error('Error fetching relief plan data:', error);
    }
};


const fetchReliefPlan = async (startDate, endDate) => {
    try {
        const url = `https://nemo.ivistaz.co/candidate/reliefplan?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(url);
        console.log(response)

        return response.data;
    } catch (error) {
        console.error('Error fetching relief plan data:', error);
        return [];
    }
};

const displayReliefPlanTable = (reliefPlanData) => {
    const tableBody = document.getElementById('reliefPlanTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows

    reliefPlanData.forEach(candidate => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${candidate.candidateId}</td>
            <td>${candidate.fname}</td>
            <td>${candidate.nationality}</td>
            <td>${candidate.c_rank}</td>
            <td>${candidate.c_vessel}</td>
            <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].wages : ''}</td>
            <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].wages_types : ''}</td>
            <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : ''}</td>
            <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_off : ''}</td>
            <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].eoc : ''}</td>
        `;
        tableBody.appendChild(row);
    });
};

const addExportButton = () => {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export to Excel';
    exportButton.classList.add('btn', 'btn-dark', 'mb-3','text-success');
    exportButton.addEventListener('click', exportReliefPlanToExcel);
    
    // Append button to container
    const buttonContainer = document.getElementById('exportButtonContainer');
    buttonContainer.innerHTML = ''; // Clear existing content
    buttonContainer.appendChild(exportButton);
};

const exportReliefPlanToExcel = () => {
    const table = document.getElementById('reliefPlanTable');
    exportToExcel(table, 'reliefPlan.xlsx');
};

const reliefPlanForm = document.getElementById('reliefPlanForm');
reliefPlanForm.addEventListener('submit', handleReliefPlan);


const displayUserDropdown = async function () {
    try {
        const userDropdown = document.getElementById('appliedBy');
        userDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select User --';
        userDropdown.appendChild(defaultOption);
        
        // Fetch user data from the server
        const userResponse = await axios.get("https://nemo.ivistaz.co/user/userdropdown");
        const users = userResponse.data;
    
        // Populate the user dropdown with fetched user names
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id; // Assuming 'id' is the correct attribute for user ID
            option.text = `${user.userName} ` // Assuming 'userName' and 'lastName' are the correct attributes for user name
            userDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Call the function to display the user dropdown
displayUserDropdown();

const displayUserDropdown1 = async function () {
    try {
        const userDropdown = document.getElementById('appliedBy1');
        userDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select User --';
        userDropdown.appendChild(defaultOption);
        
        // Fetch user data from the server
        const userResponse = await axios.get("https://nemo.ivistaz.co/user/userdropdown");
        const users = userResponse.data;
    
        // Populate the user dropdown with fetched user names
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.userName; // Assuming 'id' is the correct attribute for user ID
            option.text = `${user.userName} ` // Assuming 'userName' and 'lastName' are the correct attributes for user name
            userDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Call the function to display the user dropdown
displayUserDropdown1();



document.getElementById('exportDocumentCandidates').addEventListener('click', function() {
    exportToExcels('documentCandidatesTableBody', 'DocumentCandidates');
});

document.getElementById('exportMedicalCandidates').addEventListener('click', function() {
    exportToExcels('medicalCandidatesTableBody', 'MedicalCandidates');
});

function exportToExcels(tableBodyId, filename) {
    var tableBody = document.getElementById(tableBodyId);
    var rows = tableBody.getElementsByTagName('tr');
    var data = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            row.push(cols[j].innerText);
        }
        data.push(row);
    }
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
}

const dateFilterForms = document.getElementById('dateFilterForm');
const startDateInput = document.getElementById('startDatemis');
const endDateInput = document.getElementById('endDatemis');

dateFilterForms.addEventListener('submit', async (event) => {
    event.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    fetchData(startDate, endDate);
});

// Function to fetch discussion reminders based on date filters
async function fetchData(startDate, endDate) {
    try {
        // Check if either startDate or endDate is empty, if so, throw an error
        if (!startDate || !endDate) {
            throw new Error('Both startDate and endDate must be provided.');
        }

        const url = `https://nemo.ivistaz.co/candidate/reminder?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(url);
        renderDiscussionReminders(response.data.discussions);
    } catch (error) {
        console.error('Error fetching discussion reminders:', error);
    }
}


// Function to render discussion reminders
function renderDiscussionReminders(discussions) {
    const discussionList = document.getElementById('discussionList');
    discussionList.innerHTML = ''; // Clear existing items

    
    discussions.forEach(discussion => {
        // Calculate the status based on the r_date
        const reminderDate = new Date(discussion.r_date);
        const today = new Date();
        let status = '';

        if (reminderDate < today) {
            status = 'Expired';
        } else if (reminderDate.toDateString() === today.toDateString()) {
            status = 'Today';
        } else {
            status = 'Upcoming';
        }

        // Render each discussion reminder item
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `
            <div class="d-flex justify-content-between">
                <div>
                
                    <h5 class="mb-1 d-flex align-items-center">Candidate ID: <button class="btn btn-link candidate-btn" data-candidate-id="${discussion.candidateId}">${discussion.candidateId}</button></h5>
                    <p class="mb-1">Discussion: ${discussion.discussion}</p>
                </div>
                <div>
                    <span class="badge align-content-center h-25 ${getBadgeColor(status)}">${status}</span>
                </div>
            </div>
            <small class="text-muted">Reminder Date: ${discussion.r_date}</small>
        `;
        discussionList.appendChild(listItem);

        // Add event listener to candidate ID button
        listItem.querySelector('.candidate-btn').addEventListener('click', () => {
            const candidateId = discussion.candidateId;
            localStorage.setItem('memId',candidateId)
            // Redirect to view-candidate page with candidateId
            window.location.href = `view-candidate.html?id=${candidateId}`;
        });
    });
}

// Function to determine badge color based on discussion status
function getBadgeColor(status) {
    switch (status) {
        case 'Expired':
            return 'bg-danger';
        case 'Today':
            return 'bg-warning';
        case 'Upcoming':
            return 'bg-primary';
        default:
            return '';
    }
}

function handleView(id) {
    alert(`View button clicked for candidateId ${id}`);
    localStorage.setItem('memId', id);
    window.location.href = './view-candidate.html';
}

document.getElementById('getData').addEventListener('click', async () => {
    const startDate = document.getElementById('startDatemis').value;
    const endDate = document.getElementById('endDatemis').value;

    try {
        const response = await axios.get('https://nemo.ivistaz.co/candidate/mis', {
            params: {
                startDate,
                endDate
            }
        });

        const candidates = response.data;
        const candidatesList = document.getElementById('candidatesList');
        candidatesList.innerHTML = '';

// Inside your event listener function
// Inside your event listener function
candidates.forEach(async candidate => {
    const candidateDiv = document.createElement('div');
    candidateDiv.classList.add('candidate-card');

    // Candidate Container
    const candidateContainer = document.createElement('div');
    candidateContainer.classList.add('candidate-container');
    candidateDiv.appendChild(candidateContainer);

    // Candidate Name with label
    const candidateNameLabel = document.createElement('div');
    candidateNameLabel.textContent = `Candidate Name: `;
    candidateNameLabel.classList.add('candidate-label');
    candidateContainer.appendChild(candidateNameLabel);

    const candidateName = document.createElement('div');
    candidateName.textContent = candidate.fname;
    candidateName.classList.add('candidate-name', 'text-primary'); // Add text-primary class
    candidateName.style.cursor = 'pointer'; // Make the candidate name clickable
    candidateName.addEventListener('click', () => {
        handleView(candidate.candidateId); // Trigger the view action when clicked
    });
    candidateContainer.appendChild(candidateName);

    // Candidate ID with label
    const candidateIdLabel = document.createElement('div');
    candidateIdLabel.textContent = `Candidate ID: `;
    candidateIdLabel.classList.add('candidate-label');
    candidateContainer.appendChild(candidateIdLabel);

    const candidateId = document.createElement('div');
    candidateId.textContent = candidate.candidateId;
    candidateId.classList.add('candidate-id', 'text-primary'); // Add text-primary class
    candidateId.style.cursor = 'pointer'; // Make the candidate ID clickable
    candidateId.addEventListener('click', () => {
        handleView(candidate.candidateId); // Trigger the view action when clicked
    });
    candidateContainer.appendChild(candidateId);

    // Discussions Container
    const discussionsContainer = document.createElement('div');
    discussionsContainer.classList.add('discussions-container');
    candidateDiv.appendChild(discussionsContainer);

    // Discussions List
    const discussionsList = document.createElement('ul');
    discussionsList.classList.add('discussion-list');
    discussionsContainer.appendChild(discussionsList);

    for (const discussion of candidate.discussions) {
        const discussionItem = document.createElement('li');
        discussionItem.classList.add('discussion-item');

        // Create a container for status badge and company name
        const statusContainer = document.createElement('div');
        statusContainer.classList.add('status-container');

        // Create hollow circle badge for discussion status
        const badge = document.createElement('div');
        badge.classList.add('discussion-badge');
        switch (discussion.discussion) {
            case 'Proposed':
                badge.classList.add('badge-proposed');
                break;
            case 'Approved':
                badge.classList.add('badge-approved');
                break;
            case 'Joined':
                badge.classList.add('badge-joined');
                break;
            case 'Rejected':
                badge.classList.add('badge-rejected');
                break;
            default:
                break;
        }

        // Add the first letter of the discussion status as text content
        const badgeText = document.createElement('span');
        badgeText.textContent = discussion.discussion.charAt(0); // Only first letter
        badgeText.classList.add('badge-text');
        badge.appendChild(badgeText);
        statusContainer.appendChild(badge);

        // Fetch and display company name based on company ID
        const companyName = await fetchCompanyName(discussion.companyname);
        const companyNameItem = document.createElement('span');
        companyNameItem.textContent = companyName;
        companyNameItem.classList.add('company-name');
        statusContainer.appendChild(companyNameItem);

        // Add the status container to discussion item
        discussionItem.appendChild(statusContainer);

        // Add the created date at the end of the line
        const createdDateItem = document.createElement('span');
        createdDateItem.textContent = formatDate(discussion.created_date);
        createdDateItem.classList.add('created-date');
        statusContainer.appendChild(createdDateItem);

        // Add discussion item to discussions list
        discussionsList.appendChild(discussionItem);
    }

    candidatesList.appendChild(candidateDiv);
});





 } catch (error) {
        console.error('Error:', error);
    }
});

// Function to fetch company name based on company ID


async function fetchCompanyName(companyId) {
    try {
        if (companyId === null || companyId === 0) {
            return 'No Company details present in Database';
        }

        const token = localStorage.getItem('token');
        const response = await axios.get(`https://nemo.ivistaz.co/company/get-company/${companyId}`, { headers: { "Authorization": token } });
        console.log(response)
        return response.data.company.company_name;
    } catch (error) {
        console.error('Error fetching company name:', error);
        return 'Unknown Company';
    }
}



function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

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


  
  let pagenumber = 1
    let totalPagesCandidates = 0; // Global variable to keep track of the total number of pages for candidates
  let totalPagesContracts = 0; // Global variable to keep track of the total number of pages for contracts
  
  async function handleDueForWorkedWithSubmit(event, pages = 1) {
      event.preventDefault(); // Prevent default form submission behavior
  
      try {
          // Get the selected value from the dropdown
          const pageSize = document.getElementById('pageSizeSelect').value;
  
          // Send request to fetch candidates with 'ntbr' and contracts with pagination parameters
          const response = await axios.get('https://nemo.ivistaz.co/candidate/worked', {
              params: {
                  pages, // Use the provided page number
                  pageSize // Use selected page size
              }
          });
  
          console.log(response.data); // Assuming the server sends back some data
          const candidatesWithNTBR = response.data.candidatesWithNTBR;
          const onboardContracts = response.data.onboardContracts;
          totalPagesCandidates = response.data.totalCandidatesPages;
          totalPagesContracts = response.data.totalContractsPages;
  
          // Clear existing tables, if any
          const candidatesTableContainer = document.getElementById('CandidatesTableBody');
          candidatesTableContainer.innerHTML = '';
  
          const contractsTableContainer = document.getElementById('ContractsTableBody');
          contractsTableContainer.innerHTML = '';
  
          // Populate table with candidates with 'ntbr' data
          candidatesWithNTBR.forEach(candidate => {
              const row = document.createElement('tr');
  
              // Create button element for candidate ID
              const candidateIdBtn = document.createElement('button');
              candidateIdBtn.textContent = candidate.candidateId;
              candidateIdBtn.classList.add('btn', 'text-primary');
              candidateIdBtn.onclick = function() {
                  viewCandidate(candidate.candidateId);
              };
  
              // Append button to row
              const cell = document.createElement('td');
              cell.appendChild(candidateIdBtn);
              row.appendChild(cell);
  
              // Add NTBR to row
              const ntbrCell = document.createElement('td');
              ntbrCell.textContent = candidate.ntbr;
              ntbrCell.classList.add('text-center');
              row.appendChild(ntbrCell);
  
              // Append row to table
              candidatesTableContainer.appendChild(row);
          });
  
          // Populate table with contracts data
          onboardContracts.forEach(contract => {
              const row = document.createElement('tr');
  
              // Create button element for candidate ID
              const candidateIdBtn = document.createElement('button');
              candidateIdBtn.textContent = contract.candidateId;
              candidateIdBtn.classList.add('btn', 'text-primary');
              candidateIdBtn.onclick = function() {
                  viewCandidate(contract.candidateId);
              };
  
              // Append button to row
              const cell = document.createElement('td');
              cell.appendChild(candidateIdBtn);
              row.appendChild(cell);
  
              // Add other contract fields to row
              const fields = [
                  contract.sign_on,
                  contract.sign_off,
                 
              ];
              fields.forEach(field => {
                  const cell = document.createElement('td');
                  cell.textContent = field;
                  cell.classList.add('text-center');
                  row.appendChild(cell);
              });
              contractsTableContainer.appendChild(row);
          });
  
          // Update the current page number and pagination info
          updatePaginationInfo();
  
      } catch (error) {
          console.error(error);
      }
  }
  
  // Function to handle next page button click
  document.getElementById('nextPageBtn').addEventListener('click', () => {
        pagenumber++
      handleDueForWorkedWithSubmit(event, pagenumber + 1);
  });
  
  // Function to handle previous page button click
  document.getElementById('prevPageBtn').addEventListener('click', () => {
        pagenumber--
          handleDueForWorkedWithSubmit(event, pagenumber - 1);
   
  });
  
  // Add event listener to the form
  document.getElementById('dueForWorkedWithForm').addEventListener('submit', () => {
      handleDueForWorkedWithSubmit(event);
  });
  
  // Add event listener to the pageSizeSelect dropdown
  document.getElementById('pageSizeSelect').addEventListener('change', () => {
      handleDueForWorkedWithSubmit(event);
  });
  
  // Function to handle viewing a candidate
  function viewCandidate(candidateId) {
      localStorage.setItem('memId', candidateId);
      window.location.href = './view-candidate.html';
  }
  
  // Function to update pagination info
  function updatePaginationInfo() {
     
      document.getElementById('totalPagesCandidates').textContent = "Page " + pagenumber +" of " + totalPagesCandidates;
      document.getElementById('totalPagesContracts').textContent = "Page " + pagenumber +" of "+ totalPagesContracts;
  }
  

  async function getReq() {
    try {
        const token = localStorage.getItem('token');
        
        // Fetch nationality data
        const nationalityResponse = await axios.get("https://nemo.ivistaz.co/others/country-codes");
        nationalityData = nationalityResponse.data.countryCodes;
        
        // Fetch other necessary data
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls", { headers: { "Authorization": token } });
        vslsData= serverResponse.data
        const serverResponseUser = await axios.get('https://nemo.ivistaz.co/user/userdropdown');
        userData = serverResponseUser.data
        const serverResponsecomp = await axios.get('https://nemo.ivistaz.co/company/dropdown-company');
        companyData= serverResponsecomp.data.companies
        console.log('Data fetched successfully');
    }
    catch(err){
        console.log(err);
    }
}
getReq()

const displayDropdown = async function () {
    const rankDropdown = document.getElementById('avbrank');
    rankDropdown.innerHTML = ''; // Clear existing options
    const token = localStorage.getItem('token')
    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("https://nemo.ivistaz.co/others/get-ranks", { headers: { "Authorization": token } });
    const rankOptions = rankResponse.data.ranks;
    const rankNames = rankOptions.map(rank => rank.rank);

    for (let i = 0; i < rankNames.length; i++) {
        const option = document.createElement('option');
        option.value = rankNames[i];
        option.text = rankNames[i];
        rankDropdown.appendChild(option);
    }
}
displayDropdown()

function getNationalityName(code) {
    console.log(nationalityData,code)
    const nationality = nationalityData.find(nationality => nationality.code == code);
    return nationality ? nationality.country : code;
}
