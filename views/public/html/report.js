





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
            selectedFields: selectedFields
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
        table.classList.add('table-sm');
        table.classList.add('table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
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
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            for (const field in selectedFields) {
                if (selectedFields[field]) {
                    const cell = document.createElement('td');
                    cell.textContent = candidate[field];
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
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2','text-success');
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


// Function to handle submission of Calls Made form
// Function to handle submission of Calls Made form
// Update the handleCallsMadeSubmit function
// Update the handleCallsMadeSubmit function
async function handleCallsMadeSubmit(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;
        const user = document.getElementById('userDropdown').value;
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        // Gather selected fields, including 'candidateId'
        const selectedFields = { 'candidateId': true };
        const checkboxes = document.querySelectorAll('#callsMadeForm input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked;
        });

        // Send data to server using Axios
        const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/callsmade', {
            startDate: fromDate,
            endDate: toDate,
            userId: user,
            selectedFields: selectedFields
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
            exportButton.classList.add('btn', 'btn-light', 'mb-3', 'text-success');
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
        table.classList.add('table-sm');
        table.classList.add('table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (const field in selectedFields) {
            if (selectedFields[field]) {
                const th = document.createElement('th');
                th.textContent = field;
                th.classList = 'fw-bolder bg-warning text-white';
                headerRow.appendChild(th);
            }
        }
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        const tableBody = document.createElement('tbody');
        response.data.callsMade.forEach(call => {
            call.discussions.forEach(discussion => {
                const row = document.createElement('tr');
                for (const field in selectedFields) {
                    if (selectedFields[field]) {
                        const cell = document.createElement('td');
                        if (field === 'discussion') {
                            // Access discussion fields
                            cell.textContent = discussion.discussion || 'N/A';
                        } else if (field === 'r_date') {
                            // Access r_date
                            cell.textContent = discussion.r_date || 'N/A';
                        } else {
                            // Access other fields directly from the call object
                            cell.textContent = call[field] || 'N/A';
                        }
                        row.appendChild(cell);
                    }
                }
                tableBody.appendChild(row);
            });
        });

        table.appendChild(tableBody);

        // Append table to container
        tableContainer.appendChild(table);
    } catch (error) {
        console.error(error);
    }
}




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
        const startDate = document.getElementById('startDates').value;
        const endDate = document.getElementById('endDates').value;

        // Send data to server using Axios with the GET method and query parameters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/proposals', {
            params: {
                status: status,
                startDate: startDate,
                endDate: endDate
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
        const headers = ['Candidate ID', 'Rank', 'Vessel', 'Company Name', 'Created Date', 'Posted By'];
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
        candidates.forEach(candidate => {
            candidate.discussions.forEach(discussion => {
                const row = document.createElement('tr');
                const fields = [
                    candidate.candidateId,
                    candidate.c_rank,
                    candidate.c_vessel,
                    discussion.companyname,
                    discussion.created_date,
                    discussion.post_by
                ];
                fields.forEach(field => {
                    const cell = document.createElement('td');
                    cell.textContent = field;
                    cell.classList.add('text-center');
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
        });
        table.appendChild(tableBody);

        // Append table to discussionResults container
        discussionResults.appendChild(table);

        // Check if reports is true
        if (reports === true) {
            // Create "Export to Excel" button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(table, 'discussionData.xlsx');
            });
            discussionResults.parentNode.insertBefore(exportButton, discussionResults.nextSibling);
        }

    } catch (error) {
        console.error(error);
    }
}








// Add event listener to the discussion form
document.getElementById('discussionForm').addEventListener('submit', handleDiscussionSubmit);

// Function to handle submission of Sign On form
async function handleSignOnSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDatec').value;
        const endDate = document.getElementById('endDatec').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Clear existing table, if any
        const tableContainer = document.getElementById('signOnTable');
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-sm', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Candidate ID', 'Rank', 'Vessel', 'Sign On Date'];
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
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            const fields = [
                candidate.candidateId,
                candidate.c_rank,
                candidate.c_vessel,
                candidate.Contracts[0].sign_on // Access the sign-on date from the first contract associated with the candidate
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

        // Append table to container
        tableContainer.appendChild(table);

        // Check if reports is true
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Create "Export to Excel" button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2','text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(table, 'signOnData.xlsx');
            });
            tableContainer.parentNode.insertBefore(exportButton, tableContainer.nextSibling);
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
        const startDate = document.getElementById('startDateoff').value;
        const endDate = document.getElementById('endDateoff').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };
        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-off', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Clear existing table, if any
        const tableContainer = document.getElementById('signOffTable');
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-sm', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Candidate ID', 'Rank', 'Vessel', 'Sign Off Date'];
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
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            const fields = [
                candidate.candidateId,
                candidate.c_rank,
                candidate.c_vessel,
                candidate.Contracts[0].sign_off // Access the sign-off date from the first contract associated with the candidate
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

        // Append table to container
        tableContainer.appendChild(table);

        // Check if reports is true
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export to Excel button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', async () => {
                try {
                    const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
                    await XLSX.writeFile(wb, 'signOffCandidates.xlsx');
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





// Add event listener to the Sign On form
document.getElementById('signOffForm').addEventListener('submit', handleSignOffSubmit);


const calculateStatus = (signOffDate) => {
    const oneDay = 24 * 60 * 60 * 1000; // Hours*minutes*seconds*milliseconds
    const today = new Date();
    const signOff = new Date(signOffDate);
    const diffDays = Math.round((signOff - today) / oneDay);

    if (diffDays > 0) {
        return { status: 'Active', color: 'success' }; // Status for candidates with sign-off date in the future
    } else if (diffDays === 0) {
        return { status: 'Today', color: 'warning' }; // Status for candidates with sign-off date today
    } else {
        return { status: 'Overdue', color: 'danger' }; // Status for candidates with sign-off date in the past
    }
};


async function handleDueforSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDated').value;
        const endDate = document.getElementById('endDated').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-off', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Clear existing table, if any
        const tableContainer = document.getElementById('DuesignOffTable');
        tableContainer.innerHTML = '';

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-sm', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Candidate ID', 'Rank', 'Vessel', 'Sign Off Date', 'Status'];
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
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            const fields = [
                candidate.candidateId,
                candidate.c_rank,
                candidate.c_vessel,
                candidate.Contracts[0].sign_off, // Access the sign-off date from the first contract associated with the candidate
                calculateStatus(candidate.Contracts[0].sign_off) // Calculate status based on sign-off date
            ];
            fields.forEach((field, index) => {
                const cell = document.createElement('td');
                if (index === fields.length - 1) {
                    const badge = document.createElement('span');
                    badge.textContent = field.status;
                    badge.classList.add('badge', 'bg-' + field.color);
                    cell.appendChild(badge);
                } else {
                    cell.textContent = field;
                }
                cell.classList.add('text-center');
                row.appendChild(cell);
            });
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
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2', 'text-success');
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



document.getElementById('dueforsignoffform').addEventListener('submit', handleDueforSignOffSubmit);

async function handleAvailableCandidatesSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDatea').value;
        const endDate = document.getElementById('endDatea').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
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
        candidates.forEach(candidate => {
            const row = document.createElement('tr');
            const fields = [
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
            exportButton.classList.add('btn', 'btn-light', 'mt-3', 'float-end', 'mb-2','text-success');
            exportButton.addEventListener('click', async () => {
                try {
                    // Create table element
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-bordered');

                    // Create table header
                    const tableHeader = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    const headers = ['Candidate ID', 'Name', 'Rank', 'Vessel', 'Available Date'];
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
                    candidates.forEach(candidate => {
                        const row = document.createElement('tr');
                        const fields = [
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

        // Clear existing tables, if any
       

        // Function to create table row
    // Function to create table row for document candidates
// Function to create table row for document candidates
// Function to create table row for document candidates
// Function to create table row for document candidates
// Function to create table row for document candidates
const createDocumentRow = (candidate) => {
    const row = document.createElement('tr');
    
    // Add document fields
    const documentFields = ['document', 'expiry_date'];
    documentFields.forEach(field => {
        const cell = document.createElement('td');
        cell.textContent = candidate[field];
        cell.classList.add('text-center');
        row.appendChild(cell);
    });
    
    // Add status column
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

// Function to create table row for medical candidates
const createMedicalRow = (candidate) => {
    const row = document.createElement('tr');
    
    // Add medical fields
    const medicalFields = ['hospitalName', 'place', 'expiry_date'];
    medicalFields.forEach(field => {
        const cell = document.createElement('td');
        cell.textContent = candidate[field];
        cell.classList.add('text-center');
        row.appendChild(cell);
    });
    
    // Add status column
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


// Clear existing tables, if any
const documentTableBody = document.getElementById('documentCandidatesTableBody');
const medicalTableBody = document.getElementById('medicalCandidatesTableBody');
documentTableBody.innerHTML = '';
medicalTableBody.innerHTML = '';

// Populate table with documentCandidates data
documentCandidates.forEach(candidate => {
    documentTableBody.appendChild(createDocumentRow(candidate));
});

// Populate table with medicalCandidates data
medicalCandidates.forEach(candidate => {
    medicalTableBody.appendChild(createMedicalRow(candidate));
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
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDateo').value;
        const endDate = document.getElementById('endDateo').value;

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
            params: {
                startDate: startDate,
                endDate: endDate
            },
            headers: {
                "Authorization": token
            }
        });

        // Assuming the server sends back some data
        const onboardCandidates = response.data;
        console.log(response);
        
        // Clear existing table body, if any
        const tableBody = document.getElementById('onBoardTableBody');
        tableBody.innerHTML = '';

        // Create table rows for each onboard candidate
        onboardCandidates.forEach(candidate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${candidate.candidateId}</td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.nationality}</td>
                <td>${candidate.dob}</td>
                <td>${calculateAge(candidate.dob)}</td>
                <td>${candidate.cDocuments.length > 0 ? candidate.cDocuments[0].document_number : ''}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : ''}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on_port : ''}</td>
                <td>${candidate.c_vessel}</td>
            `;
            tableBody.appendChild(row);
        });

        // Check if the user has access to reports
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export to Excel button
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-light', 'mb-3','text-success');
            exportButton.addEventListener('click', async () => {
                try {
                    // Create table element
                    const table = document.createElement('table');
                    table.classList.add('table', 'table-bordered');

                    // Create table header
                    const tableHeader = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    const headers = ['Candidate ID', 'Name', 'Rank', 'Nationality', 'Date of Birth', 'Age', 'Document Number', 'Sign On Date', 'Sign On Port', 'Vessel'];
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
                    onboardCandidates.forEach(candidate => {
                        const row = document.createElement('tr');
                        const fields = [
                            candidate.candidateId,
                            `${candidate.fname} ${candidate.lname}`,
                            candidate.c_rank,
                            candidate.nationality,
                            candidate.dob,
                            calculateAge(candidate.dob),
                            candidate.cDocuments.length > 0 ? candidate.cDocuments[0].document_number : '',
                            candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : '',
                            candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on_port : '',
                            candidate.c_vessel
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
                    await XLSX.writeFile(wb, 'onboardCandidates.xlsx');
                } catch (error) {
                    console.error('Error exporting to Excel:', error);
                }
            });

            // Append export button above the table
            const tableContainer = document.getElementById('onBoardTable');
            tableContainer.parentNode.insertBefore(exportButton, tableContainer);
        }

    } catch (error) {
        console.error(error);
    }
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
        const startDate = document.getElementById('startDatedr').value;
        const endDate = document.getElementById('endDatedr').value;

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


async function handleCrewList(event) {
    event.preventDefault();

    try {
        const startDate = document.getElementById('startDatecl').value;
        const endDate = document.getElementById('endDatecl').value;
        const vslName = document.getElementById('vsl').value;
        const params = {
            startDate: startDate,
            endDate: endDate,
            vslName: vslName
        };

        const response = await axios.get('https://nemo.ivistaz.co/candidate/crewlist', {
            params: params
        });

        const crewlistCandidates = response.data;

        // Render crew list table
        const crewListTableBody = document.getElementById('crewListTableBody');
        crewListTableBody.innerHTML = ''; // Clear existing rows

        crewlistCandidates.forEach(candidate => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="font-size: 8px;">${candidate.candidateId}</td>
                <td style="font-size: 8px;">${candidate.fname}</td>
                <td style="font-size: 8px;">${candidate.nationality}</td>
                <td style="font-size: 8px;">${candidate.c_rank}</td>
                <td style="font-size: 8px;">${candidate.c_vessel}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].wages : ''}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].wages_types : ''}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : ''}</td>
                <td>${candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_off : ''}</td>
                <td style="font-size: 8px;">${getDocumentNumber(candidate, 'Passport')}</td>
                <td style="font-size: 8px;">${getDocumentNumber(candidate, 'INDIAN CDC')}</td>
                <td style="font-size: 8px;">${getDocumentNumber(candidate, 'INDOS')}</td>
            `;
            crewListTableBody.appendChild(row);
        });

        // Check if the user has access to reports
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export to Excel button above the table
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-light', 'mb-3', 'text-success');
            exportButton.addEventListener('click', () => {
                exportCrewListToExcel(crewlistCandidates);
            });

            const crewListTable = document.getElementById('crewlisttable');
            crewListTable.parentNode.insertBefore(exportButton, crewListTable);
        }
    } catch (error) {
        console.error("Error handling crew list:", error);
    }
}


function exportCrewListToExcel(crewlistCandidates) {
    try {
        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Candidate ID', 'Name', 'Nationality', 'Rank', 'Vessel', 'Wages', 'Wages Types', 'Sign On Date', 'Sign Off Date', 'Passport', 'INDIAN CDC', 'INDOS'];
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
        crewlistCandidates.forEach(candidate => {
            const row = document.createElement('tr');
            const fields = [
                candidate.candidateId,
                candidate.fname,
                candidate.nationality,
                candidate.c_rank,
                candidate.c_vessel,
                candidate.Contracts.length > 0 ? candidate.Contracts[0].wages : '',
                candidate.Contracts.length > 0 ? candidate.Contracts[0].wages_types : '',
                candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_on : '',
                candidate.Contracts.length > 0 ? candidate.Contracts[0].sign_off : '',
                getDocumentNumber(candidate, 'Passport'),
                getDocumentNumber(candidate, 'INDIAN CDC'),
                getDocumentNumber(candidate, 'INDOS')
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
        XLSX.writeFile(wb, 'crewlistCandidates.xlsx');
    } catch (error) {
        console.error('Error exporting to Excel:', error);
    }
}


function getDocumentNumber(candidate, documentType) {
    const doc = candidate.cDocuments.find(doc => doc.document === documentType);
    return doc ? doc.document_number : '';
}

const handleCrewListForm = document.getElementById('crewListMonthWiseForm').addEventListener('submit',handleCrewList)

// Function to fetch vessel names from the server
const displayVesselDropdown = async function () {
    try {
        const vesselDropdown = document.getElementById('vsl');
        vesselDropdown.innerHTML = ''; // Clear existing options
    
        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Vessel --';
        vesselDropdown.appendChild(defaultOption);
        
        // Fetch vessel names from the server
        const vesselResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls")
        const vessels = vesselResponse.data;
    
        // Populate the vessel dropdown with fetched vessel names
        vessels.forEach(vessel => {
            const option = document.createElement('option');
            option.value = vessel.id; // Assuming vesselName is the correct attribute
            option.text = vessel.vesselName; // Assuming vesselName is the correct attribute
            vesselDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}


displayVesselDropdown();


const handleReliefPlan = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDate').value;

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
    exportButton.classList.add('btn', 'btn-light', 'mb-3','text-success');
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
        const userDropdown = document.getElementById('userDropdown');
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


  async function handleDueForWorkedWithSubmit() {
    try {
        const url = `https://nemo.ivistaz.co`;

        // Send request to fetch candidates with 'ntbr' and contracts
        const response = await axios.get(`${url}/candidate/worked`);

        console.log(response.data); // Assuming the server sends back some data
        const candidatesWithNTBR = response.data.candidatesWithNTBR;
        const onboardContracts = response.data.onboardContracts;

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

    } catch (error) {
        console.error(error);
    }
}

// Add event listener to the form
document.getElementById('dueForWorkedWithForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    handleDueForWorkedWithSubmit();
});

// Function to handle viewing a candidate
function viewCandidate(candidateId) {
    localStorage.setItem('memId', candidateId);
    window.location.href = './view-candidate.html';
}
