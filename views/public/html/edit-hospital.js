const token = localStorage.getItem('token');
let currentHospitalPage = 1; // Initialize current page for hospitals

async function displayHospital(page = 1, limit = 10) {
    try {
        // Fetch hospitals from the server with pagination parameters
        const hospitalResponse = await axios.get(`http://localhost:4000/others/view-hospital?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        console.log('Hospital Response:', hospitalResponse);

        const hospitalTable = document.getElementById("hospital-table");

        // Clear existing rows
        hospitalTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each hospital to the table
        hospitalResponse.data.hospitals.forEach((hospital, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno + index}</td>
                <td>${hospital.hospitalName}</td>
                <td>${hospital.doctorName}</td>
                <td>${hospital.doctorAddress}</td>
                <td>${hospital.doctorCity}</td>
                <td>${hospital.doctorState}</td>
                <td>${hospital.doctorPhone}</td>
                <td>${hospital.doctorEmail}</td>
                <td>${hospital.doctorUpload}</td>
                <td>
                    <button class="btn m-0 p-0" onclick="editHospital('${hospital.id}','${hospital.hospitalName}','${hospital.doctorName}','${hospital.doctorAddress}','${hospital.doctorCity}','${hospital.doctorState}','${hospital.doctorPhone}','${hospital.doctorEmail}','${hospital.doctorUpload}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn m-0 p-0" onclick="deleteHospital('${hospital.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>
            `;
            hospitalTable.appendChild(row);
        });

        // Display pagination controls for hospitals
        const hospitalPaginationControls = document.getElementById("pagination-controls");

        // Initialize the HTML content for pagination controls
        let paginationHTML = `<nav aria-label="Page navigation" class="d-flex justify-content-start">
                                <ul class="pagination">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayHospital(1, ${limit})">
                                            <i class="tf-icon bx bx-chevrons-left"></i>
                                        </a>
                                    </li>
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="javascript:void(0);" onclick="displayHospital(${page - 1}, ${limit})">
                                            <i class="tf-icon bx bx-chevron-left"></i>
                                        </a>
                                    </li>`;

        // Maximum number of buttons to display (including ellipsis)
        const maxButtons = 4;

        // Display the page buttons
        for (let i = 1; i <= Math.ceil(hospitalResponse.data.totalPages); i++) {
            if (
                i === 1 ||                                  // First page
                i === Math.ceil(hospitalResponse.data.totalPages) ||  // Last page
                (i >= page - 1 && i <= page + maxButtons - 2) // Displayed pages around the current page
            ) {
                paginationHTML += `<li class="page-item ${page === i ? 'active' : ''}">
                                      <a class="page-link"  onclick="displayHospital(${i}, ${limit})">${i}</a>
                                  </li>`;
            } else if (i === page + maxButtons - 1) {
                // Add ellipsis (...) before the last button
                paginationHTML += `<li class="page-item disabled">
                                      <span class="page-link">...</span>
                                  </li>`;
            }
        }

        paginationHTML += `<li class="page-item ${page === Math.ceil(hospitalResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayHospital(${page + 1}, ${limit})">
                                <i class="tf-icon bx bx-chevron-right"></i>
                            </a>
                        </li>
                        <li class="page-item ${page === Math.ceil(hospitalResponse.data.totalPages) ? 'disabled' : ''}">
                            <a class="page-link" href="javascript:void(0);" onclick="displayHospital(${Math.ceil(hospitalResponse.data.totalPages)}, ${limit})">
                                <i class="tf-icon bx bx-chevrons-right"></i>
                            </a>
                        </li>
                        <span class='mt-2'> Showing ${page} of ${Math.ceil(hospitalResponse.data.totalPages)} pages </span>

                    </ul>
                </nav>
                `;

        // Set the generated HTML to hospitalPaginationControls
        hospitalPaginationControls.innerHTML = paginationHTML;

    } catch (error) {
        console.error('Error:', error);
    }
}



window.onload = async function () {
  displayHospital();
  const hasUserManagement = decodedToken.userManagement;
  const vendorManagement = decodedToken.vendorManagement;
  const staff = decodedToken.staff;
  console.log(vendorManagement);
  if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
  if (vendorManagement) {
    document.getElementById('vendorManagement').style.display = 'block';
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


async function deleteHospital(hospitalId, event) {
    event.preventDefault();

    const id = hospitalId;
    const url = `http://localhost:4000/others/delete-hospital/${id}`;

    try {
        const response = await axios.delete(url,{headers:{"Authorization":token}});
        console.log(response);
        displayHospital();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}
async function editHospital(id, hospitalName, doctorName, doctorAddress, doctorCity, doctorState, doctorPhone, doctorEmail, doctorUpload, event) {
    event.preventDefault();

    // Set values in the form for submission
    document.getElementById("u_hospital_id").value = id;
    document.getElementById("u_hospital_name").value = hospitalName;
    document.getElementById("u_doctor_name").value = doctorName;
    document.getElementById("u_doctor_address").value = doctorAddress;
    document.getElementById("u_doctor_city").value = doctorCity;
    document.getElementById("u_doctor_state").value = doctorState;
    document.getElementById("u_doctor_phone").value = doctorPhone;
    document.getElementById("u_doctor_email").value = doctorEmail;
    // document.getElementById("u_doctor_upload").value = doctorUpload;

    // Encode values for URL
    const encodedHospitalName = encodeURIComponent(hospitalName);
    const encodedDoctorName = encodeURIComponent(doctorName);
    const encodedDoctorAddress = encodeURIComponent(doctorAddress);
    const encodedDoctorCity = encodeURIComponent(doctorCity);
    const encodedDoctorState = encodeURIComponent(doctorState);
    const encodedDoctorPhone = encodeURIComponent(doctorPhone);
    const encodedDoctorEmail = encodeURIComponent(doctorEmail);
    const encodedDoctorUpload = encodeURIComponent(doctorUpload);

    // Redirect to edit-hospital-2.html with encoded values in the query parameters
    const editUrl = `edit-hospital-2.html?id=${id}&hospitalName=${encodedHospitalName}&doctorName=${encodedDoctorName}&doctorAddress=${encodedDoctorAddress}&doctorCity=${encodedDoctorCity}&doctorState=${encodedDoctorState}&doctorPhone=${encodedDoctorPhone}&doctorEmail=${encodedDoctorEmail}&doctorUpload=${encodedDoctorUpload}`;

    // Redirect to the editUrl
    window.location.href = editUrl;
}

document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`http://localhost:4000/user/${userId}/logout`)
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