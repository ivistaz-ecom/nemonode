const token = localStorage.getItem('token');
let currentPage = 1; // Initialize current page

async function displayGrade(page = 1, limit = 10) {
    try {
        // Fetch grades from the server with pagination parameters
        const gradeResponse = await axios.get(`https://nemonode.ivistaz.co/others/view-grade?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        console.log('Grade Response:', gradeResponse);

        const gradeTable = document.getElementById("grade-table");

        // Clear existing rows
        gradeTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each grade to the table
        gradeResponse.data.grades.forEach((grade, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${grade.gradeExp}</td>
                <td>
                    <button class="btn border-0 p-0 m-0" onclick="editGrade('${grade.id}','${grade.gradeExp}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 p-0 m-0" onclick="deleteGrade('${grade.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            gradeTable.appendChild(row);
        });

        // Display pagination controls
        const paginationControlsGrade = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayGrade(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayGrade(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(gradeResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(gradeResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayGrade(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(gradeResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayGrade(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(gradeResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayGrade(${Math.ceil(gradeResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(gradeResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControlsGrade
        paginationControlsGrade.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}




window.onload = async function () {
     displayGrade();
     const hasUserManagement = decodedToken.userManagement;
     const vendorManagement = decodedToken.vendorManagement;
     console.log(vendorManagement);
     if (hasUserManagement) {
       document.getElementById('userManagementSection').style.display = 'block';
       document.getElementById('userManagementSections').style.display = 'block';
 
     }
     if (vendorManagement) {
       document.getElementById('vendorManagement').style.display = 'block';
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
async function deleteGrade(gradeId, event) {
    event.preventDefault();

    const id = gradeId;
    const url = `https://nemonode.ivistaz.co/others/delete-grade/${id}`;

    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayGrade();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

async function editGrade(gradeId, grade, event) {
    event.preventDefault();
    document.getElementById("u_grade_id").value = gradeId;
    document.getElementById("u_grade_name").value = grade;

    // Encode values for URL
    const encodedGrade = encodeURIComponent(grade);

    // Redirect to edit-grade-2.html with encoded values in the query parameters
    const editUrl = `edit-grade-2.html?gradeId=${gradeId}&grade=${encodedGrade}`;

    // Redirect to the editUrl
    window.location.href = editUrl;
}

document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();

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