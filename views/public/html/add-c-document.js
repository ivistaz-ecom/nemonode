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
   await fetchDocumentTypes()
const hasUserManagement = decodedToken.userManagement;
console.log(hasUserManagement)
if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
    document.getElementById('userManagementSection').style.display = 'block';
    document.getElementById('userManagementSections').style.display = 'block';
}
const urlParams = new URLSearchParams(window.location.search);
    
// Get the candidateId from the URL parameter
const candidateId = urlParams.get('memId');
    fetchAndDisplayDocumentDetails(candidateId);

        
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
    
// Function to fetch data from the server and populate the table
async function fetchAndDisplayDocumentDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-document-details/${candidateId}`, {
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
                <td><a href='https://nemo.ivistaz.co/views/public/files/${doc.document_files}' target="_blank">Click here to view Document!</a></td>

                <td>${doc.stcw}</td>
                <td>${doc.expiry_date}</td>
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
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const memId = urlParams.get('memId');
    const queryParams = `?memId=${memId}&documentId=${documentId}&documents=${encodeURIComponent(documents)}&documentNumber=${encodeURIComponent(documentNumber)}&issueDate=${encodeURIComponent(issueDate)}&issuePlace=${encodeURIComponent(issuePlace)}&documentFiles=${encodeURIComponent(documentFiles)}&stcw=${encodeURIComponent(stcw)}`;

    window.open(`./edit-c-document.html${queryParams}`, '_blank');
}



// Delete document function
async function deleteDocument(documentId) {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');

    // If the user confirms deletion, proceed with the deletion process
    if (confirmDelete) {
        try {
            // Send a DELETE request to your server endpoint with the documentId
            const response = await axios.delete(`https://nemo.ivistaz.co/candidate/document-delete/${documentId}`,{
                headers:{"Authorization":token}
            });

            // Log the response from the server
            console.log('Document deleted successfully:', response.data);

            // Optionally, you can reload or update the document list after deletion
            const candidateId = localStorage.getItem('cmemId');
            fetchAndDisplayDocumentDetails(candidateId);
        } catch (error) {
            console.error('Error deleting document:', error);
            // Handle error and display appropriate messages to the user
        }
    }
}

const documentForm = document.getElementById('documentForm');

document.getElementById('documentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const id = urlParams.get('memId');
    const documentType = document.getElementById('documentTypeDropdown').value.trim();
    const documentNumber = document.getElementById('document_number').value.trim();
    const issueDate = document.getElementById('issue_date').value.trim();
    const issuePlace = document.getElementById('issue_place').value.trim();
    const stcw = document.getElementById('stcw').value.trim();
    const documentFiles = document.getElementById('document_files').files[0];
    const expiry_date = document.getElementById('expiry_date').value.trim();

    let documentFileName = '';

    // Upload document file if it exists
    if (documentFiles) {
        const documentFormData = new FormData();
        documentFormData.append('file', documentFiles);

        try {
            const response = await axios.post('/upload4', documentFormData, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            documentFileName = documentFiles.name;
            console.log('Document file uploaded successfully');
        } catch (err) {
            console.error('Error uploading document file:', err);
            return;
        }
    }

    // Submit the rest of the form data
    const formData = {
        document: documentType,
        document_number: documentNumber,
        issue_date: issueDate,
        issue_place: issuePlace,
        document_files: documentFileName,
        stcw: stcw,
        expiry_date:expiry_date
    };

    try {
        const response = await axios.post(`https://nemo.ivistaz.co/candidate/document-details/${id}`, formData, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        console.log('Document added successfully:', response.data);
        fetchAndDisplayDocumentDetails(id);

        // Optionally redirect to another page or show a success message
    } catch (error) {
        console.error('Error adding document:', error);
        // Handle error and display appropriate messages to the user
    }
});


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


async function fetchDocumentTypes() {
    try {
        const response = await axios.get('https://nemo.ivistaz.co/others/get-documenttype');
        const documents = response.data.documents;

        const dropdown = document.getElementById('documentTypeDropdown');
        documents.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.documentType;
            option.textContent = doc.documentType;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching document types:', error);
    }
}

function goBack() {
    // Get the search parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get('memId');
    
    if (candidateId) {
        window.location.href = './view-candidate.html';
    } else {
        console.error('Candidate ID not found in URL parameters');
    }
}

