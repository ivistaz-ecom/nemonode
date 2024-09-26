
const token = localStorage.getItem('token')

// Get the token from localStorage

// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = './loginpage.html';
}

document.addEventListener('DOMContentLoaded', async function () {

    await fetchCountryCodes()

   await displayDropdown()
   await fetchAndDisplayNationalities()
   await fetchAndDisplayVessels()
   await  fetchAndDisplayGrades()
   await fetchAndDisplayExp()
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
    // Fetch additional data and update the form if needed
    const countries = await fetchAndDisplayNationalities();

    // Display nationalities in the License Country dropdown
    const countrySelect = document.getElementById("candidate_I_country");
    displayDropdownOptions(countrySelect, countries, "License Country");

    // Display nationalities in the Nationality dropdown
    const nationalitySelect = document.getElementById("candidate_nationality");
    displayDropdownOptions(nationalitySelect, countries, "Nationality");

    // Add any other initialization or data fetching logic you need
});

async function fetchCountryCodes() {
    try {
        const response = await axios.get('https://nsnemo.com/fetch-nationality');
        const countries = response.data.countries;
        // Clear existing options
        var select = document.getElementById("countryCodeSelect");
        var select2 = document.getElementById("countryCodeSelect2");
        select.innerHTML = '<option value="">Code</option>';
        select2.innerHTML = '<option value="">Code</option>';
        // Populate the dropdown options
        countries.forEach(function(country) {
            var option = document.createElement("option");
            option.value = country.phone_code; // Set the value to phone_code
            option.text = country.phone_code; // Display only the phone_code
            select.appendChild(option);
            select2.appendChild(option.cloneNode(true))
        });
    } catch (error) {
        console.error('Error fetching country codes:', error);
    }
}

// Call the function to fetch and populate country codes


async function  fetchAndDisplayExp() {
    try {
        const serverResponse = await axios.get("https://nsnemo.com/others/view-experience", { headers: { "Authorization": token } });
        const experiences = serverResponse.data.experiences; // Access the array using response.data.experiences

        // Check if experiences is an array
        if (Array.isArray(experiences)) {
            // Get the dropdown element by its ID
            const expDropdown = document.getElementById('candidate_experience');

            // Clear existing options
            expDropdown.innerHTML = '';

            // Create and append a default option (optional)
            const defaultOption = document.createElement('option');
            defaultOption.text = 'Select Experience';
            expDropdown.add(defaultOption);

            // Iterate through experiences and add them as options
            experiences.forEach((exp) => {
                const option = document.createElement('option');
                option.value = exp.experience; // Use the appropriate property from your data
                option.text = exp.experience; // Use the appropriate property from your data
                expDropdown.add(option);
            });

            // Now the dropdown is populated with experience values
        } else {
            console.error('Invalid or empty experiences:', experiences);
        }
    } catch (error) {
        console.error('Error fetching experiences:', error);
        // Handle error as needed
    }
}



    





function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const decodedToken = decodeToken(token);


async function fetchAndDisplayGrades() {
    try {
        const serverResponse = await axios.get("https://nsnemo.com/others/get-grade-drop", { headers: { "Authorization": token } });
        const grades = serverResponse.data.allGrades; // Access the allGrades property

        console.log(grades);

        // Get the dropdown element by its ID
        const gradeDropdown = document.getElementById('candidate_grade');

        // Clear existing options
        gradeDropdown.innerHTML = '';

        // Create and append a default option (optional)
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Select Grade';
        gradeDropdown.add(defaultOption);

        // Iterate through grades and add them as options
        grades.forEach((grade) => {
            const option = document.createElement('option');
            option.value = grade.gradeExp;
            option.text = grade.gradeExp;
            gradeDropdown.add(option);
        });

        // Now the dropdown is populated with grade values
    } catch (error) {
        console.error('Error fetching grades:', error);
        // Handle error as needed
    }
}


async function fetchAndDisplayVessels() {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nsnemo.com/others/get-vessel", { headers: { "Authorization": token } });
        console.log(serverResponse)
        const vessels = serverResponse.data.vessels; // Fix here

        // Get the select element
        const vesselSelect = document.getElementById("candidate_c_vessel");

        // Clear previous options
        vesselSelect.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "-- Select Vessel --";

        vesselSelect.appendChild(defaultOption);

        // Add vessels to the dropdown
        vessels.forEach((vessel) => {
            const option = document.createElement("option");
            option.value = vessel.vesselName;
            option.text = vessel.vesselName;
            vesselSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

function displayDropdownOptions(dropdown, options, placeholder) {
    dropdown.innerHTML = ""; // Clear existing options

    // Add a default option
    const defaultOption = document.createElement("option");
    defaultOption.value = ""; // Set the default value (empty in this case)
    defaultOption.text = `-- Select ${placeholder} --`; // Set the default display text
    dropdown.appendChild(defaultOption);

    // Check if options is an array before using forEach
    if (Array.isArray(options)) {
        options.forEach(option => {
            const dropdownOption = document.createElement("option");
            dropdownOption.value = option.code; // Use the appropriate ID or value from your data
            dropdownOption.text = option.country; // Use the appropriate property from your data
            dropdown.appendChild(dropdownOption);
        });
    } else {
        console.error(`Invalid or empty options for ${placeholder}:`, options);
    }
}

const displayDropdown = async function () {
    const rankDropdown = document.getElementById('candidate_c_rank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("https://nsnemo.com/others/get-ranks", { headers: { "Authorization": token } });
    const rankOptions = rankResponse.data.ranks;
    const rankNames = rankOptions.map(rank => rank.rank);

    for (let i = 0; i < rankNames.length; i++) {
        const option = document.createElement('option');
        option.value = rankNames[i];
        option.text = rankNames[i];
        rankDropdown.appendChild(option);
    }
}

async function fetchAndDisplayNationalities() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get("https://nsnemo.com/fetch-nationality", { headers: { "Authorization": token } });
        const countries = response.data.countries; // Access the array using response.data.countries
        console.log(countries)
        return countries; // Return the fetched countries
    } catch (error) {
        console.error('Error fetching countries:', error);
        return []; // Return an empty array in case of an error
    }
}

function getCurrentDateTime() {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const time = now.toTimeString().split(' ')[0]; // Format: HH:MM:SS

    return { date, time };
}
const uploadFile = async (file, url) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": token
            },
        });
        console.log('File uploaded successfully:', response.data);
        return response.data.filename; // Return the filename received from the server
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
const addcandidateButton = document.getElementById("candidate-form");
addcandidateButton.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const mobileInput = document.getElementById('candidate_c_mobi1').value;
    const combinedMobile = mobileInput;
    const mobileInput2 = document.getElementById('candidate_c_mobi2').value;
    const combinedMobile2 = mobileInput2;
    const abc = 'm'
    const { date, time } = getCurrentDateTime();

    // Get files
    const photoFile = document.getElementById('candidate_photo').files[0];
    const resumeFile = document.getElementById('candidate_resume').files[0];

    try {
        // Upload files if provided and get filenames
        let photoFileName = '';
        let resumeFileName = '';

        if (photoFile) {
            photoFileName = await uploadFile(photoFile, 'https://nsnemo.com/upload1');
        }

        if (resumeFile) {
            resumeFileName = await uploadFile(resumeFile, 'https://nsnemo.com/upload3');
        }

        // Prepare candidate details
        const candidate_details = {
            fname: document.getElementById('candidate_fname').value.trim(),
            lname: document.getElementById('candidate_lname').value.trim(),
            c_rank: document.getElementById('candidate_c_rank').value.trim(),
            avb_date: document.getElementById('candidate_avb_date').value.trim() || '1970-01-01',
            nationality: document.getElementById('candidate_nationality').value.trim(),
            company_status: document.getElementById('candidate_company_status').value.trim(),
            dob: document.getElementById('candidate_dob').value.trim() || '1970-01-01',
            birth_place: document.getElementById('candidate_birth_place').value.trim(),
            work_nautilus: document.getElementById('candidate_work_nautilus').value.trim(),
            c_vessel: document.getElementById('candidate_c_vessel').value.trim(),
            experience: document.getElementById('candidate_experience').value.trim(),
            zone: document.getElementById('candidate_zone').value.trim(),
            grade: document.getElementById('candidate_grade').value.trim(),
            boiler_suit_size: document.getElementById('candidate_boiler_suit_size').value.trim(),
            safety_shoe_size: document.getElementById('candidate_safety_shoe_size').value.trim(),
            height: document.getElementById('candidate_height').value.trim(),
            weight: document.getElementById('candidate_weight').value.trim(),
            l_country: document.getElementById('candidate_I_country').value.trim(),
            indos_number: document.getElementById('candidate_indos_number').value.trim(),
            m_status: document.getElementById('company_status').value.trim(),
            group: document.getElementById('candidate_group').value.trim(),
            vendor: document.getElementById('candidate_vendor').value.trim(),
            photos: photoFileName,
            resume: resumeFileName,
            resume_upload_date: resumeFile ? `${date} ${time}` : null, 
            c_ad1: document.getElementById('candidate_c_ad1').value.trim(),
            c_city: document.getElementById('candidate_city').value.trim(),
            c_state: document.getElementById('candidate_c_state').value.trim(),
            c_pin: document.getElementById('candidate_pin').value.trim(),
            c_mobi1: combinedMobile,
            email1: document.getElementById('candidate_email1').value.trim(),
            c_tel1: document.getElementById('candidate_c_tel1').value.trim(),
            c_ad2: document.getElementById('candidate_c_ad2').value.trim(),
            p_city: document.getElementById('candidate_p_city').value.trim(),
            p_state: document.getElementById('candidate_p_state').value.trim(),
            p_pin: document.getElementById('candidate_p_pin').value.trim(),
            c_mobi2: combinedMobile2,
            c_tel2: document.getElementById('candidate_c_tel2').value.trim(),
            email2: document.getElementById('candidate_email2').value.trim(),
            nemo_source: abc,
            active_details: document.getElementById('candidate_active_details').value.trim() || 0,
            area_code1: document.getElementById('candidate_area_code1').value.trim() || '',
            area_code2: document.getElementById('candidate_area_code2').value.trim() || '',
            category: document.getElementById('candidate_category').value.trim() || 0,
            createdby: localStorage.getItem('username'),
            cr_date: date,
            cr_time: time,
            editedby: document.getElementById('candidate_editedby').value.trim() || '',
            imp_discussion: document.getElementById('candidate_imp_discussion').value.trim() || '',
            ipadress: document.getElementById('candidate_ipadress').value.trim() || '',
            joined_date: document.getElementById('candidate_joined_date').value.trim() || '1970-01-01',
            last_company: document.getElementById('candidate_last_company').value || '',
            last_salary: document.getElementById('candidate_last_salary').value.trim() || '',
            las_date: document.getElementById('candidate_last_date').value.trim() || '1970-01-01',
            las_time: document.getElementById('candidate_last_time').value.trim() || '',
            mobile_code1: document.getElementById('countryCodeSelect').value.trim() || '',
            mobile_code2: document.getElementById('countryCodeSelect2').value.trim() || '',
            mobile_status: document.getElementById('candidate_mobile_status').value.trim() || '',
            other_mobile_code: document.getElementById('candidate_other_mobile_code').value.trim() || '',
            other_numbers: document.getElementById('candidate_other_numbers').value.trim() || '',
            p_ad1: document.getElementById('candidate_p_ad1').value.trim() || '',
            p_ad2: document.getElementById('candidate_p_ad2').value.trim() || '',
            p_country: document.getElementById('candidate_p_country').value.trim() || '',
            p_mobi1: document.getElementById('candidate_p_mobi1').value.trim() || '',
            p_mobi2: document.getElementById('candidate_p_mobi2').value.trim() || '',
            p_rank: document.getElementById('candidate_p_rank').value.trim() || '',
            p_tel1: document.getElementById('candidate_p_tel1').value.trim() || '',
            p_tel2: document.getElementById('candidate_p_tel2').value.trim() || '',
            ref_check: document.getElementById('candidate_ref_check').value.trim() || '',
            skype: document.getElementById('candidate_skype').value.trim() || '',
            stcw: document.getElementById('candidate_stcw').value.trim() || 0,
            vendor_id: document.getElementById('candidate_vendor_id').value.trim() || '',
            us_visa: document.getElementById('candidate_us_visa').value.trim() || 0,
        };

        // Send candidate details to the server
        const serverResponse = await axios.post("https://nsnemo.com/candidate/add-candidate", candidate_details, {
            headers: {
                "Authorization": token
            }
        });
        console.log('Response:', serverResponse);
        alert("Candidate Added Successfully!");
        
        redirectToViewCandiadate(serverResponse.data.candidateId);
    } catch (error) {
        console.error('Error:', error);
        alert('Error! Kindly try again')
        // Handle error as needed
    }
});

function redirectToViewCandiadate(id){
    window.open(`./view-candidate.html?id=${id}`, '_blank');

}


// const findStudentsWithUpcomingBirthdays = async () => {
//     const currentDate = new Date();
  
//     const upcomingBirthdays = await Candidate.findAll({
//       where: {
//         dob: {
//           [Op.between]: [
//             new Date(currentDate.getTime() + 15 * 24 * 60 * 60 * 1000),
//             new Date(currentDate.getTime() + 16 * 24 * 60 * 60 * 1000),
//           ],
//         },
//       },
//     });
  
//     return upcomingBirthdays;
//   };
  
//   // Example usage of the function
//   findStudentsWithUpcomingBirthdays()
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


async function createCompanyDropdown() {

    const companyResponse = await axios.get("https://nsnemo.com/company/dropdown-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.companies;
        const companyNames = companyOptions.map(company => company.company_id);

    console.log(companyNames)
    const companyDropdown = document.getElementById('candidate_vendor');
    companyDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Company --';
    companyDropdown.appendChild(defaultOption);
    
    // Add options for each company
    for (let i = 0; i < companyNames.length; i++) {
        const option = document.createElement('option');
        option.value = companyNames[i];
        option.text = companyNames[i];
        companyDropdown.appendChild(option);
        // If you want to clone the options for another dropdown, do it here
        // companyDropdown.appendChild(option.cloneNode(true));
    }
}

createCompanyDropdown()