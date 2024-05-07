const token = localStorage.getItem('token')
async function displayPortagent(page = 1, limit = 10) {
    try {
        // Fetch port agents from the server with pagination parameters
        const portAgentResponse = await axios.get(`https://nemo.ivistaz.co/others/view-port-agent?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        const portAgentTable = document.getElementById("port-agent-table");

        // Clear existing rows
        portAgentTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each port agent to the table
        portAgentResponse.data.portAgents.forEach((portAgent, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${portAgent.portAgentName}</td>
                <td>${portAgent.contactPerson}</td>
                <td>${portAgent.address}</td>
                <td>${portAgent.phone}</td>
                <td>${portAgent.email}</td>
                <td>${portAgent.city}</td>
                <td>${portAgent.state}</td>
                <td>${portAgent.country}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="editPortagent('${portAgent.id}','${portAgent.portAgentName}','${portAgent.contactPerson}','${portAgent.address}','${portAgent.phone}','${portAgent.email}','${portAgent.city}','${portAgent.state}','${portAgent.country}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deletePortagent('${portAgent.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            portAgentTable.appendChild(row);
        });

        // Display pagination controls
        const paginationControls = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayPortagent(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayPortagent(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(portAgentResponse.data.totalPages); i++) {
            if (i === 1 || i === page || i === page - 1 || i === page + 1 || i === Math.ceil(portAgentResponse.data.totalPages)) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayPortagent(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + 2 && i < Math.ceil(portAgentResponse.data.totalPages)) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(portAgentResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayPortagent(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(portAgentResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayPortagent(${Math.ceil(portAgentResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(portAgentResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControls
        paginationControls.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}







window.onload = async function () {
    displayPortagent();
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    const staff = decodedToken.staff
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
    if(staff)
    {
        document.getElementById('settingsContainer').style.display='none'
        document.getElementById('settingsCard').style.display='block'
    }
};




function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);

async function editPortagent(portAgentId, portAgentName, contactPerson, address, phone, email, city, state, country, event) {
    event.preventDefault();

    // Construct the URL with query parameters
    const editUrl = `edit-portagent-2.html?portAgentId=${encodeURIComponent(portAgentId)}&portAgentName=${encodeURIComponent(portAgentName)}&contactPerson=${encodeURIComponent(contactPerson)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;

    // Redirect to edit-portagent-2.html with the constructed URL
    window.location.href = editUrl;  // Fix: Use the constructed URL here
}



async function deletePortagent(portAgentId, event) {
    event.preventDefault();

    const id = portAgentId;
    const url = `https://nemo.ivistaz.co/others/delete-port-agent/${id}`;

    try {
        const response = await axios.delete(url,{headers:{"Authorization":token}});
        console.log(response);
        displayPortagent();
    } catch (error) {
        console.error('Error during delete request:', error.message);
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