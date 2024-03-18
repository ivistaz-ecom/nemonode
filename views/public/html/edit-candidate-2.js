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
        console.log(hasUserManagement)
        if (hasUserManagement) {
          document.getElementById('userManagementSection').style.display = 'block';
          document.getElementById('userManagementSections').style.display = 'block';
    
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

async function fetchAndDisplayExp() {
    try {
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-experience", { headers: { "Authorization": token } });
        const experiences = serverResponse.data.experiences; // Access the array using response.data.experiences

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
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-grade", { headers: { "Authorization": token } });
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
        const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
        const vessels = serverResponse.data.vsls;

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
            dropdownOption.value = option.country; // Use the appropriate ID or value from your data
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

    const rankResponse = await axios.get("https://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
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
        const response = await axios.get("https://nemonode.ivistaz.co/fetch-nationality", { headers: { "Authorization": token } });
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
        document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
        // Fetch Rank options from the server using Axios
        // const rankResponse = await axios.get("https://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
        // const rankOptions = rankResponse.data.ranks;
        // const rankNames = rankOptions.map(rank => rank.rank);

        // const portResponse = await axios.get("https://nemonode.ivistaz.co/others/view-port", { headers: { "Authorization": token } });
        // const portOptions = portResponse.data.ports;
        // const portNames = portOptions.map(port => port.portName);

        // const documentResponse = await axios.get("https://nemonode.ivistaz.co/others/view-document", { headers: { "Authorization": token } });
        // const documentOptions = documentResponse.data.documents;
        // const documentNames = documentOptions.map(document => document.documentType);
        // console.log(documentNames)

        
    
        // const companyResponse = await axios.get("https://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        // const companyOptions = companyResponse.data.company;
        // const companyNames = companyOptions.map(company => company.company_name);

    
        // const countryResponse = await axios.get("https://nemonode.ivistaz.co/fetch-nationality", { headers: { "Authorization": token } });
        // const countries = countryResponse.data.countries; // Access the array using response.data.countries
        // const countryNames = countries.map(country => country.country);
    
        // const serverResponse = await axios.get("https://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
        // const vessels = serverResponse.data.vsls;
        // const vesselTypeNames = vessels.map(vessel=>vessel.vesselName)
        // const vesselTypeName = vessels.map(vessel=>vessel.vesselType)

        
        // const vesselDropdown_contract = document.getElementById('contract_vsl');
        // vesselDropdown_contract.innerHTML = '';
        // // Extract only the rank names
        
        // const gradeResponse = await axios.get("https://nemonode.ivistaz.co/others/view-grade", { headers: { "Authorization": token } });
        // const grades = gradeResponse.data.grades;
        // const gradeNames = grades.map(grade => grade.gradeExp);

        // const hospitalResponse = await axios.get("https://nemonode.ivistaz.co/others/view-hospital", { headers: { "Authorization": token } });
        // const hospitals = hospitalResponse.data.hospitals;
        // const hospitalNames = hospitals.map(hospital => hospital.hospitalName);
        // const hospitalDropdown = document.getElementById('hospital_name');
        // hospitalDropdown.innerHTML = ''; // Clear existing options

        // // Populate the Rank dropdown options
        // const rankDropdown = document.getElementById('edit_candidate_c_rank');
        // rankDropdown.innerHTML = ''; // Clear existing options

        // const rankDropdowns = document.getElementById('edit_contract_rank');
        // rankDropdowns.innerHTML = ''; 

        // // const rankDropdowns_one = document.getElementById('rank');
        // // rankDropdowns_one.innerHTML = ''; 
    
        // const countryDropdown = document.getElementById('edit_candidate_nationality');
        // countryDropdown.innerHTML = '';
    
        // const vesselDropdown = document.getElementById('edit_candidate_c_vessel');
        // vesselDropdown.innerHTML = '';

        // const gradeDropdown = document.getElementById('edit_candidate_grade');
        // gradeDropdown.innerHTML = '';

        // const licenseDropdown = document.getElementById('edit_candidate_I_country');
        // licenseDropdown.innerHTML = '';
    
        // // const vesselDropdowns = document.getElementById('vessel_type');
        // // vesselDropdowns.innerHTML = '';

        // const vesselDropdowns_contract = document.getElementById('contract_vesseltype');
        // vesselDropdowns_contract.innerHTML = '';

        // const companyDropdown = document.getElementById('contract_company');
        // companyDropdown.innerHTML = '';

        // const portDropdown = document.getElementById('contract_signonport');
        // portDropdown.innerHTML = '';

        // const portDropdowns = document.getElementById('contract_signoffport');
        // portDropdowns.innerHTML = '';

        // const documentDropdowns = document.getElementById('doc_document');
        // documentDropdowns.innerHTML = '';

        
        // const portAgentResponse = await axios.get("https://nemonode.ivistaz.co/others/view-port-agent", { headers: { "Authorization": token } });
        // const portAgents = portAgentResponse.data.portAgents;
        // console.log(portAgentResponse,portAgents)
        // const portAgentname = portAgents.map(pa => pa.portAgentName);
        // const portAgentDropdowns = document.getElementById('travel_port_agent');
        // portAgentDropdowns.innerHTML = '';

        // for (let i = 0; i < rankNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = rankNames[i];
        //     option.text = rankNames[i];
        //     rankDropdown.appendChild(option);
        //     rankDropdowns.appendChild(option.cloneNode(true));
        //     // rankDropdowns_one.appendChild(option.cloneNode(true));
            
        // }

        // for (let i = 0; i < hospitalNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = hospitalNames[i];
        //     option.text = hospitalNames[i];
        //     hospitalDropdown.appendChild(option);
        // }
        // for (let i = 0; i < portAgentname.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = portAgentname[i];
        //     option.text = portAgentname[i];
        //     portAgentDropdowns.appendChild(option);
           
            
        // }

        // for (let i = 0; i < documentNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = documentNames[i];
        //     option.text = documentNames[i];
        //     documentDropdowns.appendChild(option);
          
            
        // }
    
        // for (let i = 0; i < countryNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = countryNames[i];
        //     option.text = countryNames[i];
        //     countryDropdown.appendChild(option);
        //    licenseDropdown.appendChild(option.cloneNode(true));        }

        // for (let i = 0; i < vesselTypeNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = vesselTypeNames[i];
        //     option.text = vesselTypeNames[i];
        //     vesselDropdown.appendChild(option);
        //     // vesselDropdowns.appendChild(option.cloneNode(true));
        //     vesselDropdown_contract.appendChild(option.cloneNode(true));    
        //     }

        //     for (let i = 0; i < vesselTypeName.length; i++) {
        //         const option = document.createElement('option');
        //         option.value = vesselTypeName[i];
        //         option.text = vesselTypeName[i];
        //         vesselDropdowns_contract.appendChild(option.cloneNode(true));    
        //         }

        //         for (let i = 0; i < portNames.length; i++) {
        //             const option = document.createElement('option');
        //             option.value = portNames[i];
        //             option.text = portNames[i];
        //             portDropdown.appendChild(option);    
        //             portDropdowns.appendChild(option.cloneNode(true));    

        //             }
    

            

        //     for (let i = 0; i < companyNames.length; i++) {
        //         const option = document.createElement('option');
        //         option.value = companyNames[i];
        //         option.text = companyNames[i];
        //         companyDropdown.appendChild(option);
        //         // companyDropdown.appendChild(option.cloneNode(true));    
        //         }
    

        

        // for (let i = 0; i < gradeNames.length; i++) {
        //     const option = document.createElement('option');
        //     option.value = gradeNames[i];
        //     option.text = gradeNames[i];
        //     gradeDropdown.appendChild(option);
        // }

        
    
        // // Set the selected value for the Rank and Nationality dropdowns
        // rankDropdown.value = candidateData.c_rank;
        // countryDropdown.value = candidateData.nationality;
        // vesselDropdown.value=candidateData.c_vessel;
        // gradeDropdown.value=candidateData.grade;
        // licenseDropdown.value=candidateData.l_country;
        // companyDropdown.value=candidateData.last_company;
        // // Continue with the rest of the form population code
        document.getElementById('edit_candidate_fname').value = candidateData.fname;
        document.getElementById('edit_candidate_lname').value = candidateData.lname;
        document.getElementById('edit_candidate_avb_date').value = formatDate(candidateData.avb_date);
        document.getElementById('edit_candidate_dob').value = formatDate(candidateData.dob);  
              document.getElementById('edit_candidate_company_status').value = candidateData.company_status;
        document.getElementById('edit_candidate_birth_place').value = candidateData.birth_place;
        document.getElementById('edit_candidate_work_nautilus').value = candidateData.work_nautilus;
        // document.getElementById('edit_candidate_c_vessel').value = candidateData.c_vessel;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_zone').value = candidateData.zone;
        
        // document.getElementById('edit_candidate_grade').value = candidateData.grade;
        document.getElementById('edit_candidate_boiler_suit_size').value = candidateData.boiler_suit_size;
        document.getElementById('edit_candidate_safety_shoe_size').value = candidateData.safety_shoe_size;
        document.getElementById('edit_candidate_height').value = candidateData.height;
        document.getElementById('edit_candidate_weight').value = candidateData.weight;
        document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
        document.getElementById('edit_candidate_indos_number').value = candidateData.indos_number;
        document.getElementById('edit_company_status').value = candidateData.m_status;
        document.getElementById('edit_candidate_group').value = candidateData.group;
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
    } catch (error) {
        console.error('Error displaying candidate details:', error);
    }
}




function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  async function fetchAndDisplayCandidate(candidateId,token) {
    try {
        const serverResponse = await axios.get(`https://nemonode.ivistaz.co/candidate/get-candidate/${candidateId}`, {
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
        fname: document.getElementById('edit_candidate_fname').value,
        lname: document.getElementById('edit_candidate_lname').value,
        c_rank: document.getElementById('edit_candidate_c_rank').value,
        avb_date: document.getElementById('edit_candidate_avb_date').value,
        
        nationality: document.getElementById('edit_candidate_nationality').value,
        company_status: document.getElementById('edit_candidate_company_status').value,
        dob: document.getElementById('edit_candidate_dob').value,
        birth_place: document.getElementById('edit_candidate_birth_place').value,
        work_nautilus: document.getElementById('edit_candidate_work_nautilus').value,
        c_vessel: document.getElementById('edit_candidate_c_vessel').value,
        experience: document.getElementById('edit_candidate_experience').value,
        zone: document.getElementById('edit_candidate_zone').value,
        grade: document.getElementById('edit_candidate_grade').value,
        boiler_suit_size: document.getElementById('edit_candidate_boiler_suit_size').value,
        safety_shoe_size: document.getElementById('edit_candidate_safety_shoe_size').value,
        height: document.getElementById('edit_candidate_height').value,
        weight: document.getElementById('edit_candidate_weight').value,
        l_country: document.getElementById('edit_candidate_I_country').value,
        indos_number: document.getElementById('edit_candidate_indos_number').value,
        m_status: document.getElementById('edit_company_status').value,
        group: document.getElementById('edit_candidate_group').value || '',
        vendor: document.getElementById('edit_candidate_vendor').value || '',
        photos: document.getElementById('edit_candidate_photos').value,
        resume: document.getElementById('edit_candidate_resume').value,
        c_ad1: document.getElementById('edit_candidate_c_ad1').value,
        c_city: document.getElementById('edit_candidate_city').value,
        c_state: document.getElementById('edit_candidate_c_state').value,
        c_pin: document.getElementById('edit_candidate_pin').value,
        c_mobi1: document.getElementById('edit_candidate_c_mobi1').value,
        email1: document.getElementById('edit_candidate_email1').value,
        c_tel1: document.getElementById('edit_candidate_c_tel1').value,
        c_ad2: document.getElementById('edit_candidate_c_ad2').value,
        p_city: document.getElementById('edit_candidate_p_city').value,
        p_state: document.getElementById('edit_candidate_p_state').value,
        p_pin: document.getElementById('edit_candidate_p_pin').value,
        c_mobi2: document.getElementById('edit_candidate_c_mobi2').value,
        c_tel2: document.getElementById('edit_candidate_c_tel2').value,
        email2: document.getElementById('edit_candidate_email2').value,
        
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
        vendor_id: document.getElementById('edit_candidate_vendor_id').value || ''
        
      };
    try {
        const serverResponse = await axios.put(`https://nemonode.ivistaz.co/candidate/update-candidate/${currentCandidateId}`, candidate_details,{headers:{"Authorization":token}});
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

    document.getElementById('logout').addEventListener('click', function() {
        // Clear local storage
        localStorage.clear();
    
        // Perform logout actions
        // You may want to redirect to a login page or perform other logout-related tasks
    
        // For example, redirect to a login page
        window.location.href = './loginpage.html';
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