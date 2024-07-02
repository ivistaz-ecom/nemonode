


let nationalityData = []; // Add this line to declare nationalityData globally
let portData=[];
let vslsData =[];
let userData;
let companyData =[];




// Function to export table data to Excel
function exportToExcel(data, filename) {
    // Convert data to array of arrays for XLSX conversion
    const dataArray = data.map(candidate => {
        const row = [];
        for (const field in selectedFields) {
            if (selectedFields[field]) {
                let value = candidate[field];
                if (field === 'nationality' && value) {
                    value = getNationalityName(value); // Replace code with nationality name
                }
                row.push(value || ''); // Push empty string if value is undefined or null
            }
        }
        return row;
    });

    // Insert headers
    const headers = Object.keys(selectedFields).filter(field => selectedFields[field]);
    dataArray.unshift(headers);

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Save workbook and trigger download
    XLSX.writeFile(workbook, filename);
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
let currentPage = 1;
let rowsPerPage = 10; // Default rows per page
let allCandidates = [];
let filteredCandidates = [];
let selectedFields = {}; // Move selectedFields to a higher scope

async function handleNewProfileSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDate').value;
        startDate = startDate + 'T00:00:00Z';
        let endDate = document.getElementById('endDate').value;
        endDate = endDate + 'T23:59:59Z';
        const user = document.getElementById('appliedBy1').value;
        const category = document.getElementById('category').value;

        const decodedToken = decodeToken(token);

        // Gather selected fields
        selectedFields = {}; // Clear previous selectedFields
        const checkboxes = document.querySelectorAll('#newProfileContent input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            selectedFields[checkbox.id] = checkbox.checked; // Store checkbox state in selectedFields object
        });

        // Send data to server using Axios
        const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/view-new-profile', {
            startDate: startDate,
            endDate: endDate,
            id: user,
            category: category,
            selectedFields: selectedFields,
        }, {
            headers: {
                "Authorization": token
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        allCandidates = response.data.candidates;
        filteredCandidates = allCandidates; // Initialize filteredCandidates with all data

        displayTable();

        // Create "Export to Excel" button if user has permission
        if (decodedToken.reports) {
            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
            exportButton.addEventListener('click', () => {
                exportToExcel(filteredCandidates, 'candidates.xlsx'); // Use filteredCandidates for export
            });
            // Append export button
            document.getElementById('exportContainer').innerHTML = ''; // Clear previous export button
            document.getElementById('exportContainer').appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}

function displayTable() {
    // Clear existing table
    const tableContainer = document.getElementById('candidateTable');
    tableContainer.innerHTML = '';

    // Create and display match count
    const matchCount = document.createElement('div');
    matchCount.textContent = `${filteredCandidates.length} data entries match the search`;
    matchCount.classList.add('fw-bold', 'mb-2');
    tableContainer.appendChild(matchCount);

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
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedCandidates = filteredCandidates.slice(start, end);

    paginatedCandidates.forEach((candidate, index) => {
        const row = document.createElement('tr');

        // Add Serial Number cell
        const snCell = document.createElement('td');
        snCell.textContent = start + index + 1; // Serial Number starts from 1
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

    displayPagination();
}

function displayPagination() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

    function createPageButton(page) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.classList.add('btn', 'btn-dark', 'm-1');
        if (page === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = page;
            displayTable();
            displayPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    if (totalPages > 1) {
        // Previous Button
        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Prev';
            prevButton.classList.add('btn', 'btn-dark', 'm-1');
            prevButton.addEventListener('click', () => {
                currentPage -= 1;
                displayTable();
                displayPagination();
            });
            paginationContainer.appendChild(prevButton);
        }

        // First Page Button
        createPageButton(1);

        // If current page is far from the first page, add ellipsis
        if (currentPage > 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('m-1');
            paginationContainer.appendChild(ellipsis);
        }

        // Current Page Button
        if (currentPage > 1 && currentPage < totalPages) {
            createPageButton(currentPage);
        }

        // If current page is far from the last page, add ellipsis
        if (currentPage < totalPages - 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.classList.add('m-1');
            paginationContainer.appendChild(ellipsis);
        }

        // Last Page Button
        if (totalPages > 1) {
            createPageButton(totalPages);
        }

        // Next Button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.classList.add('btn', 'btn-dark', 'm-1');
            nextButton.addEventListener('click', () => {
                currentPage += 1;
                displayTable();
                displayPagination();
            });
            paginationContainer.appendChild(nextButton);
        }
    }
}


function searchTable() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    filteredCandidates = allCandidates.filter(candidate => {
        return Object.values(candidate).some(value => 
            value.toString().toLowerCase().includes(searchQuery)
        );
    });
    currentPage = 1;
    displayTable();
}

// function exportToExcel(data, filename) {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//     XLSX.writeFile(workbook, filename);
// }

// Event listener for rows per page change
document.getElementById('rowsPerPage').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);
    currentPage = 1;
    displayTable();
});

// Add event listeners for search and pagination
document.getElementById('searchInput').addEventListener('input', searchTable);


// Function to get nationality name from code


// Function to handle submission of Calls Made form
// Function to handle submission of Calls Made form
// Update the handleCallsMadeSubmit function
// Update the handleCallsMadeSubmit function
// async function handleCallsMadeSubmit(event) {
//     event.preventDefault();
//     try {
//         const token = localStorage.getItem('token');
//         let fromDate = document.getElementById('fromDate').value;
//         fromDate = fromDate + 'T00:00:00Z';
//         let toDate = document.getElementById('toDate').value;
//         toDate = toDate + 'T23:59:59Z';
//         console.log('from', fromDate);
//         console.log('to', toDate);

//         const user = document.getElementById('appliedBy').value;
//         const category = document.getElementById('categoryc').value;
//         const decodedToken = decodeToken(token);
//         const reports = decodedToken.reports;

//         // Fetch necessary data including nationality
//         await getReq();

//         // Send data to server using Axios
//         const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/callsmade', {
//             startDate: fromDate,
//             endDate: toDate,
//             userId: user,
//             category: category
//         }, {
//             headers: {
//                 "Authorization": token
//             }
//         });

//         console.log(response.data); // Check the server response structure

//         const callsMade = response.data.callsMade;

//         // Display calls made in a table
//         const tableContainer = document.getElementById('callsMadeTable');
//         tableContainer.innerHTML = '';

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'searchInput';
//         searchInput.addEventListener('input', function () {
//             currentPage = 1;
//             renderTable();
//         });
//         tableContainer.appendChild(searchInput);

//         // Create rows per page dropdown
//         const rowsPerPageSelect = document.createElement('select');
//         rowsPerPageSelect.id = 'rowsPerPage';
//         [10, 25, 50, 100].forEach(num => {
//             const option = document.createElement('option');
//             option.value = num;
//             option.textContent = num;
//             rowsPerPageSelect.appendChild(option);
//         });
//         rowsPerPageSelect.addEventListener('change', function () {
//             currentPage = 1;
//             renderTable();
//         });
//         tableContainer.appendChild(rowsPerPageSelect);

//         // Create export button if reports is true
//         if (reports === true) {
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
//             exportButton.style = 'width:300px;';
//             exportButton.addEventListener('click', function () {
//                 exportToExcel(callsMade, 'callsMade.xlsx');
//             });
//             tableContainer.appendChild(exportButton);
//         }

//         // Create table element
//         const table = document.createElement('table');
//         table.classList.add('table', 'table-bordered');
//         tableContainer.appendChild(table);

//         // Pagination variables
//         let currentPage = 1;

//         function renderTable() {
//             // Clear previous content
//             tableContainer.innerHTML = '';
        
//             // Check if callsMade is empty
//             if (callsMade.length === 0) {
//                 const emptyMessage = document.createElement('p');
//                 emptyMessage.textContent = 'No data available';
//                 tableContainer.appendChild(emptyMessage);
//                 return;
//             }
        
//             // Gather selected fields from checkboxes
//             const selectedFields = [];
//             document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
//                 const label = checkbox.nextElementSibling.textContent;
//                 selectedFields.push({
//                     id: checkbox.id,
//                     label: label
//                 });
//             });
        
//             // Create search input
//             const searchInput = document.createElement('input');
//             searchInput.type = 'text';
//             searchInput.placeholder = 'Search...';
//             searchInput.id = 'searchInput';
//             searchInput.addEventListener('input', function () {
//                 currentPage = 1;
//                 renderTable();
//             });
//             tableContainer.appendChild(searchInput);
        
//             // Create rows per page dropdown
//             const rowsPerPageSelect = document.createElement('select');
//             rowsPerPageSelect.id = 'rowsPerPage';
//             [10, 25, 50, 100].forEach(num => {
//                 const option = document.createElement('option');
//                 option.value = num;
//                 option.textContent = num;
//                 rowsPerPageSelect.appendChild(option);
//             });
//             rowsPerPageSelect.addEventListener('change', function () {
//                 currentPage = 1;
//                 renderTable();
//             });
//             tableContainer.appendChild(rowsPerPageSelect);
        
//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');
        
//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
        
//             // Add Serial Number column header
//             const snHeader = document.createElement('th');
//             snHeader.textContent = 'S.No';
//             snHeader.classList.add('fw-bolder', 'bg-warning', 'text-white');
//             headerRow.appendChild(snHeader);
        
//             // Add dynamic headers based on selected checkboxes
//             selectedFields.forEach(field => {
//                 const th = document.createElement('th');
//                 th.textContent = field.label;
//                 th.classList.add('fw-bolder', 'bg-warning', 'text-white');
//                 headerRow.appendChild(th);
//             });
        
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);
        
//             // Create table body
//             const tableBody = document.createElement('tbody');
        
//             // Define a mapping for the required headers to the corresponding data fields
//             const fieldMapping = {
//                 id: 'candidateId',
//                 'current-rank': 'c_rank',
//                 vessel: 'c_vessel',
//                 availability: 'avb_date',
//                 'reminder-date': 'r_date'
//             };
        
//             // Render all data without filtering
//             callsMade.forEach((contract, index) => {
//                 const row = document.createElement('tr');
        
//                 // Add Serial Number cell
//                 const snCell = document.createElement('td');
//                 snCell.textContent = index + 1; // Serial Number starts from 1
//                 row.appendChild(snCell);
        
//                 // Add cells based on selected checkboxes
//                 selectedFields.forEach(field => {
//                     const cell = document.createElement('td');
//                     const fieldName = fieldMapping[field.id] || field.id.replace('-', '_'); // Adjust field name for object key
//                     cell.textContent = contract[fieldName] || 'N/A';
//                     row.appendChild(cell);
//                 });
        
//                 tableBody.appendChild(row);
//             });
        
//             table.appendChild(tableBody);
        
//             // Display count of fetched data
//             const fetchedDataCount = document.createElement('p');
//             fetchedDataCount.textContent = `${callsMade.length} data fetched`;
//             tableContainer.appendChild(fetchedDataCount);
        
//             // Display the table
//             tableContainer.appendChild(table);
//         }
        
        

        

//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleCallsMadeSubmit(event) {
//     event.preventDefault();
//     try {
//         const token = localStorage.getItem('token');
//         let fromDate = document.getElementById('fromDate').value;
//         fromDate = fromDate + 'T00:00:00Z';
//         let toDate = document.getElementById('toDate').value;
//         toDate = toDate + 'T23:59:59Z';
//         console.log('from', fromDate);
//         console.log('to', toDate);

//         const user = document.getElementById('appliedBy').value;
//         const category = document.getElementById('categoryc').value;
//         const decodedToken = decodeToken(token);
//         const reports = decodedToken.reports;

//         // Fetch necessary data including nationality
//         await getReq();

//         // Send data to server using Axios
//         const response = await axios.post('https://nemo.ivistaz.co/candidate/reports/callsmade', {
//             startDate: fromDate,
//             endDate: toDate,
//             userId: user,
//             category: category
//         }, {
//             headers: {
//                 "Authorization": token
//             }
//         });

//         console.log(response.data); // Check the server response structure

//         const callsMade = response.data.callsMade;

//         // Display calls made in a table
//         const tableContainer = document.getElementById('callsMadeTable');
//         tableContainer.innerHTML = '';

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'searchInput';
//         searchInput.addEventListener('input', function () {
//             currentPage = 1;
//             renderTable();
//         });
//         tableContainer.appendChild(searchInput);

//         // Create rows per page dropdown
//         const rowsPerPageSelect = document.createElement('select');
//         rowsPerPageSelect.id = 'rowsPerPage';
//         [10, 25, 50, 100].forEach(num => {
//             const option = document.createElement('option');
//             option.value = num;
//             option.textContent = num;
//             rowsPerPageSelect.appendChild(option);
//         });
//         rowsPerPageSelect.addEventListener('change', function () {
//             currentPage = 1;
//             renderTable();
//         });
//         tableContainer.appendChild(rowsPerPageSelect);

//         // Create export button if reports is true
//         if (reports === true) {
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
//             exportButton.style = 'width:300px;';
//             exportButton.addEventListener('click', function () {
//                 exportToExcel(callsMade, 'callsMade.xlsx');
//             });
//             tableContainer.appendChild(exportButton);
//         }

//         // Pagination variables
//         let currentPage = 1;
//         let rowsPerPage = parseInt(rowsPerPageSelect.value);

//         function renderTable() {
//             // Clear previous content
//             tableContainer.innerHTML = '';

//             // Check if callsMade is empty
//             if (callsMade.length === 0) {
//                 const emptyMessage = document.createElement('p');
//                 emptyMessage.textContent = 'No data available';
//                 tableContainer.appendChild(emptyMessage);
//                 return;
//             }

//             // Gather selected fields from checkboxes
//             const selectedFields = [];
//             document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
//                 const label = checkbox.nextElementSibling.textContent;
//                 selectedFields.push({
//                     id: checkbox.id,
//                     label: label
//                 });
//             });

//             // Create search input
//             const searchInput = document.createElement('input');
//             searchInput.type = 'text';
//             searchInput.placeholder = 'Search...';
//             searchInput.id = 'searchInput';
//             searchInput.addEventListener('input', function () {
//                 currentPage = 1;
//                 renderTable();
//             });
//             tableContainer.appendChild(searchInput);

//             // Create rows per page dropdown
//             const rowsPerPageSelect = document.createElement('select');
//             rowsPerPageSelect.id = 'rowsPerPage';
//             [10, 25, 50, 100].forEach(num => {
//                 const option = document.createElement('option');
//                 option.value = num;
//                 option.textContent = num;
//                 rowsPerPageSelect.appendChild(option);
//             });
//             rowsPerPageSelect.addEventListener('change', function () {
//                 currentPage = 1;
//                 rowsPerPage = parseInt(rowsPerPageSelect.value);
//                 renderTable();
//             });
//             tableContainer.appendChild(rowsPerPageSelect);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');

//             // Add Serial Number column header
//             const snHeader = document.createElement('th');
//             snHeader.textContent = 'S.No';
//             snHeader.classList.add('fw-bolder', 'bg-warning', 'text-white');
//             headerRow.appendChild(snHeader);

//             // Add dynamic headers based on selected checkboxes
//             selectedFields.forEach(field => {
//                 const th = document.createElement('th');
//                 th.textContent = field.label;
//                 th.classList.add('fw-bolder', 'bg-warning', 'text-white');
//                 headerRow.appendChild(th);
//             });

//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');

//             // Define a mapping for the required headers to the corresponding data fields
//             const fieldMapping = {
//                 id: 'candidateId',
//                 'current-rank': 'c_rank',
//                 vessel: 'c_vessel',
//                 availability: 'avb_date',
//                 'reminder-date': 'r_date'
//             };

//             // Filter data based on search input
//             const searchTerm = searchInput.value.toLowerCase();
//             const filteredData = callsMade.filter(contract => {
//                 return selectedFields.some(field => {
//                     const fieldName = fieldMapping[field.id] || field.id.replace('-', '_');
//                     return contract[fieldName]?.toString().toLowerCase().includes(searchTerm);
//                 });
//             });

//             // Paginate data
//             const start = (currentPage - 1) * rowsPerPage;
//             const end = start + rowsPerPage;
//             const paginatedData = filteredData.slice(start, end);

//             // Render paginated data
//             paginatedData.forEach((contract, index) => {
//                 const row = document.createElement('tr');

//                 // Add Serial Number cell
//                 const snCell = document.createElement('td');
//                 snCell.textContent = start + index + 1; // Serial Number based on page
//                 row.appendChild(snCell);

//                 // Add cells based on selected checkboxes
//                 selectedFields.forEach(field => {
//                     const cell = document.createElement('td');
//                     const fieldName = fieldMapping[field.id] || field.id.replace('-', '_'); // Adjust field name for object key
//                     cell.textContent = contract[fieldName] || 'N/A';
//                     row.appendChild(cell);
//                 });

//                 tableBody.appendChild(row);
//             });

//             table.appendChild(tableBody);

//             // Display count of filtered data
//             const fetchedDataCount = document.createElement('p');
//             fetchedDataCount.textContent = `${filteredData.length} data matches`;
//             tableContainer.appendChild(fetchedDataCount);

//             // Display the table
//             tableContainer.appendChild(table);

//             // Create pagination controls
//             const paginationControls = document.createElement('div');
//             paginationControls.classList.add('pagination-controls');

//             const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//             for (let i = 1; i <= totalPages; i++) {
//                 const pageButton = document.createElement('button');
//                 pageButton.textContent = i;
//                 pageButton.classList.add('page-button');
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 pageButton.addEventListener('click', function () {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 paginationControls.appendChild(pageButton);
//             }

//             tableContainer.appendChild(paginationControls);
//         }

//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }
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
        const category = document.getElementById('categoryc').value;
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

        const callsMade = response.data.callsMade;

        // Display calls made in a table
        const tableContainer = document.getElementById('callsMadeTable');
        tableContainer.innerHTML = '';

        // Pagination variables
        let currentPage = 1;
        let rowsPerPage = parseInt(document.getElementById('rowsPerPagecm')?.value || 10);

        // Gather selected fields from checkboxes
        const selectedFields = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            const label = checkbox.nextElementSibling.textContent;
            selectedFields.push({
                id: checkbox.id,
                label: label
            });
        });

        // Create search input
        const searchInput = document.getElementById('callsmadesearch');

        // Define a mapping for the required headers to the corresponding data fields
        const fieldMapping = {
            id: 'candidateId',
            'current-rank': 'c_rank',
            vessel: 'c_vessel',
            availability: 'avb_date',
            'reminder-date': 'r_date',
            nationality: 'nationality',
            'user-name': 'userName',
            discussion: 'discussion'
        };

        // Function to filter data based on search input
        function filterData() {
            const searchTerm = searchInput.value.toLowerCase().split(' ').filter(term => term.length > 0);
            return callsMade.filter(contract => {
                return searchTerm.every(term => {
                    // Check userName field
                    if (contract.userName && contract.userName.toLowerCase().includes(term)) {
                        return true;
                    }
                    // Check other selected fields
                    return selectedFields.some(field => {
                        const fieldName = fieldMapping[field.id] || field.id.replace('-', '_');
                        return contract[fieldName]?.toString().toLowerCase().includes(term);
                    });
                });
            });
        }

        // Event listener for search input
        searchInput.addEventListener('input', function () {
            currentPage = 1;
            renderTable();
        });

        // Function to render table and pagination
        function renderTable() {
            tableContainer.innerHTML = '';

            const filteredData = filterData();

            if (filteredData.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'No data available';
                tableContainer.appendChild(emptyMessage);
                return;
            }

            const rowsPerPageSelect = document.createElement('select');
            rowsPerPageSelect.id = 'rowsPerPage';
            [10, 25, 50, 100].forEach(num => {
                const option = document.createElement('option');
                option.value = num;
                option.textContent = num;
                rowsPerPageSelect.appendChild(option);
            });
            rowsPerPageSelect.addEventListener('change', function () {
                currentPage = 1;
                rowsPerPage = parseInt(rowsPerPageSelect.value);
                renderTable();
            });
            rowsPerPageSelect.value = rowsPerPage.toString();
            tableContainer.appendChild(rowsPerPageSelect);

            const exportButton = document.createElement('button');
            exportButton.textContent = 'Export to Excel';
            exportButton.id = 'exportButton';
            exportButton.classList.add('btn', 'btn-primary', 'ms-2');
            exportButton.addEventListener('click', function () {
                exportToExcel(filteredData, 'Calls_Made_Report.xlsx');
            });
            tableContainer.appendChild(exportButton);

            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered');

            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');

            const snHeader = document.createElement('th');
            snHeader.textContent = 'S.No';
            snHeader.classList.add('fw-bolder', 'bg-warning', 'text-white');
            headerRow.appendChild(snHeader);

            // Always add userName header
            const userNameHeader = document.createElement('th');
            userNameHeader.textContent = 'User Name';
            userNameHeader.classList.add('fw-bolder', 'bg-warning', 'text-white');
            headerRow.appendChild(userNameHeader);

            selectedFields.forEach(field => {
                const th = document.createElement('th');
                th.textContent = field.label;
                th.classList.add('fw-bolder', 'bg-warning', 'text-white');
                headerRow.appendChild(th);
            });

            tableHeader.appendChild(headerRow);
            table.appendChild(tableHeader);

            const tableBody = document.createElement('tbody');

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const paginatedData = filteredData.slice(start, end);

            paginatedData.forEach((contract, index) => {
                const row = document.createElement('tr');

                const snCell = document.createElement('td');
                snCell.textContent = start + index + 1;
                row.appendChild(snCell);

                // Always add userName cell
                const userNameCell = document.createElement('td');
                userNameCell.textContent = contract.userName || 'N/A';
                row.appendChild(userNameCell);

                selectedFields.forEach(field => {
                    const cell = document.createElement('td');
                    const fieldName = fieldMapping[field.id] || field.id.replace('-', '_');
                    if (fieldName === 'nationality') {
                        cell.textContent = getNationalityName(contract[fieldName]);
                    } else {
                        cell.textContent = contract[fieldName] || 'N/A';
                    }
                    row.appendChild(cell);
                });

                tableBody.appendChild(row);
            });

            table.appendChild(tableBody);

            const fetchedDataCount = document.createElement('p');
            fetchedDataCount.textContent = `${filteredData.length} data matches`;
            tableContainer.appendChild(fetchedDataCount);

            tableContainer.appendChild(table);

            const paginationControls = document.createElement('nav');
            paginationControls.setAttribute('aria-label', 'Page navigation');
            const ul = document.createElement('ul');
            ul.classList.add('pagination');

            const totalPages = Math.ceil(filteredData.length / rowsPerPage);

            const maxVisiblePages = 5;
            let startPage = currentPage - Math.floor(maxVisiblePages / 2);
            startPage = Math.max(startPage, 1);
            let endPage = startPage + maxVisiblePages - 1;
            endPage = Math.min(endPage, totalPages);

            if (startPage > 1) {
                const firstPageLi = document.createElement('li');
                firstPageLi.classList.add('page-item');
                const firstPageButton = document.createElement('button');
                firstPageButton.classList.add('page-link');
                firstPageButton.textContent = '1';
                firstPageButton.addEventListener('click', function () {
                    currentPage = 1;
                    renderTable();
                });
                firstPageLi.appendChild(firstPageButton);
                ul.appendChild(firstPageLi);

                if (startPage > 2) {
                    const ellipsisLi = document.createElement('li');
                    ellipsisLi.classList.add('page-item');
                    const ellipsisSpan = document.createElement('span');
                    ellipsisSpan.classList.add('page-link');
                    ellipsisSpan.textContent = '...';
                    ellipsisLi.appendChild(ellipsisSpan);
                    ul.appendChild(ellipsisLi);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                const li = document.createElement('li');
                li.classList.add('page-item');
                const pageButton = document.createElement('button');
                pageButton.classList.add('page-link');
                pageButton.textContent = i;
                if (i === currentPage) {
                    li.classList.add('active');
                }
                pageButton.addEventListener('click', function () {
                    currentPage = i;
                    renderTable();
                });
                li.appendChild(pageButton);
                ul.appendChild(li);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const ellipsisLi = document.createElement('li');
                    ellipsisLi.classList.add('page-item');
                    const ellipsisSpan = document.createElement('span');
                    ellipsisSpan.classList.add('page-link');
                    ellipsisSpan.textContent = '...';
                    ellipsisLi.appendChild(ellipsisSpan);
                    ul.appendChild(ellipsisLi);
                }

                const lastPageLi = document.createElement('li');
                lastPageLi.classList.add('page-item');
                const lastPageButton = document.createElement('button');
                lastPageButton.classList.add('page-link');
                lastPageButton.textContent = totalPages;
                lastPageButton.addEventListener('click', function () {
                    currentPage = totalPages;
                    renderTable();
                });
                lastPageLi.appendChild(lastPageButton);
                ul.appendChild(lastPageLi);
            }

            paginationControls.appendChild(ul);
            tableContainer.appendChild(paginationControls);
        }

        renderTable();

    } catch (error) {
        console.error(error);
    }
}




// Helper function to export data to Excel
function exportToExcel(data, filename) {
    const worksheet = XLSX.utils.json_to_sheet(data.map((call, index) => {
        const candidateData = { 'S.No': index + 1, ...call };
        return candidateData;
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Calls Made');
    XLSX.writeFile(workbook, filename);
}

document.getElementById('callsMadeForm').addEventListener('submit', handleCallsMadeSubmit);

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
// function exportToExcel(table, fileName) {
//     const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
//     XLSX.writeFile(wb, fileName);
// }

// Add event listener to the "Generate Calls Made Report" button

// Add event listener to the New Profile form
document.getElementById('newprofilesubmit').addEventListener('submit', handleNewProfileSubmit);


// Function to handle form submission for fetching discussions
// Function to handle form submission for fetching discussions
// async function handleDiscussionSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const status = document.getElementById('status').value;
//         let startDate = document.getElementById('startDates').value;
//         let endDate = document.getElementById('endDates').value;
//         const category = document.getElementById('categoryp').value;
//         const companyName = document.getElementById('user_client').value;

//         // Format dates to include time
//         startDate = startDate + 'T00:00:00Z';
//         endDate = endDate + 'T23:59:59Z';

//         // Send data to server using Axios with the GET method and query parameters
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/proposals', {
//             params: {
//                 status: status,
//                 startDate: startDate,
//                 endDate: endDate,
//                 category: category,
//                 companyName: companyName
//             }
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         let candidates = response.data.candidates;

//         // Clear existing results
//         const discussionResults = document.getElementById('discussionResults');
//         discussionResults.innerHTML = '';

//         if (candidates.length === 0) {
//             const message = document.createElement('p');
//             message.textContent = 'No data available';
//             discussionResults.appendChild(message);
//             return;
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'searchInput';
//         discussionResults.appendChild(searchInput);

//         // Create table container
//         const tableContainer = document.createElement('div');
//         tableContainer.id = 'tableContainer';
//         discussionResults.appendChild(tableContainer);

//         // Pagination variables
//         let currentPage = 1;
//         const rowsPerPage = 10; // Number of rows per page
//         let totalPages = Math.ceil(candidates.length / rowsPerPage);
//         const maxVisiblePages = 5; // Maximum number of page buttons to display

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//         });

//         // Function to render table with pagination and search
//         function renderTable() {
//             // Clear existing table content (excluding search input)
//             tableContainer.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             const filteredCandidates = candidates.filter(candidate => {
//                 return Object.values(candidate).some(value =>
//                     value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Update total pages based on filtered candidates
//             totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

//             // Paginate data
//             const startIndex = (currentPage - 1) * rowsPerPage;
//             const endIndex = startIndex + rowsPerPage;
//             const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             const headers = ['S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 'Vessel', 'Category', 'Nationality', 'Join Date', 'Company Name', 'Posted By'];
//             headers.forEach(headerText => {
//                 const header = document.createElement('th');
//                 header.textContent = headerText;
//                 header.scope = 'col';
//                 header.classList.add('text-center');
//                 headerRow.appendChild(header);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             paginatedCandidates.forEach((candidate, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     startIndex + index + 1, // Serial Number (S.No)
//                     candidate.candidateId,
//                     candidate.fname,
//                     candidate.lname,
//                     candidate.c_rank,
//                     candidate.c_vessel,
//                     candidate.category,
//                     candidate.nationality,
//                     candidate.join_date,
//                     candidate.company_name,
//                     candidate.userName
//                 ];
//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field || 'N/A'; // Handle cases where field is null or undefined
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });
//                 tableBody.appendChild(row);
//             });
//             table.appendChild(tableBody);

//             // Append table to tableContainer
//             tableContainer.appendChild(table);

//             // Display "X data fetched" message
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${response.data.candidates.length} data fetched`;
//             tableContainer.appendChild(fetchedDataMessage);

//             // Display "X data match search" message
//             const matchedDataMessage = document.createElement('p');
//             matchedDataMessage.textContent = `${filteredCandidates.length} data match search`;
//             tableContainer.appendChild(matchedDataMessage);

//             // Create pagination controls
//             const paginationContainer = document.createElement('div');
//             paginationContainer.classList.add('pagination', 'justify-content-center');

//             // Previous button
//             const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
//                 currentPage--;
//                 renderTable();
//             });
//             paginationContainer.appendChild(prevButton);

//             // Page buttons
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage < maxVisiblePages - 1) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = createPaginationButton(i.toString(), true, () => {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 paginationContainer.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(lastEllipsis);
//             }

//             // Next button
//             const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
//                 currentPage++;
//                 renderTable();
//             });
//             paginationContainer.appendChild(nextButton);

//             // Append pagination controls to tableContainer
//             tableContainer.appendChild(paginationContainer);
//         }

//         // Helper function to create pagination button
//         function createPaginationButton(text, isEnabled, onClick) {
//             const button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-primary', 'mx-1');
//             button.textContent = text;
//             button.addEventListener('click', onClick);
//             button.disabled = !isEnabled;
//             return button;
//         }

//         // Initial render of table
//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }
async function handleDiscussionSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const status = document.getElementById('status').value;
        let startDate = document.getElementById('startDates').value;
        let endDate = document.getElementById('endDates').value;
        const category = document.getElementById('categoryp').value;
        const companyName = document.getElementById('user_client').value;

        // Format dates to include time
        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';

        // Send data to server using Axios with the GET method and query parameters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/proposals', {
            params: {
                status: status,
                startDate: startDate,
                endDate: endDate,
                category: category,
                companyName: companyName
            }
        });

        console.log(response.data); // Assuming the server sends back some data
        let candidates = response.data.candidates;

        // Clear existing results
        const discussionResults = document.getElementById('discussionResults');
        discussionResults.innerHTML = '';

        if (candidates.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No data available';
            discussionResults.appendChild(message);
            return;
        }

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.classList.add('form-control', 'my-3');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'searchInput';
        discussionResults.appendChild(searchInput);

        // Create export button
        const exportButton = document.createElement('button');
        exportButton.classList.add('btn', 'btn-primary', 'my-3');
        exportButton.textContent = 'Export to Excel';
        exportButton.addEventListener('click', () => exportToExcel(filteredCandidates));
        discussionResults.appendChild(exportButton);

        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'tableContainer';
        discussionResults.appendChild(tableContainer);

        // Pagination variables
        let currentPage = 1;
        const rowsPerPage = 10; // Number of rows per page
        let totalPages = Math.ceil(candidates.length / rowsPerPage);
        const maxVisiblePages = 5; // Maximum number of page buttons to display

        let filteredCandidates = candidates;

        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });

        // Function to render table with pagination and search
        function renderTable() {
            // Clear existing table content (excluding search input and export button)
            tableContainer.innerHTML = '';

            // Apply search filter
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredCandidates = candidates.filter(candidate => {
                return Object.values(candidate).some(value =>
                    value.toString().toLowerCase().includes(searchTerm)
                );
            });

            // Update total pages based on filtered candidates
            totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

            // Paginate data
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

            // Create table element
            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered');

            // Create table header
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = ['S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 'Vessel', 'Category', 'Nationality', 'Join Date', 'Company Name', 'Posted By'];
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
            paginatedCandidates.forEach((candidate, index) => {
                const row = document.createElement('tr');
                const fields = [
                    startIndex + index + 1, // Serial Number (S.No)
                    candidate.candidateId,
                    candidate.fname,
                    candidate.lname,
                    candidate.c_rank,
                    candidate.c_vessel,
                    candidate.category,
                    getNationalityName(candidate.nationality),
                    candidate.join_date,
                    candidate.company_name,
                    candidate.userName
                ];
                fields.forEach(field => {
                    const cell = document.createElement('td');
                    cell.textContent = field || 'N/A'; // Handle cases where field is null or undefined
                    cell.classList.add('text-center');
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);

            // Append table to tableContainer
            tableContainer.appendChild(table);

            // Display "X data fetched" message
            const fetchedDataMessage = document.createElement('p');
            fetchedDataMessage.textContent = `${response.data.candidates.length} data fetched`;
            tableContainer.appendChild(fetchedDataMessage);

            // Display "X data match search" message
            const matchedDataMessage = document.createElement('p');
            matchedDataMessage.textContent = `${filteredCandidates.length} data match search`;
            tableContainer.appendChild(matchedDataMessage);

            // Create pagination controls
            const paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination', 'justify-content-center');

            // Previous button
            const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
                currentPage--;
                renderTable();
            });
            paginationContainer.appendChild(prevButton);

            // Page buttons
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                const firstEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(firstEllipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageButton = createPaginationButton(i.toString(), true, () => {
                    currentPage = i;
                    renderTable();
                });
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                paginationContainer.appendChild(pageButton);
            }

            if (endPage < totalPages) {
                const lastEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(lastEllipsis);
            }

            // Next button
            const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
                currentPage++;
                renderTable();
            });
            paginationContainer.appendChild(nextButton);

            // Append pagination controls to tableContainer
            tableContainer.appendChild(paginationContainer);
        }

        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'mx-1');
            button.textContent = text;
            button.addEventListener('click', onClick);
            button.disabled = !isEnabled;
            return button;
        }

        // Function to export table data to Excel
        function exportToExcel(data) {
            const worksheet = XLSX.utils.json_to_sheet(data.map((candidate, index) => ({
                'S.No': index + 1,
                'Candidate ID': candidate.candidateId,
                'First Name': candidate.fname,
                'Last Name': candidate.lname,
                'Rank': candidate.c_rank,
                'Vessel': candidate.c_vessel,
                'Category': candidate.category,
                'Nationality': getNationalityName(candidate.nationality),
                'Join Date': candidate.join_date,
                'Company Name': candidate.company_name,
                'Posted By': candidate.userName
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Candidates');

            XLSX.writeFile(workbook, 'proposals.xlsx');
        }

        // Initial render of table
        renderTable();

    } catch (error) {
        console.error(error);
    }
}







async function fetchAndDisplayVessels() {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vsls", { headers: { "Authorization": token } });
        // console.log(serverResponse);
        const vessels = serverResponse.data.vessels;

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
// async function handleSignOnSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const startDate = document.getElementById('startDatec').value + 'T00:00:00Z';
//         const endDate = document.getElementById('endDatec').value + 'T23:59:59Z';
//         const companyName = document.getElementById('user_client1').value;
//         const vessel_type = document.getElementById('candidate_c_vessel').value;
//         const category = document.getElementById('categoryso').value;

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vessel_type: vessel_type,
//             companyname: companyName,
//             category: category
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Clear existing table body, if any
//         const tableBody = document.getElementById('signOnTableBody');
//         tableBody.innerHTML = '';

//         // Append values to table body
//         contracts.forEach((contract, index) => {
//             const row = document.createElement('tr');
            
//             // Create table cells for each field
//             const fields = [
//                 index + 1,
//                 contract.candidateId,
//                 contract.rank,
//                 contract.vesselType,
//                 contract.sign_on,
//                 contract.sign_off,
//                 contract.eoc,
//                 contract.emigrate_number,
//                 contract.aoa_number,
//                 contract.currency,
//                 contract.wages,
//                 contract.wages_types,
//                 contract.reason_for_sign_off,
//                 contract.fname + ' ' +contract.lname,
//                 contract.nationality,
//                 contract.vesselName,
//                 contract.imoNumber,
//                 contract.vesselFlag,
//                 contract.category,
//                 contract.company_name
//             ];

//             fields.forEach(field => {
//                 const cell = document.createElement('td');
//                 cell.textContent = field || ''; // Display empty string if field is undefined or null
//                 cell.classList.add('text-center');
//                 row.appendChild(cell);
//             });

//             tableBody.appendChild(row);
//         });

//         // Check if reports is true
//         const token = localStorage.getItem('token');
//         const decodedToken = decodeToken(token);
//         const reports = decodedToken.reports;

//         if (reports === true) {
//             // Create "Export to Excel" button
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
//             exportButton.addEventListener('click', () => {
//                 exportToExcel(tableBody, 'signOnData.xlsx');
//             });
//             // Append export button after the table
//             const tableContainer = document.getElementById('signOnContent');
//             tableContainer.appendChild(exportButton);
//         }

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleSignOnSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const startDate = document.getElementById('startDatec').value + 'T00:00:00Z';
//         const endDate = document.getElementById('endDatec').value + 'T23:59:59Z';
//         const companyName = document.getElementById('user_client1').value;
//         const vessel_type = document.getElementById('candidate_c_vessel').value;
//         const category = document.getElementById('categoryso').value;

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vessel_type: vessel_type,
//             companyname: companyName,
//             category: category
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Clear existing table body, if any
//         const tableBody = document.getElementById('signOnTableBody');
//         tableBody.innerHTML = '';

//         // Append values to table body
//         contracts.forEach((contract, index) => {
//             const row = document.createElement('tr');
            
//             // Create table cells for each field
//             const fields = [
//                 index + 1,
//                 contract.candidateId,
//                 contract.rank,
//                 contract.vesselType,
//                 contract.sign_on,
//                 contract.sign_off,
//                 contract.eoc,
//                 contract.emigrate_number,
//                 contract.aoa_number,
//                 contract.currency,
//                 contract.wages,
//                 contract.wages_types,
//                 contract.reason_for_sign_off,
//                 contract.fname,
//                 contract.lname,
//                 contract.nationality,
//                 contract.vesselName,
//                 contract.imoNumber,
//                 contract.vesselFlag,
//                 contract.category,
//                 contract.company_name,
//                 contract.bank_pan_num || '', // Display empty string if bank_pan_num is null or undefined
//                 contract.indos_number || '', // Display empty string if indos_number is null or undefined
//                 contract.indian_cdc_document_number || '', // Display empty string if indian_cdc_document_number is null or undefined
//                 contract.passport_document_number || '', // Display empty string if passport_document_number is null or undefined
//                                 contract.userName || '' // Display empty string if userName is null or undefined

//             ];

//             fields.forEach(field => {
//                 const cell = document.createElement('td');
//                 cell.textContent = field;
//                 cell.classList.add('text-center');
//                 row.appendChild(cell);
//             });

//             tableBody.appendChild(row);
//         });

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleSignOnSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const startDate = document.getElementById('startDatec').value + 'T00:00:00Z';
//         const endDate = document.getElementById('endDatec').value + 'T23:59:59Z';
//         const companyName = document.getElementById('user_client1').value;
//         const vessel_type = document.getElementById('candidate_c_vessel').value;
//         const category = document.getElementById('categoryso').value;

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vessel_type: vessel_type,
//             companyname: companyName,
//             category: category
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Pagination variables
//         let currentPage = 1; // Current page number, starting from 1
//         let itemsPerPage = 10; // Default number of items to display per page
//         let totalItems = contracts.length;
//         let totalPages = Math.ceil(totalItems / itemsPerPage);

//         // Function to display contracts for the current page
//         function displayContracts(page) {
//             const startIndex = (page - 1) * itemsPerPage;
//             const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
//             const displayedContracts = contracts.slice(startIndex, endIndex);

//             // Clear existing table body
//             const tableBody = document.getElementById('signOnTableBody');
//             tableBody.innerHTML = '';

//             // Append values to table body
//             displayedContracts.forEach((contract, index) => {
//                 const sno = startIndex + index + 1; // Calculate serial number
//                 const row = document.createElement('tr');
//                 const fields = [
//                     sno,
//                     contract.candidateId,
//                     contract.rank,
//                     contract.vesselType,
//                     contract.sign_on,
//                     contract.sign_off,
//                     contract.eoc,
//                     contract.emigrate_number,
//                     contract.aoa_number,
//                     contract.currency,
//                     contract.wages,
//                     contract.wages_types,
//                     contract.reason_for_sign_off,
//                     contract.fname,
//                     contract.lname,
//                     contract.nationality,
//                     contract.vesselName,
//                     contract.imoNumber,
//                     contract.vesselFlag,
//                     contract.category,
//                     contract.company_name,
//                     contract.bank_pan_num || '', // Display empty string if bank_pan_num is null or undefined
//                     contract.indos_number || '', // Display empty string if indos_number is null or undefined
//                     contract.indian_cdc_document_number || '', // Display empty string if indian_cdc_document_number is null or undefined
//                     contract.passport_document_number || '', // Display empty string if passport_document_number is null or undefined
//                     contract.userName || '' // Display empty string if userName is null or undefined
//                 ];

//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });

//                 tableBody.appendChild(row);
//             });
//         }

//         // Function to update pagination controls
//         function updatePaginationControls() {
//             const paginationControls = document.getElementById('paginationControlssignon');
//             paginationControls.innerHTML = '';

//             // Previous button
//             const prevButton = document.createElement('button');
//             prevButton.textContent = 'Previous';
//             prevButton.addEventListener('click', () => {
//                 if (currentPage > 1) {
//                     currentPage--;
//                     displayContracts(currentPage);
//                     updatePaginationControls();
//                 }
//             });
//             paginationControls.appendChild(prevButton);

//             // Page numbers and ellipsis
//             const maxVisiblePages = 5; // Maximum number of visible page numbers
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage + 1 < maxVisiblePages) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = document.createElement('button');
//                 firstEllipsis.textContent = '...';
//                 firstEllipsis.disabled = true;
//                 paginationControls.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = document.createElement('button');
//                 pageButton.textContent = i;
//                 if (i === currentPage) {
//                     pageButton.disabled = true;
//                 }
//                 pageButton.addEventListener('click', () => {
//                     currentPage = i;
//                     displayContracts(currentPage);
//                     updatePaginationControls();
//                 });
//                 paginationControls.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = document.createElement('button');
//                 lastEllipsis.textContent = '...';
//                 lastEllipsis.disabled = true;
//                 paginationControls.appendChild(lastEllipsis);
//             }

//             // Last page button
//             if (totalPages > 1) {
//                 const lastPageButton = document.createElement('button');
//                 lastPageButton.textContent = totalPages;
//                 lastPageButton.addEventListener('click', () => {
//                     currentPage = totalPages;
//                     displayContracts(currentPage);
//                     updatePaginationControls();
//                 });
//                 paginationControls.appendChild(lastPageButton);
//             }

//             // Next button
//             const nextButton = document.createElement('button');
//             nextButton.textContent = 'Next';
//             nextButton.addEventListener('click', () => {
//                 if (currentPage < totalPages) {
//                     currentPage++;
//                     displayContracts(currentPage);
//                     updatePaginationControls();
//                 }
//             });
//             paginationControls.appendChild(nextButton);
//         }

//         // Function to filter contracts based on search input
//         function filterContracts(searchTerm) {
//             searchTerm = searchTerm.toLowerCase().trim();
//             filteredContracts = contracts.filter(contract => {
//                 // Customize this to match your specific search criteria
//                 return (
//                     contract.candidateId.toLowerCase().includes(searchTerm) ||
//                     contract.rank.toLowerCase().includes(searchTerm) ||
//                     contract.vesselType.toLowerCase().includes(searchTerm) ||
//                     contract.sign_on.toLowerCase().includes(searchTerm) ||
//                     contract.sign_off.toLowerCase().includes(searchTerm) ||
//                     contract.eoc.toLowerCase().includes(searchTerm) ||
//                     contract.emigrate_number.toLowerCase().includes(searchTerm) ||
//                     contract.aoa_number.toLowerCase().includes(searchTerm) ||
//                     contract.currency.toLowerCase().includes(searchTerm) ||
//                     contract.wages.toLowerCase().includes(searchTerm) ||
//                     contract.wages_types.toLowerCase().includes(searchTerm) ||
//                     contract.reason_for_sign_off.toLowerCase().includes(searchTerm) ||
//                     contract.fname.toLowerCase().includes(searchTerm) ||
//                     contract.lname.toLowerCase().includes(searchTerm) ||
//                     contract.nationality.toLowerCase().includes(searchTerm) ||
//                     contract.vesselName.toLowerCase().includes(searchTerm) ||
//                     contract.imoNumber.toLowerCase().includes(searchTerm) ||
//                     contract.vesselFlag.toLowerCase().includes(searchTerm) ||
//                     contract.category.toLowerCase().includes(searchTerm) ||
//                     contract.company_name.toLowerCase().includes(searchTerm) ||
//                     (contract.bank_pan_num && contract.bank_pan_num.toLowerCase().includes(searchTerm)) ||
//                     (contract.indos_number && contract.indos_number.toLowerCase().includes(searchTerm)) ||
//                     (contract.indian_cdc_document_number && contract.indian_cdc_document_number.toLowerCase().includes(searchTerm)) ||
//                     (contract.passport_document_number && contract.passport_document_number.toLowerCase().includes(searchTerm)) ||
//                     (contract.userName && contract.userName.toLowerCase().includes(searchTerm))
//                 );
//             });

//             totalItems = filteredContracts.length;
//             totalPages = Math.ceil(totalItems / itemsPerPage);
//             currentPage = 1;
//             displayContracts(currentPage);
//             updatePaginationControls();
//         }

//         // Search input handling
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'signOnSearchInput';
//         searchInput.addEventListener('input', (event) => {
//             const searchTerm = event.target.value;
//             filterContracts(searchTerm);
//         });

//         // Add search input and pagination controls to the DOM
//         const searchContainer = document.getElementById('signOnSearchContainer');
//         searchContainer.innerHTML = ''; // Clear previous content
//         searchContainer.appendChild(searchInput);

//         const paginationContainer = document.getElementById('paginationContainersignon');
//         paginationContainer.innerHTML = ''; // Clear previous content
//         const itemsPerPageDropdown = createItemsPerPageDropdown();
//         paginationContainer.appendChild(itemsPerPageDropdown);
//         paginationContainer.appendChild(document.createElement('br')); // Line break for spacing
//         const paginationControls = document.createElement('div');
//         paginationControls.id = 'paginationControlssignon';
//         paginationContainer.appendChild(paginationControls);

//         // Initial display of contracts on page load
//         displayContracts(currentPage);

//         // Initial update of pagination controls
//         updatePaginationControls();

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleSignOnSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const startDate = document.getElementById('startDatec').value + 'T00:00:00Z';
//         const endDate = document.getElementById('endDatec').value + 'T23:59:59Z';
//         const companyName = document.getElementById('user_client1').value;
//         const vessel_type = document.getElementById('candidate_c_vessel').value;
//         const category = document.getElementById('categoryso').value;

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vessel_type: vessel_type,
//             companyname: companyName,
//             category: category
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         let contracts = response.data.contracts;

//         // Clear existing results
//         const signOnResults = document.getElementById('signOnSearchContainer');
//         signOnResults.innerHTML = '';

//         if (contracts.length === 0) {
//             const message = document.createElement('p');
//             message.textContent = 'No data available';
//             signOnResults.appendChild(message);
//             return;
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'signOnSearchInput';
//         signOnResults.appendChild(searchInput);

//         // Create export button
//         const exportButton = document.createElement('button');
//         exportButton.classList.add('btn', 'btn-primary', 'my-3');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', () => exportToExcel(filteredContracts));
//         signOnResults.appendChild(exportButton);

//         // Create table container
//         const tableContainer = document.createElement('div');
//         tableContainer.id = 'signOnTableContainer';
//         signOnResults.appendChild(tableContainer);

//         // Pagination variables
//         let currentPage = 1;
//         const itemsPerPage = 10; // Number of items per page
//         let totalItems = contracts.length;
//         let totalPages = Math.ceil(totalItems / itemsPerPage);
//         const maxVisiblePages = 5; // Maximum number of page buttons to display

//         let filteredContracts = contracts;

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//         });

//         // Function to render table with pagination and search
//         function renderTable() {
//             // Clear existing table content (excluding search input and export button)
//             tableContainer.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             filteredContracts = contracts.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Update total pages based on filtered contracts
//             totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

//             // Paginate data
//             const startIndex = (currentPage - 1) * itemsPerPage;
//             const endIndex = startIndex + itemsPerPage;
//             const displayedContracts = filteredContracts.slice(startIndex, endIndex);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             const headers = [
//                 'S.No', 'Candidate ID', 'Rank', 'Vessel Type', 'Sign On', 'Sign Off', 
//                 'EOC', 'Emigrate Number', 'AOA Number', 'Currency', 'Wages', 
//                 'Wages Types', 'Reason for Sign Off', 'First Name', 'Last Name', 
//                 'Nationality', 'Vessel Name', 'IMO Number', 'Vessel Flag', 
//                 'Category', 'Company Name', 'Bank PAN Number', 'INDOS Number', 
//                 'Indian CDC Document Number', 'Passport Document Number', 'User Name'
//             ];
//             headers.forEach(headerText => {
//                 const header = document.createElement('th');
//                 header.textContent = headerText;
//                 header.scope = 'col';
//                 header.classList.add('text-center');
//                 headerRow.appendChild(header);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             displayedContracts.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     startIndex + index + 1, // Serial Number (S.No)
//                     contract.candidateId,
//                     contract.rank,
//                     contract.vesselType,
//                     contract.sign_on,
//                     contract.sign_off,
//                     contract.eoc,
//                     contract.emigrate_number,
//                     contract.aoa_number,
//                     contract.currency,
//                     contract.wages,
//                     contract.wages_types,
//                     contract.reason_for_sign_off,
//                     contract.fname,
//                     contract.lname,
//                     getNationalityName(contract.nationality),
//                     contract.vesselName,
//                     contract.imoNumber,
//                     contract.vesselFlag,
//                     contract.category,
//                     contract.company_name,
//                     contract.bank_pan_num || 'N/A', // Display 'N/A' if field is null or undefined
//                     contract.indos_number || 'N/A',
//                     contract.indian_cdc_document_number || 'N/A',
//                     contract.passport_document_number || 'N/A',
//                     contract.userName || 'N/A'
//                 ];
//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });
//                 tableBody.appendChild(row);
//             });
//             table.appendChild(tableBody);

//             // Append table to tableContainer
//             tableContainer.appendChild(table);

//             // Display total number of contracts fetched
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${totalItems} data fetched`;
//             tableContainer.appendChild(fetchedDataMessage);

//             // Display number of contracts matching search criteria
//             const matchedDataMessage = document.createElement('p');
//             matchedDataMessage.textContent = `${filteredContracts.length} data match search`;
//             tableContainer.appendChild(matchedDataMessage);

//             // Create pagination controls
//             const paginationContainer = document.createElement('div');
//             paginationContainer.classList.add('pagination', 'justify-content-center');

//             // Previous button
//             const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
//                 currentPage--;
//                 renderTable();
//             });
//             paginationContainer.appendChild(prevButton);

//             // Page buttons
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage < maxVisiblePages - 1) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = createPaginationButton(i.toString(), true, () => {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 paginationContainer.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(lastEllipsis);
//             }

//             // Next button
//             const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
//                 currentPage++;
//                 renderTable();
//             });
//             paginationContainer.appendChild(nextButton);

//             // Append pagination controls to tableContainer
//             tableContainer.appendChild(paginationContainer);
//         }

//         // Helper function to create pagination button
//         function createPaginationButton(text, isEnabled, onClick) {
//             const button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-primary', 'mx-1');
//             button.textContent = text;
//             button.addEventListener('click', onClick);
//             button.disabled = !isEnabled;
//             return button;
//         }

//         // Function to export table data to Excel
//         function exportToExcel(data) {
//             const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
//                 'S.No': index + 1,
//                 'Candidate ID': contract.candidateId,
//                 'Rank': contract.rank,
//                 'Vessel Type': contract.vesselType,
//                 'Sign On': contract.sign_on,
//                 'Sign Off': contract.sign_off,
//                 'EOC': contract.eoc,
//                 'Emigrate Number': contract.emigrate_number,
//                 'AOA Number': contract.aoa_number,
//                 'Currency': contract.currency,
//                 'Wages': contract.wages,
//                 'Wages Types': contract.wages_types,
//                 'Reason for Sign Off': contract.reason_for_sign_off,
//                 'First Name': contract.fname,
//                 'Last Name': contract.lname,
//                 'Nationality': getNationalityName(contract.nationality),
//                 'Vessel Name': contract.vesselName,
//                 'IMO Number': contract.imoNumber,
//                 'Vessel Flag': contract.vesselFlag,
//                 'Category': contract.category,
//                 'Company Name': contract.company_name,
//                 'Bank PAN Number': contract.bank_pan_num || 'N/A',
//                 'INDOS Number': contract.indos_number || 'N/A',
//                 'Indian CDC Document Number': contract.indian_cdc_document_number || 'N/A',
//                 'Passport Document Number': contract.passport_document_number || 'N/A',
//                 'User Name': contract.userName || 'N/A'
//             })));

//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Sign On Contracts');

//             XLSX.writeFile(workbook, 'sign_on_contracts.xlsx');
//         }

//         // Initial render of table
//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }

async function handleSignOnSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const startDate = document.getElementById('startDatec').value + 'T00:00:00Z';
        const endDate = document.getElementById('endDatec').value + 'T23:59:59Z';
        const companyName = document.getElementById('user_client1').value;
        const vessel_type = document.getElementById('candidate_c_vessel').value;
        const category = document.getElementById('categoryso').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
            vessel_type: vessel_type,
            companyname: companyName,
            category: category
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-on', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        let contracts = response.data.contracts;

        // Clear existing results
        const signOnResults = document.getElementById('signOnSearchContainer');
        signOnResults.innerHTML = '';

        if (contracts.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No data available';
            signOnResults.appendChild(message);
            return;
        }

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.classList.add('form-control', 'my-3');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'signOnSearchInput';
        signOnResults.appendChild(searchInput);

        // Create export button
        const exportButton = document.createElement('button');
        exportButton.classList.add('btn', 'btn-primary', 'my-3');
        exportButton.textContent = 'Export to Excel';
        exportButton.addEventListener('click', () => exportToExcel(filteredContracts));
        signOnResults.appendChild(exportButton);

        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'signOnTableContainer';
        signOnResults.appendChild(tableContainer);

        // Pagination variables
        let currentPage = 1;
        const itemsPerPage = 10; // Number of items per page
        let totalItems = contracts.length;
        let totalPages = Math.ceil(totalItems / itemsPerPage);
        const maxVisiblePages = 5; // Maximum number of page buttons to display

        let filteredContracts = contracts;

        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });

        // Function to render table with pagination and search
        function renderTable() {
            // Clear existing table content (excluding search input and export button)
            tableContainer.innerHTML = '';

            // Apply search filter
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredContracts = contracts.filter(contract => {
                return Object.values(contract).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm)
                );
            });

            // Update total pages based on filtered contracts
            totalPages = Math.ceil(filteredContracts.length / itemsPerPage);

            // Paginate data
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const displayedContracts = filteredContracts.slice(startIndex, endIndex);

            // Create table element
            const table = document.createElement('table');
            table.classList.add('table', 'table-bordered');

            // Create table header
            const tableHeader = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headers = [
                'S.No', 'Candidate ID', 'Rank', 'Vessel Type', 'Sign On', 'Sign Off', 
                'EOC', 'Emigrate Number', 'AOA Number', 'Currency', 'Wages', 
                'Wages Types', 'Reason for Sign Off', 'First Name', 'Last Name', 
                'Nationality', 'Vessel Name', 'IMO Number', 'Vessel Flag', 
                'Category', 'Company Name', 'Bank PAN Number', 'INDOS Number', 
                'Indian CDC Document Number', 'Passport Document Number', 'User Name'
            ];
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
            displayedContracts.forEach((contract, index) => {
                const row = document.createElement('tr');
                const fields = [
                    startIndex + index + 1, // Serial Number (S.No)
                    `<a href="javascript:void(0);" onclick="viewCandidate('${contract.candidateId}')">${contract.candidateId}</a>`,
                    contract.rank,
                    contract.vesselType,
                    contract.sign_on,
                    contract.sign_off,
                    contract.eoc,
                    contract.emigrate_number,
                    contract.aoa_number,
                    contract.currency,
                    contract.wages,
                    contract.wages_types,
                    contract.reason_for_sign_off,
                    contract.fname,
                    contract.lname,
                    getNationalityName(contract.nationality),
                    contract.vesselName,
                    contract.imoNumber,
                    contract.vesselFlag,
                    contract.category,
                    contract.company_name,
                    contract.bank_pan_num || 'N/A', // Display 'N/A' if field is null or undefined
                    contract.indos_number || 'N/A',
                    contract.indian_cdc_document_number || 'N/A',
                    contract.passport_document_number || 'N/A',
                    contract.userName || 'N/A'
                ];
                fields.forEach(field => {
                    const cell = document.createElement('td');
                    cell.innerHTML = field; // Use innerHTML to allow HTML content
                    cell.classList.add('text-center');
                    row.appendChild(cell);
                });
                tableBody.appendChild(row);
            });
            table.appendChild(tableBody);

            // Append table to tableContainer
            tableContainer.appendChild(table);

            // Display total number of contracts fetched
            const fetchedDataMessage = document.createElement('p');
            fetchedDataMessage.textContent = `${totalItems} data fetched`;
            tableContainer.appendChild(fetchedDataMessage);

            // Display number of contracts matching search criteria
            const matchedDataMessage = document.createElement('p');
            matchedDataMessage.textContent = `${filteredContracts.length} data match search`;
            tableContainer.appendChild(matchedDataMessage);

            // Create pagination controls
            const paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination', 'justify-content-center');

            // Previous button
            const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
                currentPage--;
                renderTable();
            });
            paginationContainer.appendChild(prevButton);

            // Page buttons
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                const firstEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(firstEllipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageButton = createPaginationButton(i.toString(), true, () => {
                    currentPage = i;
                    renderTable();
                });
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                paginationContainer.appendChild(pageButton);
            }

            if (endPage < totalPages) {
                const lastEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(lastEllipsis);
            }

            // Next button
            const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
                currentPage++;
                renderTable();
            });
            paginationContainer.appendChild(nextButton);

            // Append pagination controls to tableContainer
            tableContainer.appendChild(paginationContainer);
        }

        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'mx-1');
            button.textContent = text;
            button.addEventListener('click', onClick);
            button.disabled = !isEnabled;
            return button;
        }

        // Function to export table data to Excel
        function exportToExcel(data) {
            const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
                'S.No': index + 1,
                'Candidate ID': contract.candidateId,
                'Rank': contract.rank,
                'Vessel Type': contract.vesselType,
                'Sign On': contract.sign_on,
                'Sign Off': contract.sign_off,
                'EOC': contract.eoc,
                'Emigrate Number': contract.emigrate_number,
                'AOA Number': contract.aoa_number,
                'Currency': contract.currency,
                'Wages': contract.wages,
                'Wages Types': contract.wages_types,
                'Reason for Sign Off': contract.reason_for_sign_off,
                'First Name': contract.fname,
                'Last Name': contract.lname,
                'Nationality': getNationalityName(contract.nationality),
                'Vessel Name': contract.vesselName,
                'IMO Number': contract.imoNumber,
                'Vessel Flag': contract.vesselFlag,
                'Category': contract.category,
                'Company Name': contract.company_name,
                'Bank PAN Number': contract.bank_pan_num || 'N/A',
                'INDOS Number': contract.indos_number || 'N/A',
                'Indian CDC Document Number': contract.indian_cdc_document_number || 'N/A',
                'Passport Document Number': contract.passport_document_number || 'N/A',
                'User Name': contract.userName || 'N/A'
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sign On Contracts');

            XLSX.writeFile(workbook, 'sign_on_contracts.xlsx');
        }

        // Initial render of table
        renderTable();

    } catch (error) {
        console.error(error);
    }
}











// Add event listener to the Sign On form
document.getElementById('signOnForm').addEventListener('submit', handleSignOnSubmit);


// async function handleSignOffSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         const token = localStorage.getItem('token');
//         let startDate = document.getElementById('startDateoff').value;
//         let endDate = document.getElementById('endDateoff').value;
//         const companyName = document.getElementById('user_client2').value;
//         const vesselType = document.getElementById('candidate_c_vessel1').value;
//         const category = document.getElementById('categorysoff').value;

//         startDate = startDate + 'T00:00:00Z';
//         endDate = endDate + 'T23:59:59Z';
//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             vessel_type: vesselType,
//             companyname: companyName,
//             category: category,
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-off', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Clear existing results
//         const signOffTableBody = document.getElementById('signOffTableBody');
//         signOffTableBody.innerHTML = '';

//         if (contracts.length === 0) {
//             const message = document.createElement('tr');
//             const messageCell = document.createElement('td');
//             messageCell.colSpan = 26; // Adjust to the number of fields (columns) you expect
//             messageCell.textContent = 'No data available';
//             message.appendChild(messageCell);
//             signOffTableBody.appendChild(message);
//             return;
//         }

//         // Clear existing search and export button container
//         const signOffSearchContainer = document.getElementById('signOffSearchContainer');
//         if (signOffSearchContainer) {
//             signOffSearchContainer.innerHTML = '';
//         } else {
//             const newSearchContainer = document.createElement('div');
//             newSearchContainer.id = 'signOffSearchContainer';
//             document.querySelector('.container.table-responsive').insertBefore(newSearchContainer, document.getElementById('signOffTable'));
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'signOffSearchInput';
//         signOffSearchContainer.appendChild(searchInput);

//         // Function to export to Excel
//         function exportToExcel() {
//             // Create a new Workbook
//             const wb = XLSX.utils.book_new();

//             // Convert data into an array of arrays format suitable for Excel
//             const data = contracts.map(contract => [
//                 contract.candidateId,
//                 contract.rank,
//                 contract.vesselName,
//                 contract.vesselType,
//                 contract.sign_off,
//                 contract.wages,
//                 contract.wages_types,
//                 contract.company_name,
//                 contract.aoa_number,
//                 contract.currency,
//                 contract.emigrate_number,
//                 contract.eoc,
//                 contract.reason_for_sign_off,
//                 contract.userName,
//                 contract.fname + ' ' + contract.lname,
//                 getNationalityName(contract.nationality),
//                 contract.indos_number,
//                 contract.indian_cdc_document_number,
//                 contract.bank_pan_num,
//                 contract.passport_document_number,
//                 // Add all other fields here
//             ]);

//             // Create a Worksheet
//             const ws = XLSX.utils.aoa_to_sheet([[
//                 'Candidate ID',
//                 'Rank',
//                 'Vessel Name',
//                 'Vessel Type',
//                 'Sign Off',
//                 'Wages',
//                 'Wages Types',
//                 'Company Name',
//                 'AOA Number',
//                 'Currency',
//                 'Emigrate Number',
//                 'EOC',
//                 'Reason for Sign Off',
//                 'User Name',
//                 'Full Name',
//                 'Nationality',
//                 'INDOS Number',
//                 'Indian CDC Document Number',
//                 'Bank PAN Number',
//                 'Passport Document Number',
//                 // Add headers for all other fields here
//             ], ...data]);

//             // Add the Worksheet to the Workbook
//             XLSX.utils.book_append_sheet(wb, ws, 'Sign Off Contracts');

//             // Save the Workbook as a .xlsx file
//             XLSX.writeFile(wb, 'sign_off_contracts.xlsx');
//         }

//         // Add Export to Excel button
//         const exportButton = document.createElement('button');
//         exportButton.classList.add('btn', 'btn-outline-success', 'mx-2', 'my-3');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', exportToExcel);
//         signOffSearchContainer.appendChild(exportButton);

//         // Function to render table without pagination
//         function renderTable() {
//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             const filteredContracts = contracts.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Clear existing table content
//             signOffTableBody.innerHTML = '';

//             // Populate table body with data
//             filteredContracts.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     index + 1, // Serial Number (S.No)
//                     contract.candidateId,
//                     contract.rank,
//                     contract.vesselName,
//                     contract.vesselType,
//                     contract.sign_off,
//                     contract.wages,
//                     contract.wages_types,
//                     contract.company_name,
//                     contract.aoa_number,
//                     contract.currency,
//                     contract.emigrate_number,
//                     contract.eoc,
//                     contract.reason_for_sign_off,
//                     contract.userName,
//                     contract.fname + ' ' + contract.lname,
//                     getNationalityName(contract.nationality),
//                     contract.indos_number,
//                     contract.indian_cdc_document_number,
//                     contract.bank_pan_num,
//                     contract.passport_document_number,
//                     // Add all other fields here
//                 ];

//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     row.appendChild(cell);
//                 });

//                 signOffTableBody.appendChild(row);
//             });

//             // Display total number of contracts fetched
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${filteredContracts.length} data fetched`;
//             signOffSearchContainer.appendChild(fetchedDataMessage);
//         }

//         // Initial render of table
//         renderTable();

//         // Search input event listener
//         searchInput.addEventListener('input', renderTable);

//     } catch (error) {
//         console.error(error);
//     }
// }











// Add event listener to the Sign On form
async function handleSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDateoff').value;
        let endDate = document.getElementById('endDateoff').value;
        const companyName = document.getElementById('user_client2').value;
        const vesselType = document.getElementById('candidate_c_vessel1').value;
        const category = document.getElementById('categorysoff').value;

        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';
        const params = {
            startDate: startDate,
            endDate: endDate,
            vessel_type: vesselType,
            companyname: companyName,
            category: category,
        };

        // Send data to server using Axios
        const response = await axios.get('https://nemo.ivistaz.co/candidate/reports/sign-off', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const contracts = response.data.contracts;

        // Clear existing results
        const signOffTableBody = document.getElementById('signOffTableBody');
        signOffTableBody.innerHTML = '';

        if (contracts.length === 0) {
            const message = document.createElement('tr');
            const messageCell = document.createElement('td');
            messageCell.colSpan = 26; // Adjust to the number of fields (columns) you expect
            messageCell.textContent = 'No data available';
            message.appendChild(messageCell);
            signOffTableBody.appendChild(message);
            return;
        }

        // Clear existing search and export button container
        const signOffSearchContainer = document.getElementById('signOffSearchContainer');
        if (signOffSearchContainer) {
            signOffSearchContainer.innerHTML = '';
        } else {
            const newSearchContainer = document.createElement('div');
            newSearchContainer.id = 'signOffSearchContainer';
            document.querySelector('.container.table-responsive').insertBefore(newSearchContainer, document.getElementById('signOffTable'));
        }

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.classList.add('form-control', 'my-3');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'signOffSearchInput';
        signOffSearchContainer.appendChild(searchInput);

        // Function to export to Excel
        function exportToExcel() {
            // Create a new Workbook
            const wb = XLSX.utils.book_new();

            // Convert data into an array of arrays format suitable for Excel
            const data = contracts.map(contract => [
                contract.candidateId,
                contract.rank,
                contract.vesselName,
                contract.vesselType,
                contract.sign_off,
                contract.wages,
                contract.wages_types,
                contract.company_name,
                contract.aoa_number,
                contract.currency,
                contract.emigrate_number,
                contract.eoc,
                contract.reason_for_sign_off,
                contract.userName,
                contract.fname + ' ' + contract.lname,
                getNationalityName(contract.nationality),
                contract.indos_number,
                contract.indian_cdc_document_number,
                contract.bank_pan_num,
                contract.passport_document_number,
                // Add all other fields here
            ]);

            // Create a Worksheet
            const ws = XLSX.utils.aoa_to_sheet([[
                'Candidate ID',
                'Rank',
                'Vessel Name',
                'Vessel Type',
                'Sign Off',
                'Wages',
                'Wages Types',
                'Company Name',
                'AOA Number',
                'Currency',
                'Emigrate Number',
                'EOC',
                'Reason for Sign Off',
                'User Name',
                'Full Name',
                'Nationality',
                'INDOS Number',
                'Indian CDC Document Number',
                'Bank PAN Number',
                'Passport Document Number',
                // Add headers for all other fields here
            ], ...data]);

            // Add the Worksheet to the Workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Sign Off Contracts');

            // Save the Workbook as a .xlsx file
            XLSX.writeFile(wb, 'sign_off_contracts.xlsx');
        }

        // Add Export to Excel button
        const exportButton = document.createElement('button');
        exportButton.classList.add('btn', 'btn-outline-success', 'mx-2', 'my-3');
        exportButton.textContent = 'Export to Excel';
        exportButton.addEventListener('click', exportToExcel);
        signOffSearchContainer.appendChild(exportButton);

        // Function to render table without pagination
        function renderTable() {
            // Apply search filter
            const searchTerm = searchInput.value.trim().toLowerCase();
            const filteredContracts = contracts.filter(contract => {
                return Object.values(contract).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm)
                );
            });

            // Clear existing table content
            signOffTableBody.innerHTML = '';

            // Populate table body with data
            filteredContracts.forEach((contract, index) => {
                const row = document.createElement('tr');
                const fields = [
                    index + 1, // Serial Number (S.No)
                    `<a href="javascript:void(0);" onclick="viewCandidate('${contract.candidateId}')">${contract.candidateId}</a>`,
                    contract.rank,
                    contract.vesselName,
                    contract.vesselType,
                    contract.sign_off,
                    contract.wages,
                    contract.wages_types,
                    contract.company_name,
                    contract.aoa_number,
                    contract.currency,
                    contract.emigrate_number,
                    contract.eoc,
                    contract.reason_for_sign_off,
                    contract.userName,
                    contract.fname + ' ' + contract.lname,
                    getNationalityName(contract.nationality),
                    contract.indos_number,
                    contract.indian_cdc_document_number,
                    contract.bank_pan_num,
                    contract.passport_document_number,
                    // Add all other fields here
                ];

                fields.forEach(field => {
                    const cell = document.createElement('td');
                    cell.innerHTML = field; // Use innerHTML to allow HTML content
                    row.appendChild(cell);
                });

                signOffTableBody.appendChild(row);
            });

            // Display total number of contracts fetched
            const fetchedDataMessage = document.createElement('p');
            fetchedDataMessage.textContent = `${filteredContracts.length} data fetched`;
            signOffSearchContainer.appendChild(fetchedDataMessage);
        }

        // Initial render of table
        renderTable();

        // Search input event listener
        searchInput.addEventListener('input', renderTable);

    } catch (error) {
        console.error(error);
    }
}

document.getElementById('signOffForm').addEventListener('submit', handleSignOffSubmit);


// async function handleDueforSignOffSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         let startDate = document.getElementById('startDated').value;
//         let endDate = document.getElementById('endDated').value;
//         const companyName = document.getElementById('user_client3').value;
//         const vessel_type = document.getElementById('candidate_c_vessel2').value;
//         const category = document.getElementById('categorydue').value;

//         startDate = startDate + 'T00:00:00Z';
//         endDate = endDate + 'T23:59:59Z';

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             companyname: companyName,
//             vessel_type: vessel_type,
//             category: category,
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/dueforsignoff', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Clear existing table, if any
//         const tableContainer = document.getElementById('DuesignOffTable');
//         tableContainer.innerHTML = '';

//         // Create table element
//         const table = document.createElement('table');
//         table.classList.add('table', 'table-bordered');

//         // Create table header
//         const tableHeader = document.createElement('thead');
//         const headerRow = document.createElement('tr');
//         const headers = ['S.no', 'CandidateId', 'First Name', 'Last Name', 'Nationality', 'Rank', 'Vessel', 'EOC-Date', 'Company', 'Status'];
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

//         // Process each contract and add candidates to the table
//         contracts.forEach((contract, index) => {
//             const row = document.createElement('tr');
//             row.classList.add('border'); // Adding border to the row
//             const fields = [
//                 index + 1, // Serial number (sno)
//                 contract.candidateId,
//                 contract.fname,
//                 contract.lname,
//                 contract.nationality,
//                 contract.rank,
//                 contract.vesselName,
//                 contract.eoc, // Access the EOC date from the contract
//                 contract.company_name
//             ];
//             fields.forEach((field, fieldIndex) => {
//                 const cell = document.createElement('td');
//                 if (fieldIndex === 0) {
//                     cell.textContent = field; // Serial number
//                 } else if (fieldIndex === headers.length - 3) {
//                     cell.textContent = new Date(field).toLocaleDateString();
//                 } else {
//                     cell.textContent = field;
//                 }
//                 cell.classList.add('text-center');
//                 row.appendChild(cell);
//             });

//             // Calculate status based on EOC date
//             const status = calculateStatus(contract.eoc);
//             const statusCell = document.createElement('td');
//             const badge = document.createElement('span');
//             badge.textContent = status.status;
//             badge.classList.add('badge', 'bg-' + status.color);
//             statusCell.classList.add('text-center');
//             statusCell.appendChild(badge);
//             row.appendChild(statusCell);

//             tableBody.appendChild(row);
//         });
//         table.appendChild(tableBody);

//         // Append table to container
//         tableContainer.appendChild(table);

//         // Check if reports is true
//         const decodedToken = decodeToken(localStorage.getItem('token'));
//         const reports = decodedToken.reports;

//         if (reports === true) {
//             // Add export to Excel button
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
//             exportButton.addEventListener('click', async () => {
//                 try {
//                     const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
//                     await XLSX.writeFile(wb, 'dueSignOffCandidates.xlsx');
//                 } catch (error) {
//                     console.error('Error exporting to Excel:', error);
//                 }
//             });
//             tableContainer.appendChild(exportButton);
//         }

//     } catch (error) {
//         console.error(error);
//     }
// }

// // Helper function to calculate status based on EOC date
// function calculateStatus(eocDate) {
//     const today = new Date();
//     const eoc = new Date(eocDate);
//     const diffTime = Math.abs(eoc - today);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     if (eoc < today) {
//         return { status: 'Overdue', color: 'danger' };
//     } else if (diffDays <= 30) {
//         return { status: 'Due Soon', color: 'warning' };
//     } else {
//         return { status: 'On Track', color: 'success' };
//     }
// }
// async function handleDueforSignOffSubmit(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         let startDate = document.getElementById('startDated').value;
//         let endDate = document.getElementById('endDated').value;
//         const companyName = document.getElementById('user_client3').value;
//         const vessel_type = document.getElementById('candidate_c_vessel2').value;
//         const category = document.getElementById('categorydue').value;

//         startDate = startDate + 'T00:00:00Z';
//         endDate = endDate + 'T23:59:59Z';

//         const params = {
//             startDate: startDate,
//             endDate: endDate,
//             companyname: companyName,
//             vessel_type: vessel_type,
//             category: category,
//         };

//         // Send data to server using Axios
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/dueforsignoff', {
//             params: params
//         });

//         console.log(response.data); // Assuming the server sends back some data
//         const contracts = response.data.contracts;

//         // Clear existing table, if any
//         const tableContainer = document.getElementById('DuesignOffTable');
//         tableContainer.innerHTML = '';

//         // Create pagination controls container
//         const paginationContainer = document.createElement('div');
//         paginationContainer.id = 'paginationContainer';
//         tableContainer.appendChild(paginationContainer);

//         // Create table element
//         const table = document.createElement('table');
//         table.classList.add('table', 'table-bordered');

//         // Create table header
//         const tableHeader = document.createElement('thead');
//         const headerRow = document.createElement('tr');
//         const headers = ['S.no', 'CandidateId', 'First Name', 'Last Name', 'Nationality', 'Rank', 'Vessel', 'EOC-Date', 'Company', 'Status'];
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
//         tableBody.id = 'tableBody';
//         table.appendChild(tableBody);
//         tableContainer.appendChild(table);

//         // Search input
//         const searchContainer = document.createElement('div');
//         searchContainer.classList.add('my-3');
//         const searchInput = document.createElement('input');
//         searchInput.type = 'text';
//         searchInput.classList.add('form-control');
//         searchInput.placeholder = 'Search...';
//         searchContainer.appendChild(searchInput);
//         tableContainer.insertBefore(searchContainer, table);

//         // Dropdown for rows per page
//         const rowsPerPageSelect = document.createElement('select');
//         rowsPerPageSelect.classList.add('form-select', 'w-auto', 'my-2');
//         [5, 10, 25, 100].forEach(num => {
//             const option = document.createElement('option');
//             option.value = num;
//             option.text = `${num} rows per page`;
//             rowsPerPageSelect.appendChild(option);
//         });
//         tableContainer.insertBefore(rowsPerPageSelect, paginationContainer);

//         let currentPage = 1;
//         let rowsPerPage = parseInt(rowsPerPageSelect.value);
//         let totalPages = Math.ceil(contracts.length / rowsPerPage);

//         rowsPerPageSelect.addEventListener('change', () => {
//             rowsPerPage = parseInt(rowsPerPageSelect.value);
//             totalPages = Math.ceil(filteredContracts.length / rowsPerPage);
//             currentPage = 1;
//             renderTable();
//             renderPagination();
//         });

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//             renderPagination();
//         });

//         let filteredContracts = contracts;

//         function renderTable() {
//             tableBody.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             filteredContracts = contracts.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             const start = (currentPage - 1) * rowsPerPage;
//             const end = start + rowsPerPage;
//             const paginatedContracts = filteredContracts.slice(start, end);

//             paginatedContracts.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 row.classList.add('border'); // Adding border to the row
//                 const fields = [
//                     start + index + 1, // Serial number (sno)
//                     contract.candidateId,
//                     contract.fname,
//                     contract.lname,
//                     contract.nationality,
//                     contract.rank,
//                     contract.vesselName,
//                     contract.eoc, // Access the EOC date from the contract
//                     contract.company_name
//                 ];
//                 fields.forEach((field, fieldIndex) => {
//                     const cell = document.createElement('td');
//                     if (fieldIndex === 0) {
//                         cell.textContent = field; // Serial number
//                     } else if (fieldIndex === headers.length - 3) {
//                         cell.textContent = new Date(field).toLocaleDateString();
//                     } else {
//                         cell.textContent = field;
//                     }
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });

//                 // Calculate status based on EOC date
//                 const status = calculateStatus(contract.eoc);
//                 const statusCell = document.createElement('td');
//                 const badge = document.createElement('span');
//                 badge.textContent = status.status;
//                 badge.classList.add('badge', 'bg-' + status.color);
//                 statusCell.classList.add('text-center');
//                 statusCell.appendChild(badge);
//                 row.appendChild(statusCell);

//                 tableBody.appendChild(row);
//             });
//         }

//         function renderPagination() {
//             paginationContainer.innerHTML = '';

//             const createPageButton = (pageNum) => {
//                 const pageButton = document.createElement('button');
//                 pageButton.textContent = pageNum;
//                 pageButton.classList.add('btn', 'btn-outline-primary', 'mx-1');
//                 if (pageNum === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 pageButton.addEventListener('click', () => {
//                     currentPage = pageNum;
//                     renderTable();
//                     renderPagination();
//                 });
//                 return pageButton;
//             };

//             if (totalPages <= 5) {
//                 for (let i = 1; i <= totalPages; i++) {
//                     paginationContainer.appendChild(createPageButton(i));
//                 }
//             } else {
//                 if (currentPage > 1) {
//                     paginationContainer.appendChild(createPageButton(1));
//                     if (currentPage > 2) {
//                         paginationContainer.appendChild(document.createTextNode('...'));
//                     }
//                 }

//                 let startPage = Math.max(1, currentPage - 1);
//                 let endPage = Math.min(totalPages, currentPage + 1);

//                 if (currentPage === 1) {
//                     endPage = 3;
//                 } else if (currentPage === totalPages) {
//                     startPage = totalPages - 2;
//                 }

//                 for (let i = startPage; i <= endPage; i++) {
//                     paginationContainer.appendChild(createPageButton(i));
//                 }

//                 if (currentPage < totalPages) {
//                     if (currentPage < totalPages - 1) {
//                         paginationContainer.appendChild(document.createTextNode('...'));
//                     }
//                     paginationContainer.appendChild(createPageButton(totalPages));
//                 }
//             }
//         }

//         // Initial render of table and pagination
//         renderTable();
//         renderPagination();

//         // Check if reports is true
//         const decodedToken = decodeToken(localStorage.getItem('token'));
//         const reports = decodedToken.reports;

//         if (reports === true) {
//             // Add export to Excel button
//             const exportButton = document.createElement('button');
//             exportButton.textContent = 'Export to Excel';
//             exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
//             exportButton.addEventListener('click', async () => {
//                 try {
//                     const wb = XLSX.utils.table_to_book(table, { sheet: "SheetJS" });
//                     await XLSX.writeFile(wb, 'dueSignOffCandidates.xlsx');
//                 } catch (error) {
//                     console.error('Error exporting to Excel:', error);
//                 }
//             });
//             tableContainer.appendChild(exportButton);
//         }

//     } catch (error) {
//         console.error(error);
//     }
// }

// Helper function to calculate status based on EOC date
async function handleDueforSignOffSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDated').value;
        let endDate = document.getElementById('endDated').value;
        const companyName = document.getElementById('user_client3').value;
        const vessel_type = document.getElementById('candidate_c_vessel2').value;
        const category = document.getElementById('categorydue').value;

        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';

        const params = {
            startDate: startDate,
            endDate: endDate,
            companyname: companyName,
            vessel_type: vessel_type,
            category: category,
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

        // Create pagination controls container
        const paginationContainer = document.createElement('div');
        paginationContainer.id = 'paginationContainer';
        tableContainer.appendChild(paginationContainer);

        // Create table element
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered');

        // Create table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['S.no', 'CandidateId', 'First Name', 'Last Name', 'Nationality', 'Rank', 'Vessel', 'EOC-Date', 'Company', 'Status'];
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
        tableBody.id = 'tableBody';
        table.appendChild(tableBody);
        tableContainer.appendChild(table);

        // Search input
        const searchContainer = document.createElement('div');
        searchContainer.classList.add('my-3');
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.classList.add('form-control');
        searchInput.placeholder = 'Search...';
        searchContainer.appendChild(searchInput);
        tableContainer.insertBefore(searchContainer, table);

        // Dropdown for rows per page
        const rowsPerPageSelect = document.createElement('select');
        rowsPerPageSelect.classList.add('form-select', 'w-auto', 'my-2');
        [5, 10, 25, 100].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.text = `${num} rows per page`;
            rowsPerPageSelect.appendChild(option);
        });
        tableContainer.insertBefore(rowsPerPageSelect, paginationContainer);

        let currentPage = 1;
        let rowsPerPage = parseInt(rowsPerPageSelect.value);
        let totalPages = Math.ceil(contracts.length / rowsPerPage);

        rowsPerPageSelect.addEventListener('change', () => {
            rowsPerPage = parseInt(rowsPerPageSelect.value);
            totalPages = Math.ceil(filteredContracts.length / rowsPerPage);
            currentPage = 1;
            renderTable();
            renderPagination();
        });

        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
            renderPagination();
        });

        let filteredContracts = contracts;

        function renderTable() {
            tableBody.innerHTML = '';

            // Apply search filter
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredContracts = contracts.filter(contract => {
                return Object.values(contract).some(value =>
                    value && value.toString().toLowerCase().includes(searchTerm)
                );
            });

            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const paginatedContracts = filteredContracts.slice(start, end);

            paginatedContracts.forEach((contract, index) => {
                const row = document.createElement('tr');
                row.classList.add('border'); // Adding border to the row
                const fields = [
                    start + index + 1, // Serial number (sno)
                    contract.candidateId,
                    contract.fname,
                    contract.lname,
                    getNationalityName(contract.nationality),
                    contract.rank,
                    contract.vesselName,
                    contract.eoc, // Access the EOC date from the contract
                    contract.company_name
                ];
                fields.forEach((field, fieldIndex) => {
                    const cell = document.createElement('td');
                    if (fieldIndex === 0) {
                        cell.textContent = field; // Serial number
                    } else if (fieldIndex === headers.length - 3) {
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
        }

        function renderPagination() {
            paginationContainer.innerHTML = '';

            const createPageButton = (pageNum) => {
                const pageButton = document.createElement('button');
                pageButton.textContent = pageNum;
                pageButton.classList.add('btn', 'btn-outline-primary', 'mx-1');
                if (pageNum === currentPage) {
                    pageButton.classList.add('active');
                }
                pageButton.addEventListener('click', () => {
                    currentPage = pageNum;
                    renderTable();
                    renderPagination();
                });
                return pageButton;
            };

            if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                    paginationContainer.appendChild(createPageButton(i));
                }
            } else {
                if (currentPage > 1) {
                    paginationContainer.appendChild(createPageButton(1));
                    if (currentPage > 2) {
                        paginationContainer.appendChild(document.createTextNode('...'));
                    }
                }

                let startPage = Math.max(1, currentPage - 1);
                let endPage = Math.min(totalPages, currentPage + 1);

                if (currentPage === 1) {
                    endPage = 3;
                } else if (currentPage === totalPages) {
                    startPage = totalPages - 2;
                }

                for (let i = startPage; i <= endPage; i++) {
                    paginationContainer.appendChild(createPageButton(i));
                }

                if (currentPage < totalPages) {
                    if (currentPage < totalPages - 1) {
                        paginationContainer.appendChild(document.createTextNode('...'));
                    }
                    paginationContainer.appendChild(createPageButton(totalPages));
                }
            }
        }

        // Export to Excel button
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

        // Initial render of table and pagination
        renderTable();
        renderPagination();

        // Check if reports is true
        const decodedToken = decodeToken(localStorage.getItem('token'));
        const reports = decodedToken.reports;

        if (reports === true) {
            tableContainer.appendChild(exportButton);
        }

    } catch (error) {
        console.error(error);
    }
}

function calculateStatus(eocDate) {
    const today = new Date();
    const eoc = new Date(eocDate);
    const diffTime = Math.abs(eoc - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (eoc < today) {
        return { status: 'Overdue', color: 'danger' };
    } else if (diffDays <= 30) {
        return { status: 'Due Soon', color: 'warning' };
    } else {
        return { status: 'On Track', color: 'success' };
    }
}


document.getElementById('dueforsignoffform').addEventListener('submit', handleDueforSignOffSubmit);

async function handleAvailableCandidatesSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDatea').value;
        startDate = startDate + 'T00:00:00Z';
        let endDate = document.getElementById('endDatea').value;
        endDate = endDate + 'T23:59:59Z';
        const avbrank = document.getElementById('avbrank').value;
        const category = document.getElementById('categoryavb').value;

        const params = {
            startDate: startDate,
            endDate: endDate,
            avbrank: avbrank,
            category: category
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

        // Pagination variables
        let currentPage = 1;
        let itemsPerPage = 10; // Default items per page
        let totalPages = Math.ceil(candidates.length / itemsPerPage);
        const maxVisiblePages = 5; // Maximum number of page buttons to display

        // Function to render candidates for the current page
        function renderCandidates() {
            // Clear existing table content
            tableContainer.innerHTML = '';

            // Calculate start and end index of items to display
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const displayedCandidates = candidates.slice(startIndex, endIndex);

            // Populate table with candidates data
            displayedCandidates.forEach((candidate, index) => {
                const row = document.createElement('tr');
                const fields = [
                    startIndex + index + 1, // Serial number (s.no)
                    candidate.candidateid,
                    candidate.fname,
                    candidate.lname,
                    getNationalityName(candidate.nationality),
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

            // Render pagination controls
            renderPagination();
        }

        // Function to render pagination controls
        function renderPagination() {
            const paginationContainer = document.getElementById('paginationContaineravbdate');
            paginationContainer.innerHTML = '';

            // Calculate total pages again in case itemsPerPage or candidates length change
            totalPages = Math.ceil(candidates.length / itemsPerPage);

            // Previous button
            const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
                currentPage--;
                renderCandidates();
            });
            paginationContainer.appendChild(prevButton);

            // Page buttons
            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            if (startPage > 1) {
                const firstEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(firstEllipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                const pageButton = createPaginationButton(i.toString(), true, () => {
                    currentPage = i;
                    renderCandidates();
                });
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                paginationContainer.appendChild(pageButton);
            }

            if (endPage < totalPages) {
                const lastEllipsis = createPaginationButton('...', false, null);
                paginationContainer.appendChild(lastEllipsis);
            }

            // Next button
            const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
                currentPage++;
                renderCandidates();
            });
            paginationContainer.appendChild(nextButton);

            // Append pagination controls to container
            tableContainer.parentNode.insertBefore(paginationContainer, tableContainer.nextSibling);
        }

        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'mx-1');
            button.textContent = text;
            button.addEventListener('click', onClick);
            button.disabled = !isEnabled;
            return button;
        }

        // Initial render of candidates
        renderCandidates();

        // Dropdown to select items per page
        const itemsPerPageDropdown = document.createElement('select');
        itemsPerPageDropdown.classList.add('form-select', 'my-3', 'w-auto');
        const itemsPerPageOptions = [5, 10, 25, 100];
        itemsPerPageOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option + ' per page';
            itemsPerPageDropdown.appendChild(optionElement);
        });
        itemsPerPageDropdown.addEventListener('change', () => {
            itemsPerPage = parseInt(itemsPerPageDropdown.value);
            currentPage = 1;
            renderCandidates();
        });
        tableContainer.parentNode.insertBefore(itemsPerPageDropdown, tableContainer.nextSibling);

    } catch (error) {
        console.error(error);
    }
}






document.getElementById('availableCandidatesForm').addEventListener('submit', handleAvailableCandidatesSubmit);


async function handleDueForRenewalSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDater').value;
        let endDate = document.getElementById('endDater').value;

        startDate = startDate + 'T00:00:00Z';
        endDate = endDate + 'T23:59:59Z';
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

        // Function to create table row with serial number and status
        const createRowWithSerialNumberAndStatus = (candidate, fields) => {
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

            // Calculate status based on expiry date
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
            return createRowWithSerialNumberAndStatus(candidate, fields);
        };

        // Function to create table row for medical candidates
        const createMedicalRow = (candidate, fields) => {
            return createRowWithSerialNumberAndStatus(candidate, fields);
        };

        // Clear existing tables, if any
        const documentTableBody = document.getElementById('documentCandidatesTableBody');
        const medicalTableBody = document.getElementById('medicalCandidatesTableBody');
        documentTableBody.innerHTML = '';
        medicalTableBody.innerHTML = '';

        // Populate table with documentCandidates data
        let documentFields = { keys: ['candidateId', 'document', 'document_files', 'document_number', 'expiry_date', 'id', 'issue_date', 'issue_place', 'stcw'], sn: 1 };
        documentCandidates.forEach(candidate => {
            documentTableBody.appendChild(createDocumentRow(candidate, documentFields));
        });

        // Populate table with medicalCandidates data
        let medicalFields = { keys: ['amount', 'candidateId', 'created_by', 'date', 'done_by', 'expiry_date', 'hospitalName', 'id', 'place', 'status', 'upload'], sn: 1 };
        medicalCandidates.forEach(candidate => {
            medicalTableBody.appendChild(createMedicalRow(candidate, medicalFields));
        });

        // Check if the user has access to reports
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        // Hide export buttons if the user has no access to reports
        if (!reports) {
            document.getElementById('exportDocumentCandidates').style.display = 'none';
            document.getElementById('exportMedicalCandidates').style.display = 'none';
        }

    } catch (error) {
        console.error(error);
        // Display error message
        alert('An error occurred while fetching data. Please try again later.');
    }
}




document.getElementById('dueForRenewalForm').addEventListener('submit', handleDueForRenewalSubmit);
// async function handleOnBoardSubmit(event) {
//     event.preventDefault();
//     try {
//         const token = localStorage.getItem('token');
//         let startDate = document.getElementById('startDateo').value;
//         startDate = startDate + 'T00:00:00Z';
//         const companyname = document.getElementById('user_client4').value || null;
//         const vesselDropdown = document.getElementById('vsl1').value || null;
//         const category = document.getElementById('categoryob').value;

//         // Send request to fetch onboard candidates with filters
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
//             params: {
//                 startDate: startDate,
//                 companyname: companyname,
//                 vslName: vesselDropdown,
//                 category: category
//             },
//             headers: {
//                 "Authorization": token
//             }
//         });

//         const contracts = response.data.contracts;
//         setupPagination(contracts);
//     } catch (error) {
//         console.error("Error fetching onboard contracts:", error);
//     }
// }

// function setupPagination(contracts) {
//     const rowsPerPageSelect = document.getElementById('rowsPerPage5');
//     const paginationControls = document.getElementById('paginationControls5');
//     const tableBody = document.getElementById('onBoardTableBody');
//     const searchInput = document.getElementById('searchInput5');

//     let currentPage = 1;
//     let rowsPerPage = parseInt(rowsPerPageSelect.value);
//     let filteredContracts = contracts;

//     function filterContracts() {
//         const searchQuery = searchInput.value.toLowerCase();
//         filteredContracts = contracts.filter(contract =>
//             Object.values(contract).some(val =>
//                 val && val.toString().toLowerCase().includes(searchQuery)
//             )
//         );
//         currentPage = 1; // Reset to first page after filtering
//         displayTableRows();
//         updatePaginationControls();
//     }

//     function displayTableRows() {
//         tableBody.innerHTML = ''; // Clear existing table rows

//         const start = (currentPage - 1) * rowsPerPage;
//         const end = start + rowsPerPage;
//         const paginatedContracts = filteredContracts.slice(start, end);

//         const rows = paginatedContracts.map((contract, index) => `
//             <tr>
//                 <td style="font-size: 8px;">${start + index + 1}</td>
//                 <td><button onclick="viewCandidate(${contract.candidateId})" class="btn btn-link">${contract.candidateId}</button></td>
//                 <td style="font-size: 8px;">${contract.fname}</td>
//                 <td style="font-size: 8px;">${contract.lname}</td>
//                 <td style="font-size: 8px;">${contract.birth_place}</td>
//                 <td style="font-size: 8px;">${contract.rank}</td>
//                 <td style="font-size: 8px;">${contract.nationality}</td>
//                 <td style="font-size: 8px;">${contract.dob}</td>
//                 <td style="font-size: 8px;">${calculateAge(contract.dob)}</td>
//                 <td style="font-size: 8px;">${contract.company_name}</td>
//                 <td style="font-size: 8px;">${contract.currency}</td>
//                 <td style="font-size: 8px;">${contract.eoc}</td>
//                 <td style="font-size: 8px;">${contract.sign_on}</td>
//                 <td style="font-size: 8px;">${contract.sign_off}</td>
//                 <td style="font-size: 8px;">${contract.sign_on_port}</td>
//                 <td style="font-size: 8px;">${contract.vesselName}</td>
//                 <td style="font-size: 8px;">${contract.vesselType}</td>
//                 <td style="font-size: 8px;">${contract.wages}</td>
//                 <td style="font-size: 8px;">${contract.wages_types}</td>
//             </tr>
//         `).join('');

//         tableBody.innerHTML = rows;
//     }

//     function updatePaginationControls() {
//         paginationControls.innerHTML = '';

//         const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

//         if (currentPage > 1) {
//             const prevButton = document.createElement('button');
//             prevButton.textContent = 'Previous';
//             prevButton.addEventListener('click', () => {
//                 currentPage--;
//                 displayTableRows();
//                 updatePaginationControls();
//             });
//             paginationControls.appendChild(prevButton);
//         }

//         const pageButtons = [];
//         for (let i = 1; i <= totalPages; i++) {
//             const pageButton = document.createElement('button');
//             pageButton.textContent = i;
//             if (i === currentPage) {
//                 pageButton.disabled = true;
//             } else {
//                 pageButton.addEventListener('click', () => {
//                     currentPage = i;
//                     displayTableRows();
//                     updatePaginationControls();
//                 });
//             }
//             pageButtons.push(pageButton);
//         }

//         pageButtons.forEach(button => paginationControls.appendChild(button));

//         if (currentPage < totalPages) {
//             const nextButton = document.createElement('button');
//             nextButton.textContent = 'Next';
//             nextButton.addEventListener('click', () => {
//                 currentPage++;
//                 displayTableRows();
//                 updatePaginationControls();
//             });
//             paginationControls.appendChild(nextButton);
//         }
//     }

//     rowsPerPageSelect.addEventListener('change', () => {
//         rowsPerPage = parseInt(rowsPerPageSelect.value);
//         currentPage = 1;
//         displayTableRows();
//         updatePaginationControls();
//     });

//     searchInput.addEventListener('input', filterContracts);

//     displayTableRows();
//     updatePaginationControls();
// }
// async function handleOnBoardSubmit(event) {
//     event.preventDefault();
//     try {
//         const token = localStorage.getItem('token');
//         let startDate = document.getElementById('startDateo').value;
//         startDate = startDate + 'T00:00:00Z';
//         const companyname = document.getElementById('user_client4').value || null;
//         const vesselDropdown = document.getElementById('vsl1').value || null;
//         const category = document.getElementById('categoryob').value;

//         // Send request to fetch onboard candidates with filters
//         const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
//             params: {
//                 startDate: startDate,
//                 companyname: companyname,
//                 vslName: vesselDropdown,
//                 category: category
//             },
//             headers: {
//                 "Authorization": token
//             }
//         });

//         const contracts = response.data.contracts;
//         setupPagination(contracts);
//         addExportToExcelButton(contracts);

//     } catch (error) {
//         console.error("Error fetching onboard contracts:", error);
//     }
// }

// function setupPagination(contracts) {
//     const rowsPerPageSelect = document.getElementById('rowsPerPage5');
//     const paginationControls = document.getElementById('paginationControls5');
//     const tableBody = document.getElementById('onBoardTableBody');
//     const searchInput = document.getElementById('searchInput5');

//     let currentPage = 1;
//     let rowsPerPage = parseInt(rowsPerPageSelect.value);
//     let filteredContracts = contracts;

//     function filterContracts() {
//         const searchQuery = searchInput.value.toLowerCase();
//         filteredContracts = contracts.filter(contract =>
//             Object.values(contract).some(val =>
//                 val && val.toString().toLowerCase().includes(searchQuery)
//             )
//         );
//         currentPage = 1; // Reset to first page after filtering
//         displayTableRows();
//         updatePaginationControls();
//     }

//     function displayTableRows() {
//         tableBody.innerHTML = ''; // Clear existing table rows

//         const start = (currentPage - 1) * rowsPerPage;
//         const end = start + rowsPerPage;
//         const paginatedContracts = filteredContracts.slice(start, end);

//         const rows = paginatedContracts.map((contract, index) => `
//             <tr>
//                 <td style="font-size: 8px;">${start + index + 1}</td>
//                 <td><button onclick="viewCandidate(${contract.candidateId})" class="btn btn-link">${contract.candidateId}</button></td>
//                 <td style="font-size: 8px;">${contract.fname}</td>
//                 <td style="font-size: 8px;">${contract.lname}</td>
//                 <td style="font-size: 8px;">${contract.birth_place}</td>
//                 <td style="font-size: 8px;">${contract.rank}</td>
//                 <td style="font-size: 8px;">${contract.nationality}</td>
//                 <td style="font-size: 8px;">${contract.dob}</td>
//                 <td style="font-size: 8px;">${calculateAge(contract.dob)}</td>
//                 <td style="font-size: 8px;">${contract.company_name}</td>
//                 <td style="font-size: 8px;">${contract.currency}</td>
//                 <td style="font-size: 8px;">${contract.eoc}</td>
//                 <td style="font-size: 8px;">${contract.sign_on}</td>
//                 <td style="font-size: 8px;">${contract.sign_off}</td>
//                 <td style="font-size: 8px;">${contract.sign_on_port}</td>
//                 <td style="font-size: 8px;">${contract.vesselName}</td>
//                 <td style="font-size: 8px;">${contract.vesselType}</td>
//                 <td style="font-size: 8px;">${contract.wages}</td>
//                 <td style="font-size: 8px;">${contract.wages_types}</td>
//             </tr>
//         `).join('');

//         tableBody.innerHTML = rows;
//     }

//     function updatePaginationControls() {
//         paginationControls.innerHTML = '';

//         const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

//         if (currentPage > 1) {
//             const prevButton = document.createElement('button');
//             prevButton.textContent = 'Previous';
//             prevButton.addEventListener('click', () => {
//                 currentPage--;
//                 displayTableRows();
//                 updatePaginationControls();
//             });
//             paginationControls.appendChild(prevButton);
//         }

//         const pageButtons = [];
//         for (let i = 1; i <= totalPages; i++) {
//             const pageButton = document.createElement('button');
//             pageButton.textContent = i;
//             if (i === currentPage) {
//                 pageButton.disabled = true;
//             } else {
//                 pageButton.addEventListener('click', () => {
//                     currentPage = i;
//                     displayTableRows();
//                     updatePaginationControls();
//                 });
//             }
//             pageButtons.push(pageButton);
//         }

//         pageButtons.forEach(button => paginationControls.appendChild(button));

//         if (currentPage < totalPages) {
//             const nextButton = document.createElement('button');
//             nextButton.textContent = 'Next';
//             nextButton.addEventListener('click', () => {
//                 currentPage++;
//                 displayTableRows();
//                 updatePaginationControls();
//             });
//             paginationControls.appendChild(nextButton);
//         }
//     }

//     rowsPerPageSelect.addEventListener('change', () => {
//         rowsPerPage = parseInt(rowsPerPageSelect.value);
//         currentPage = 1;
//         displayTableRows();
//         updatePaginationControls();
//     });

//     searchInput.addEventListener('input', filterContracts);

//     displayTableRows();
//     updatePaginationControls();
// }

// function addExportToExcelButton(contracts) {
//     // Create Export Button
//     const exportButton = document.createElement('button');
//     exportButton.id = 'exportButton';
//     exportButton.textContent = 'Export to Excel';
//     document.body.appendChild(exportButton);

//     exportButton.addEventListener('click', () => {
//         exportToExcel5(contracts);
//     });
// }

// function exportToExcel5(contracts) {
//     const headers = ["No", "Candidate ID", "First Name", "Last Name", "Birth Place", "Rank", "Nationality", "DOB", "Age", "Company Name", "Currency", "EOC", "Sign On", "Sign Off", "Sign On Port", "Vessel Name", "Vessel Type", "Wages", "Wages Types"];
//     const data = contracts.map((contract, index) => [
//         index + 1,
//         contract.candidateId,
//         contract.fname,
//         contract.lname,
//         contract.birth_place,
//         contract.rank,
//         contract.nationality,
//         contract.dob,
//         calculateAge(contract.dob),
//         contract.company_name,
//         contract.currency,
//         contract.eoc,
//         contract.sign_on,
//         contract.sign_off,
//         contract.sign_on_port,
//         contract.vesselName,
//         contract.vesselType,
//         contract.wages,
//         contract.wages_types
//     ]);

//     const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

//     XLSX.writeFile(workbook, "Onboard.xlsx");
// }
async function handleOnBoardSubmit(event) {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        let startDate = document.getElementById('startDateo').value;
        startDate = startDate + 'T00:00:00Z';
        const companyname = document.getElementById('user_client4').value || null;
        const vesselDropdown = document.getElementById('vsl1').value || null;
        const category = document.getElementById('categoryob').value;

        // Send request to fetch onboard candidates with filters
        const response = await axios.get('https://nemo.ivistaz.co/candidate/onboard', {
            params: {
                startDate: startDate,
                companyname: companyname,
                vslName: vesselDropdown,
                category: category
            },
            headers: {
                "Authorization": token
            }
        });

        const contracts = response.data.contracts;
        setupPagination(contracts);
        addExportToExcelButton(contracts);

    } catch (error) {
        console.error("Error fetching onboard contracts:", error);
    }
}

function setupPagination(contracts) {
    const rowsPerPageSelect = document.getElementById('rowsPerPage5');
    const paginationControls = document.getElementById('paginationControls5');
    const tableBody = document.getElementById('onBoardTableBody');
    const searchInput = document.getElementById('searchInput5');

    let currentPage = 1;
    let rowsPerPage = parseInt(rowsPerPageSelect.value);
    let filteredContracts = contracts;

    function filterContracts() {
        const searchQuery = searchInput.value.toLowerCase();
        filteredContracts = contracts.filter(contract =>
            Object.values(contract).some(val =>
                val && val.toString().toLowerCase().includes(searchQuery)
            )
        );
        currentPage = 1; // Reset to first page after filtering
        displayTableRows();
        updatePaginationControls();
    }

    function displayTableRows() {
        tableBody.innerHTML = ''; // Clear existing table rows

        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedContracts = filteredContracts.slice(start, end);

        const rows = paginatedContracts.map((contract, index) => `
            <tr>
                <td style="font-size: 8px;">${start + index + 1}</td>
                <td><button onclick="viewCandidate(${contract.candidateId})" class="btn btn-link">${contract.candidateId}</button></td>
                <td style="font-size: 8px;">${contract.fname}</td>
                <td style="font-size: 8px;">${contract.lname}</td>
                <td style="font-size: 8px;">${contract.birth_place}</td>
                <td style="font-size: 8px;">${contract.rank}</td>
                <td style="font-size: 8px;">${getNationalityName(contract.nationality)}</td>
                <td style="font-size: 8px;">${contract.dob}</td>
                <td style="font-size: 8px;">${calculateAge(contract.dob)}</td>
                <td style="font-size: 8px;">${contract.company_name}</td>
                <td style="font-size: 8px;">${contract.currency}</td>
                <td style="font-size: 8px;">${contract.eoc}</td>
                <td style="font-size: 8px;">${contract.sign_on}</td>
                <td style="font-size: 8px;">${contract.sign_off}</td>
                <td style="font-size: 8px;">${getPortName(contract.sign_on_port)}</td>
                <td style="font-size: 8px;">${contract.vesselName}</td>
                <td style="font-size: 8px;">${contract.vesselType}</td>
                <td style="font-size: 8px;">${contract.wages}</td>
                <td style="font-size: 8px;">${contract.wages_types}</td>
            </tr>
        `).join('');

        tableBody.innerHTML = rows;
    }

    function updatePaginationControls() {
        paginationControls.innerHTML = '';

        const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

        if (currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.addEventListener('click', () => {
                currentPage--;
                displayTableRows();
                updatePaginationControls();
            });
            paginationControls.appendChild(prevButton);
        }

        const pageButtons = [];
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.disabled = true;
            } else {
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    displayTableRows();
                    updatePaginationControls();
                });
            }
            pageButtons.push(pageButton);
        }

        pageButtons.forEach(button => paginationControls.appendChild(button));

        if (currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.addEventListener('click', () => {
                currentPage++;
                displayTableRows();
                updatePaginationControls();
            });
            paginationControls.appendChild(nextButton);
        }
    }

    rowsPerPageSelect.addEventListener('change', () => {
        rowsPerPage = parseInt(rowsPerPageSelect.value);
        currentPage = 1;
        displayTableRows();
        updatePaginationControls();
    });

    searchInput.addEventListener('input', filterContracts);

    displayTableRows();
    updatePaginationControls();
}

function addExportToExcelButton(contracts) {
    const exportBtn = document.getElementById('exportToExcelBtnob');
    exportBtn.addEventListener('click', () => {
        exportToExcel5(contracts);
    });
}

function exportToExcel5(contracts) {
    const headers = ["No", "Candidate ID", "First Name", "Last Name", "Birth Place", "Rank", "Nationality", "DOB", "Age", "Company Name", "Currency", "EOC", "Sign On", "Sign Off", "Sign On Port", "Vessel Name", "Vessel Type", "Wages", "Wages Types"];
    const data = contracts.map((contract, index) => [
        index + 1,
        contract.candidateId,
        contract.fname,
        contract.lname,
        contract.birth_place,
        contract.rank,
        contract.nationality,
        contract.dob,
        calculateAge(contract.dob),
        contract.company_name,
        contract.currency,
        contract.eoc,
        contract.sign_on,
        contract.sign_off,
        contract.sign_on_port,
        contract.vesselName,
        contract.vesselType,
        contract.wages,
        contract.wages_types
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contracts");

    XLSX.writeFile(workbook, "Onboard.xlsx");
}









function viewCandidate(candidateId) {
    localStorage.setItem('memId', candidateId);
    // Open the link in a new window
    window.open('./view-candidate.html', '_blank');
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
        startDate += 'T00:00:00Z';

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

            // Display the number of fetched data items
            const discussionCount = document.getElementById('discussionCount');
            discussionCount.textContent = `Displaying ${discussions.length} number(s) of Data`;

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


// async function handleCrewList(event) {
//     event.preventDefault();
//     try {
//         let startDate = document.getElementById('startDatecl').value;
//         startDate = startDate + 'T00:00:00Z';
//         let endDate = document.getElementById('endDatecl').value;
//         endDate = endDate + 'T23:59:59Z';
        
//         // Check if startDate and endDate are empty
//         if (!startDate || !endDate) {
//             console.error("Start date and end date are required");
//             // Show a message to the user indicating that start date and end date are required
//             return;
//         }

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
//         console.log(response.data)
//         const crewlistCandidates = response.data; // Directly accessing the array since response.data already contains the data

//         const crewListTableBody = document.getElementById('crewListTableBody');
//         crewListTableBody.innerHTML = ''; // Clear existing rows
        
//         if (crewlistCandidates && crewlistCandidates.length > 0) {
//             let index = 1;
//             crewlistCandidates.forEach(contract => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${index++}</td>
//                     <td>${contract.candidateId}</td>
//                     <td>${contract.fname}</td>
//                     <td>${contract.lname}</td>
//                     <td>${contract.rank}</td>
//                     <td>${contract.nationality}</td>
//                     <td>${contract.company_name}</td>
//                     <td>${contract.currency}</td>
//                     <td>${contract.eoc}</td>
//                     <td>${contract.sign_on}</td>
//                     <td>${contract.sign_off}</td>
//                     <td>${contract.vesselId}</td>
//                     <td>${contract.vesselType}</td>
//                     <td>${contract.vslName}</td>
//                     <td>${contract.wages}</td>
//                     <td>${contract.wages_types}</td>
//                 `;
//                 crewListTableBody.appendChild(row);
//             });
//         } else {
//             // No data message
//             crewListTableBody.innerHTML = '<tr><td colspan="19">No data available</td></tr>';
//         }
        
//     } catch (error) {
//         console.error("Error handling crew list:", error);
//         // Handle error here, maybe show an error message to the user
//     }
// }

// async function handleCrewList(event) {
//     event.preventDefault();
//     try {
//         let startDate = document.getElementById('startDatecl').value;
//         startDate = startDate + 'T00:00:00Z';
//         let endDate = document.getElementById('endDatecl').value;
//         endDate = endDate + 'T23:59:59Z';

//         // Check if startDate and endDate are empty
//         if (!startDate || !endDate) {
//             console.error("Start date and end date are required");
//             // Show a message to the user indicating that start date and end date are required
//             return;
//         }

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
//         console.log(response.data);
//         const crewlistCandidates = response.data; // Directly accessing the array since response.data already contains the data

//         const crewListTableBody = document.getElementById('crewListTableBody');
//         crewListTableBody.innerHTML = ''; // Clear existing rows

//         if (crewlistCandidates && crewlistCandidates.length > 0) {
//             setupPagination(crewlistCandidates);
//         } else {
//             // No data message
//             crewListTableBody.innerHTML = '<tr><td colspan="16">No data available</td></tr>';
//         }

//         function setupPagination(crewlistCandidates) {
//             const rowsPerPageSelect = document.getElementById('rowsPerPageSelectcl');
//             const paginationControls = document.getElementById('paginationControlscl');
//             const tableBody = document.getElementById('crewListTableBody');
//             const searchInput = document.getElementById('searchInputcl');

//             let currentPage = 1;
//             let rowsPerPage = parseInt(rowsPerPageSelect.value);
//             let filteredCandidates = crewlistCandidates;

//             function filterCandidates() {
//                 const searchQuery = searchInput.value.toLowerCase();
//                 filteredCandidates = crewlistCandidates.filter(contract =>
//                     Object.values(contract).some(val =>
//                         val && val.toString().toLowerCase().includes(searchQuery)
//                     )
//                 );
//                 currentPage = 1; // Reset to first page after filtering
//                 displayTableRows();
//                 updatePaginationControls();
//             }

//             function displayTableRows() {
//                 tableBody.innerHTML = ''; // Clear existing table rows

//                 const start = (currentPage - 1) * rowsPerPage;
//                 const end = start + rowsPerPage;
//                 const paginatedCandidates = filteredCandidates.slice(start, end);

//                 let index = start + 1;
//                 paginatedCandidates.forEach(contract => {
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${index++}</td>
//                         <td>${contract.candidateId}</td>
//                         <td>${contract.fname}</td>
//                         <td>${contract.lname}</td>
//                         <td>${contract.rank}</td>
//                         <td>${getNationalityName(contract.nationality)}</td>
//                         <td>${contract.company_name}</td>
//                         <td>${contract.currency}</td>
//                         <td>${contract.eoc}</td>
//                         <td>${contract.sign_on}</td>
//                         <td>${contract.sign_off}</td>
//                         <td>${getVesselName(contract.vesselId)}</td>
//                         <td>${contract.vesselType}</td>
                      
//                         <td>${contract.wages}</td>
//                         <td>${contract.wages_types}</td>
//                     `;
//                     tableBody.appendChild(row);
//                 });
//             }

//             function updatePaginationControls() {
//                 paginationControls.innerHTML = '';

//                 const totalPages = Math.ceil(filteredCandidates.length / rowsPerPage);

//                 if (currentPage > 1) {
//                     const prevButton = document.createElement('button');
//                     prevButton.textContent = 'Previous';
//                     prevButton.addEventListener('click', () => {
//                         currentPage--;
//                         displayTableRows();
//                         updatePaginationControls();
//                     });
//                     paginationControls.appendChild(prevButton);
//                 }

//                 const pageButtons = [];
//                 for (let i = 1; i <= totalPages; i++) {
//                     const pageButton = document.createElement('button');
//                     pageButton.textContent = i;
//                     if (i === currentPage) {
//                         pageButton.disabled = true;
//                     } else {
//                         pageButton.addEventListener('click', () => {
//                             currentPage = i;
//                             displayTableRows();
//                             updatePaginationControls();
//                         });
//                     }
//                     pageButtons.push(pageButton);
//                 }

//                 pageButtons.forEach(button => paginationControls.appendChild(button));

//                 if (currentPage < totalPages) {
//                     const nextButton = document.createElement('button');
//                     nextButton.textContent = 'Next';
//                     nextButton.addEventListener('click', () => {
//                         currentPage++;
//                         displayTableRows();
//                         updatePaginationControls();
//                     });
//                     paginationControls.appendChild(nextButton);
//                 }
//             }

//             rowsPerPageSelect.addEventListener('change', () => {
//                 rowsPerPage = parseInt(rowsPerPageSelect.value);
//                 currentPage = 1;
//                 displayTableRows();
//                 updatePaginationControls();
//             });

//             searchInput.addEventListener('input', filterCandidates);

//             displayTableRows();
//             updatePaginationControls();
//         }
//         const exportButton = document.createElement('button');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', exportToExcel);
//         document.getElementById('exportButtonContainer').appendChild(exportButton);
    
//         function exportToExcel() {
//             const dataToExport = filteredCandidates.length > 0 ? filteredCandidates : crewlistCandidates;
    
//             if (dataToExport.length === 0) {
//                 console.error("No data to export.");
//                 return;
//             }
    
//             const formattedData = dataToExport.map(contract => ({
//                 'Index': contract.index, // Adjust this as per your table structure
//                 'Candidate ID': contract.candidateId,
//                 'First Name': contract.fname,
//                 'Last Name': contract.lname,
//                 'Rank': contract.rank,
//                 'Nationality': getNationalityName(contract.nationality),
//                 'Company': contract.company_name,
//                 'Currency': contract.currency,
//                 'EOC': contract.eoc,
//                 'Sign On': contract.sign_on,
//                 'Sign Off': contract.sign_off,
//                 'Vessel': getVesselName(contract.vesselId),
//                 'Vessel Type': contract.vesselType,
//                 'Wages': contract.wages,
//                 'Wage Types': contract.wages_types
//             }));
    
//             const worksheet = XLSX.utils.json_to_sheet(formattedData);
//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew List');
    
//             // Generate a unique filename with timestamp
//             const today = new Date();
//             const filename = `CrewList_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.xlsx`;
    
//             // Save the Excel file
//             XLSX.writeFile(workbook, filename);
    
//             console.log(`Excel file "${filename}" exported successfully.`);
//         }
    

//     } catch (error) {
//         console.error("Error handling crew list:", error);
//         // Handle error here, maybe show an error message to the user
//     }
// }


// async function handleCrewList(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         let startDate = document.getElementById('startDatecl').value;
//         startDate = startDate + 'T00:00:00Z';
//         let endDate = document.getElementById('endDatecl').value;
//         endDate = endDate + 'T23:59:59Z';

//         // Check if startDate and endDate are empty
//         if (!startDate || !endDate) {
//             console.error("Start date and end date are required");
//             // Show a message to the user indicating that start date and end date are required
//             return;
//         }

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
//         console.log(response.data);
//         const crewlist = response.data; //let crewlist = response.data.crewlist; // Adjust according to your API response structure

//         // Clear existing results
//         const crewListResults = document.getElementById('crewListMonthWiseContainer');
//         crewListResults.innerHTML = '';

//         if (crewlist.length === 0) {
//             const message = document.createElement('p');
//             message.textContent = 'No data available';
//             crewListResults.appendChild(message);
//             return;
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'crewListMonthWiseSearchInput';
//         crewListResults.appendChild(searchInput);

//         // Create export button
//         const exportButton = document.createElement('button');
//         exportButton.classList.add('btn', 'btn-primary', 'my-3');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', () => exportToExcel(filteredCrewlist));
//         crewListResults.appendChild(exportButton);

//         // Create table container
//         const tableContainer = document.createElement('div');
//         tableContainer.id = 'crewListMonthWiseTableContainer';
//         crewListResults.appendChild(tableContainer);

//         // Pagination variables
//         let currentPage = 1;
//         const itemsPerPage = 10; // Number of items per page
//         let totalItems = crewlist.length;
//         let totalPages = Math.ceil(totalItems / itemsPerPage);
//         const maxVisiblePages = 5; // Maximum number of page buttons to display

//         let filteredCrewlist = crewlist;

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//         });

//         // Function to render table with pagination and search
//         function renderTable() {
//             // Clear existing table content (excluding search input and export button)
//             tableContainer.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             filteredCrewlist = crewlist.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Update total pages based on filtered crewlist
//             totalPages = Math.ceil(filteredCrewlist.length / itemsPerPage);

//             // Paginate data
//             const startIndex = (currentPage - 1) * itemsPerPage;
//             const endIndex = startIndex + itemsPerPage;
//             const displayedCrewlist = filteredCrewlist.slice(startIndex, endIndex);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             const headers = [
//                 'S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 
//                 'Nationality', 'Company', 'Currency', 'EOC', 'Sign On', 
//                 'Sign Off', 'Vessel Name', 'Vessel Type', 'Wages', 'Wage Types'
//             ];
//             headers.forEach(headerText => {
//                 const header = document.createElement('th');
//                 header.textContent = headerText;
//                 header.scope = 'col';
//                 header.classList.add('text-center');
//                 headerRow.appendChild(header);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             displayedCrewlist.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     startIndex + index + 1, // Serial Number (S.No)
//                     contract.candidateId,
//                     contract.fname,
//                     contract.lname,
//                     contract.rank,
//                     getNationalityName(contract.nationality),
//                     contract.company_name,
//                     contract.currency,
//                     contract.eoc,
//                     contract.sign_on,
//                     contract.sign_off,
//                     contract.vesselName,
//                     contract.vesselType,
//                     contract.wages,
//                     contract.wages_types
//                 ];
//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });
//                 tableBody.appendChild(row);
//             });
//             table.appendChild(tableBody);

//             // Append table to tableContainer
//             tableContainer.appendChild(table);

//             // Display total number of crewlist fetched
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${totalItems} data fetched`;
//             tableContainer.appendChild(fetchedDataMessage);

//             // Display number of crewlist matching search criteria
//             const matchedDataMessage = document.createElement('p');
//             matchedDataMessage.textContent = `${filteredCrewlist.length} data match search`;
//             tableContainer.appendChild(matchedDataMessage);

//             // Create pagination controls
//             const paginationContainer = document.createElement('div');
//             paginationContainer.classList.add('pagination', 'justify-content-center');

//             // Previous button
//             const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
//                 currentPage--;
//                 renderTable();
//             });
//             paginationContainer.appendChild(prevButton);

//             // Page buttons
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage < maxVisiblePages - 1) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = createPaginationButton(i.toString(), true, () => {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 paginationContainer.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(lastEllipsis);
//             }

//             // Next button
//             const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
//                 currentPage++;
//                 renderTable();
//             });
//             paginationContainer.appendChild(nextButton);

//             // Append pagination controls to tableContainer
//             tableContainer.appendChild(paginationContainer);
//         }

//         // Helper function to create pagination button
//         function createPaginationButton(text, isEnabled, onClick) {
//             const button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-primary', 'mx-1');
//             button.textContent = text;
//             button.addEventListener('click', onClick);
//             button.disabled = !isEnabled;
//             return button;
//         }

//         // Function to export table data to Excel
//         function exportToExcel(data) {
//             const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
//                 'S.No': index + 1,
//                 'Candidate ID': contract.candidateId,
//                 'First Name': contract.fname,
//                 'Last Name': contract.lname,
//                 'Rank': contract.rank,
//                 'Nationality': getNationalityName(contract.nationality),
//                 'Company': contract.company_name,
//                 'Currency': contract.currency,
//                 'EOC': contract.eoc,
//                 'Sign On': contract.sign_on,
//                 'Sign Off': contract.sign_off,
//                 'Vessel Name': contract.vesselName,
//                 'Vessel Type': contract.vesselType,
//                 'Wages': contract.wages,
//                 'Wage Types': contract.wages_types
//             })));

//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew List Month Wise');

//             XLSX.writeFile(workbook, 'crew_list_month_wise.xlsx');
//         }

//         // Initial render of table
//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleCrewList(event) {
//     event.preventDefault(); // Prevent default form submission behavior

    
//         try {
//                     let startDate = document.getElementById('startDatecl').value;
//                     startDate = startDate + 'T00:00:00Z';
//                     let endDate = document.getElementById('endDatecl').value;
//                     endDate = endDate + 'T23:59:59Z';
            
//                     // Check if startDate and endDate are empty
//                     if (!startDate || !endDate) {
//                         console.error("Start date and end date are required");
//                         // Show a message to the user indicating that start date and end date are required
//                         return;
//                     }
            
//                     const vslName = document.getElementById('vsl').value || null;
//                     const companyname = document.getElementById('user_client5').value || null;
            
//                     const params = {
//                         startDate: startDate,
//                         endDate: endDate,
//                         vslName: vslName,
//                         company: companyname
//                     };
            
//                     const response = await axios.get('https://nemo.ivistaz.co/candidate/crewlist', {
//                         params: params
//                     });
//                     console.log(response.data);
//                     const crewlist = response.data; //let crewlist = response.data.crewlist; // Adjust according to your API response structure
            
//                     // Clear existing results
//                     const crewListResults = document.getElementById('crewListMonthWiseContainer');
//                     crewListResults.innerHTML = '';

//         if (crewlist.length === 0) {
//             const message = document.createElement('p');
//             message.textContent = 'No data available';
//             crewListResults.appendChild(message);
//             return;
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'crewListMonthWiseSearchInput';
//         crewListResults.appendChild(searchInput);

//         // Create rows per page select
//         const rowsPerPageSelect = document.createElement('select');
//         rowsPerPageSelect.classList.add('form-select', 'my-3');
//         rowsPerPageSelect.id = 'rowsPerPageSelect';
//         [10, 25, 50, 100, 500].forEach(option => {
//             const optionElement = document.createElement('option');
//             optionElement.value = option;
//             optionElement.textContent = option;
//             rowsPerPageSelect.appendChild(optionElement);
//         });
//         rowsPerPageSelect.addEventListener('change', () => {
//             renderTable();
//         });
//         crewListResults.appendChild(rowsPerPageSelect);

//         // Create export button
//         const exportButton = document.createElement('button');
//         exportButton.classList.add('btn', 'btn-primary', 'my-3', 'ms-3');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', () => exportToExcel(filteredCrewlist));
//         crewListResults.appendChild(exportButton);

//         // Create table container
//         const tableContainer = document.createElement('div');
//         tableContainer.id = 'crewListMonthWiseTableContainer';
//         crewListResults.appendChild(tableContainer);

//         // Pagination variables
//         let currentPage = 1;
//         let itemsPerPage = parseInt(rowsPerPageSelect.value); // Number of items per page
//         let totalItems = crewlist.length;
//         let totalPages = Math.ceil(totalItems / itemsPerPage);
//         const maxVisiblePages = 5; // Maximum number of page buttons to display

//         let filteredCrewlist = crewlist;

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//         });

//         // Function to render table with pagination and search
//         function renderTable() {
//             itemsPerPage = parseInt(rowsPerPageSelect.value); // Update items per page based on selection

//             // Clear existing table content (excluding search input, rows per page select, and export button)
//             tableContainer.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             filteredCrewlist = crewlist.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Update total pages based on filtered crewlist
//             totalPages = Math.ceil(filteredCrewlist.length / itemsPerPage);

//             // Paginate data
//             const startIndex = (currentPage - 1) * itemsPerPage;
//             const endIndex = startIndex + itemsPerPage;
//             const displayedCrewlist = filteredCrewlist.slice(startIndex, endIndex);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             const headers = [
//                 'S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 
//                 'Nationality', 'Company', 'Currency', 'EOC', 'Sign On', 
//                 'Sign Off', 'Vessel Name', 'Vessel Type', 'Wages', 'Wage Types'
//             ];
//             headers.forEach(headerText => {
//                 const header = document.createElement('th');
//                 header.textContent = headerText;
//                 header.scope = 'col';
//                 header.classList.add('text-center');
//                 headerRow.appendChild(header);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             displayedCrewlist.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     startIndex + index + 1, // Serial Number (S.No)
//                     contract.candidateId,
//                     contract.fname,
//                     contract.lname,
//                     contract.rank,
//                     getNationalityName(contract.nationality),
//                     contract.company_name,
//                     contract.currency,
//                     contract.eoc,
//                     contract.sign_on,
//                     contract.sign_off,
//                     getVesselName(contract.vslName),
//                     contract.vesselType,
//                     contract.wages,
//                     contract.wages_types
//                 ];
//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });
//                 tableBody.appendChild(row);
//             });
//             table.appendChild(tableBody);

//             // Append table to tableContainer
//             tableContainer.appendChild(table);

//             // Display total number of crewlist fetched
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${totalItems} data fetched`;
//             tableContainer.appendChild(fetchedDataMessage);

//             // Display number of crewlist matching search criteria
//             const matchedDataMessage = document.createElement('p');
//             matchedDataMessage.textContent = `${filteredCrewlist.length} data match search`;
//             tableContainer.appendChild(matchedDataMessage);

//             // Create pagination controls
//             const paginationContainer = document.createElement('div');
//             paginationContainer.classList.add('pagination', 'justify-content-center');

//             // Previous button
//             const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
//                 currentPage--;
//                 renderTable();
//             });
//             paginationContainer.appendChild(prevButton);

//             // Page buttons
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage < maxVisiblePages - 1) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = createPaginationButton(i.toString(), true, () => {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 paginationContainer.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(lastEllipsis);
//             }

//             // Next button
//             const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
//                 currentPage++;
//                 renderTable();
//             });
//             paginationContainer.appendChild(nextButton);

//             // Append pagination controls to tableContainer
//             tableContainer.appendChild(paginationContainer);
//         }

//         // Helper function to create pagination button
//         function createPaginationButton(text, isEnabled, onClick) {
//             const button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-primary', 'mx-1');
//             button.textContent = text;
//             button.addEventListener('click', onClick);
//             button.disabled = !isEnabled;
//             return button;
//         }

//         // Function to export table data to Excel
//         function exportToExcel(data) {
//             const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
//                 'S.No': index + 1,
//                 'Candidate ID': contract.candidateId,
//                 'First Name': contract.fname,
//                 'Last Name': contract.lname,
//                 'Rank': contract.rank,
//                 'Nationality': getNationalityName(contract.nationality),
//                 'Company': contract.company_name,
//                 'Currency': contract.currency,
//                 'EOC': contract.eoc,
//                 'Sign On': contract.sign_on,
//                 'Sign Off': contract.sign_off,
//                 'Vessel Name': contract.vesselName,
//                 'Vessel Type': contract.vesselType,
//                 'Wages': contract.wages,
//                 'Wage Types': contract.wages_types
//             })));

//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew List Month Wise');

//             XLSX.writeFile(workbook, 'crew_list_month_wise.xlsx');
//         }

//         // Initial render of table
//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function handleCrewList(event) {
//     event.preventDefault(); // Prevent default form submission behavior

//     try {
//         let startDate = document.getElementById('startDatecl').value;
//         startDate = startDate + 'T00:00:00Z';
//         let endDate = document.getElementById('endDatecl').value;
//         endDate = endDate + 'T23:59:59Z';

//         // Check if startDate and endDate are empty
//         if (!startDate || !endDate) {
//             console.error("Start date and end date are required");
//             // Show a message to the user indicating that start date and end date are required
//             return;
//         }

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
//         console.log(response.data);
//         const crewlist = response.data; // Adjust according to your API response structure

//         // Clear existing results
//         const crewListResults = document.getElementById('crewListMonthWiseContainer');
//         crewListResults.innerHTML = '';

//         if (crewlist.length === 0) {
//             const message = document.createElement('p');
//             message.textContent = 'No data available';
//             crewListResults.appendChild(message);
//             return;
//         }

//         // Create search input
//         const searchInput = document.createElement('input');
//         searchInput.classList.add('form-control', 'my-3');
//         searchInput.type = 'text';
//         searchInput.placeholder = 'Search...';
//         searchInput.id = 'crewListMonthWiseSearchInput';
//         crewListResults.appendChild(searchInput);

//         // Create rows per page select
//         const rowsPerPageSelect = document.createElement('select');
//         rowsPerPageSelect.classList.add('form-select', 'my-3');
//         rowsPerPageSelect.id = 'rowsPerPageSelect';
//         [10, 25, 50, 100, 500].forEach(option => {
//             const optionElement = document.createElement('option');
//             optionElement.value = option;
//             optionElement.textContent = option;
//             rowsPerPageSelect.appendChild(optionElement);
//         });
//         rowsPerPageSelect.addEventListener('change', () => {
//             renderTable();
//         });
//         crewListResults.appendChild(rowsPerPageSelect);

//         // Create export button
//         const exportButton = document.createElement('button');
//         exportButton.classList.add('btn', 'btn-primary', 'my-3', 'ms-3');
//         exportButton.textContent = 'Export to Excel';
//         exportButton.addEventListener('click', () => exportToExcel(filteredCrewlist));
//         crewListResults.appendChild(exportButton);

//         // Create table container
//         const tableContainer = document.createElement('div');
//         tableContainer.id = 'crewListMonthWiseTableContainer';
//         crewListResults.appendChild(tableContainer);

//         // Pagination variables
//         let currentPage = 1;
//         let itemsPerPage = parseInt(rowsPerPageSelect.value); // Number of items per page
//         let totalItems = crewlist.length;
//         let totalPages = Math.ceil(totalItems / itemsPerPage);
//         const maxVisiblePages = 5; // Maximum number of page buttons to display

//         let filteredCrewlist = crewlist;

//         searchInput.addEventListener('input', () => {
//             currentPage = 1;
//             renderTable();
//         });

//         // Function to render table with pagination and search
//         function renderTable() {
//             itemsPerPage = parseInt(rowsPerPageSelect.value); // Update items per page based on selection

//             // Clear existing table content (excluding search input, rows per page select, and export button)
//             tableContainer.innerHTML = '';

//             // Apply search filter
//             const searchTerm = searchInput.value.trim().toLowerCase();
//             filteredCrewlist = crewlist.filter(contract => {
//                 return Object.values(contract).some(value =>
//                     value && value.toString().toLowerCase().includes(searchTerm)
//                 );
//             });

//             // Update total pages based on filtered crewlist
//             totalPages = Math.ceil(filteredCrewlist.length / itemsPerPage);

//             // Paginate data
//             const startIndex = (currentPage - 1) * itemsPerPage;
//             const endIndex = startIndex + itemsPerPage;
//             const displayedCrewlist = filteredCrewlist.slice(startIndex, endIndex);

//             // Create table element
//             const table = document.createElement('table');
//             table.classList.add('table', 'table-bordered');

//             // Create table header
//             const tableHeader = document.createElement('thead');
//             const headerRow = document.createElement('tr');
//             const headers = [
//                 'S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 
//                 'Nationality', 'Company', 'Currency', 'EOC', 'Sign On', 
//                 'Sign Off', 'Vessel Name', 'Vessel Type', 'Wages', 'Wage Types',
//                 'Account Number', 'Bank Name', 'Branch', 'IFSC Code', 
//                 'SWIFT Code', 'Beneficiary', 'Beneficiary Address', 'Bank Address'
//             ];
//             headers.forEach(headerText => {
//                 const header = document.createElement('th');
//                 header.textContent = headerText;
//                 header.scope = 'col';
//                 header.classList.add('text-center');
//                 headerRow.appendChild(header);
//             });
//             tableHeader.appendChild(headerRow);
//             table.appendChild(tableHeader);

//             // Create table body
//             const tableBody = document.createElement('tbody');
//             displayedCrewlist.forEach((contract, index) => {
//                 const row = document.createElement('tr');
//                 const fields = [
//                     startIndex + index + 1, // Serial Number (S.No)
//                     contract.candidateId,
//                     contract.fname,
//                     contract.lname,
//                     contract.rank,
//                     getNationalityName(contract.nationality),
//                     contract.company_name,
//                     contract.currency,
//                     contract.eoc,
//                     contract.sign_on,
//                     contract.sign_off,
//                     getVesselName(contract.vslName),
//                     contract.vesselType,
//                     contract.wages,
//                     contract.wages_types,
//                     contract.account_num, // New field
//                     contract.bank_name, // New field
//                     contract.branch, // New field
//                     contract.ifsc_code, // New field
//                     contract.swift_code, // New field
//                     contract.beneficiary, // New field
//                     contract.beneficiary_addr, // New field
//                     contract.bank_addr // New field
//                 ];
//                 fields.forEach(field => {
//                     const cell = document.createElement('td');
//                     cell.textContent = field;
//                     cell.classList.add('text-center');
//                     row.appendChild(cell);
//                 });
//                 tableBody.appendChild(row);
//             });
//             table.appendChild(tableBody);

//             // Append table to tableContainer
//             tableContainer.appendChild(table);

//             // Display total number of crewlist fetched
//             const fetchedDataMessage = document.createElement('p');
//             fetchedDataMessage.textContent = `${totalItems} data fetched`;
//             tableContainer.appendChild(fetchedDataMessage);

//             // Display number of crewlist matching search criteria
//             const matchedDataMessage = document.createElement('p');
//             matchedDataMessage.textContent = `${filteredCrewlist.length} data match search`;
//             tableContainer.appendChild(matchedDataMessage);

//             // Create pagination controls
//             const paginationContainer = document.createElement('div');
//             paginationContainer.classList.add('pagination', 'justify-content-center');

//             // Previous button
//             const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
//                 currentPage--;
//                 renderTable();
//             });
//             paginationContainer.appendChild(prevButton);

//             // Page buttons
//             let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//             let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//             if (endPage - startPage < maxVisiblePages - 1) {
//                 startPage = Math.max(1, endPage - maxVisiblePages + 1);
//             }

//             if (startPage > 1) {
//                 const firstEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(firstEllipsis);
//             }

//             for (let i = startPage; i <= endPage; i++) {
//                 const pageButton = createPaginationButton(i.toString(), true, () => {
//                     currentPage = i;
//                     renderTable();
//                 });
//                 if (i === currentPage) {
//                     pageButton.classList.add('active');
//                 }
//                 paginationContainer.appendChild(pageButton);
//             }

//             if (endPage < totalPages) {
//                 const lastEllipsis = createPaginationButton('...', false, null);
//                 paginationContainer.appendChild(lastEllipsis);
//             }

//             // Next button
//             const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
//                 currentPage++;
//                 renderTable();
//             });
//             paginationContainer.appendChild(nextButton);

//             // Append pagination controls to tableContainer
//             tableContainer.appendChild(paginationContainer);
//         }

//         // Helper function to create pagination button
//         function createPaginationButton(text, isEnabled, onClick) {
//             const button = document.createElement('button');
//             button.classList.add('btn', 'btn-outline-primary', 'mx-1');
//             button.textContent = text;
//             button.addEventListener('click', onClick);
//             button.disabled = !isEnabled;
//             return button;
//         }

//         // Function to export table data to Excel
//         function exportToExcel(data) {
//             const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
//                 'S.No': index + 1,
//                 'Candidate ID': contract.candidateId,
//                 'First Name': contract.fname,
//                 'Last Name': contract.lname,
//                 'Rank': contract.rank,
//                 'Nationality': getNationalityName(contract.nationality),
//                 'Company': contract.company_name,
//                 'Currency': contract.currency,
//                 'EOC': contract.eoc,
//                 'Sign On': contract.sign_on,
//                 'Sign Off': contract.sign_off,
//                 'Vessel Name': contract.vesselName,
//                 'Vessel Type': contract.vesselType,
//                 'Wages': contract.wages,
//                 'Wage Types': contract.wages_types,
//                 'Account Number': contract.account_num, // New field
//                 'Bank Name': contract.bank_name, // New field
//                 'Branch': contract.branch, // New field
//                 'IFSC Code': contract.ifsc_code, // New field
//                 'SWIFT Code': contract.swift_code, // New field
//                 'Beneficiary': contract.beneficiary, // New field
//                 'Beneficiary Address': contract.beneficiary_addr, // New field
//                 'Bank Address': contract.bank_addr // New field
//             })));

//             const workbook = XLSX.utils.book_new();
//             XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew List Month Wise');

//             XLSX.writeFile(workbook, 'crew_list_month_wise.xlsx');
//         }

//         // Initial render of table
//         renderTable();

//     } catch (error) {
//         console.error(error);
//     }
// }

async function handleCrewList(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        let startDate = document.getElementById('startDatecl').value;
        startDate = startDate + 'T00:00:00Z';
        let endDate = document.getElementById('endDatecl').value;
        endDate = endDate + 'T23:59:59Z';

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
        console.log(response.data);
        const crewlist = response.data; // Adjust according to your API response structure

        // Clear existing results
        const crewListResults = document.getElementById('crewListMonthWiseContainer');
        crewListResults.innerHTML = '';

        if (crewlist.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No data available';
            crewListResults.appendChild(message);
            return;
        }

        // Create search input
        const searchInput = document.createElement('input');
        searchInput.classList.add('form-control', 'my-3');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'crewListMonthWiseSearchInput';
        crewListResults.appendChild(searchInput);

        // Create rows per page select
        const rowsPerPageSelect = document.createElement('select');
        rowsPerPageSelect.classList.add('form-select', 'my-3');
        rowsPerPageSelect.id = 'rowsPerPageSelect';
        [10, 25, 50, 100, 500].forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            rowsPerPageSelect.appendChild(optionElement);
        });
        rowsPerPageSelect.addEventListener('change', () => {
            renderTable();
        });
        crewListResults.appendChild(rowsPerPageSelect);

        // Create export button
        const exportButton = document.createElement('button');
        exportButton.classList.add('btn', 'btn-primary', 'my-3', 'ms-3');
        exportButton.textContent = 'Export to Excel';
        exportButton.addEventListener('click', () => exportToExcel(filteredCrewlist));
        crewListResults.appendChild(exportButton);

        // Create table container
        const tableContainer = document.createElement('div');
        tableContainer.id = 'crewListMonthWiseTableContainer';
        crewListResults.appendChild(tableContainer);

        // Pagination variables
        let currentPage = 1;
        let itemsPerPage = parseInt(rowsPerPageSelect.value); // Number of items per page
        let totalItems = crewlist.length;
        let totalPages = Math.ceil(totalItems / itemsPerPage);
        const maxVisiblePages = 5; // Maximum number of page buttons to display

        let filteredCrewlist = crewlist;

        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderTable();
        });

        // Function to render table with pagination and search
        // Function to render table with pagination and search
function renderTable() {
    itemsPerPage = parseInt(rowsPerPageSelect.value); // Update items per page based on selection

    // Clear existing table content (excluding search input, rows per page select, and export button)
    tableContainer.innerHTML = '';

    // Apply search filter
    const searchTerm = searchInput.value.trim().toLowerCase();
    filteredCrewlist = crewlist.filter(contract => {
        return Object.values(contract).some(value =>
            value && value.toString().toLowerCase().includes(searchTerm)
        );
    });

    // Update total pages based on filtered crewlist
    totalPages = Math.ceil(filteredCrewlist.length / itemsPerPage);

    // Paginate data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedCrewlist = filteredCrewlist.slice(startIndex, endIndex);

    // Create table element
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered');

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        'S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 
        'Nationality', 'Company', 'Currency', 'EOC', 'Sign On', 
        'Sign Off', 'Vessel Name', 'Vessel Type', 'Wages', 'Wage Types',
        'Account Number', 'Bank Name', 'Branch', 'IFSC Code', 
        'SWIFT Code', 'Beneficiary', 'Beneficiary Address', 'Bank Address'
    ];
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
    displayedCrewlist.forEach((contract, index) => {
        const row = document.createElement('tr');
        const fields = [
            startIndex + index + 1, // Serial Number (S.No)
            `<a href="javascript:void(0);" onclick="viewCandidate('${contract.candidateId}')">${contract.candidateId}</a>`,
            contract.fname,
            contract.lname,
            contract.rank,
            getNationalityName(contract.nationality),
            contract.company_name,
            contract.currency,
            contract.eoc,
            contract.sign_on,
            contract.sign_off,
            getVesselName(contract.vslName),
            contract.vesselType,
            contract.wages,
            contract.wages_types,
            contract.account_num, // New field
            contract.bank_name, // New field
            contract.branch, // New field
            contract.ifsc_code, // New field
            contract.swift_code, // New field
            contract.beneficiary, // New field
            contract.beneficiary_addr, // New field
            contract.bank_addr // New field
        ];
        fields.forEach(field => {
            const cell = document.createElement('td');
            if (typeof field === 'string') {
                cell.innerHTML = field; // Use innerHTML to allow HTML content
            } else {
                cell.textContent = field;
            }
            cell.classList.add('text-center');
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
    table.appendChild(tableBody);

    // Append table to tableContainer
    tableContainer.appendChild(table);

    // Display total number of crewlist fetched
    const fetchedDataMessage = document.createElement('p');
    fetchedDataMessage.textContent = `${totalItems} data fetched`;
    tableContainer.appendChild(fetchedDataMessage);

    // Display number of crewlist matching search criteria
    const matchedDataMessage = document.createElement('p');
    matchedDataMessage.textContent = `${filteredCrewlist.length} data match search`;
    tableContainer.appendChild(matchedDataMessage);

    // Create pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination', 'justify-content-center');

    // Previous button
    const prevButton = createPaginationButton('Prev', currentPage > 1, () => {
        currentPage--;
        renderTable();
    });
    paginationContainer.appendChild(prevButton);

    // Page buttons
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        const firstEllipsis = createPaginationButton('...', false, null);
        paginationContainer.appendChild(firstEllipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createPaginationButton(i.toString(), true, () => {
            currentPage = i;
            renderTable();
        });
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        paginationContainer.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        const lastEllipsis = createPaginationButton('...', false, null);
        paginationContainer.appendChild(lastEllipsis);
    }

    // Next button
    const nextButton = createPaginationButton('Next', currentPage < totalPages, () => {
        currentPage++;
        renderTable();
    });
    paginationContainer.appendChild(nextButton);

    // Append pagination controls to tableContainer
    tableContainer.appendChild(paginationContainer);
}


        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'mx-1');
            button.textContent = text;
            button.addEventListener('click', onClick);
            button.disabled = !isEnabled;
            return button;
        }

        // Function to export table data to Excel
        function exportToExcel(data) {
            const worksheet = XLSX.utils.json_to_sheet(data.map((contract, index) => ({
                'S.No': index + 1,
                'Candidate ID': contract.candidateId,
                'First Name': contract.fname,
                'Last Name': contract.lname,
                'Rank': contract.rank,
                'Nationality': getNationalityName(contract.nationality),
                'Company': contract.company_name,
                'Currency': contract.currency,
                'EOC': contract.eoc,
                'Sign On': contract.sign_on,
                'Sign Off': contract.sign_off,
                'Vessel Name': contract.vslName,
                'Vessel Type': contract.vesselType,
                'Wages': contract.wages,
                'Wage Types': contract.wages_types,
                'Account Number': contract.account_num, // New field
                'Bank Name': contract.bank_name, // New field
                'Branch': contract.branch, // New field
                'IFSC Code': contract.ifsc_code, // New field
                'SWIFT Code': contract.swift_code, // New field
                'Beneficiary': contract.beneficiary, // New field
                'Beneficiary Address': contract.beneficiary_addr, // New field
                'Bank Address': contract.bank_addr // New field
            })));

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Crew List Month Wise');

            XLSX.writeFile(workbook, 'crew_list_month_wise.xlsx');
        }

        // Initial render of table
        renderTable();

    } catch (error) {
        console.error(error);
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
        const vessels = vesselResponse.data.vessels;
    
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
        let startDate = document.getElementById('reliefPlanDate').value;
        startDate = startDate + 'T00:00:00Z';
        // Get today's date as the end date
        const endDate = new Date().toISOString();

        // Fetch relief plan data based on start date and today's date as end date
        const url = `https://nemo.ivistaz.co/candidate/reliefplan?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(url);
        const reliefPlanData = response.data.contracts;
        console.log('Relief Plan Data:', reliefPlanData);

        // Display relief plan data in the table with pagination and search filter
        displayReliefPlanTable(reliefPlanData);

        // Check if the user has access to reports
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const reports = decodedToken.reports;

        if (reports === true) {
            // Add export button dynamically and pass reliefPlanData
            addExportButton(reliefPlanData);
        }
    } catch (error) {
        console.error('Error fetching relief plan data:', error);
    }

    function displayReliefPlanTable(reliefPlanData) {
        const tableBody = document.getElementById('reliefPlanTableBody');
        const paginationControls = document.getElementById('paginationControlsrpc');
        const rowsPerPageSelect = document.getElementById('rowsPerPageSelectrpc');
        const searchInput = document.getElementById('searchInputrpc'); // Search input field
        tableBody.innerHTML = ''; // Clear existing table rows
        paginationControls.innerHTML = ''; // Clear existing pagination controls

        let currentPage = 1;
        let rowsPerPage = parseInt(rowsPerPageSelect.value); // Default rows per page

        // Update table with current page data and search filter
        function updateTable() {
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            let filteredData = reliefPlanData;

            // Apply search filter if search input is not empty
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(contract =>
                    contract.fname.toLowerCase().includes(searchTerm) ||
                    contract.lname.toLowerCase().includes(searchTerm) ||
                    contract.nationality.toLowerCase().includes(searchTerm) ||
                    contract.rank.toLowerCase().includes(searchTerm) ||
                    contract.vesselName.toLowerCase().includes(searchTerm) ||
                    contract.company_name.toLowerCase().includes(searchTerm) ||
                    contract.category.toString().toLowerCase().includes(searchTerm) ||
                    contract.eoc.toLowerCase().includes(searchTerm)
                );
            }

            const currentData = filteredData.slice(startIndex, endIndex);

            tableBody.innerHTML = ''; // Clear existing table rows
            let index = startIndex + 1;
            currentData.forEach(contract => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index++}</td>
                    <td>${contract.candidateId}</td>
                    <td>${contract.fname}</td>
                    <td>${contract.lname}</td>
                    <td>${getNationalityName(contract.nationality)}</td>
                    <td>${contract.rank}</td>
                    <td>${contract.vesselName}</td>
                    <td>${contract.company_name}</td>
                    <td>${contract.category}</td>
                    <td>${contract.eoc}</td>
                `;
                tableBody.appendChild(row);
            });

            updatePagination(filteredData); // Update pagination controls after updating table
        }

        // Update pagination controls based on current page and data length
        function updatePagination(filteredData) {
            paginationControls.innerHTML = ''; // Clear existing pagination

            const totalPages = Math.ceil(filteredData.length / rowsPerPage);

            // Previous button
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updateTable();
                }
            });
            paginationControls.appendChild(prevButton);

            // Page buttons
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.disabled = i === currentPage;
                pageButton.addEventListener('click', () => {
                    currentPage = i;
                    updateTable();
                });
                paginationControls.appendChild(pageButton);
            }

            // Next button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updateTable();
                }
            });
            paginationControls.appendChild(nextButton);
        }

        // Rows per page dropdown change event
        rowsPerPageSelect.addEventListener('change', () => {
            rowsPerPage = parseInt(rowsPerPageSelect.value);
            currentPage = 1;
            updateTable();
        });

        // Search input field change event
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            updateTable();
        });

        // Initialize table and pagination
        updateTable();
    }

    function addExportButton(reliefPlanData) {
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.classList.add('btn', 'btn-dark', 'mb-3', 'text-success');
        exportButton.addEventListener('click', () => exportReliefPlanToExcel(reliefPlanData));

        // Append button to container
        const buttonContainer = document.getElementById('exportButtonContainerrpc');
        buttonContainer.innerHTML = ''; // Clear existing content
        buttonContainer.appendChild(exportButton);
    }

    function exportReliefPlanToExcel(reliefPlanData) {
        const headers = [
            'S.No', 'ID', 'First Name', 'Last Name', 'Nationality', 'Rank', 'Vessel', 'Company', 'Category', 'End of Contract'
        ];
        const rows = reliefPlanData.map((contract, index) => [
            index + 1,
            contract.candidateId,
            contract.fname,
            contract.lname,
            getNationalityName(contract.nationality),
            contract.rank,
            contract.vesselName,
            contract.company_name,
            contract.category,
            contract.eoc
        ]);
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'reliefPlan.xlsx');
    }
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
            option.text = user.userName // Assuming 'userName' and 'lastName' are the correct attributes for user name
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
const startDateInput = document.getElementById('startDatedr');
const endDateInput = document.getElementById('endDatedr');

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
    window.open('./view-candidate.html', '_blank');
}

document.getElementById('getData').addEventListener('click', async () => {
    let startDate = document.getElementById('startDatemis').value;
    startDate=startDate+'T00:00:00Z'
    let endDate = document.getElementById('endDatemis').value;
    endDate=endDate+'T23:59:59Z'

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
      window.open('./view-candidate.html', '_blank');
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
        console.log(serverResponse)
        vslsData= serverResponse.data.vessels
        const serverResponseUser = await axios.get('https://nemo.ivistaz.co/user/userdropdown');
        userData = serverResponseUser.data
        const serverResponsecomp = await axios.get('https://nemo.ivistaz.co/company/dropdown-company');
        companyData= serverResponsecomp.data.companies
        console.log('Data fetched successfully');

        const serverrespPort = await axios.get('https://nemo.ivistaz.co/others/get-ports')
        portData=serverrespPort.data.ports
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

function getCompanyName(code){
    const companies = companiesData.find(companies=>companies.company_id ==code);
    return companies?companies.company_name:code
}

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

