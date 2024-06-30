const token = localStorage.getItem('token')
function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
document.addEventListener('DOMContentLoaded', async function () {
    const candidateId= localStorage.getItem('memId')
        const id = candidateId;
        const decodedToken = decodeToken(token);
    console.log(decodedToken)
   await populateHospitalDropdown()
const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}

        try {
            const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-hospital-details/${id}`, {
                headers: {
                    'Authorization': token,
                },
            });

            // Check if the request was successful
            if (response.status) {
                const data = response.data;

                // Update the table with the fetched data
                updateHospitalTable(data);
            } else {
                console.error('Failed to fetch data. Server returned:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }

    async function updateHospitalTable(data) {
        const hospitalTableBody = document.getElementById('hospitalTableBody');

        // Clear existing rows
        hospitalTableBody.innerHTML = '';

        // Populate the table with the fetched data
        data.forEach(hospital => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class='badge bg-success'>${hospital.hospitalName}</span></td>
                <td>${hospital.place}</td>
                <td>${hospital.date}</td>
                <td>${hospital.expiry_date}</td>
                <td>${hospital.done_by}</td>
                <td>${hospital.status}</td>
                <td>${hospital.amount}</td>
                <td>${hospital.upload}</td>
                <td>${hospital.created_by}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editMedical('${hospital.id}', '${hospital.hospitalName}', '${hospital.place}', '${hospital.date}', '${hospital.expiry_date}', '${hospital.done_by}', '${hospital.status}', '${hospital.amount}', '${hospital.upload}','${hospital.created_by}')">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteMedical('${hospital.id}')">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;
            hospitalTableBody.appendChild(row);
        });
    }
      
       

        let dropdownItems = document.querySelectorAll(".dropdown-item");
    
        // Add click event listener to each dropdown item
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function() {
                // Get the id attribute of the clicked item
                var itemId = item.id;
                const memId= localStorage.getItem('memId')
                // Define the destination URLs based on the clicked item
                var destinationPage = "";
                switch (itemId) {
                    case "personal":
                        destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                        break;
                    case "discussion":
                        destinationPage =`./edit-discussion.html?memId=${memId}`;
                        break;
                    case "contract":
                        destinationPage = `./add-c-contract.html?memId=${memId}`;
                        break;
                    case "document":
                        destinationPage = `./add-c-document.html?memId=${memId}`;
                        break;
                    case "bank":
                        destinationPage = `./add-c-bank.html?memId=${memId}`;
                        break;
                    case "travel":
                        destinationPage = `./add-c-travel.html?memId=${memId}`;
                        break;
                    case "medicals":
                        destinationPage = `./add-c-medicals.html?memId=${memId}`;
                        break;
                    case "nkd":
                        destinationPage = `./add-c-nkd.html?memId=${memId}`;
                        break;
                        case 'seaservice':
                        destinationPage=`./seaservicetable.html?memId=${memId};`;
                        break;
                    default:
                        // Handle default case or do nothing
                        break;
                }
    
                // Redirect to the destination page¯
                if (destinationPage !== "") {
                    window.location.href = destinationPage;
                }
            });
            
        });

        async function populateHospitalDropdown() {
            const token = localStorage.getItem('token');
            try {
                const hospitalResponse = await axios.get("https://nemo.ivistaz.co/others/get-hospital", { 
                    headers: { "Authorization": token } 
                });
                console.log(hospitalResponse);
                const hospitals = hospitalResponse.data.hospital;
                const hospitalDropdown = document.getElementById('hospital_name');
                hospitalDropdown.innerHTML = ''; // Clear existing options
                for (let i = 0; i < hospitals.length; i++) {
                    const option = document.createElement('option');
                    option.value = hospitals[i].id;
                    option.text = hospitals[i].hospitalName;
                    hospitalDropdown.appendChild(option);
                }
            } catch (error) {
                console.error('Error fetching hospital names:', error);
            }
        }
      // Add event listener to the submit button
      document.getElementById('medicalForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const memId = localStorage.getItem('memId');
        const hospitalName = document.getElementById('hospital_name').value.trim();
        const place = document.getElementById('place').value.trim();
        const date = document.getElementById('date').value.trim();
        const expiryDate = document.getElementById('expiry_date').value.trim();
        const doneBy = document.getElementById('done_by').value.trim();
        const status = document.getElementById('status').value.trim();
        const amount = document.getElementById('amount').value.trim();
        const newMedicalFile = document.getElementById('upload').files[0];
    
        let uploadFileName = '';
    
        // Upload the file if it exists
        if (newMedicalFile) {
            const medicalFormData = new FormData();
            medicalFormData.append('file', newMedicalFile);
    
            try {
                const response = await axios.post('/upload7', medicalFormData, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                uploadFileName = newMedicalFile.name;
                console.log('Medical file uploaded successfully');
                alert('Medical file uploaded successfully');
            } catch (err) {
                console.error('Error uploading medical file:', err);
                return;
            }
        }
    
        // Prepare medical details
        const medicalDetails = {
            hospital_name: hospitalName,
            place: place,
            date: date,
            expiry_date: expiryDate,
            done_by: doneBy,
            status: status,
            amount: amount,
            upload: uploadFileName,
            created_by: decodedToken.userId
        };
    
        // Submit the form data
        try {
            const response = await axios.post(`https://nemo.ivistaz.co/candidate/hospital-details/${memId}`, medicalDetails, {
                headers: {
                    'Authorization': token,
                    
                }
            });
            console.log('Medical data sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending medical data:', error);
        }
    });
    

    });
    function editMedical(id, hospitalName, place, date, expiry_date, done_by, status, amount, upload,created_by) {
        // You can use this function to perform any actions needed for editing
        console.log('Edit clicked for medical ID:', id);
    
        // You can modify this part to send the data to the server for editing
        // Example: Redirect to an edit page with parameters
        window.location.href = `edit-c-medicals.html?id=${id}&hospitalName=${hospitalName}&place=${place}&date=${date}&expiry_date=${expiry_date}&done_by=${done_by}&status=${status}&amount=${amount}&upload=${upload}&created_by=${created_by}`;
    }

    document.getElementById("logout").addEventListener("click", function() {
        // Display the modal with initial message
        var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        myModal.show();
        
        // Send request to update logged status to false
        const userId = localStorage.getItem('userId');
        if (userId) {
          axios.put(`https://nemo.ivistaz.co/user/${userId}/logout`)
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