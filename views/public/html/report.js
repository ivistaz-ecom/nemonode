// Function to handle submission of New Profile form
async function handleNewProfileSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Gather selected fields
        const selectedFields = {};
        const checkboxes = document.querySelectorAll('#newProfileContent input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked; // Store checkbox state in selectedFields object
        });

        // Send data to server using Axios
        const response = await axios.post('http://localhost:4000/candidate/reports/view-new-profile', {
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
                th.classList = 'fw-bolder bg-info text-white';
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

        // Create "Export to Excel" button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.classList.add('btn', 'btn-success', 'mt-3', 'float-end', 'mb-2');
        exportButton.addEventListener('click', () => {
            exportToExcel(table, 'candidates.xlsx');
        });
        tableContainer.appendChild(exportButton);
        tableContainer.appendChild(table);

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
        const user = document.getElementById('user').value;

        // Gather selected fields, including 'candidateId'
        const selectedFields = { 'candidateId': true };
        const checkboxes = document.querySelectorAll('#callsMadeForm input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked;
        });

        // Send data to server using Axios
        const response = await axios.post('http://localhost:4000/candidate/reports/callsmade', {
            startDate: fromDate,
            endDate: toDate,
            user: user,
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
                th.classList = 'fw-bolder bg-info text-white';
                headerRow.appendChild(th);
            }
        }
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        // Create table body
const tableBody = document.createElement('tbody');
response.data.callsMade.forEach(call => {
    const row = document.createElement('tr');
    for (const field in selectedFields) {
        if (selectedFields[field]) {
            const cell = document.createElement('td');
            if (field === 'discussion') {
                // Access discussion fields
                if (call.discussions && call.discussions.length > 0) {
                    const discussions = call.discussions.map(discussion => discussion.discussion);
                    cell.textContent = discussions.join('\n');
                } else {
                    cell.textContent = 'N/A';
                }
            } else if (field === 'r_date') {
                // Access r_date
                if (call.discussions && call.discussions.length > 0) {
                    const rDates = call.discussions.map(discussion => discussion.r_date);
                    cell.textContent = rDates.join('\n');
                } else {
                    cell.textContent = 'N/A';
                }
            } else {
                // Access other fields directly from the call object
                cell.textContent = call[field];
            }
            row.appendChild(cell);
        }
    }
    tableBody.appendChild(row);
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
        const response = await axios.get('http://localhost:4000/candidate/reports/proposals', {
            params: {
                status: status,
                startDate: startDate,
                endDate: endDate
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

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

    } catch (error) {
        console.error(error);
    }
}






// Add event listener to the discussion form
document.getElementById('discussionForm').addEventListener('submit', handleDiscussionSubmit);


// Function to handle submission of New Profile form
async function handleNewProfileSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Gather selected fields
        const selectedFields = {};
        const checkboxes = document.querySelectorAll('#newProfileContent input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked; // Store checkbox state in selectedFields object
        });

        // Send data to server using Axios
        const response = await axios.post('http://localhost:4000/candidate/reports/view-new-profile', {
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
                th.classList = 'fw-bolder bg-info text-white';
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

        // Create "Export to Excel" button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.classList.add('btn', 'btn-success', 'mt-3', 'float-end', 'mb-2');
        exportButton.addEventListener('click', () => {
            exportToExcel(table, 'candidates.xlsx');
        });
        tableContainer.appendChild(exportButton);
        tableContainer.appendChild(table);

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
        const user = document.getElementById('user').value;

        // Gather selected fields, including 'candidateId'
        const selectedFields = { 'candidateId': true };
        const checkboxes = document.querySelectorAll('#callsMadeForm input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked;
        });

        // Send data to server using Axios
        const response = await axios.post('http://localhost:4000/candidate/reports/callsmade', {
            startDate: fromDate,
            endDate: toDate,
            user: user,
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
                th.classList = 'fw-bolder bg-info text-white';
                headerRow.appendChild(th);
            }
        }
        tableHeader.appendChild(headerRow);
        table.appendChild(tableHeader);

        // Create table body
        // Create table body
const tableBody = document.createElement('tbody');
response.data.callsMade.forEach(call => {
    const row = document.createElement('tr');
    for (const field in selectedFields) {
        if (selectedFields[field]) {
            const cell = document.createElement('td');
            if (field === 'discussion') {
                // Access discussion fields
                if (call.discussions && call.discussions.length > 0) {
                    const discussions = call.discussions.map(discussion => discussion.discussion);
                    cell.textContent = discussions.join('\n');
                } else {
                    cell.textContent = 'N/A';
                }
            } else if (field === 'r_date') {
                // Access r_date
                if (call.discussions && call.discussions.length > 0) {
                    const rDates = call.discussions.map(discussion => discussion.r_date);
                    cell.textContent = rDates.join('\n');
                } else {
                    cell.textContent = 'N/A';
                }
            } else {
                // Access other fields directly from the call object
                cell.textContent = call[field];
            }
            row.appendChild(cell);
        }
    }
    tableBody.appendChild(row);
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
        const response = await axios.get('http://localhost:4000/candidate/reports/proposals', {
            params: {
                status: status,
                startDate: startDate,
                endDate: endDate
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

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
        const response = await axios.get('http://localhost:4000/candidate/reports/sign-on', {
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
        const startDate = document.getElementById('startDatec').value;
        const endDate = document.getElementById('endDatec').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };

        // Send data to server using Axios
        const response = await axios.get('http://localhost:4000/candidate/reports/sign-off', {
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
                candidate.Contracts[0].sign_off // Access the sign-on date from the first contract associated with the candidate
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

    } catch (error) {
        console.error(error);
    }
}


// Add event listener to the Sign On form
document.getElementById('signOffForm').addEventListener('submit', handleSignOffSubmit);


const calculateRemainingDays = (signOffDate, startDate) => {
    // Convert sign-off and start dates to JavaScript Date objects
    const signOff = new Date(signOffDate);
    const start = new Date(startDate);

    // Calculate the difference in milliseconds
    const difference = signOff - start;

    // Convert milliseconds to days
    const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));

    // Determine if the remaining days are negative (sign off date is before start date)
    if (daysDifference < 0) {
        return { days: daysDifference, color: 'danger' }; // Set color to 'danger' for negative remaining days
    } else {
        let color;
        if (daysDifference < 7) {
            color = 'warning'; // Set color to 'warning' for less than 7 days remaining
        } else {
            color = 'success'; // Set color to 'success' for 7 days or more remaining
        }
        return { days: daysDifference  + ' remaining', color: color };
    }
};

async function handleDueforSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        const startDate = document.getElementById('startDated').value;
        const endDate = document.getElementById('endDated').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
        };

        // Send data to server using Axios
        const response = await axios.get('http://localhost:4000/candidate/reports/sign-off', {
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
        const headers = ['Candidate ID', 'Rank', 'Vessel', 'Sign Off Date', 'Remaining Days'];
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
                calculateRemainingDays(candidate.Contracts[0].sign_off, startDate) // Calculate remaining days based on sign-off date and start date
            ];
            fields.forEach((field, index) => {
                const cell = document.createElement('td');
                if (index === fields.length - 1) {
                    const badge = document.createElement('span');
                    badge.textContent = field.days + ' days';
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
        const response = await axios.get('http://localhost:4000/candidate/reports/avb-date', {
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
        const response = await axios.get('http://localhost:4000/candidate/reports/renewal', {
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


    } catch (error) {
        console.error(error);
        // Display error message
        alert('An error occurred while fetching data. Please try again later.');
    }
}



document.getElementById('dueForRenewalForm').addEventListener('submit', handleDueForRenewalSubmit);
