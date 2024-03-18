const token = localStorage.getItem('token')
document.addEventListener('DOMContentLoaded', async function () {
    // Get the URLSearchParams object
    const urlParams = new URLSearchParams(window.location.search);
const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    // Get values from URL parameters
    const id = urlParams.get('id');
    const doctype = urlParams.get('doctype');
    const expirydate = urlParams.get('expirydate');

    // Set values in the form
    document.getElementById("u_document_type_id").value = id;
    document.getElementById("u_document_type_name").value = doctype;
    document.getElementById("u_hide_expiry_date").checked = expirydate === 'true';

    // Fetch additional data and update the form if needed

    // Add any other initialization or data fetching logic you need
});

const updateDocumentTypeButton = document.getElementById("update-document-type-form");
updateDocumentTypeButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const documentTypeId = document.getElementById("u_document_type_id").value;
    
    const updatedDocumentTypeDetails = {
        id: documentTypeId,
        documentType: document.getElementById("u_document_type_name").value,
        hideExpiryDate: document.getElementById("u_hide_expiry_date").checked,
        // Add other fields specific to Document Type entity
    };

    try {
        const response = await axios.put(`http://nemonode.ivistaz.co:8000/others/update-document/${documentTypeId}`, updatedDocumentTypeDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Document Type Updated Successfully!");
        window.location.href="./edit-document.html"
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('logout').addEventListener('click', function() {
    // Clear local storage
    localStorage.clear();

    // Perform logout actions
    // You may want to redirect to a login page or perform other logout-related tasks

    // For example, redirect to a login page
    window.location.href = './loginpage.html';
});

    





function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);


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