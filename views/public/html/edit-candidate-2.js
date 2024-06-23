const token = localStorage.getItem('token')

document.addEventListener('DOMContentLoaded', async function () {





   await displayDropdown()
   await fetchAndDisplayNationalities()
   await fetchAndDisplayVessels()
   await  fetchAndDisplayGrades()
   await fetchAndDisplayExp()
    // Fetch additional data and update the form if needed
    const countries = await fetchAndDisplayNationalities();
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
    // Display nationalities in the License Country dropdown
    const countrySelect = document.getElementById("edit_candidate_I_country");
    displayDropdownOptions(countrySelect, countries, "License Country");

    // Display nationalities in the Nationality dropdown
    const nationalitySelect = document.getElementById("edit_candidate_nationality");
    displayDropdownOptions(nationalitySelect, countries, "Nationality");

    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('memId');
    const token = localStorage.getItem('token');

    currentCandidateId=candidateId;
    // console.log(">>>>>>>>>",currentCandidateId)
    if (candidateId) {
        await fetchAndDisplayCandidate(candidateId,token);
    //     await fetchSpecialComments(currentCandidateId, token); // Pass the token
    //    await fetchAndDisplayContractDetails(currentCandidateId);
    //    await fetchAndDisplayDocumentDetails(currentCandidateId);
    //    await fetchAndDisplayBankDetails(currentCandidateId);
    //    await fetchAndDisplayTravelDetails(currentCandidateId);
    //    await fetchAndDisplayHospitalDetails(currentCandidateId);
    //    await fetchAndDisplayNKDDetails(currentCandidateId);
    //    await fetchAndDisplayRanks();


    } else {
        console.error('Invalid URL. Missing memId parameter.');
    }



    // Add any other initialization or data fetching logic you need
});
const avbDateInput = document.getElementById('edit_candidate_avb_date');
const avbDateValue = avbDateInput.value;
// Check if the avb_date is null
const avbDate = avbDateValue.trim() !== '' ? avbDateValue : null;


async function fetchAndDisplayExp() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/view-experience", { headers: { "Authorization": token } });
        const experiences = serverResponse.data.experiences; // Access the array using response.data.experiences
        console.log(serverResponse,'exp')
        // Check if experiences is an array
        if (Array.isArray(experiences)) {
            // Get the dropdown element by its ID
            const expDropdown = document.getElementById('edit_candidate_experience');

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






async function fetchAndDisplayGrades() {
    try {
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/view-grade", { headers: { "Authorization": token } });
        const grades = serverResponse.data.grades;
        const gradeDropdown = document.getElementById('edit_candidate_grade');

        if (gradeDropdown) {
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

            // Set the selected value based on candidateData.grade
            // For example: gradeDropdown.value = candidateData.grade;
        }
    } catch (error) {
        console.error('Error fetching grades:', error);
        // Handle error as needed
    }
}

async function fetchAndDisplayVessels() {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get("https://nemo.ivistaz.co/others/get-vessel", { headers: { "Authorization": token } });
        const vessels = serverResponse.data;
        console.log('vsls',serverResponse)
        // Get the select element
        const vesselSelect = document.getElementById("edit_candidate_c_vessel");

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
    const rankDropdown = document.getElementById('edit_candidate_c_rank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("https://nemo.ivistaz.co/others/get-ranks", { headers: { "Authorization": token } });
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
        const response = await axios.get("https://nemo.ivistaz.co/fetch-nationality", { headers: { "Authorization": token } });
        const countries = response.data.countries; // Access the array using response.data.countries
        return countries; // Return the fetched countries
    } catch (error) {
        console.error('Error fetching countries:', error);
        return []; // Return an empty array in case of an error
    }
}



async function displayCandidateDetails(candidateData) {
    try {
        document.getElementById('edit_candidate_c_rank').value = candidateData.c_rank;
        document.getElementById('edit_candidate_nationality').value = candidateData.nationality;
        document.getElementById('edit_candidate_c_vessel').value = candidateData.c_vessel;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_grade').value = candidateData.grade;
       
        // // Continue with the rest of the form population code
        document.getElementById('edit_candidate_fname').value = candidateData.fname;
        document.getElementById('edit_candidate_lname').value = candidateData.lname;
    document.getElementById('edit_candidate_avb_date').value = formatDate(candidateData.avb_date);
        document.getElementById('edit_candidate_dob').value = formatDate(candidateData.dob);  
              document.getElementById('edit_candidate_company_status').value = candidateData.active_details;
              
        document.getElementById('edit_candidate_birth_place').value = candidateData.birth_place;
        document.getElementById('edit_candidate_work_nautilus').value = candidateData.work_nautilus;
        document.getElementById('edit_candidate_c_vessel').value = candidateData.c_vessel;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_zone').value = candidateData.zone;
        
        document.getElementById('edit_candidate_grade').value = candidateData.grade;
        document.getElementById('edit_candidate_boiler_suit_size').value = candidateData.boiler_suit_size;
        document.getElementById('edit_candidate_safety_shoe_size').value = candidateData.safety_shoe_size;
        document.getElementById('edit_candidate_height').value = candidateData.height;
        document.getElementById('edit_candidate_weight').value = candidateData.weight;
        document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
        document.getElementById('edit_candidate_indos_number').value = candidateData.indos_number;
        document.getElementById('edit_company_status').value = candidateData.m_status;
        document.getElementById('edit_candidate_group').value = candidateData.category;
        document.getElementById('edit_candidate_vendor').value = candidateData.vendor;
        displayFileInput('edit_candidate_photos', candidateData.photos);
        displayFileInput('edit_candidate_resume', candidateData.resume);

        document.getElementById('edit_candidate_c_ad1').value = candidateData.c_ad1;
        document.getElementById('edit_candidate_city').value = candidateData.c_city;
        document.getElementById('edit_candidate_c_state').value = candidateData.c_state;
        document.getElementById('edit_candidate_pin').value = candidateData.c_pin;
        document.getElementById('edit_candidate_c_mobi1').value = candidateData.c_mobi1;
        document.getElementById('edit_candidate_email1').value = candidateData.email1;
        document.getElementById('edit_candidate_c_tel1').value = candidateData.c_tel1;
        document.getElementById('edit_candidate_c_ad2').value = candidateData.c_ad2;
        document.getElementById('edit_candidate_p_city').value = candidateData.p_city;
        document.getElementById('edit_candidate_p_state').value = candidateData.p_state;
        document.getElementById('edit_candidate_p_pin').value = candidateData.p_pin;
        document.getElementById('edit_candidate_c_mobi2').value = candidateData.c_mobi2;
        document.getElementById('edit_candidate_c_tel2').value = candidateData.c_tel2;
        document.getElementById('edit_candidate_email2').value = candidateData.email2;

        // Hidden fields
        document.getElementById('edit_candidate_active_details').value = candidateData.active_details;
        document.getElementById('edit_candidate_area_code1').value = candidateData.area_code1;
        document.getElementById('edit_candidate_area_code2').value = candidateData.area_code2;
        document.getElementById('edit_candidate_category').value = candidateData.category;
        document.getElementById('edit_candidate_created_by').value = candidateData.createdby;
        document.getElementById('edit_candidate_created_date').value = candidateData.cr_date;
        document.getElementById('edit_candidate_created_time').value = candidateData.cr_time;
        document.getElementById('edit_candidate_editedby').value = candidateData.editedby;
        document.getElementById('edit_candidate_imp_discussion').value = candidateData.imp_discussion;
        document.getElementById('edit_candidate_ipadress').value = candidateData.ipadress;
        document.getElementById('edit_candidate_joined_date').value = candidateData.joined_date;
        document.getElementById('edit_candidate_last_company').value = candidateData.last_company;
        document.getElementById('edit_candidate_last_salary').value = candidateData.last_salary;
        document.getElementById('edit_candidate_last_date').value = candidateData.las_date;
        document.getElementById('edit_candidate_last_time').value = candidateData.las_time;
        document.getElementById('edit_candidate_mobile_code1').value = candidateData.mobile_code1;
        document.getElementById('edit_candidate_mobile_code2').value = candidateData.mobile_code2;
        document.getElementById('edit_candidate_mobile_status').value = candidateData.mobile_status;
        document.getElementById('edit_candidate_other_mobile_code').value = candidateData.other_mobile_code;
        document.getElementById('edit_candidate_other_numbers').value = candidateData.other_numbers;
        document.getElementById('edit_candidate_p_ad1').value = candidateData.p_ad1;
        document.getElementById('edit_candidate_p_ad2').value = candidateData.p_ad2;
        document.getElementById('edit_candidate_p_country').value = candidateData.p_country;
        document.getElementById('edit_candidate_p_mobi1').value = candidateData.p_mobi1;
        document.getElementById('edit_candidate_p_mobi2').value = candidateData.p_mobi2;
        document.getElementById('edit_candidate_p_rank').value = candidateData.p_rank;
        document.getElementById('edit_candidate_p_tel1').value = candidateData.p_tel1;
        document.getElementById('edit_candidate_p_tel2').value = candidateData.p_tel2;
        document.getElementById('edit_candidate_ref_check').value = candidateData.ref_check;
        document.getElementById('edit_candidate_resume_upload_date').value = candidateData.resume_upload_date;
        document.getElementById('edit_candidate_skype').value = candidateData.skype;
        document.getElementById('edit_candidate_stcw').value = candidateData.stcw;
        document.getElementById('edit_candidate_vendor_id').value = candidateData.vendor_id;
        document.getElementById('edit_candidate_us_visa').value = candidateData.us_visa
    } catch (error) {
        console.error('Error displaying candidate details:', error);
    }
}




function formatDate(dateString) {
    if (!dateString) {
        return ''; // Return empty string if dateString is null or empty
    }

    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

  async function fetchAndDisplayCandidate(candidateId,token) {
    try {
        const serverResponse = await axios.get(`https://nemo.ivistaz.co/candidate/get-candidate/${candidateId}`, {
            headers: { 'Authorization': token }
        });

        const candidateData = serverResponse.data.candidate;
        console.log(candidateData);
        displayCandidateDetails(candidateData);
    } catch (error) {
        console.error('Error fetching candidate data:', error);
        // Handle error as needed
    }
}
function displayFileInput(inputId, fileName) {
    // Display the file name in the corresponding file input
    const fileInput = document.getElementById(inputId);
    
    // Check if nextElementSibling exists before accessing it
    if (fileInput.nextElementSibling) {
        fileInput.nextElementSibling.innerText = fileName;
    }
}

const addcandidateButton = document.getElementById("edit-candidate-form");
addcandidateButton.addEventListener("submit", async(e) =>{
    e.preventDefault() // Prevent the default form submission behavior

    const candidate_details = {
        fname: document.getElementById('edit_candidate_fname').value || null,
        lname: document.getElementById('edit_candidate_lname').value || null,
        c_rank: document.getElementById('edit_candidate_c_rank').value || null,
        avb_date:avbDate || null,
        
        nationality: document.getElementById('edit_candidate_nationality').value || null,
        company_status: document.getElementById('edit_candidate_company_status').value|| null,
        dob: document.getElementById('edit_candidate_dob').value || null,
        birth_place: document.getElementById('edit_candidate_birth_place').value || null,
        work_nautilus: document.getElementById('edit_candidate_work_nautilus').value || null,
        c_vessel: document.getElementById('edit_candidate_c_vessel').value || null,
        experience: document.getElementById('edit_candidate_experience').value|| null,
        zone: document.getElementById('edit_candidate_zone').value || null,
        grade: document.getElementById('edit_candidate_grade').value || null,
        boiler_suit_size: document.getElementById('edit_candidate_boiler_suit_size').value || null,
        safety_shoe_size: document.getElementById('edit_candidate_safety_shoe_size').value || null,
        height: document.getElementById('edit_candidate_height').value || null,
        weight: document.getElementById('edit_candidate_weight').value || null,
        l_country: document.getElementById('edit_candidate_I_country').value || null,
        indos_number: document.getElementById('edit_candidate_indos_number').value || null,
        m_status: document.getElementById('edit_company_status').value || null,
        group: document.getElementById('edit_candidate_group').value || '',
        vendor: document.getElementById('edit_candidate_vendor').value || '',
        photos: document.getElementById('edit_candidate_photos').value || null,
        resume: document.getElementById('edit_candidate_resume').value || null,
        c_ad1: document.getElementById('edit_candidate_c_ad1').value || null,
        c_city: document.getElementById('edit_candidate_city').value || null,
        c_state: document.getElementById('edit_candidate_c_state').value || null,
        c_pin: document.getElementById('edit_candidate_pin').value || null,
        c_mobi1: document.getElementById('edit_candidate_c_mobi1').value || null,
        email1: document.getElementById('edit_candidate_email1').value || null,
        c_tel1: document.getElementById('edit_candidate_c_tel1').value || null,
        c_ad2: document.getElementById('edit_candidate_c_ad2').value || null,
        p_city: document.getElementById('edit_candidate_p_city').value || null,
        p_state: document.getElementById('edit_candidate_p_state').value || null,
        p_pin: document.getElementById('edit_candidate_p_pin').value || null,
        c_mobi2: document.getElementById('edit_candidate_c_mobi2').value || null,
        c_tel2: document.getElementById('edit_candidate_c_tel2').value || null,
        email2: document.getElementById('edit_candidate_email2').value || null,
        
        active_details: document.getElementById('edit_candidate_active_details').value || 0,
        area_code1: document.getElementById('edit_candidate_area_code1').value || '',
        area_code2: document.getElementById('edit_candidate_area_code2').value || '',
        category: document.getElementById('edit_candidate_category').value || 0,
        createdby: document.getElementById('edit_candidate_created_by').value || '',
        cr_date: document.getElementById('edit_candidate_created_date').value || null,
        cr_time: document.getElementById('edit_candidate_created_time').value || '',
        editedby: localStorage.getItem('username'),
        imp_discussion: document.getElementById('edit_candidate_imp_discussion').value || '',
        ipadress: document.getElementById('edit_candidate_ipadress').value || '',
        joined_date: document.getElementById('edit_candidate_joined_date').value || null,
        last_company: document.getElementById('edit_candidate_last_company').value || '',
        last_salary: document.getElementById('edit_candidate_last_salary').value || '',
        las_date: document.getElementById('edit_candidate_last_date').value || null,
        las_time: document.getElementById('edit_candidate_last_time').value || '',
        mobile_code1: document.getElementById('edit_candidate_mobile_code1').value || '',
        mobile_code2: document.getElementById('edit_candidate_mobile_code2').value || '',
        mobile_status: document.getElementById('edit_candidate_mobile_status').value || '',
        other_mobile_code: document.getElementById('edit_candidate_other_mobile_code').value || '',
        other_numbers: document.getElementById('edit_candidate_other_numbers').value || '',
        p_ad1: document.getElementById('edit_candidate_p_ad1').value || '',
        p_ad2: document.getElementById('edit_candidate_p_ad2').value || '',
        p_country: document.getElementById('edit_candidate_p_country').value || '',
        p_mobi1: document.getElementById('edit_candidate_p_mobi1').value || '',
        p_mobi2: document.getElementById('edit_candidate_p_mobi2').value || '',
        p_rank: document.getElementById('edit_candidate_p_rank').value || '',
        p_tel1: document.getElementById('edit_candidate_p_tel1').value || '',
        p_tel2: document.getElementById('edit_candidate_p_tel2').value || '',
        ref_check: document.getElementById('edit_candidate_ref_check').value || '',
        resume_upload_date: document.getElementById('edit_candidate_resume_upload_date').value || null,
        skype: document.getElementById('edit_candidate_skype').value || '',
        stcw: document.getElementById('edit_candidate_stcw').value || 0,
        vendor_id: document.getElementById('edit_candidate_vendor_id').value || '',
        us_visa:document.getElementById('edit_candidate_us_visa').value || ''
        
      };
    try {
        const serverResponse = await axios.put(`https://nemo.ivistaz.co/candidate/update-candidate/${currentCandidateId}`, candidate_details,{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
        alert("Candidate Added Successfully!");
        window.location.href="./edit-candidate.html"
    } catch (error) {
        console.error('Error:', error);
        // Handle error as needed
    }
    console.log(candidate_details);
    // Now you can use axios to send the data to the server if needed
});



    document.addEventListener("DOMContentLoaded", function() {
        // Get the dropdown items
        let dropdownItems = document.querySelectorAll(".dropdown-item");

        // Add click event listener to each dropdown item
        dropdownItems.forEach(function(item) {
            item.addEventListener("click", function() {
                // Get the id attribute of the clicked item
                var itemId = item.id;
                const memId= localStorage.getItem('memId')
                // Define the destination URLs based on the clicked item
                var destinationPage = "";
                switch (itemId) {
                    case "personnel":
                    destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                    break;
                case "discussion":
                    destinationPage =`./edit-discussion.html?memId=${memId}`;
                    break;
                case "contract":
                    destinationPage = `./add-c-contract.html?memId=${memId}`;
                    break;
                case "document":
                    destinationPage = `./add-c-document.html?memId=${memId}`;
                    break;
                case "bank":
                    destinationPage = `./add-c-bank.html?memId=${memId}`;
                    break;
                case "travel":
                    destinationPage = `./add-c-travel.html?memId=${memId}`;
                    break;
                case "medicals":
                    destinationPage = `./add-c-medicals.html?memId=${memId}`;
                    break;
                case "nkd":
                    destinationPage = `./add-c-nkd.html?memId=${memId}`;
                    break;
                    case 'seaservice':
                        destinationPage=`./seaservicetable.html?memId=${memId}`;
                        break;
                    case 'evaluation':
                    destinationPage=`./add-c-evaluation.html?memId=${memId}`;
                    break;
                default:
                    // Handle default case or do nothing
                    break;
            }

                // Redirect to the destination page
                if (destinationPage !== "") {
                    window.location.href = destinationPage;
                }
            });
        });
    });

  
       
  
    
    
    
    
    function decodeToken(token) {
        // Implementation depends on your JWT library
        // Here, we're using a simple base64 decode
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(atob(base64));
    }
    const decodedToken = decodeToken(token);

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