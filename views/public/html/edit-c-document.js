const token = localStorage.getItem('token')
document.addEventListener("DOMContentLoaded", function() {
    // Get the form element
    // Retrieve parameters from the URL
const urlParams = new URLSearchParams(window.location.search);
const documentId = urlParams.get('documentId');
const documents = urlParams.get('documents');
const documentNumber = urlParams.get('documentNumber');
const issueDate = urlParams.get('issueDate');
const issuePlace = urlParams.get('issuePlace');
const documentFiles = urlParams.get('documentFiles');
const stcw = urlParams.get('stcw');

console.log(documentId,documents,documentNumber,issueDate,issuePlace,documentFiles,stcw)
// Use the retrieved parameters as needed
    document.getElementById('doc_id').value = documentId;
    document.getElementById('documents').value = documents;
    document.getElementById('document_number').value = documentNumber;
    document.getElementById('issue_date').value = formatDate(issueDate);
    document.getElementById('issue_place').value = issuePlace;
    document.getElementById('prev_document_files').value = documentFiles;
    document.getElementById('stcw').value = stcw;

// Now you can use these parameters to pre-fill form fields or perform other actions on the edit page.

    const editDocumentForm = document.getElementById("editdocForm");

    
    // Add submit event listener to the form
    document.getElementById('editdocForm').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        const token = localStorage.getItem('token');
        const decodedToken = decodeToken(token);
        const documentId = document.getElementById('doc_id').value;
    
        const document = document.getElementById('documents').value.trim();
        const documentNumber = document.getElementById('document_number').value.trim();
        const issueDate = document.getElementById('issue_date').value.trim();
        const issuePlace = document.getElementById('issue_place').value.trim();
        const stcw = document.getElementById('stcw').value.trim();
        
        const newDocumentFile = document.getElementById('document_files').files[0];
        let documentFilesName = document.getElementById('prev_document_files').value.trim();
    
        // Upload new document file if it exists
        if (newDocumentFile) {
            const documentFormData = new FormData();
            documentFormData.append('file', newDocumentFile);
    
            try {
                const response = await axios.post('/upload4', documentFormData, {
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                documentFilesName = newDocumentFile.name;
                console.log('Document file uploaded successfully');
                alert('Document file uploaded successfully');
            } catch (err) {
                console.error('Error uploading document file:', err);
                return;
            }
        }
    
        // Prepare document details
        const documentDetails = {
            document: document,
            document_number: documentNumber,
            issue_date: issueDate,
            issue_place: issuePlace,
            document_files: documentFilesName,
            stcw: stcw
        };
    
        // Submit the form data
        try {
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-documents/${documentId}`, documentDetails, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Document data updated successfully:', response.data);
            window.location.href = './add-c-document.html';
        } catch (error) {
            console.error('Error updating document data:', error);
        }
    });
    
    
});

function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
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