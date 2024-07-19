const { response } = require("express");

const token = localStorage.getItem('token')
document.addEventListener("DOMContentLoaded", async function() {
    // Get the dropdown items
   await populateHospitalDropdown()
  
    const urlParams = new URLSearchParams(window.location.search);

    // Get values by parameter name
    const id = urlParams.get('id');
    const hospitalName = urlParams.get('hospitalName');
    const place = urlParams.get('place');
    const date = urlParams.get('date');
    const expiry_date = urlParams.get('expiry_date');
    const done_by = urlParams.get('done_by');
    const status = urlParams.get('status');
    const amount = urlParams.get('amount');
    const upload = urlParams.get('upload');
    const created_by = urlParams.get('created_by');


    // Log the retrieved data to the console
    console.log('ID:', id);
    console.log('Hospital Name:', hospitalName);
    console.log('Place:', place);
    console.log('Date:', date);
    console.log('Expiry Date:', expiry_date);
    console.log('Done By:', done_by);
    console.log('Status:', status);
    console.log('Amount:', amount);
    console.log('Upload:', upload);
    console.log('created_by:', created_by);

    document.getElementById('med_id').value = id;
    document.getElementById('hospital_name').value = hospitalName;
    document.getElementById('hospital_place').value = place;
    document.getElementById('hospital_date').value = date;
    document.getElementById('hospital_exp_date').value = expiry_date;
    document.getElementById('hospital_done').value = done_by;
    document.getElementById('hospital_status').value = status;
    document.getElementById('hospital_amount').value = amount;
    document.getElementById('created_by').value = created_by;
    // document.getElementById('hospital_upload').value = upload;

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
            hospitalDropdown.value=hospitalName

        } catch (error) {
            console.error('Error fetching hospital names:', error);
        }
    }

    let dropdownItems = document.querySelectorAll(".dropdown-item");

    // Add click event listener to each dropdown item
    dropdownItems.forEach(function(item) {
        item.addEventListener("click", function() {
            // Get the id attribute of the clicked item
            var itemId = item.id;
            const urlParams = new URLSearchParams(window.location.search);
    
            // Get the candidateId from the URL parameter
            const memId = urlParams.get('memId');
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
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const med_id = document.getElementById('med_id').value;
    const newUploadFile = document.getElementById('hospital_new_upload').files[0];
    let uploadedFileName = document.getElementById('hospital_upload').value.trim();

    // Check if there's a new file to upload
    if (newUploadFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', newUploadFile);
        
        try {
            const uploadResponse = await axios.post('/upload7', uploadFormData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            uploadedFileName = uploadResponse.data.filename
            console.log('File uploaded successfully');
        } catch (err) {
            console.error('Error uploading file:', err);
            return;
        }
    }

    // Collect form data
    const formData = {
        id: med_id,
        hospitalName: document.getElementById('hospital_name').value,
        place: document.getElementById('hospital_place').value,
        date: document.getElementById('hospital_date').value,
        expiry_date: document.getElementById('hospital_exp_date').value,
        done_by: document.getElementById('hospital_done').value,
        status: document.getElementById('hospital_status').value,
        amount: document.getElementById('hospital_amount').value,
        upload: uploadedFileName,
        created_by: document.getElementById('created_by').value,
    };

    console.log(formData);

    try {
        // Send data to the server using Axios with async/await
        const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-c-hospital/${med_id}`, formData, {
            headers: { 
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        console.log(response);

        // Handle success
        console.log('Data updated successfully:', response.data);
        const urlParams = new URLSearchParams(window.location.search);
    
        // Get the candidateId from the URL parameter
        const memId = urlParams.get('memId');
    viewCandidate(memId)
    } catch (error) {
        // Handle error
        console.error('Error updating data:', error);
        // You can handle errors and display appropriate messages to the user
    }
});

function viewCandidate(id) {
    // Add your view logic here
    window.location.href=`./view-candidate.html?id=${id}`;

}
// Call the function to populate the dropdown when the page loads
document.addEventListener('DOMContentLoaded', populateHospitalDropdown);


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