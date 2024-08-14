const token = localStorage.getItem('ctoken');
const candidateId = localStorage.getItem('cmemId'); // Retrieve candidateId from localStorage

async function fetchData() {
    localStorage.clear();

    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-c-candidate/${candidateId}`, {
            headers: { "Authorization": token }
        });

        const responseData = response.data;
        console.log('Fetched data:', responseData); // Log the fetched data

        if (responseData.success && responseData.candidate) {
            const candidate = responseData.candidate;
            // Update the input fields with the fetched data
            updateFields(candidate);
        } else {
            console.error('Invalid response format:', responseData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to update the input fields with data
function updateFields(candidate) {
    // Update Candidate Information
    document.getElementById('indosNumber').value = candidate.indos_number;
    document.getElementById('firstName').value = candidate.fname;
    document.getElementById('lastName').value = candidate.lname;
    document.getElementById('nationality').value = candidate.nationality;
    document.getElementById('maritalStatus').value = candidate.m_status;
    document.getElementById('dob').value = candidate.dob;
    document.getElementById('birthPlace').value = candidate.birth_place;
    document.getElementById('experience').value = candidate.experience;
    document.getElementById('countryLicense').value = candidate.l_country;
    document.getElementById('safetyShoeSize').value = candidate.safety_shoe_size;
    document.getElementById('height').value = candidate.height;
    document.getElementById('weight').value = candidate.weight;
    document.getElementById('candidate_last_company').value=candidate.last_company|| 'NA';
    document.getElementById('candidate_last_salary').value=candidate.last_salary || 'NA';
    document.getElementById('photo').value = candidate.photos;
    document.getElementById('resume').value = candidate.resume;

    // Update Address Information
    document.getElementById('address1').value = candidate.c_ad1;
    document.getElementById('city1').value = candidate.c_city;
    document.getElementById('state1').value = candidate.c_state;
    document.getElementById('pin1').value = candidate.c_pin;
    document.getElementById('mobile1').value = candidate.c_mobi1;
    document.getElementById('email1').value = candidate.email1;

    document.getElementById('address2').value = candidate.c_ad2;
    document.getElementById('city2').value = candidate.p_city;
    document.getElementById('state2').value = candidate.p_state;
    document.getElementById('pin2').value = candidate.p_pin;
    document.getElementById('mobile2').value = candidate.c_mobi2;
    document.getElementById('email2').value = candidate.email2;
}

document.addEventListener('DOMContentLoaded', fetchData);

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