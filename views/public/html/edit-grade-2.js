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
        const response = await axios.put(`http://nemonode.ivistaz.co/others/update-grade/${gradeId}`, updatedGradeDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Grade Updated Successfully!");
        window.location.href="./edit-grade.html"
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
window.onload = async function () {
    
    const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

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