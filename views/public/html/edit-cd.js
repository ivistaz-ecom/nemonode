let experience;
let nationality;
let country;
let cmemId;
document.addEventListener('DOMContentLoaded',async function () 
{
    localStorage.clear();

    const token = localStorage.getItem('ctoken');
    const candidateId = localStorage.getItem('cmemId');
    cmemId= candidateId;
    console.log(token,candidateId)


    async function fetchAndDisplayExp() {
        try {
            const serverResponse = await axios.get(`https://nemo.ivistaz.co/others/get-experiences`);
            console.log(serverResponse.data)

            const experiences = serverResponse.data.experiences;
            if (Array.isArray(experiences)) {
                const expDropdown = document.getElementById('candidate_experience');
                expDropdown.innerHTML = '';

                const defaultOption = document.createElement('option');
                defaultOption.text = 'Select Experience';
                expDropdown.add(defaultOption);

                experiences.forEach((exp) => {
                    const option = document.createElement('option');
                    option.value = exp.experience;
                    option.text = exp.experience;
                    expDropdown.add(option);
                });

                expDropdown.value=experience
            } else {
                console.error('Invalid or empty experiences:', experiences);
            }
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    }

    fetchAndDisplayExp();

    
    async function fetchData() {
        try {
            const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-c-candidate/${candidateId}`, {
                headers: { "Authorization": token }
            });

            const responseData = response.data;
            console.log('Fetched data:', responseData);

            if (responseData.success && responseData.candidate) {
                const candidate = responseData.candidate;
                updateFields(candidate);
            } else {
                console.error('Invalid response format:', responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
   await  fetchData();

    function updateFields(candidate) {
        document.getElementById('candidate_fname').value = candidate.fname;
        document.getElementById('candidate_lname').value = candidate.lname;
        document.getElementById('candidate_nationality').value = candidate.nationality;
        nationality=candidate.nationality;
        document.getElementById('company_status').value = candidate.m_status;
        document.getElementById('candidate_dob').value = formatDate(candidate.dob);
        document.getElementById('candidate_birth_place').value = candidate.birth_place;
        document.getElementById('candidate_experience').value = candidate.experience;
        experience=candidate.experience
        document.getElementById('candidate_I_country').value = candidate.l_country;
        country = candidate.l_country;
        document.getElementById('candidate_safety_shoe_size').value = candidate.safety_shoe_size;
        document.getElementById('candidate_height').value = candidate.height;
        document.getElementById('candidate_weight').value = candidate.weight;
        document.getElementById('candidate_last_company').value=candidate.last_company
        document.getElementById('candidate_last_salary').value = candidate.last_salary


        document.getElementById('candidate_c_ad1').value = candidate.c_ad1;
        document.getElementById('candidate_city').value = candidate.c_city;
        document.getElementById('candidate_c_state').value = candidate.c_state;
        document.getElementById('candidate_pin').value = candidate.c_pin;
        document.getElementById('candidate_c_mobi1').value = candidate.c_mobi1;
        // document.getElementById('candidate_c_tel1').value = candidate.c_tel1;
        document.getElementById('candidate_email1').value = candidate.email1;

        document.getElementById('candidate_c_ad2').value = candidate.c_ad2;
        document.getElementById('candidate_p_city').value = candidate.p_city;
        document.getElementById('candidate_p_state').value = candidate.p_state;
        document.getElementById('candidate_p_pin').value = candidate.p_pin;
        document.getElementById('candidate_c_mobi2').value = candidate.c_mobi2;
        // document.getElementById('candidate_c_tel2').value = candidate.c_tel2;
        document.getElementById('candidate_email2').value = candidate.email2;
        document.getElementById('candidate_photos').value=candidate.photos;
        document.getElementById('candidate_resume').value=candidate.resume
        
    }

    async function displayCountryDropdown() {
        try {
            const countryDropdown = document.getElementById('candidate_nationality');
            const licenseDropdown = document.getElementById('candidate_I_country');
            countryDropdown.innerHTML = '';
            licenseDropdown.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = '-- Select Nationality --';
            countryDropdown.appendChild(defaultOption);

            const countryResponse = await axios.get("https://nemo.ivistaz.co/others/country-codes", { headers: { "Authorization": token } });
            const countries = countryResponse.data.countryCodes;

            for (let i = 0; i < countries.length; i++) {
                const option = document.createElement('option');
                option.value = countries[i].country;
                option.text = countries[i].country;
                countryDropdown.appendChild(option);
                licenseDropdown.appendChild(option.cloneNode(true));
            }
            countryDropdown.value=nationality   
            licenseDropdown.value=country
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    }

    displayCountryDropdown();

    
        const form = document.getElementById('candidate-form');
        form.addEventListener('submit',async function (event) {
            event.preventDefault();
            
            const candidateData = {
                fname: document.getElementById('candidate_fname').value,
                lname: document.getElementById('candidate_lname').value,
                nationality: document.getElementById('candidate_nationality').value,
                company_status: document.getElementById('company_status').value,
                dob: document.getElementById('candidate_dob').value,
                birth_place: document.getElementById('candidate_birth_place').value,
                experience: document.getElementById('candidate_experience').value,
                l_country: document.getElementById('candidate_I_country').value,
                safety_shoe_size: document.getElementById('candidate_safety_shoe_size').value,
                height: document.getElementById('candidate_height').value,
                weight: document.getElementById('candidate_weight').value,
                last_company:document.getElementById('candidate_last_company').value,
                last_salary:document.getElementById('candidate_last_salary').value,
                c_ad1: document.getElementById('candidate_c_ad1').value,
                c_city: document.getElementById('candidate_city').value,
                c_state: document.getElementById('candidate_c_state').value,
                c_pin: document.getElementById('candidate_pin').value,
                c_mobi1: document.getElementById('candidate_c_mobi1').value,
                // c_tel1: document.getElementById('candidate_c_tel1').value,
                email1: document.getElementById('candidate_email1').value,
                c_ad2: document.getElementById('candidate_c_ad2').value,
                p_city: document.getElementById('candidate_p_city').value,
                p_state: document.getElementById('candidate_p_state').value,
                p_pin: document.getElementById('candidate_p_pin').value,
                c_mobi2: document.getElementById('candidate_c_mobi2').value,
                // c_tel2: document.getElementById('candidate_c_tel2').value,
                email2: document.getElementById('candidate_email2').value,
                photos: document.getElementById('candidate_photos').value,
        resume: document.getElementById('candidate_resume').value,
                // Add other fields as needed
            };
          await  updateCandidate(candidateData);
        });
    });

    async function updateCandidate(candidateData) {
        try {
            const response = await axios.put(`https://nemo.ivistaz.co/candidate/update-c-candidate/${cmemId}`, candidateData);
            const responseData = response.data;
            console.log('Update response:', responseData);

            if (response.status) {
                alert('Candidate details updated successfully!');
            } else {
                alert('Failed to update candidate details. Please try again.');
            }
        } catch (error) {
            console.error('Error updating candidate details:', error);
            alert('An error occurred while updating candidate details.');
        }
    }

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

// Update date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);