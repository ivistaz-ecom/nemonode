async function displayExperiences(page = 1, limit = 10) {
    try {
        // Fetch experiences from the server with pagination parameters
        const expResponse = await axios.get(`${config.APIURL}others/view-experience?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        console.log('Experience Response:', expResponse);

        const expTable = document.getElementById("exp-table");

        // Clear existing rows
        expTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each experience to the table
        expResponse.data.experiences.forEach((exp, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${exp.experience}</td>
                <td>
                    <button class="btn p-0 m-0" onclick="editExperience('${exp.id}','${exp.experience}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn p-0 m-0" onclick="deleteExperience('${exp.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            expTable.appendChild(row);
        });

        // Display pagination controls
        const paginationControlsExp = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayExperiences(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayExperiences(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(expResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(expResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayExperiences(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(expResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayExperiences(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(expResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayExperiences(${Math.ceil(expResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(expResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to paginationControlsExp
        paginationControlsExp.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}

window.onload = async function () {
    displayExperiences();
};

async function deleteExperience(expId, event) {
    event.preventDefault();
    const id = expId;
    const url = `${config.APIURL}others/delete-experience/${id}`;
    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayExperiences(); // Refresh the experience list after deletion
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

async function editExperience(expId, expr, event) {
    event.preventDefault();
    document.getElementById('u_experience_id').value = expId;
    document.getElementById("u_experience_name").value = expr;
    const editUrl = `edit-experience-2.html?expId=${encodeURIComponent(expId)}&expr=${encodeURIComponent(expr)}`;
    // Redirect to the editUrl
    window.location.href = editUrl;
}

// Add event listener for updating Experience
const updateExperienceButton = document.getElementById("update-experience-form");
updateExperienceButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const experienceId = document.getElementById("u_experience_id").value;

    const updatedExperienceDetails = {
        id: experienceId,
        experience: document.getElementById("u_experience_name").value,
    };

    try {
        const response = await axios.put(`${config.APIURL}others/update-experience/${experienceId}`, updatedExperienceDetails, { headers: { "Authorization": token } });
        console.log('Response:', response.data);
        alert("Experience Updated Successfully!");
        displayExperiences();
    } catch (error) {
        console.error('Error:', error);
    }
});