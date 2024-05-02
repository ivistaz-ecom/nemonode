const token = localStorage.getItem('token');

async function displayVessels(page = 1, limit = 10) {
    try {
        // Fetch vessels from the server with pagination parameters
        const vesselResponse = await axios.get(`https://nemonode.ivistaz.co/others/view-vessels?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        const vesselList = document.getElementById("vessel-list");

        // Clear existing rows
        vesselList.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each vessel to the table
        vesselResponse.data.vessels.forEach((vessel, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${vessel.vesselName}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="editVessel('${vessel.id}','${vessel.vesselName}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteVessel('${vessel.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            vesselList.appendChild(row);
        });

        // Display pagination controls
        const paginationControls = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayVessels(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayVessels(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(vesselResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(vesselResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayVessels(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(vesselResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayVessels(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(vesselResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayVessels(${Math.ceil(vesselResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(vesselResponse.data.totalPages)} pages </span>

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
    await  displayVessels();
    await displayVesselTypes();
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
};




function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);





async function deleteVessel(vesselId, event) {
    event.preventDefault(); // Prevent default form submission behavior

    const url = `https://nemonode.ivistaz.co/others/delete-vessels/${vesselId}`;

    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayVessels(); // Refresh the vessel list after deletion
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

async function editVessel(vesselId, vesselName, event) {
    event.preventDefault();
    document.getElementById("u_vessel_id").value = vesselId;
    document.getElementById("u_vessel_name").value = vesselName;
    const editVessel2URL = `edit-vessel-2.html?vesselId=${vesselId}&vesselName=${encodeURIComponent(vesselName)}`;
    
    // Navigate to edit-vessel-2.html
    window.location.href = editVessel2URL;
}

const updateVesselButton = document.getElementById("update-vessel-form");
updateVesselButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const vesselId = document.getElementById("u_vessel_id").value;

    const updatedVesselDetails = {
        id: vesselId,
        vesselName: document.getElementById("u_vessel_name").value,
    };

    try {
        const response = await axios.put(`https://nemonode.ivistaz.co/others/update-vessels/${vesselId}`, updatedVesselDetails, { headers: { "Authorization": token } });
        console.log('Response:', response.data);
        alert("Vessel Updated Successfully!");
        displayVessels();
    } catch (error) {
        console.error('Error:', error);
    }
})

async function displayVesselTypes(page = 1, limit = 10) {
    try {
        // Fetch vessel types from the server with pagination parameters
        const vslTypeResponse = await axios.get(`https://nemonode.ivistaz.co/others/view-vsl?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        console.log('VSL Type Response:', vslTypeResponse);

        const vslTypeList = document.getElementById("vsl-list");

        // Clear existing rows
        vslTypeList.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each vessel type to the table
        vslTypeResponse.data.vsls.forEach((vslType, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${vslType.vesselName}</td>
                <td>${vslType.vesselType}</td>
                <td>${vslType.vsl_company}</td>
                <td>${vslType.imoNumber}</td>
                <td>${vslType.vesselFlag}</td>
                <td>
                    <button class="btn border-0 p-0 m-0" onclick="editVesselType('${vslType.id}','${vslType.vesselName}','${vslType.vesselType}','${vslType.vsl_company}','${vslType.imoNumber}','${vslType.vesselFlag}', event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 p-0 m-0" onclick="deleteVesselType('${vslType.id}', event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            vslTypeList.appendChild(row);
        });

        // Display pagination controls
        const paginationControlsVsl = document.getElementById("pagination-controls-vsl");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayVesselTypes(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayVesselTypes(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(vslTypeResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(vslTypeResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayVesselTypes(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(vslTypeResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayVesselTypes(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(vslTypeResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayVesselTypes(${Math.ceil(vslTypeResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(vslTypeResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControls
        paginationControlsVsl.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}






function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}





// Function to delete a vessel type
async function deleteVesselType(vesselTypeId, event) {
    event.preventDefault(); // Prevent default form submission behavior

    const url = `https://nemonode.ivistaz.co/others/delete-vsl/${vesselTypeId}`;

    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayVesselTypes(); // Refresh the vessel type list after deletion
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

async function editVesselType(id, vesselName, vesselType, vslCompany, imoNumber, vesselFlag, event) {
    event.preventDefault();

    const editVesselTypeURL = `edit-vessel-2.html?` +
        `id=${id}&` +
        `vesselName=${encodeURIComponent(vesselName)}&` +
        `vesselType=${encodeURIComponent(vesselType)}&` +
        `vslCompany=${encodeURIComponent(vslCompany)}&` +
        `imoNumber=${encodeURIComponent(imoNumber)}&` +
        `vesselFlag=${encodeURIComponent(vesselFlag)}`;

    window.location.href = editVesselTypeURL;
    console.log(editVesselTypeURL)
}




// Assume you have a form for updating vessel types similar to the updateVesselButton form
// const updateVesselTypeButton = document.getElementById("update-vsl-form");
// updateVesselTypeButton.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const vesselTypeId = document.getElementById("u_vessel_id").value;

//     const updatedVesselTypeDetails = {
//         id: vesselTypeId,
//         vesselName: document.getElementById("u_vessel_name").value,
//         // Add other fields as needed for updating
//     };

//     try {
//         const response = await axios.put(`https://nemonode.ivistaz.co/others/update-vsl/${vesselTypeId}`, updatedVesselTypeDetails, { headers: { "Authorization": token } });
//         console.log('Response:', response.data);
//         alert("Vessel Type Updated Successfully!");
//         displayVesselTypes();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// });
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