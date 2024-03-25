const token = localStorage.getItem('token');
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
console.log(hasUserManagement)
if (hasUserManagement) {
  document.getElementById('userManagementSection').style.display = 'block';
  document.getElementById('userManagementSections').style.display = 'block';

}
    const candidateId = localStorage.getItem('memId');
    fetchAndDisplayDocumentDetails(candidateId);

        
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
    
// Function to fetch data from the server and populate the table
async function fetchAndDisplayDocumentDetails(candidateId) {
    try {
        const response = await axios.get(`http://localhost:4000/candidate/get-document-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const documentDetails = response.data;

        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = ''; // Clear existing rows

        documentDetails.forEach(doc => {
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
                <td>${doc.document}</td>
                <td>${doc.document_number}</td>
                <td>${doc.issue_date}</td>
                <td>${doc.issue_place}</td>
                <td>${doc.document_files}</td>
                <td>${doc.stcw}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editDocument('${doc.id}','${doc.document}','${doc.document_number}','${doc.issue_date}','${doc.issue_place}','${doc.document_files}','${doc.stcw}', event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteDocument('${doc.id}', event)">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;

            documentTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching document details:', error);
    }
}

// Edit document function
// Edit document function
function editDocument(documentId, documents, documentNumber, issueDate, issuePlace, documentFiles, stcw) {
    // Redirect to the edit-c-document.html page with parameters
    const memId = localStorage.getItem('memId');
    window.location.href = `./edit-c-document.html?memId=${memId}&documentId=${documentId}&documents=${documents}&documentNumber=${documentNumber}&issueDate=${issueDate}&issuePlace=${issuePlace}&documentFiles=${documentFiles}&stcw=${stcw}`;
}


// Delete document function
function deleteDocument(documentId) {
    // Implement your delete functionality here using the documentId
    console.log('Delete clicked for document ID:', documentId);
}

const documentForm = document.getElementById('documentForm');

documentForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const id = localStorage.getItem('memId')
    const formData = {
        document: document.getElementById('documents').value.trim(),
        document_number: document.getElementById('document_number').value.trim(),
        issue_date: document.getElementById('issue_date').value.trim(),
        issue_place: document.getElementById('issue_place').value.trim(),
        document_files: document.getElementById('document_files').value.trim(),
        stcw: document.getElementById('stcw').value.trim(),
    };

    console.log(formData)
    try {
        const response = await axios.post(`http://localhost:4000/candidate/document-details/${id}`, formData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        console.log('Document added successfully:', response.data);
        fetchAndDisplayDocumentDetails(id);

        // Redirect to the destination page
    } catch (error) {
        console.error('Error adding document:', error);
        // Handle error and display appropriate messages to the user
    }
});

document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();

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