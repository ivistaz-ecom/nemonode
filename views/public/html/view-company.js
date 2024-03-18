const token = localStorage.getItem('token');
const decodedToken = decodeToken(token);

window.onload = async function () {
    try {
        displayCompanies();
        const hasUserManagement = decodedToken.userManagement;
        console.log(hasUserManagement);
        if (hasUserManagement) {
            document.getElementById('userManagementSection').style.display = 'block';
            document.getElementById('userManagementSections').style.display = 'block';
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

async function displayCompanies(page = 1, limit = 10) {
    try {
        const response = await axios.get(`http://nemonode.ivistaz.co/company/view-company?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        const companies = response.data.company;
        const companyList = document.getElementById("company-list");
        companyList.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        companies.forEach(company => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td>${company.company_id}</td>
                <td>${company.company_name}</td>
                <td>${company.b_type}</td>
                <td>${company.contact_person}</td>
                <td>${company.email}</td>
                <td>${company.address}</td>
                <td>${company.management}</td>
                <td>${company.phone}</td>
                <td>${formatDate(company.last_update)}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="editCompany('${company.company_id}','${company.company_name}','${company.b_type}','${company.contact_person}','${company.email}','${company.address}','${company.management}','${company.phone}','${company.last_update}',event)" ${company.readOnly ? 'style="display:none;"' : ''}><i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i></button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteCompany('${company.company_id}', event)"><i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i></button>
                </td>`;
            companyList.appendChild(row);
            sno++;
        });

        const paginationControls = document.getElementById("pagination-controls");
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayCompanies(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayCompanies(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        const maxButtons = 4;
        for (let i = 1; i <= Math.ceil(response.data.totalPages); i++) {
            if (
                i === 1 ||
                i === Math.ceil(response.data.totalPages) ||
                (i >= page - 1 && i <= page + maxButtons - 2)
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayCompanies(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(response.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayCompanies(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(response.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayCompanies(${Math.ceil(response.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(response.data.totalPages)} pages </span>
                    </ul>
                </nav>`;

        paginationControls.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}


async function deleteCompany(companyId, event) {
    event.preventDefault();
    let id = companyId;
    console.log(id);
    const url = `http://nemonode.ivistaz.co/company/delete-company/${id}`;
    console.log(url);
    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayCompanies();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

const editCompany = async (companyId, companyname, b_type, contact_person, email, address, management, phone, last_update, event) => {
    event.preventDefault();
    document.getElementById(`u_${b_type.toLowerCase()}`).checked = true;
    const queryParams = {
        companyId,
        companyname,
        b_type,
        contact_person,
        email,
        address,
        management,
        phone,
        last_update: formatDate(last_update),
    };
    const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join('&');
    window.location.href = `./edit-company.html?${queryString}`;
};

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

updateDateTime();
setInterval(updateDateTime, 1000);

document.getElementById('logout').addEventListener('click', function () {
    localStorage.clear();
    window.location.href = './loginpage.html';
});
