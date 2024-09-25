


let nationalityData = []; // Add this line to declare nationalityData globally
let portData=[];
let vslsData =[];
let userData =[];
let companyData =[];


function formatDateNew(dateString) {
    if (dateString === '1970-01-01' || dateString === '01-01-1970') {
        return ''; // Return empty string for invalid dates
    }
    
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Function to export table data to Excel
function exportToExcelnp(data, filename) {
    // Convert data to array of arrays for XLSX conversion
    const dataArray = data.map(candidate => {
        const row = [];
        for (const field in selectedFields) {
            if (selectedFields[field]) {
                let value = candidate[field];
                
                // Replace '1970-01-01' and '01-01-1970' with an empty string
                if (value === '1970-01-01' || value === '01-01-1970') {
                    value = '';
                }
                else if (field === 'userId' && candidate[field]) {
                    // Replace code with nationality name
                    const userName = getUserName(candidate[field]);
                   value = userName;
                }
                
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
        const response = await axios.post('https://nsnemo.com/candidate/reports/view-new-profile', {
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
            exportButton.classList.add('btn', 'btn-success','text-white','p-0','ps-2','pe-2');
            exportButton.addEventListener('click', () => {
                exportToExcelnp(filteredCandidates, 'candidates.xlsx'); // Use filteredCandidates for export
            });
            // Append export button
            document.getElementById('exportContainer').innerHTML = ''; // Clear previous export button
            document.getElementById('exportContainer').appendChild(exportButton);
        }

        // Attach event listener for the search input
        document.getElementById('searchInput').addEventListener('input', searchTable);

    } catch (error) {
        console.error(error);
    }
}

function displayTable() {
    // Clear existing table
    const tableContainer = document.getElementById('candidateTable');
    tableContainer.innerHTML = '';

    // Create and display match count
    const matchCount = document.getElementById('countNewProfile');
    // Set innerHTML to style part of the text
    matchCount.innerHTML = `<span class='text-success'>${filteredCandidates.length}</span> Matches found`;

    // Create table element
    const table = document.createElement('table');
    table.classList.add('table');
    table.classList.add('table-bordered');
    table.classList.add('table-sm');
    table.classList.add('border-1')

    // Create table header
    const tableHeader = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Add Serial Number column header
    const snHeader = document.createElement('th');
    snHeader.textContent = 'S.No';
    snHeader.classList = 'fw-bolder text-white';
    snHeader.style.backgroundColor='#201E43'

    headerRow.appendChild(snHeader);

    // Add other field columns
    for (const field in selectedFields) {
        if (selectedFields[field]) {
            const th = document.createElement('th');
            th.textContent = field;
            th.classList = 'fw-bolder text-white';
            th.style.backgroundColor='#201E43'
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
                } else if (field === 'candidateId') {
                    // Add button for candidate ID
                    const button = document.createElement('button');
                    button.textContent = candidate[field];
                    button.classList.add('btn', 'text-primary','p-0','ps-2','pe-2');
                    button.addEventListener('click', () => {
                        viewCandidate(candidate[field])
                    });
                    cell.appendChild(button);
                }
                else if (field === 'userId' && candidate[field]) {
                    // Replace code with nationality name
                    const userName = getUserName(candidate[field]);
                    cell.textContent = userName;
                }
             else if (candidate[field] === '1970-01-01') {
                cell.textContent = ''; // Set to empty string if the date is 1970-01-01
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
        pageButton.classList.add('btn','mb-2');
        
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
            prevButton.classList.add('btn', 'btn-outline-primary','mb-2');
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

        // Page Buttons around current page
        for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
            createPageButton(page);
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
            nextButton.classList.add('btn', 'btn-outline-primary','mb-2');
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
    const searchQuery = document.getElementById('searchInput1').value.toLowerCase();
    
    filteredCandidates = allCandidates.filter(candidate => {
        return Object.values(candidate).some(value => 
            value != null && // Ignore null and undefined values
            value.toString().toLowerCase().includes(searchQuery)
        );
    });
    
    currentPage = 1; // Reset to the first page on new search
    displayTable();  // Re-render table with filtered data
}


// Event listener for rows per page change
document.getElementById('rowsPerPage').addEventListener('change', (event) => {
    rowsPerPage = parseInt(event.target.value, 10);
    currentPage = 1;
    displayTable();
});

// Add event listeners for search and pagination
document.getElementById('searchInput1').addEventListener('input', searchTable);

document.getElementById('newprofilesubmit').addEventListener('submit', handleNewProfileSubmit);


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
        const response = await axios.post('https://nsnemo.com/candidate/reports/callsmade', {
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
     // Replace the relevant section in your renderTable function
     function renderTable() {
        tableContainer.innerHTML = '';
    
        const filteredData = filterData();
    
        if (filteredData.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No data available';
            tableContainer.appendChild(emptyMessage);
            return;
        }
    
        // Update the countCallsMade element with the filtered data length
        const countCallsMade = document.getElementById('countCallsMade');
        countCallsMade.innerHTML = `<span class='text-success'>${filteredData.length}</span> data matches`;
    
        const rowsPerPageSelect = document.getElementById('rowsPerPageCallsMade');
        rowsPerPageSelect.innerHTML = '';  // Clear any existing options
        
        [10, 25, 50, 100, 500].forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            rowsPerPageSelect.appendChild(option);
        });
        
        rowsPerPageSelect.addEventListener('change', function () {
            currentPage = 1;
            rowsPerPage = parseInt(rowsPerPageSelect.value);
            renderTable();  // Re-render the table with new rowsPerPage value
        });
        
        // Set the current value based on the rowsPerPage variable (if it's defined)
        rowsPerPageSelect.value = rowsPerPage?.toString() || '10';
        
    
        // Move the export button to exportContainerCallsMade
        const exportContainer = document.getElementById('exportContainerCallsMade');
        exportContainer.innerHTML = ''; // Clear any existing content
    
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.id = 'exportButton';
        exportButton.classList.add('btn', 'btn-success','p-0','ps-2','pe-2');
        exportButton.addEventListener('click', function () {
            exportToExcel(filteredData, 'Calls_Made_Report.xlsx');
        });
        exportContainer.appendChild(exportButton); // Append the export button to the export container
    
        const table = document.createElement('table');
        table.classList.add('table', 'table-bordered','table-sm');
    
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
    
        const snHeader = document.createElement('th');
        snHeader.textContent = 'S.No';
        snHeader.classList.add('fw-bolder', 'text-white');
        snHeader.style.backgroundColor='#201E43'

        headerRow.appendChild(snHeader);
    
        // Always add userName header
        // Always add userName header
const userNameHeader = document.createElement('th');
userNameHeader.innerHTML = 'User&nbsp;Name';  // Use innerHTML for special characters
userNameHeader.classList.add('fw-bolder', 'text-white');
userNameHeader.style.backgroundColor = '#201E43';
headerRow.appendChild(userNameHeader);

selectedFields.forEach(field => {
    const th = document.createElement('th');
    th.innerHTML = field.label.replace(/ /g, '&nbsp;');  // Replace spaces with &nbsp;
    th.classList.add('fw-bolder', 'text-white');
    th.style.backgroundColor = '#201E43';
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
                } else if (fieldName === 'candidateId') {
                    const candidateIdButton = document.createElement('button');
                    candidateIdButton.textContent = contract[fieldName] || 'N/A';
                    candidateIdButton.classList.add('btn', 'text-primary','p-0','ps-2','pe-2');
                    candidateIdButton.addEventListener('click', function () {
                        window.open(`./view-candidate.html?id=${contract[fieldName]}`, '_blank');
                    });
                    cell.appendChild(candidateIdButton);
                } else {
                    cell.textContent = (contract[fieldName] === '1970-01-01') ? '' : (contract[fieldName] || 'N/A');
                }
                
                row.appendChild(cell);
            });
    
            tableBody.appendChild(row);
        });
    
        table.appendChild(tableBody);
    
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
    const orderedFields = [
        'S.No', 'candidateId', 'fname', 'lname', 
        'c_rank', 'c_vessel', 'avb_date', 'discussion', 
        'join_date', 'reason', 'r_date', 'nationality', 
        'companyname', 'category', 'userName', 'post_by'
    ];

    const worksheet = XLSX.utils.json_to_sheet(data.map((call, index) => {
        const candidateData = { 'S.No': index + 1, ...call };

        // Replace nationality code with name
        if (candidateData.nationality) {
            candidateData.nationality = getNationalityName(candidateData.nationality);
        }

        // Replace post_by ID with username
        if (candidateData.post_by) {
            candidateData.post_by = getUserName(candidateData.post_by);
        }

        // Replace '1970-01-01' and '01-01-1970' with empty field
        Object.keys(candidateData).forEach(key => {
            if (candidateData[key] === '1970-01-01' || candidateData[key] === '01-01-1970') {
                candidateData[key] = ''; // Set to empty string
            }
        });

        return orderedFields.reduce((obj, key) => {
            obj[key] = candidateData[key] || ''; // Ensure keys exist
            return obj;
        }, {});
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Calls Made');
    XLSX.writeFile(workbook, filename);
}


document.getElementById('callsMadeForm').addEventListener('submit', handleCallsMadeSubmit);

async function createCompanyDropdown() {

    const token = localStorage.getItem('token')
    const companyResponse = await axios.get("https://nsnemo.com/company/dropdown-company", { headers: { "Authorization": token } });
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



async function handleDiscussionSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    try {
        const status = document.getElementById('status').value;
        let startDate = document.getElementById('startDates').value;
        let endDate = document.getElementById('endDates').value;
        const category = document.getElementById('categoryp').value;
        const companyName = document.getElementById('user_client').value;

        // Format dates to include time
        console.log(status)

        // Send data to server using Axios with the GET method and query parameters
        const response = await axios.get('https://nsnemo.com/candidate/reports/proposals', {
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
        const serverResponse = await axios.get("https://nsnemo.com/others/get-vsls", { headers: { "Authorization": token } });
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
        const response = await axios.get('https://nsnemo.com/candidate/reports/sign-on', {
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
        searchInput.classList.add('col-md-2')
        searchInput.style.height='25px'
        searchInput.classList.add('form-control');
       
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'signOnSearchInput';
        signOnResults.appendChild(searchInput);

        // Create export button
       // Create and append the export button to the exportContainerSignOn div
const exportContainer = document.getElementById('exportContainerSignOn');

const exportButton = document.createElement('button');
exportButton.classList.add('btn', 'btn-success','p-0','ps-2','pe-2');
exportButton.textContent = 'Export to Excel';
exportButton.addEventListener('click', () => exportToExcel(filteredContracts));
exportContainer.appendChild(exportButton);


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
// Create table element
const table = document.createElement('table');
table.classList.add('table', 'table-bordered','table-sm','mt-2');

// Create table header
const tableHeader = document.createElement('thead');
tableHeader.style.backgroundColor='#201E43'

const headerRow = document.createElement('tr');
tableHeader.style.color='white'

const headers = [
    'S.No', 'Candidate ID', 'Name', 'Rank', 'Vessel Type', 'Sign On', 'Sign Off', 'Sign On Port',
    'EOC', 'Emigrate Number', 'AOA Number', 'Currency', 'Wages', 
    'Wages Types', 'Reason for Sign Off',
    'Nationality', 'Vessel Name', 'IMO Number', 'Vessel Flag', 
    'Company Name', 'Bank Name', 'Account Number', 
    'Bank Address', 'IFSC Code', 'SWIFT Code', 'Beneficiary', 
    'Beneficiary Address', 'Branch', 'Bank Types', 
    'Bank PAN Number', 'INDOS Number', 'Indian CDC Document Number', 
    'Passport Document Number', 'Passbook', 'PAN Card', 'User Name'
];

// Replace spaces with non-breaking spaces in header names
const headersWithNbsp = headers.map(headerText => headerText.replace(/ /g, '&nbsp;'));

headersWithNbsp.forEach(headerText => {
    const header = document.createElement('th');
    header.innerHTML = headerText; // Use innerHTML to render HTML entities
    header.scope = 'col';
    header.classList.add('text-center');
    header.style.color='white'
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
                    contract.fname + ' ' + contract.lname,
                    contract.rank,
                    contract.vesselType,
                    formatDate(contract.sign_on), // Use the formatDate function
                    formatDate(contract.sign_off), // Use the formatDate function
                    getPortName(contract.sign_on_port),
                    contract.eoc,
                    contract.emigrate_number,
                    contract.aoa_number,
                    contract.currency,
                    contract.wages,
                    contract.wages_types,
                    contract.reason_for_sign_off,
                    getNationalityName(contract.nationality),
                    contract.vesselName,
                    contract.imoNumber,
                    contract.vesselFlag,
                    contract.company_name,
                    contract.bank_name || 'N/A', 
                    contract.account_num || 'N/A', 
                    contract.bank_addr || 'N/A', 
                    contract.ifsc_code || 'N/A', 
                    contract.swift_code || 'N/A', 
                    contract.beneficiary || 'N/A', 
                    contract.beneficiary_addr || 'N/A', 
                    contract.branch || 'N/A', 
                    contract.types || 'N/A', 
                    contract.pan_num || 'N/A', 
                    contract.indos_number || 'N/A',
                    contract.indian_cdc_document_number || 'N/A',
                    contract.passport_document_number || 'N/A',
                    contract.passbook || 'N/A',
                    contract.pan_card || 'N/A',
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
            // const fetchedDataMessage = document.createElement('p');
            // fetchedDataMessage.textContent = `${totalItems} data fetched`;
            // tableContainer.appendChild(fetchedDataMessage);

            // Display number of contracts matching search criteria
        // Get the element by ID
const countSignOnElement = document.getElementById('countSignOn');

// Update its content with the count of filtered contracts
countSignOnElement.innerHTML = `<span class='text-success'>${filteredContracts.length}</span> data matches`;


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
        function formatDate(date) {
            return date === '1970-01-01' ? '' : date; // Return blank if date is '1970-01-01'
        }

        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary', 'p-0','ps-2','pe-2','me-3');
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
                'Vessel Name': contract.vesselName,
                'Vessel Type': contract.vesselType,
                'Sign On': formatDateNew(contract.sign_on),
                'Sign Off':formatDateNew(contract.sign_off),
                'EOC': contract.eoc,
                'Emigrate Number': contract.emigrate_number,
                'AOA Number': contract.aoa_number,
                'Currency': contract.currency,
                'Wages': contract.wages,
                'Wages Types': contract.wages_types,
                'Reason for Sign Off': contract.reason_for_sign_off,
              
                'Nationality': getNationalityName(contract.nationality),
                
                'IMO Number': contract.imoNumber,
                'Vessel Flag': contract.vesselFlag,
                'Sign On Port' : getPortName(contract.sign_on_port),
                'Company Name': contract.company_name,
                'Bank Name': contract.bank_name || 'N/A',
                'Account Number': contract.account_num || 'N/A',
                'Bank Address': contract.bank_addr || 'N/A',
                'IFSC Code': contract.ifsc_code || 'N/A',
                'SWIFT Code': contract.swift_code || 'N/A',
                'Beneficiary': contract.beneficiary || 'N/A',
                'Beneficiary Address': contract.beneficiary_addr || 'N/A',
                'Branch': contract.branch || 'N/A',
                'Bank Types': contract.types || 'N/A',
               
                'Bank PAN Number': contract.pan_num || 'N/A',
                'INDOS Number': contract.indos_number || 'N/A',
                'Indian CDC Document Number': contract.indian_cdc_document_number || 'N/A',
                'Passport Document Number': contract.passport_document_number || 'N/A',
                'Passbook': contract.passbook || 'N/A',
                'PAN Card': contract.pan_card || 'N/A',
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
        const response = await axios.get('https://nsnemo.com/candidate/reports/sign-off', {
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
            messageCell.colSpan = 30; // Adjust to the number of fields (columns) you expect
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

        // Function to format dates
        function formatDate(date) {
            return date === '1970-01-01' ? '' : date; // Return blank if date is '1970-01-01'
        }

        // Function to export to Excel
        function exportToExcel() {
            const wb = XLSX.utils.book_new();
            const data = contracts.map(contract => [
                contract.candidateId,
                contract.fname + ' ' + contract.lname,
                contract.rank,
                contract.vesselName,
                contract.vesselType,
                formatDateNew(contract.sign_off), // Use formatDate function
                formatDateNew(contract.sign_on), // Use formatDate function
                getPortName(contract.sign_on_port),
                getPortName(contract.sign_off_port),
                contract.wages,
                contract.wages_types,
                contract.company_name,
                contract.aoa_number,
                contract.currency,
                contract.emigrate_number,
                contract.eoc,
                contract.reason_for_sign_off,
                getNationalityName(contract.nationality),
                contract.indos_number,
                contract.indian_cdc_document_number,
                contract.bank_name,
                contract.account_num,
                contract.bank_addr,
                contract.ifsc_code,
                contract.swift_code,
                contract.beneficiary,
                contract.beneficiary_addr,
                contract.pan_num,
                contract.passbook,
                contract.pan_card,
                contract.branch,
                contract.types,
                contract.passport_document_number,
                contract.userName,
            ]);

            const ws = XLSX.utils.aoa_to_sheet([[
                'Candidate ID',
                'Full Name',
                'Rank',
                'Vessel Name',
                'Vessel Type',
                'Sign Off',
                'Sign On',
                'Sign On Port',
                'Sign Off Port',
                'Wages',
                'Wages Types',
                'Company Name',
                'AOA Number',
                'Currency',
                'Emigrate Number',
                'EOC',
                'Reason for Sign Off',
                'Nationality',
                'INDOS Number',
                'Indian CDC Document Number',
                'Bank Name',
                'Account Number',
                'Bank Address',
                'IFSC Code',
                'Swift Code',
                'Beneficiary',
                'Beneficiary Address',
                'PAN Number',
                'Passbook',
                'PAN Card',
                'Branch',
                'Types',
                'Passport Document Number',
                'User Name',
            ], ...data]);

            XLSX.utils.book_append_sheet(wb, ws, 'Sign Off Contracts');
            XLSX.writeFile(wb, 'sign_off_contracts.xlsx');
        }

        // Create the export button
        const exportContainerSignOff = document.getElementById('exportContainerSignOff');
        const exportButton = document.createElement('button');
        exportButton.classList.add('btn', 'btn-success', 'p-0', 'ps-2','pe-2');
        exportButton.textContent = 'Export to Excel';
        exportButton.addEventListener('click', exportToExcel);
        exportContainerSignOff.appendChild(exportButton);

        // Create or update fetched data message
        let fetchedDataMessage = document.getElementById('countSignOff');
        if (fetchedDataMessage) {
            fetchedDataMessage.textContent = `${contracts.length} records fetched`; // Update count correctly
        } else {
            fetchedDataMessage = document.createElement('span');
            fetchedDataMessage.id = 'countSignOff';
            fetchedDataMessage.className = 'border ps-2 pe-2 pt-1 pb-1 rounded-2';
            fetchedDataMessage.textContent = `${contracts.length} records fetched`;
            document.querySelector('.container').appendChild(fetchedDataMessage); // Append if it doesn't exist
        }

        // Function to render table with headers and data
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

            // Create table headers dynamically
            const headerRow = document.createElement('tr');
            [
                'S.No',
                'Candidate&nbsp;ID',
                'Full&nbsp;Name',
                'Rank',
                'Vessel&nbsp;Name',
                'Vessel&nbsp;Type',
                'Sign&nbsp;Off',
                'Sign&nbsp;On',
                'Sign&nbsp;On&nbsp;Port',
                'Sign&nbsp;Off&nbsp;Port',
                'Wages',
                'Wages&nbsp;Types',
                'Company&nbsp;Name',
                'AOA&nbsp;Number',
                'Currency',
                'Emigrate&nbsp;Number',
                'EOC',
                'Reason&nbsp;for&nbsp;Sign&nbsp;Off',
                'Nationality',
                'INDOS&nbsp;Number',
                'Indian&nbsp;CDC&nbsp;Document&nbsp;Number',
                'Bank&nbsp;Name',
                'Account&nbsp;Number',
                'Bank&nbsp;Address',
                'IFSC&nbsp;Code',
                'Swift&nbsp;Code',
                'Beneficiary',
                'Beneficiary&nbsp;Address',
                'PAN&nbsp;Number',
                'Passbook',
                'PAN&nbsp;Card',
                'Branch',
                'Types',
                'Passport&nbsp;Document&nbsp;Number',
                'User&nbsp;Name',
            ].forEach(headerText => {
                const header = document.createElement('th');
                header.innerHTML = headerText; // Use innerHTML to include &nbsp; characters
                header.style.backgroundColor='#201E43';
                header.style.color='white';
                headerRow.appendChild(header);
            });
            signOffTableBody.appendChild(headerRow);

            // Populate table body with data
            filteredContracts.forEach((contract, index) => {
                const row = document.createElement('tr');
                [
                    index + 1, // Serial Number (S.No)
                    `<a href="javascript:void(0);" onclick="viewCandidate('${contract.candidateId}')">${contract.candidateId}</a>`,
                    contract.fname + ' ' + contract.lname,
                    contract.rank,
                    contract.vesselName,
                    contract.vesselType,
                    formatDate(contract.sign_off), // Use formatDate function
                    formatDate(contract.sign_on), // Use formatDate function
                    getPortName(contract.sign_on_port),
                    getPortName(contract.sign_off_port),
                    contract.wages,
                    contract.wages_types,
                    contract.company_name,
                    contract.aoa_number,
                    contract.currency,
                    contract.emigrate_number,
                    contract.eoc,
                    contract.reason_for_sign_off,
                    getNationalityName(contract.nationality),
                    contract.indos_number,
                    contract.indian_cdc_document_number,
                    contract.bank_name,
                    contract.account_num,
                    contract.bank_addr,
                    contract.ifsc_code,
                    contract.swift_code,
                    contract.beneficiary,
                    contract.beneficiary_addr,
                    contract.pan_num,
                    contract.passbook,
                    contract.pan_card,
                    contract.branch,
                    contract.types,
                    contract.passport_document_number,
                    contract.userName,
                ].forEach(field => {
                    const cell = document.createElement('td');
                    cell.innerHTML = field; // Use innerHTML to allow HTML content
                    row.appendChild(cell);
                });

                signOffTableBody.appendChild(row);
            });

            // Update total number of contracts fetched
            fetchedDataMessage.textContent = `${filteredContracts.length} records fetched`;
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
        const response = await axios.get('https://nsnemo.com/candidate/dueforsignoff', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const contracts = response.data.contracts;

        // Clear existing table, if any
        const tableContainer = document.getElementById('DuesignOffTable');
        tableContainer.innerHTML = '';

        // Display number of records fetched
        const recordCount = document.createElement('p');
        recordCount.textContent = `${contracts.length} records fetched`;
        recordCount.classList.add('text-info');
        tableContainer.appendChild(recordCount);

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

        // Function to format dates
        function formatDate(date) {
            return date === '1970-01-01' ? '' : new Date(date).toLocaleDateString();
        }

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
                    contract.candidateId || 'N/A',
                    contract.fname || 'N/A',
                    contract.lname || 'N/A',
                    getNationalityName(contract.nationality) || 'N/A',
                    contract.rank || 'N/A',
                    contract.vesselName || 'N/A',
                    formatDateNew(contract.eoc), // Use formatDate function
                    contract.company_name || 'N/A'
                ];
                fields.forEach((field, fieldIndex) => {
                    const cell = document.createElement('td');
                    cell.textContent = field;
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

        // Create export button
        const exportButton = document.createElement('button');
        exportButton.textContent = 'Export to Excel';
        exportButton.classList.add('btn', 'btn-dark', 'mt-3', 'float-end', 'mb-2', 'text-success');
        exportButton.addEventListener('click', async () => {
            try {
                // Process contracts data
                const processedContracts = contracts.map(contract => ({
                    ...contract,
                    vslName: getVesselName(contract.vslName) || 'N/A',
                    nationality: getNationalityName(contract.nationality) || 'N/A',
                    eoc: formatDateNew(contract.eoc) // Format date for export
                }));
        
                // Define the desired order of fields
                const orderedFields = [
                    'candidateId', 'fname', 'lname', 'rank', 
                    'vslName', 'vesselName', 'company_name', 
                    'eoc', 'category', 'nationality'
                ];
        
                // Map processed data to the desired order
                const orderedData = processedContracts.map(contract => 
                    orderedFields.reduce((obj, key) => {
                        obj[key] = contract[key] || ''; // Ensure keys exist
                        return obj;
                    }, {})
                );
        
                // Convert ordered data to Excel
                const ws = XLSX.utils.json_to_sheet(orderedData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'DueSignOffCandidates');
                XLSX.writeFile(wb, 'dueSignOffCandidates.xlsx');
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
        const response = await axios.get('https://nsnemo.com/candidate/reports/avb-date', {
            params: params
        });

        console.log(response.data); // Assuming the server sends back some data
        const candidates = response.data.candidates;

        // Update the data count element
        const dataCountElement = document.getElementById('avbCandCount');
        dataCountElement.innerHTML = `<span class='text-success'>${candidates.length}</span> data fetched`;

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
                    candidate.avb_date,
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
            // Create a new div for pagination controls
            const paginationContainer = document.createElement('div');
            paginationContainer.id = 'paginationContaineravbdate';
            paginationContainer.style.display = 'flex';
            paginationContainer.style.flexWrap = 'nowrap';
            paginationContainer.style.overflowX = 'auto';
            paginationContainer.style.padding = '0';
            paginationContainer.style.margin = '0';
            paginationContainer.style.whiteSpace = 'nowrap';

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

            // Clear existing pagination container if it exists
            const existingPaginationContainer = document.getElementById('paginationContaineravbdate');
            if (existingPaginationContainer) {
                existingPaginationContainer.remove();
            }

            // Append the new pagination container after the table
            tableContainer.parentNode.appendChild(paginationContainer);
        }

        // Helper function to create pagination button
        function createPaginationButton(text, isEnabled, onClick) {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-primary', 'btn-sm', 'mx-1');
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
        const response = await axios.get('https://nsnemo.com/candidate/reports/renewal', {
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
        const response = await axios.get('https://nsnemo.com/candidate/onboard', {
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
                <td style='font-size:10px'>${start + index + 1}</td>
                <td style='font-size:10px'>
                    <button onclick="viewCandidate(${contract.candidateId})" class="btn btn-link">${contract.candidateId}</button>
                </td>
                <td style='font-size:10px'>${contract.fname}</td>
                <td style='font-size:10px'>${contract.lname}</td>
                <td style='font-size:10px'>${contract.birth_place}</td>
                <td style='font-size:10px'>${contract.rank}</td>
                <td style='font-size:10px'>${getNationalityName(contract.nationality)}</td>
                <td style='font-size:10px'>${formatDateNew(contract.dob) === '1970-01-01' || formatDateNew(contract.dob) === '01-01-1970' ? '' : formatDateNew(contract.dob)}</td>
                <td style='font-size:10px'>${calculateAge(contract.dob) === '1970-01-01' || calculateAge(contract.dob) === '01-01-1970' ? '' : calculateAge(contract.dob)}</td>
                <td style='font-size:10px'>${contract.company_name}</td>
                <td style='font-size:10px'>${contract.currency}</td>
                <td style='font-size:10px'>${formatDateNew(contract.eoc) === '1970-01-01' || formatDateNew(contract.eoc) === '01-01-1970' ? '' : formatDateNew(contract.eoc)}</td>
                <td style='font-size:10px'>${formatDateNew(contract.sign_on) === '1970-01-01' || formatDateNew(contract.sign_on) === '01-01-1970' ? '' : formatDateNew(contract.sign_on)}</td>
                <td style='font-size:10px'>${formatDateNew(contract.sign_off) === '1970-01-01' || formatDateNew(contract.sign_off) === '01-01-1970' ? '' : formatDateNew(contract.sign_off)}</td>
                <td style='font-size:10px'>${getPortName(contract.sign_on_port)}</td>
                <td style='font-size:10px'>${contract.vesselName}</td>
                <td style='font-size:10px'>${contract.vesselType}</td>
                <td style='font-size:10px'>${contract.wages}</td>
                <td style='font-size:10px'>${contract.wages_types}</td>
            </tr>
        `).join('');
    
        tableBody.innerHTML = rows;
    }
    

    function updatePaginationControls() {
        paginationControls.innerHTML = '';

        const totalPages = Math.ceil(filteredContracts.length / rowsPerPage);

        const paginationDiv = document.createElement('nav');
        paginationDiv.setAttribute('aria-label', 'Page navigation');

        const ul = document.createElement('ul');
        ul.classList.add('pagination');

        // Previous button
        if (currentPage > 1) {
            const prevButton = document.createElement('li');
            prevButton.classList.add('page-item');
            const prevLink = document.createElement('a');
            prevLink.classList.add('page-link');
            prevLink.href = '#';
            prevLink.textContent = 'Previous';
            prevLink.addEventListener('click', () => {
                currentPage--;
                displayTableRows();
                updatePaginationControls();
            });
            prevButton.appendChild(prevLink);
            ul.appendChild(prevButton);
        } else {
            const prevButton = document.createElement('li');
            prevButton.classList.add('page-item', 'disabled');
            const prevLink = document.createElement('a');
            prevLink.classList.add('page-link');
            prevLink.href = '#';
            prevLink.textContent = 'Previous';
            prevButton.appendChild(prevLink);
            ul.appendChild(prevButton);
        }

        // Page numbers
        const maxPageButtons = 5; // Maximum number of page buttons to show
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }

        if (startPage > 1) {
            const firstPage = document.createElement('li');
            firstPage.classList.add('page-item');
            const firstPageLink = document.createElement('a');
            firstPageLink.classList.add('page-link');
            firstPageLink.href = '#';
            firstPageLink.textContent = '1';
            firstPageLink.addEventListener('click', () => {
                currentPage = 1;
                displayTableRows();
                updatePaginationControls();
            });
            firstPage.appendChild(firstPageLink);
            ul.appendChild(firstPage);
            
            if (startPage > 2) {
                const ellipsis = document.createElement('li');
                ellipsis.classList.add('page-item', 'disabled');
                const ellipsisLink = document.createElement('a');
                ellipsisLink.classList.add('page-link');
                ellipsisLink.href = '#';
                ellipsisLink.textContent = '...';
                ellipsis.appendChild(ellipsisLink);
                ul.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.classList.add('page-item');
            if (i === currentPage) {
                pageItem.classList.add('active');
            }
            const pageLink = document.createElement('a');
            pageLink.classList.add('page-link');
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', () => {
                currentPage = i;
                displayTableRows();
                updatePaginationControls();
            });
            pageItem.appendChild(pageLink);
            ul.appendChild(pageItem);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('li');
                ellipsis.classList.add('page-item', 'disabled');
                const ellipsisLink = document.createElement('a');
                ellipsisLink.classList.add('page-link');
                ellipsisLink.href = '#';
                ellipsisLink.textContent = '...';
                ellipsis.appendChild(ellipsisLink);
                ul.appendChild(ellipsis);
            }

            const lastPage = document.createElement('li');
            lastPage.classList.add('page-item');
            const lastPageLink = document.createElement('a');
            lastPageLink.classList.add('page-link');
            lastPageLink.href = '#';
            lastPageLink.textContent = totalPages;
            lastPageLink.addEventListener('click', () => {
                currentPage = totalPages;
                displayTableRows();
                updatePaginationControls();
            });
            lastPage.appendChild(lastPageLink);
            ul.appendChild(lastPage);
        }

        // Next button
        if (currentPage < totalPages) {
            const nextButton = document.createElement('li');
            nextButton.classList.add('page-item');
            const nextLink = document.createElement('a');
            nextLink.classList.add('page-link');
            nextLink.href = '#';
            nextLink.textContent = 'Next';
            nextLink.addEventListener('click', () => {
                currentPage++;
                displayTableRows();
                updatePaginationControls();
            });
            nextButton.appendChild(nextLink);
            ul.appendChild(nextButton);
        } else {
            const nextButton = document.createElement('li');
            nextButton.classList.add('page-item', 'disabled');
            const nextLink = document.createElement('a');
            nextLink.classList.add('page-link');
            nextLink.href = '#';
            nextLink.textContent = 'Next';
            nextButton.appendChild(nextLink);
            ul.appendChild(nextButton);
        }

        paginationDiv.appendChild(ul);
        paginationControls.appendChild(paginationDiv);
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
        getNationalityName(contract.nationality),
        formatDateNew(contract.dob),
        calculateAge(contract.dob),
        contract.company_name,
        contract.currency,
        formatDateNew(contract.eoc),
        formatDateNew(contract.sign_on),
        formatDateNew(contract.sign_off),
        getPortName(contract.sign_on_port),
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








function viewCandidate(id) {
    // Add your view logic here
    window.open(`./view-candidate.html?id=${id}`, '_blank');

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
                const url = `https://nsnemo.com/candidate/reminder?startDate=${startDate}&endDate=${endDate}`;
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

        const response = await axios.get('https://nsnemo.com/candidate/crewlist', {
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
        searchInput.classList.add('form-control', 'p-0','mt-2','mb-2');
        searchInput.style.width='150px'
        searchInput.type = 'text';
        searchInput.placeholder = 'Search...';
        searchInput.id = 'crewListMonthWiseSearchInput';
        crewListResults.appendChild(searchInput);

        // Create rows per page select
        const rowsPerPageSelect = document.createElement('select');
        rowsPerPageSelect.classList.add('form-select', 'p-2','mt-2','mb-2');
        rowsPerPageSelect.style.width='100px'
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
        exportButton.classList.add('btn', 'btn-success','p-0','ps-2','pe-2');
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
    table.classList.add('table', 'table-bordered','table-sm');

    // Create table header
    const tableHeader = document.createElement('thead');
const headerRow = document.createElement('tr');
const headers = [
    'S.No', 'Candidate ID', 'First Name', 'Last Name', 'Rank', 
    'Nationality', 'Company', 'Currency', 'EOC', 'Sign On', 'Sign On Port', 'Sign Off Port',
    'Sign Off', 'Vessel Name', 'Vessel Type', 'Wages', 'Wage Types',
    'Account Number', 'Bank Name', 'Branch', 'IFSC Code', 
    'SWIFT Code', 'Beneficiary', 'Beneficiary Address', 'Bank Address', 'PAN num', 'PAN card',
    'Indian CDC', 'Passport Document Number'
];

headers.forEach(headerText => {
    const header = document.createElement('th');
    header.innerHTML = headerText.replace(/ /g, '&nbsp;'); // Replace spaces with &nbsp;
    header.scope = 'col';
    header.style.backgroundColor='#201E43'
    header.style.color='#ffffff'
    header.classList.add('text-center');
    headerRow.appendChild(header);
});

tableHeader.appendChild(headerRow);
table.appendChild(tableHeader);


    // Create table body
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
        formatDateNew(contract.eoc),
        formatDateNew(contract.sign_on),
        getPortName(contract.sign_on_port),
        getPortName(contract.sign_off_port),
        formatDateNew(contract.sign_off),
        getVesselName(contract.vslName),
        contract.vesselType,
        contract.wages,
        contract.wages_types,
        contract.account_num,
        contract.bank_name,
        contract.branch,
        contract.ifsc_code,
        contract.swift_code,
        contract.beneficiary,
        contract.beneficiary_addr,
        contract.bank_addr,
        contract.pan_num,
        contract.pan_card,
        contract.indian_cdc_document_number,
        contract.passport_document_number,
    ];

    fields.forEach(field => {
        const cell = document.createElement('td');
        // Check for the specific date values
        if (field === '1970-01-01' || field === '01-01-1970') {
            cell.textContent = ''; // Replace with empty cell
        } else if (typeof field === 'string') {
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
    // const fetchedDataMessage = document.createElement('p');
    // fetchedDataMessage.textContent = `${totalItems} data fetched`;
    // tableContainer.appendChild(fetchedDataMessage);

    // Display number of crewlist matching search criteria
   const dataCount = document.getElementById('dataCount');
dataCount.textContent = `${filteredCrewlist.length}`;


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
                'EOC': formatDateNew(contract.eoc),
                'Sign On': formatDateNew(contract.sign_on),
                'Sign Off': formatDateNew(contract.sign_off),
                'Sign On Port': getPortName(contract.sign_on_port),
                'Sign Off Port': getPortName(contract.sign_off_port),
                'Vessel Name': getVesselName(contract.vslName),
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
                'Bank Address': contract.bank_addr, // New field
                'PAN num':contract.pan_num,
                'PAN card':contract.pan_card,
                'Indian CDC':contract.indian_cdc_document_number,
                'Passport Doc number':contract.passport_document_number
                
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
        const vesselResponse = await axios.get("https://nsnemo.com/others/get-vsls")
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
        const url = `https://nsnemo.com/candidate/reliefplan?startDate=${startDate}&endDate=${endDate}`;
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
                    <td>${formatDateNew(contract.eoc)}</td>
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
            formatDateNew(contract.eoc)
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
        const userResponse = await axios.get("https://nsnemo.com/user/userdropdown");
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
        const userResponse = await axios.get("https://nsnemo.com/user/userdropdown");
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

        const url = `https://nsnemo.com/candidate/reminder?startDate=${startDate}&endDate=${endDate}`;
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
    // Add your view logic here
    window.open(`./view-candidate.html?id=${id}`, '_blank');

}


document.getElementById('getData').addEventListener('click', async () => {
    let startDate = document.getElementById('startDatemis').value;
    startDate=startDate+'T00:00:00Z'
    let endDate = document.getElementById('endDatemis').value;
    endDate=endDate+'T23:59:59Z'

    try {
        const response = await axios.get('https://nsnemo.com/candidate/mis', {
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
        const response = await axios.get(`https://nsnemo.com/company/get-company/${companyId}`, { headers: { "Authorization": token } });
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


  
  let pagenumber = 1
    let totalPagesCandidates = 0; // Global variable to keep track of the total number of pages for candidates
  let totalPagesContracts = 0; // Global variable to keep track of the total number of pages for contracts
  
  async function handleDueForWorkedWithSubmit(event, pages = 1) {
      event.preventDefault(); // Prevent default form submission behavior
  
      try {
          // Get the selected value from the dropdown
          const pageSize = document.getElementById('pageSizeSelect').value;
  
          // Send request to fetch candidates with 'ntbr' and contracts with pagination parameters
          const response = await axios.get('https://nsnemo.com/candidate/worked', {
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
  function viewCandidate(id) {
    // Add your view logic here
    window.open(`./view-candidate.html?id=${id}`, '_blank');

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
        const nationalityResponse = await axios.get("https://nsnemo.com/others/country-codes");
        nationalityData = nationalityResponse.data.countryCodes;
        
        // Fetch other necessary data
        const serverResponse = await axios.get("https://nsnemo.com/others/get-vsls", { headers: { "Authorization": token } });
        console.log(serverResponse)
        vslsData= serverResponse.data.vessels
        const serverResponseUser = await axios.get('https://nsnemo.com/user/userdropdown');
        userData = serverResponseUser.data
        const serverResponsecomp = await axios.get('https://nsnemo.com/company/dropdown-company');
        companyData= serverResponsecomp.data.companies
        console.log('Data fetched successfully');

        const serverrespPort = await axios.get('https://nsnemo.com/others/get-ports')
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

    const rankResponse = await axios.get("https://nsnemo.com/others/get-ranks", { headers: { "Authorization": token } });
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
function getUserName(id){
    const user = userData.find(user=>user.id==id);
    return user ? user.userName : id;
}