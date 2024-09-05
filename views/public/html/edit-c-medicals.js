// Ensure token is available and redirect to login if not
const token = localStorage.getItem('token');
if (!token) {
  window.location.href = './loginpage.html';
}

document.addEventListener("DOMContentLoaded", async function() {
  // Call the function to populate the dropdown
  await populateHospitalDropdown();

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
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

  // Log retrieved data
  console.log('ID:', id);
  console.log('Hospital Name:', hospitalName);
  console.log('Place:', place);
  console.log('Date:', date);
  console.log('Expiry Date:', expiry_date);
  console.log('Done By:', done_by);
  console.log('Status:', status);
  console.log('Amount:', amount);
  console.log('Upload:', upload);
  console.log('Created By:', created_by);

  // Populate form fields
  document.getElementById('med_id').value = id;
  document.getElementById('hospital_name').value = hospitalName;
  document.getElementById('hospital_place').value = place;
  document.getElementById('hospital_date').value = date;
  document.getElementById('hospital_exp_date').value = expiry_date;
  document.getElementById('hospital_done').value = done_by;
  document.getElementById('hospital_status').value = status;
  document.getElementById('hospital_amount').value = amount;
  document.getElementById('created_by').value = created_by;
  document.getElementById('hospital_upload').value = upload;

  // Add click event listeners for dropdown items
  let dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach(function(item) {
    item.addEventListener("click", function() {
      const itemId = item.id;
      const memId = urlParams.get('memId');
      let destinationPage = "";

      switch (itemId) {
        case "personal":
          destinationPage = `./edit-candidate-2.html?memId=${memId}`;
          break;
        case "discussion":
          destinationPage = `./edit-discussion.html?memId=${memId}`;
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
          destinationPage = `./seaservicetable.html?memId=${memId}`;
          break;
        default:
          break;
      }

      if (destinationPage !== "") {
        window.location.href = destinationPage;
      }
    });
  });
});

// Function to populate the hospital dropdown
async function populateHospitalDropdown() {
  const token = localStorage.getItem('token');
  try {
    const hospitalResponse = await axios.get("https://nsnemo.com/others/get-hospital", { 
      headers: { "Authorization": token } 
    });
    const hospitals = hospitalResponse.data.hospital;
    const hospitalDropdown = document.getElementById('hospital_name');
    hospitalDropdown.innerHTML = ''; // Clear existing options
    hospitals.forEach(hospital => {
      const option = document.createElement('option');
      option.value = hospital.id;
      option.text = hospital.hospitalName;
      hospitalDropdown.appendChild(option);
    });

    // Set the dropdown value to the hospitalName from URL
    const urlParams = new URLSearchParams(window.location.search);
    const hospitalName = urlParams.get('hospitalName');
    hospitalDropdown.value = hospitalName;

  } catch (error) {
    console.error('Error fetching hospital names:', error);
  }
}

// Update form data on submission
document.getElementById('updateForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const med_id = document.getElementById('med_id').value;
  const newUploadFile = document.getElementById('hospital_new_upload').files[0];
  let uploadedFileName = document.getElementById('hospital_upload').value.trim();

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
      uploadedFileName = uploadResponse.data.filename;
      console.log('File uploaded successfully');
    } catch (err) {
      console.error('Error uploading file:', err);
      return;
    }
  }

  const formData = {
    hospitalName: document.getElementById('hospital_name').value,
    place: document.getElementById('hospital_place').value,
    date: document.getElementById('hospital_date').value,
    expiry_date: document.getElementById('hospital_exp_date').value,
    done_by: document.getElementById('hospital_done').value,
    status: document.getElementById('hospital_status').value,
    amount: document.getElementById('hospital_amount').value,
    created_by: document.getElementById('created_by').value,
  };

  if (newUploadFile) {
    formData.upload = uploadedFileName;
  }

  try {
    const response = await axios.put(`https://nsnemo.com/candidate/update-c-hospital/${med_id}`, formData, {
      headers: { 
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    console.log('Data updated successfully:', response.data);
    alert('Medical details updated successfully!');
    
    const urlParams = new URLSearchParams(window.location.search);
    const memId = urlParams.get('memId');
    viewCandidate(memId);
  } catch (error) {
    console.error('Error updating data:', error);
  }
});

// Function to view candidate
function viewCandidate(id) {
  window.location.href = `./view-candidate.html?id=${id}`;
}

// Logout function
document.getElementById("logout").addEventListener("click", function() {
  var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
  myModal.show();
  
  const userId = localStorage.getItem('userId');
  if (userId) {
    axios.put(`https://nsnemo.com/user/${userId}/logout`)
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
  
  setTimeout(function() {
    document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
  }, 1000);

  setTimeout(function() {
    window.location.href = "loginpage.html";
  }, 2000);
});

// Update date and time
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

// Call updateDateTime initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);
