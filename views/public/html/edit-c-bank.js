function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the dropdown items
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

// edit-c-bank.js

const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', async function () {

    
    // Extract parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const bankName = urlParams.get('bank_name');
    const accountNum = urlParams.get('account_num');
    const bankAddr = urlParams.get('bank_addr');
    const ifscCode = urlParams.get('ifsc_code');
    const swiftCode = urlParams.get('swift_code');
    const beneficiary = urlParams.get('beneficiary');
    const beneficiaryAddr = urlParams.get('beneficiary_addr');
    const panNum = urlParams.get('pan_num');
    const passbookda = urlParams.get('passbook');
    const panCardda = urlParams.get('pan_card');
    const branch = urlParams.get('branch');
    const types = urlParams.get('types');
    console.log(types)
    const created_by = urlParams.get('created_by')

    // Populate the form fields with the fetched data
    document.getElementById('bank_id').value = id;
    document.getElementById('bank_name').value = bankName;
    document.getElementById('account_num').value = accountNum;
    document.getElementById('bank_addr').value = bankAddr;
    document.getElementById('ifsc_code').value = ifscCode;
    document.getElementById('swift_code').value = swiftCode;
    document.getElementById('beneficiary').value = beneficiary;
    document.getElementById('beneficiary_addr').value = beneficiaryAddr;
    document.getElementById('pan_num').value = panNum;
    document.getElementById('prevPass').value = passbookda || null;
    document.getElementById('prevPan').value = panCardda || null;
    document.getElementById('branch').value = branch;
    document.getElementById('types').value = types;
    document.getElementById('created_by').value = created_by;
    
    // Add any additional logic or event listeners you need for the edit page
});

    const bankForm = document.getElementById('bankForm');

    // Add submit event listener to the form
    document.getElementById('bankForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        const decodedToken = decodeToken(token);
        const bankId = document.getElementById('bank_id').value;
        const created_by = decodedToken.userId;
    
        const bankName = document.getElementById('bank_name').value.trim();
        const accountNum = document.getElementById('account_num').value.trim();
        const bankAddr = document.getElementById('bank_addr').value.trim();
        const ifscCode = document.getElementById('ifsc_code').value.trim();
        const swiftCode = document.getElementById('swift_code').value.trim();
        const beneficiary = document.getElementById('beneficiary').value.trim();
        const beneficiaryAddr = document.getElementById('beneficiary_addr').value.trim();
        const panNum = document.getElementById('pan_num').value.trim();
        const branch = document.getElementById('branch').value.trim();
        const types = document.getElementById('types').value.trim();
    
        const passbookFile = document.getElementById('passbook').files[0];
        const panCardFile = document.getElementById('pan_card').files[0];
    
        let passbookFileName = document.getElementById('prevPass').value.trim();
        let panCardFileName = document.getElementById('prevPan').value.trim();
    
        // Upload Passbook file if it exists
        if (passbookFile) {
            const passbookFormData = new FormData();
            passbookFormData.append('file', passbookFile);
    
            try {
                const response = await axios.post('/upload8', passbookFormData, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                passbookFileName = response.data.filename
                console.log('Passbook file uploaded successfully');
            } catch (err) {
                console.error('Error uploading passbook file:', err);
                return;
            }
        }
    
        // Upload PAN Card file if it exists
        if (panCardFile) {
            const panCardFormData = new FormData();
            panCardFormData.append('file', panCardFile);
    
            try {
                const response = await axios.post('/upload9', panCardFormData, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                panCardFileName =response.data.filename
                console.log('PAN Card file uploaded successfully');
            } catch (err) {
                console.error('Error uploading PAN Card file:', err);
                return;
            }
        }
    
        // Submit the rest of the form data
        const bankDetails = {
            bank_name: bankName,
            account_num: accountNum,
            bank_addr: bankAddr,
            ifsc_code: ifscCode,
            swift_code: swiftCode,
            beneficiary: beneficiary,
            beneficiary_addr: beneficiaryAddr,
            pan_num: panNum,
            passbook: passbookFileName,
            pan_card: panCardFileName,
            branch: branch,
            types: types,
            created_by: created_by
        };
    
        try {
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-bank-details/${bankId}`, bankDetails, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Bank details updated successfully:', response.data);
            alert('Bank details edited Successfully!')
            const urlParams = new URLSearchParams(window.location.search);
    
            // Get the candidateId from the URL parameter
            const memId = urlParams.get('memId');
        viewCandidate(memId)
        } catch (err) {
            console.error('Error updating bank details:', err);
        }
    });
    
    function viewCandidate(id) {
        // Add your view logic here
        window.location.href=`./view-candidate.html?id=${id}`;
    
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