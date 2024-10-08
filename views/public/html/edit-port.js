if (!token) {
  // Redirect to the login page
  window.location.href = './loginpage.html';
}
async function displayPort(page = 1, limit = 10) {
    try {
        // Fetch ports from the server with pagination parameters
        const portResponse = await axios.get(`${config.APIURL}others/view-port?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        console.log('Port Response:', portResponse);

        const portTable = document.getElementById("port-table");

        // Clear existing rows
        portTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each port to the table
        portResponse.data.ports.forEach((port, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${port.portName}</td>
                <td>
                    <button class="btn m-0 p-0" onclick="editPort('${port.id}','${port.portName}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn m-0 p-0" onclick="deletePort('${port.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            portTable.appendChild(row);
        });

        // Display pagination controls
        const paginationControlsPort = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayPort(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayPort(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(portResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(portResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayPort(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(portResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayPort(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(portResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayPort(${Math.ceil(portResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(portResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControlsPort
        paginationControlsPort.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}



window.onload = async function () {
     displayPort();
};

async function editPort(portId, portName, event) {
    event.preventDefault();
    
    // Encode values for URL
    const encodedPortName = encodeURIComponent(portName);

    // Redirect to edit-port-2.html with encoded values in the query parameters
    const editUrl = `edit-port-2.html?portId=${portId}&portName=${encodedPortName}`;

    // Redirect to the editUrl
    window.location.href = editUrl;
}

async function deletePort(portId, event) {
    event.preventDefault();

    const id = portId;
    const url = `${config.APIURL}others/delete-port/${id}`;

    try {
        const response = await axios.delete(url,{headers:{"Authorization":token}});
        console.log(response);
        displayPort();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}