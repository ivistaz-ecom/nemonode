const token = localStorage.getItem('ctoken');

document.addEventListener("DOMContentLoaded", function() {
    // Retrieve parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const documentId = urlParams.get('documentId');
    const documents = urlParams.get('documents');
    const documentNumber = urlParams.get('documentNumber');
    const issueDate = urlParams.get('issueDate');
    const issuePlace = urlParams.get('issuePlace');
    const documentFiles = urlParams.get('documentFiles');
    const stcw = urlParams.get('stcw');

    console.log(documentId, documents, documentNumber, issueDate, issuePlace, documentFiles, stcw);

    // Set form fields with the retrieved parameters
    document.getElementById('doc_id').value = documentId;
    document.getElementById('documents').value = documents;
    document.getElementById('document_number').value = documentNumber;
    document.getElementById('issue_date').value = formatDate(issueDate);
    document.getElementById('issue_place').value = issuePlace;
    document.getElementById('document_files').value = documentFiles;
    document.getElementById('stcw').value = stcw;

    // Add submit event listener to the form
    const editDocumentForm = document.getElementById("editdocForm");
    editDocumentForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        try {
            // Collect form data
            const formData = {
                document: document.getElementById('documents').value,
                document_number: document.getElementById('document_number').value,
                issue_date: document.getElementById('issue_date').value,
                issue_place: document.getElementById('issue_place').value,
                document_files: document.getElementById('document_files').value,
                stcw: document.getElementById('stcw').value
            };

            // Send data to the server using Axios with async/await for update
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-cdocument/${documentId}`, formData);

            // Handle success
            console.log('Document data updated successfully:', response.data);
            // You can perform additional actions here after a successful update

            // Redirect to the destination page
            window.location.href = './edit-cDocuments.html';
        } catch (error) {
            // Handle error
            console.error('Error updating document data:', error);
            // You can handle errors and display appropriate messages to the user
        }
    });
});

function formatDate(dateString) {
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

updateDateTime();
setInterval(updateDateTime, 1000);
