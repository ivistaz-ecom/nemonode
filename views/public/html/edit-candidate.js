const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);

window.onload = async function () {
    try {
        await displayCandidates();
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
    } catch (err) {
        console.log('No entries present');
        console.log(err);
    }
};

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

async function fetchData(url) {
    try {
        const response = await axios.get(url, { headers: { "Authorization": token } });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

async function displayCandidates(page = 1, limit = 10) {
    try {
        const url = `https://nemo.ivistaz.co/candidate/view-candidate?page=${page}&limit=${limit}`;
        const responseData = await fetchData(url);
        const candidates = responseData.candidates;
        const candidateTable = document.getElementById("candidate-table");
        candidateTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        candidates.forEach(candidate => {
            const dob = new Date(candidate.dob);
            const age = calculateAge(dob);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td>${candidate.candidateId}</td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.c_vessel}</td>
                <td>${candidate.c_mobi1}</td>
                <td>${age}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="viewCandidate('${candidate.candidateId}')">
                        <i class="fa fa-eye" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="editCandidate('${candidate.candidateId}')">
                        <i class="fa fa-pencil" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteCandidate('${candidate.candidateId}', event)">
                        <i class="fa fa-trash" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                </td>`;
            candidateTable.appendChild(row);
            sno++;
        });

        updatePagination(responseData.totalPages, page, limit);

    } catch (error) {
        console.error('Error:', error);
    }
}

function updatePagination(totalPages, currentPage, limit) {
    const paginationControls = document.getElementById("pagination-controls");
    let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayCandidates(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayCandidates(${currentPage - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

    const maxButtons = 4;
    for (let i = 1; i <= Math.ceil(totalPages); i++) {
        if (
            i === 1 ||
            i === Math.ceil(totalPages) ||
            (i >= currentPage - 1 && i <= currentPage + maxButtons - 2)
        ) {
            paginationHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayCandidates(${i}, ${limit})">${i}</a>
                                  </li>`;
        } else if (i === currentPage + maxButtons - 1) {
            paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
        }
    }

    paginationHTML += `<li class="page-item ${currentPage === Math.ceil(totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayCandidates(${currentPage + 1 > totalPages ? totalPages : currentPage + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${currentPage === Math.ceil(totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayCandidates(${Math.ceil(totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${currentPage} of ${Math.ceil(totalPages)} pages </span>
                    </ul>
                </nav>`;

    paginationControls.innerHTML = paginationHTML;
}

async function deleteCandidate(candidateId, event) {
    event.preventDefault();
    let id = candidateId;
    console.log(id);
    const url = `https://nemo.ivistaz.co/candidate/delete-candidate/${id}`;
    console.log(url);
    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayCandidates();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

function calculateAge(birthdate) {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

function viewCandidate(candidateId) {
    localStorage.setItem('memId', candidateId);
    window.location.href = './view-candidate.html';
}

function editCandidate(memId) {
    console.log('memId:', memId);
    localStorage.setItem('memId', memId);
    const canEdit = decodedToken.Write;
    if (canEdit) {
        console.log('Edited:', memId);
        window.location.href = `./edit-candidate-2.html?memId=${memId}`;
    } else {
        alert('You do not have permission to edit this candidate.');
    }
}

document.getElementById("logout").addEventListener("click", function() {
    localStorage.clear();
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    localStorage.clear()

    setTimeout(function() {
        document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
    }, 1000);

    setTimeout(function() {
        window.location.href = "loginpage.html";
    }, 2000);
});
