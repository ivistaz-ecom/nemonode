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
    document.getElementById('document_files').value = documentFiles;
    document.getElementById('stcw').value = stcw;

// Now you can use these parameters to pre-fill form fields or perform other actions on the edit page.

    const editDocumentForm = document.getElementById("editdocForm");

    
    // Add submit event listener to the form
    editDocumentForm.addEventListener("submit", async function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        try {
            // Collect form data
            // Collect form data
            const formData = {
                id:document.getElementById('doc_id').value,
                document:    document.getElementById('documents').value,
                document_number:document.getElementById('document_number').value,
                issue_date:document.getElementById('issue_date').value,
                issue_place:document.getElementById('issue_place').value,
                document_files:document.getElementById('document_files').value,
                stcw:document.getElementById('stcw').value
            }
            // Get the memId from localStorage
 
            // Send data to the server using Axios with async/await for update
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-documents/${documentId}`, formData, {
                headers: { "Authorization": token } // Replace with your authorization header
            });

            // Handle success
            console.log('Document data updated successfully:', response.data);
            // You can perform additional actions here after a successful update

            // Redirect to the destination page
           

            // Redirect to the destination page
            window.location.href = './add-c-document.html';
        } catch (error) {
            // Handle error
            console.error('Error updating document data:', error);
            // You can handle errors and display appropriate messages to the user
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