const token = localStorage.getItem('token')
// Fetch and display vendors
async function fetchAndDisplayVendors(page = 1, limit = 10) {
    try {
        const token = localStorage.getItem('token');

        // Fetch vendor data from the server using Axios with async/await
        const response = await axios.get(`https://nemo.ivistaz.co/others/view-vendor?page=${page}&limit=${limit}`, {
            headers: { "Authorization": token }
        });

        // Extract vendors from the response
        const vendors = response.data;

        // Display vendors in the table with pagination
        displayVendors(vendors, page, limit);
    } catch (error) {
        console.error('Error fetching vendors', error);
    }
}

// Display vendors in the table with pagination
function displayVendors(response, page, limit) {
    const vendorListElement = document.getElementById('vendor-list');

    // Clear existing rows
    vendorListElement.innerHTML = '';

    // Check if the response has a "vendors" key
    if (response.vendors) {
        const vendors = response.vendors;

        // Calculate start and end index for pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        // Display vendors within the specified range
        const paginatedVendors = vendors.slice(startIndex, endIndex);

        // Iterate over paginated vendors and create table rows
        paginatedVendors.forEach(vendor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${vendor.id}</td>
                <td>${vendor.vendorName}</td>
                <td>${vendor.vendorAddress}</td>
                <td>
    <button class="btn border-0 m-0 p-0" onclick="editVendor('${vendor.id}','${vendor.vendorName}','${vendor.vendorAddress}',event)">
        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
    </button>
    <button class="btn border-0 m-0 p-0" onclick="deleteVendor('${vendor.id}',event)">
        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
    </button>
</td>

            `;
            vendorListElement.appendChild(row);
        });

        // Display pagination controls
        const paginationControls = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="fetchAndDisplayVendors(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="fetchAndDisplayVendors(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(vendors.length / limit); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(vendors.length / limit) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="fetchAndDisplayVendors(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(vendors.length / limit) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="fetchAndDisplayVendors(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(vendors.length / limit) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="fetchAndDisplayVendors(${Math.ceil(vendors.length / limit)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing page ${page} of ${Math.ceil(vendors.length / limit)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControls
        paginationControls.innerHTML = paginationHTML;
    } else {
        console.error('No "vendors" key found in the response:', response);
    }
}

// Call the fetchAndDisplayVendors function when the page loads

// Call the fetchAndDisplayVendors function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayVendors();
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
});

document.getElementById('addVendorButton').addEventListener('click', async () => {
    try {
        // Get form data
        const vendorName = document.getElementById('vendorName').value.trim();
        const vendorAddress = document.getElementById('vendorAddress').value.trim();

        // Create data object
        const formData = {
            vendorName: vendorName,
            vendorAddress: vendorAddress
        };

        // Send data to the server using Axios with async/await
        const response = await axios.post('https://nemo.ivistaz.co/others/create-vendor', formData,{headers:{"Authorization":token}});

        // Handle success, e.g., show a success message or redirect to another page
        console.log('Vendor added successfully', response.data);
    } catch (error) {
        // Handle error, e.g., show an error message
        console.error('Error adding vendor', error);
    }
});

async function editVendor(vendorId, vendorName, vendorAddress, event) {
    event.preventDefault();
    
    console.log('Edit clicked for vendor ID:', vendorId);

    // Encode values for URL
    const encodedVendorName = encodeURIComponent(vendorName);
    const encodedVendorAddress = encodeURIComponent(vendorAddress);

    // Construct the editUrl with encoded values in the query parameters
    const editUrl = `edit-vendor.html?vendorId=${vendorId}&vendorName=${encodedVendorName}&vendorAddress=${encodedVendorAddress}`;

    // Log the generated URL for debugging
    console.log('Edit URL:', editUrl);

    // Redirect to the editUrl
    window.location.href = editUrl;
}


// Delete vendor functionality
async function deleteVendor(vendorId) {
    try {
        const token = localStorage.getItem('token');
        
        // Send a delete request to the server
        const response = await axios.delete(`https://nemo.ivistaz.co/others/delete-vendor/${vendorId}`, {
            headers: { "Authorization": token }
        });

        // Handle success, e.g., update the UI or show a success message
        console.log('Vendor deleted successfully', response.data);

        // Fetch and display updated vendors after deletion
        fetchAndDisplayVendors();
    } catch (error) {
        // Handle error, e.g., show an error message
        console.error('Error deleting vendor', error);
    }
}

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



    
    





function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);


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