const token = localStorage.getItem('token')
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Fetch values from URL parameters
  const gradeId = getUrlParameter("gradeId");
  const grade = getUrlParameter("grade");

  // Set values in input fields
  document.getElementById("u_grade_id").value = gradeId;
  document.getElementById("u_grade_name").value = decodeURIComponent(grade);

  const updateGradeButton = document.getElementById("update-grade-form");
updateGradeButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const gradeId = document.getElementById("u_grade_id").value;
    
    const updatedGradeDetails = {
        id: gradeId,
        gradeExp: document.getElementById("u_grade_name").value,
        // Add other fields specific to Grade entity
    };

    try {
        const response = await axios.put(`https://nemonode.ivistaz.co//others/update-grade/${gradeId}`, updatedGradeDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Grade Updated Successfully!");
        window.location.href="./edit-grade.html"
    } catch (error) {
        console.error('Error:', error);
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

window.onload = async function () {
    
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
};




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