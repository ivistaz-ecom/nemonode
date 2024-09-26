const token = localStorage.getItem('token')
if(!token)
{
  window.location.href='./loginpage.html'
}
function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
document.addEventListener('DOMContentLoaded', async function () {
      
    const decodedToken = decodeToken(token);
    console.log(decodedToken)

const hasUserManagement = decodedToken.userManagement;
const currentuserId = decodedToken.userId
console.log(currentuserId)
console.log(hasUserManagement)
if (hasUserManagement) {
  document.getElementById('userManagementSection').style.display = 'block';
  document.getElementById('userManagementSections').style.display = 'block';

}
const urlParams = new URLSearchParams(window.location.search);
    
// Get the candidateId from the URL parameter
const candidateId = urlParams.get('memId');
    fetchAndDisplayBankDetails(candidateId);


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
})

async function fetchAndDisplayBankDetails(candidateId) {
    try {
        const response = await axios.get(`http://localhost:8001/candidate/get-bank-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const bankDetails = response.data;
        console.log(bankDetails)

        const bankTableBody = document.getElementById('bankTableBody');
        bankTableBody.innerHTML = ''; // Clear existing rows

        bankDetails.forEach(bank => {
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
            <td><span class='badge bg-success'>${bank.bank_name}</span></td>
            <td>${bank.account_num}</td>
            <td>${bank.bank_addr}</td>
            <td>${bank.ifsc_code}</td>
            <td>${bank.swift_code}</td>
            <td>${bank.beneficiary}</td>
            <td>${bank.beneficiary_addr}</td>
            <td>${bank.pan_num}</td>
            <td>${bank.passbook}</td>

            <td><a href='http://localhost:8001/views/public/bank_details/${bank.passbook}' target="_blank">Click here to view Document!</a></td>
            <td>${bank.pan_card}</td>

            <td><a href='http://localhost:8001/views/public/bank_details/pan_card/${bank.pan_card}' target="_blank">Click here to view Document!</a></td>
            <td>${bank.branch}</td>
            <td>${bank.types}</td>
            <td>${bank.created_by}</td>
            
            
            <td>
            <button class="btn border-0 m-0 p-0" onclick="editBank('${candidateId}','${bank.id}','${bank.bank_name}','${bank.account_num}','${bank.bank_addr}','${bank.ifsc_code}','${bank.swift_code}','${bank.beneficiary}','${bank.beneficiary_addr}','${bank.pan_num}','${bank.passbook}','${bank.pan_card}','${bank.branch}','${bank.types}','${bank.created_by}', event)">
                <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
            </button>
            <button class="btn border-0 m-0 p-0" onclick="deleteBank('${bank.id}', event)">
                <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
            </button>
        </td>
        
            `;

            bankTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching bank details:', error);
    }
}

function editBank(candidateId,id, bank_name, account_num, bank_addr, ifsc_code, swift_code, beneficiary, beneficiary_addr, pan_num, passbook, pan_card, branch, types, created_by, event) {
    event.preventDefault();
    console.log('Edit clicked for bank ID:', id);

    const queryParams = `?candidateId=${candidateId}&id=${id}&bank_name=${encodeURIComponent(bank_name)}&account_num=${encodeURIComponent(account_num)}&bank_addr=${encodeURIComponent(bank_addr)}&ifsc_code=${encodeURIComponent(ifsc_code)}&swift_code=${encodeURIComponent(swift_code)}&beneficiary=${encodeURIComponent(beneficiary)}&beneficiary_addr=${encodeURIComponent(beneficiary_addr)}&pan_num=${encodeURIComponent(pan_num)}&passbook=${encodeURIComponent(passbook)}&pan_card=${encodeURIComponent(pan_card)}&branch=${encodeURIComponent(branch)}&types=${encodeURIComponent(types)}&created_by=${encodeURIComponent(created_by)}`;

    window.open(`edit-c-bank.html${queryParams}`, '_blank');
}



function deleteBank(bankId) {
    // Confirm with the user before deleting
    if (confirm("Are you sure you want to delete this bank?")) {
        // Send an AJAX request to delete the bank
        axios.delete(`http://localhost:8001/candidate/delete-bank/${bankId}`,{headers:{"Authorization":token}})
            .then(response => {
                // Handle success response
                console.log(response.data.message);
                // Optionally, you can perform additional actions like removing the bank from the UI
            })
            .catch(error => {
                // Handle error
                console.error('Error deleting bank:', error.message);
            });
    }
}


async function handleBankDetailsForm(event) {
    event.preventDefault();
    const decodedToken = decodeToken(token);
    const currentuserId = decodedToken.userId;
      const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const currentCandidateId = urlParams.get('memId');

    const bankName = document.getElementById('bank_name').value.trim();
    const accountNumber = document.getElementById('bank_acc_num').value.trim();
    const bankAddress = document.getElementById('bank_acc_addr').value.trim();
    const ifscCode = document.getElementById('bank_ifsc').value.trim();
    const swiftCode = document.getElementById('bank_swift').value.trim();
    const beneficiary = document.getElementById('bank_beneficiary').value.trim();
    const address = document.getElementById('bank_addr').value.trim();
    const panNumber = document.getElementById('bank_pan').value.trim();
    const branch = document.getElementById('branch').value.trim();
    const types = document.getElementById('types').value.trim();
    const created_by = currentuserId;

    const passbookFile = document.getElementById('bank_passbook').files[0];
    const panCardFile = document.getElementById('bank_pan_card').files[0];

    let passbookFileName = '';
    let panCardFileName = '';

    // Upload Passbook file
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

    // Upload PAN Card file
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
            panCardFileName = response.data.filename
            console.log('PAN Card file uploaded successfully');
        } catch (err) {
            console.error('Error uploading PAN Card file:', err);
            return;
        }
    }

    // Submit the rest of the form data
    const bankDetails = {
        bankName,
        accountNumber,
        bankAddress,
        ifscCode,
        swiftCode,
        beneficiary,
        address,
        panNumber,
        passbookFile: passbookFileName,
        panCardFile: panCardFileName,
        branch,
        types,
        created_by
    };

    try {
        const response = await axios.post(`http://localhost:8001/candidate/bank-details/${currentCandidateId}`, bankDetails, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        await fetchAndDisplayBankDetails(currentCandidateId);
        document.getElementById('bankForm').reset();
    } catch (err) {
        console.error(err);
    }
}

const bankForm = document.getElementById('bankForm');
bankForm.addEventListener('submit', handleBankDetailsForm);


// Attach the form submission handler to the form
const bankDetailsForm = document.getElementById('bankForm');
bankDetailsForm.addEventListener('submit', handleBankDetailsForm);




const storedName = localStorage.getItem('username');

    // Update the HTML content with the retrieved name
    const userInfoElement = document.getElementById('userInfo');
    userInfoElement.querySelector('.fw-semibold').textContent = storedName;

    document.getElementById("logout").addEventListener("click", function() {
        // Display the modal with initial message
        var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        myModal.show();
        
        // Send request to update logged status to false
        const userId = localStorage.getItem('userId');
        if (userId) {
          axios.put(`http://localhost:8001/user/${userId}/logout`)
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

function goBack() {
    // Get the search parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get('memId');
    
    if (candidateId) {
        // Construct the URL with candidateId as a query parameter
        const url = `./view-candidate.html?id=${candidateId}`;
        
        // Redirect to the new URL
        window.location.href = url;
    } else {
        console.error('Candidate ID not found in URL parameters');
    }
}

