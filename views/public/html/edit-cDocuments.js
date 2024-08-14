const token = localStorage.getItem('ctoken');
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

    const candidateId = localStorage.getItem('cmemId');
    fetchAndDisplayDocumentDetails(candidateId);

        
           
        });
    
// Function to fetch data from the server and populate the table
let documentCounter = 0;

// Function to fetch data from the server and populate the table
async function fetchAndDisplayDocumentDetails(candidateId) {
    try {
        const response = await axios.get(`https://nsnemo.com/candidate/get-cdocument-detail/${candidateId}`);

        const documentDetails = response.data;

        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = ''; // Clear existing rows

        documentDetails.forEach(doc => {
            documentCounter++; // Increment counter for each document
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
                <td>${documentCounter}</td>
                <td>${doc.document}</td>
                <td>${doc.document_number}</td>
                <td>${doc.issue_date}</td>
                <td>${doc.issue_place}</td>
                <td>${doc.document_files}</td>
                <td>${doc.stcw}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="editDocument('${doc.id}','${doc.document}','${doc.document_number}','${doc.issue_date}','${doc.issue_place}','${doc.document_files}','${doc.stcw}')">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pen"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteDocument('${doc.id}', event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>`;
            documentTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching document details:', error);
    }
}

// Edit document function
// Edit document function
function editDocument(documentId, documents, documentNumber, issueDate, issuePlace, documentFiles, stcw) {
    // Retrieve memId from localStorage
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const memId = urlParams.get('memId');

    // Construct the query parameters string
    const queryParams = `?memId=${memId}&documentId=${documentId}&documents=${encodeURIComponent(documents)}&documentNumber=${encodeURIComponent(documentNumber)}&issueDate=${encodeURIComponent(issueDate)}&issuePlace=${encodeURIComponent(issuePlace)}&documentFiles=${encodeURIComponent(documentFiles)}&stcw=${encodeURIComponent(stcw)}`;

    // Open edit-cDocuments2.html in a new tab with query parameters
    window.open(`./edit-cDocuments2.html${queryParams}`, '_blank');
}



// Delete document function
async function deleteDocument(documentId) {
    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');

    // If the user confirms deletion, proceed with the deletion process
    if (confirmDelete) {
        try {
            // Send a DELETE request to your server endpoint with the documentId
            const response = await axios.delete(`https://nsnemo.com/candidate/cdocument-delete/${documentId}`,{headers:{
                "Authorization":token
            }});

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

documentForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const id = localStorage.getItem('cmemId')
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
        const response = await axios.post(`https://nsnemo.com/candidate/cdocument-detail/${id}`, formData);

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
    
    // Send request to update logged status to false
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