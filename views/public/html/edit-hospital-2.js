const token = localStorage.getItem('token')
    document.addEventListener('DOMContentLoaded', function () {
        // Get the URLSearchParams object  
        const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    console.log(vendorManagement);
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    if (vendorManagement) {
      document.getElementById('vendorManagement').style.display = 'block';
      document.getElementById('vendorManagementSections').style.display = 'block';

    }
        const urlParams = new URLSearchParams(window.location.search);

        // Get values from URL parameters
        var id = urlParams.get('id');
        var hospitalName = urlParams.get('hospitalName');
        var doctorName = urlParams.get('doctorName');
        var doctorAddress = urlParams.get('doctorAddress');
        var doctorCity = urlParams.get('doctorCity');
        var doctorState = urlParams.get('doctorState');
        var doctorPhone = urlParams.get('doctorPhone');
        var doctorEmail = urlParams.get('doctorEmail');
        var doctorUpload = urlParams.get('doctorUpload');

        // Set values in the form
        document.getElementById("u_hospital_id").value = id;
        document.getElementById("u_hospital_name").value = hospitalName;
        document.getElementById("u_doctor_name").value = doctorName;
        document.getElementById("u_doctor_address").value = doctorAddress;
        document.getElementById("u_doctor_city").value = doctorCity;
        document.getElementById("u_doctor_state").value = doctorState;
        document.getElementById("u_doctor_phone").value = doctorPhone;
        document.getElementById("u_doctor_email").value = doctorEmail;
        document.getElementById("u_doctor_upload").value = doctorUpload;
    });
    const updateHospitalButton = document.getElementById("update-hospital-form");
    updateHospitalButton.addEventListener("submit", async (e) => {
        e.preventDefault();
        const hospitalId = document.getElementById("u_hospital_id").value;
        
        const updatedHospitalDetails = {
            id: hospitalId,
            hospitalName: document.getElementById("u_hospital_name").value,
            doctorName: document.getElementById("u_doctor_name").value,
            doctorAddress: document.getElementById("u_doctor_address").value,
            doctorCity: document.getElementById("u_doctor_city").value,
            doctorState: document.getElementById("u_doctor_state").value,
            doctorPhone: document.getElementById("u_doctor_phone").value,
            doctorEmail: document.getElementById("u_doctor_email").value,
            doctorUpload: document.getElementById("u_doctor_upload").value,
            // Add other fields specific to Hospital entity
        };
    
        try {
            const response = await axios.put(`http://localhost:4000/others/update-hospital/${hospitalId}`, updatedHospitalDetails,{headers:{"Authorization":token}});
            console.log('Response:', response.data);
            alert("Hospital Updated Successfully!");
            window.location.href="./edit-hospital.html";
        } catch (error) {
            console.error('Error:', error);
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