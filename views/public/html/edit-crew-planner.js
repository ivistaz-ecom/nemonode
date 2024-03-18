const token = localStorage.getItem('token');
let country;
let vessel;
let vessel_type;
let company;
let rank;
let id;
const displayDropdown = async function () {
    const rankDropdown = document.getElementById('edit_candidate_c_rank');
    rankDropdown.innerHTML = ''; // Clear existing options

    // Add the default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = '-- Select Rank --';
    rankDropdown.appendChild(defaultOption);

    const rankResponse = await axios.get("http://nemonode.ivistaz.co/others/view-rank", { headers: { "Authorization": token } });
    const rankOptions = rankResponse.data.ranks;
    const rankNames = rankOptions.map(rank => rank.rank);

    for (let i = 0; i < rankNames.length; i++) {
        const option = document.createElement('option');
        option.value = rankNames[i];
        option.text = rankNames[i];
        rankDropdown.appendChild(option);
    }
    rankDropdown.value=rank
}

const displayVesselDropdown = async function () {
    try {
        const vesselDropdown = document.getElementById('edit_vsl');
        vesselDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Vessel --';
        vesselDropdown.appendChild(defaultOption);

        const vesselResponse = await axios.get("http://nemonode.ivistaz.co/others/view-vsl", { headers: { "Authorization": token } });
        const vessels = vesselResponse.data.vsls;
        const vesselNames = vessels.map(vessel => vessel.vesselName);

        for (let i = 0; i < vesselNames.length; i++) {
            const option = document.createElement('option');
            option.value = vesselNames[i];
            option.text = vesselNames[i];
            vesselDropdown.appendChild(option);
        }
        vesselDropdown.value=vessel
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

const displayVesselTypeDropdown = async function () {
    try {
        const vesselDropdown = document.getElementById('edit_vesseltype');
        vesselDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Vessel Type --';
        vesselDropdown.appendChild(defaultOption);

        const vesselResponse = await axios.get("http://nemonode.ivistaz.co/others/view-vessels", { headers: { "Authorization": token } });
        const vessels = vesselResponse.data.vessels;
        const vesselNames = vessels.map(vessel => vessel.vesselName);

        for (let i = 0; i < vesselNames.length; i++) {
            const option = document.createElement('option');
            option.value = vesselNames[i];
            option.text = vesselNames[i];
            vesselDropdown.appendChild(option);
        }
        vesselDropdown.value=vessel_type
    } catch (error) {
        console.error('Error fetching vessels:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    displayDropdown();
    displayVesselDropdown();
    displayVesselTypeDropdown();
    displayCountryDropdown();
    createCompanyDropdown()
    const params = new URLSearchParams(window.location.search);

    // Log the parameters to the console
    console.log('ID:', params.get('id'));
    console.log('Rank:', params.get('rank'));
    console.log('Client:', params.get('client'));
    console.log('Vessel Type:', params.get('vesselType'));
    console.log('Vessel Name:', params.get('vesselName'));
    console.log('COC Accepted:', params.get('cocAccepted'));
    console.log('Trading:', params.get('trading'));
    console.log('Wages:', params.get('wages'));
    console.log('Date of Joining:', params.get('doj'));
    console.log('Other Info:', params.get('otherInfo'));
    console.log('Status:', params.get('status'));

    document.getElementById('crew_id').value = params.get('id');
    document.getElementById('edit_candidate_c_rank').value = params.get('rank');
    document.getElementById('edit_client').value = params.get('client');
    document.getElementById('edit_vesseltype').value = params.get('vesselType');
    document.getElementById('edit_vsl').value = params.get('vesselName');
    document.getElementById('edit_cocAccepted').value = params.get('cocAccepted');
    document.getElementById('edit_trading').value = params.get('trading');
    document.getElementById('edit_wages').value = params.get('wages');
    document.getElementById('edit_otherInfo').value = params.get('otherInfo');
    document.getElementById('edit_status').value = params.get('status');
    id = params.get('id');
     country = params.get('cocAccepted');
     vessel_type=params.get('vesselType')
     vessel=params.get('vesselName')
    rank =params.get('rank');
    company = params.get('client')

    const dojInput = document.getElementById('edit_doj');
    const immediateCheckbox = document.getElementById('edit_immediate');

    // Handle "Date of Joining" and "Immediate" checkbox
    if (params.get('doj') === 'immediate') {
        immediateCheckbox.checked = true;
    } else {
        dojInput.value = formatDate(params.get('doj'));
        immediateCheckbox.checked = false;
    }

    dojInput.addEventListener('input', function () {
        // Disable "Immediate" if "Date of Joining" is selected
        immediateCheckbox.disabled = dojInput.value !== '';
    });

    immediateCheckbox.addEventListener('input', function () {
        // Disable "Date of Joining" if "Immediate" is selected
        dojInput.disabled = immediateCheckbox.checked;
    });
});

// Function to format the date
async function createCompanyDropdown() {

    const companyResponse = await axios.get("http://nemonode.ivistaz.co/company/view-company", { headers: { "Authorization": token } });
        const companyOptions = companyResponse.data.company;
        const companyNames = companyOptions.map(company => company.company_name);


    const companyDropdown = document.getElementById('edit_client');
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
    companyDropdown.value = company
}


const displayCountryDropdown = async function () {
    try {
        const countryDropdown = document.getElementById('edit_cocAccepted');
        countryDropdown.innerHTML = ''; // Clear existing options

        // Add the default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.text = '-- Select Country --';
        countryDropdown.appendChild(defaultOption);

        // Assuming the country data is an array of objects with the property "country"
        const countryResponse = await axios.get("http://nemonode.ivistaz.co/others/country-codes", { headers: { "Authorization": token } });
        const countries = countryResponse.data.countryCodes; // Assuming the array is directly returned

        for (let i = 0; i < countries.length; i++) {
            const option = document.createElement('option');
            option.value = countries[i].country; // Assuming the country name is in the "country" property
            option.text = countries[i].country; // Assuming the country name is in the "country" property
            countryDropdown.appendChild(option);
            // If you want to clone the options for another dropdown, do it here
            // licenseDropdown.appendChild(option.cloneNode(true));
        }
        countryDropdown.value = country
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

const updateCrewPlanner = async (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
         id : document.getElementById('crew_id').value,
        rank: document.getElementById('edit_candidate_c_rank').value,
        client: document.getElementById('edit_client').value,
        vesselType: document.getElementById('edit_vesseltype').value,
        vesselName: document.getElementById('edit_vsl').value,
        cocAccepted: document.getElementById('edit_cocAccepted').value,
        trading: document.getElementById('edit_trading').value,
        wages: document.getElementById('edit_wages').value,
        otherInfo: document.getElementById('edit_otherInfo').value,
        status: document.getElementById('edit_status').value,
    };

    console.log(formData)
    // Check if "doj" or "immediate" should be included
    const dojInput = document.getElementById('edit_doj');
    const immediateCheckbox = document.getElementById('edit_immediate');

    if (dojInput.value && !immediateCheckbox.checked) {
        formData.doj = dojInput.value;
    } else {
        formData.doj = 'immediate';
    }

    try {
        // Send data to the server using Axios
        const response = await axios.put(`http://nemonode.ivistaz.co/others/update-crew-planner/${id}`, formData, { headers: { "Authorization": token } });

        // Handle the response as needed
        console.log(response.data);
        window.location.href='./crew-planner.html'
        // Reset the form or perform other actions if necessary
    } catch (error) {
        // Handle errors
        console.error('Error updating data:', error);
    }
};

// Attach the function to the form submit event
document.getElementById('editCrewForm').addEventListener('submit', updateCrewPlanner);

function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

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
