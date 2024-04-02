document.addEventListener("DOMContentLoaded", function() {
    // Get the dropdown items
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
                case "personnel":
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
    const passbook = urlParams.get('passbook');
    const panCard = urlParams.get('pan_card');
    const branch = urlParams.get('branch');
    const types = urlParams.get('types');
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
    // document.getElementById('passbook').value = passbook || null;
    // document.getElementById('pan_card').value = panCard || null;
    document.getElementById('branch').value = branch;
    document.getElementById('types').value = types;
    document.getElementById('created_by').value = created_by;
    
    // Add any additional logic or event listeners you need for the edit page
});

    const bankForm = document.getElementById('bankForm');

    // Add submit event listener to the form
    bankForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Extract values from the form fields
        const id = document.getElementById('bank_id').value;
        const bankName = document.getElementById('bank_name').value;
        const accountNum = document.getElementById('account_num').value;
        const bankAddr = document.getElementById('bank_addr').value;
        const ifscCode = document.getElementById('ifsc_code').value;
        const swiftCode = document.getElementById('swift_code').value;
        const beneficiary = document.getElementById('beneficiary').value;
        const beneficiaryAddr = document.getElementById('beneficiary_addr').value;
        const panNum = document.getElementById('pan_num').value;
        const passbook = document.getElementById('passbook').value;
        const panCard = document.getElementById('pan_card').value;
        const branch = document.getElementById('branch').value;
        const types = document.getElementById('types').value;
        const created_by = document.getElementById('created_by').value;
        
        try {
            // Make an axios request to update the bank details
            const response = await axios.put(
                `https://nemonode.ivistaz.co//candidate/update-bank-details/${id}`,
                {
                    bank_name: bankName,
                    account_num: accountNum,
                    bank_addr: bankAddr,
                    ifsc_code: ifscCode,
                    swift_code: swiftCode,
                    beneficiary: beneficiary,
                    beneficiary_addr: beneficiaryAddr,
                    pan_num: panNum,
                    passbook: passbook,
                    pan_card: panCard,
                    branch:branch,
                    types:types,
                    created_by:created_by,
                },
                {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Handle the response as needed
            console.log('Bank details updated successfully:', response.data);
            window.location.href='./add-c-bank.html'
            // Optionally, redirect the user to a success page or perform other actions

        } catch (error) {
            console.error('Error updating bank details:', error);
            // Handle the error, display an alert, or redirect to an error page
        }
    })

    document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    localStorage.clear();
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    localStorage.clear()

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