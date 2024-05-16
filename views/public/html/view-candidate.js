const token = localStorage.getItem('token')

function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }
function loadContent(section) {
    // Hide all content divs
    document.getElementById('personnelContent').style.display = 'none';
    document.getElementById('discussionContent').style.display = 'none';
    document.getElementById('contractContent').style.display = 'none';
    document.getElementById('documentContent').style.display = 'none';
    document.getElementById('bankContent').style.display = 'none';
    document.getElementById('travelContent').style.display = 'none';
    document.getElementById('medicalContent').style.display = 'none';
    document.getElementById('nkdContent').style.display = 'none';
    document.getElementById('seaServiceContent').style.display = 'none';
    document.getElementById('evaluationContent').style.display = 'none';

    // Show the selected content div
    document.getElementById(`${section}Content`).style.display = 'block';
}

async function fetchAndDisplayDocumentDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-document-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const documentDetails = response.data;

        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = ''; // Clear existing rows

        documentDetails.forEach(doc => {
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
                <td>${doc.document}</td>
                <td>${doc.document_number}</td>
                <td>${doc.issue_date}</td>
                <td>${doc.issue_place}</td>
                <td>${doc.document_files}</td>
                <td>${doc.stcw}</td>
                <td>${doc.expiry_date}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editDocument('${doc.id}','${doc.document}','${doc.document_number}','${doc.issue_date}','${doc.issue_place}','${doc.document_files}','${doc.stcw}', event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteDocument('${doc.id}', event)">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;

            documentTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching document details:', error);
    }
}


async function fetchAndDisplayBankDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-bank-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const bankDetails = response.data;
        console.log(bankDetails)

        const bankTableBody = document.getElementById('bankTableBody');
        bankTableBody.innerHTML = ''; // Clear existing rows

        bankDetails.forEach(bank => {
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
            <td><span class='badge bg-success'>${bank.beneficiary}</span></td>
            <td>${bank.account_num}</td>
            <td><span class='badge bg-success'>${bank.branch}</span></td>
            <td>${bank.bank_addr}</td>
            <td>${bank.beneficiary_addr}</td>
            <td>${bank.swift_code}</td>
            <td>${bank.ifsc_code}</td>
            <td>${bank.passbook}</td>
            <td>${bank.pan_num}</td>
            <td>${bank.pan_card}</td>
            <td>
            <button class="btn border-0 m-0 p-0" onclick="editBank('${bank.id}','${bank.bank_name}','${bank.account_num}','${bank.bank_addr}','${bank.ifsc_code}','${bank.swift_code}','${bank.beneficiary}','${bank.beneficiary_addr}','${bank.pan_num}','${bank.passbook}','${bank.pan_card}','${bank.branch}' event)">
                <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
            </button>
            <button class="btn border-0 m-0 p-0" onclick="deleteBank('${bank.id}', event)">
                <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
            </button>
        </td>
        
            `;

            bankTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching bank details:', error);
    }
}

function editBank(id, bank_name, account_num, bank_addr,branch, ifsc_code, swift_code, beneficiary, beneficiary_addr, pan_num, passbook, pan_card, event) {
event.preventDefault();
    console.log('Edit clicked for bank ID:', id);
    window.location.href = `edit-c-bank.html?id=${id}&bank_name=${bank_name}&account_num=${account_num}&bank_addr=${bank_addr}&ifsc_code=${ifsc_code}&swift_code=${swift_code}&beneficiary=${beneficiary}&beneficiary_addr=${beneficiary_addr}&pan_num=${pan_num}&passbook=${passbook}&pan_card=${pan_card}&nri_bank_name=${nri_bank_name}&nri_account_num=${nri_account_num}&nri_bank_addr=${nri_bank_addr}&nri_ifsc_code=${nri_ifsc_code}&nri_swift_code=${nri_swift_code}&nri_beneficiary=${nri_beneficiary}&nri_beneficiary_addr=${nri_beneficiary_addr}&nri_passbook=${nri_passbook}`; // Include all parameters
    // ...
}


function deleteBank(bankId) {
    // Implement your delete functionality here using the bankId
    console.log('Delete clicked for bank ID:', bankId);
}




async function fetchAndDisplayTravelDetails(candidateId) {
    try {
        // Make an Axios request to your backend API to get travel details
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-travel-details/${candidateId}`, {
            headers: { "Authorization": token }
        });

        // Clear existing table rows
        const travelTableBody = document.getElementById('travelTableBody');
        travelTableBody.innerHTML = '';

        // Iterate over the fetched data and append rows to the table
        response.data.forEach(travel => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${travel.travel_date}</td>
                <td>${travel.travel_from}</td>
                <td>${travel.travel_to}</td>
                <td>${travel.travel_mode}</td>
                <td>${travel.travel_status}</td>
                <td>${travel.ticket_number}</td>
                <td>${travel.agent_name}</td>
                <td>${travel.portAgent}</td>
                <td>${travel.travel_amount}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editTravel('${travel.id}','${travel.travel_date}','${travel.travel_from}','${travel.travel_to}','${travel.travel_mode}','${travel.travel_status}','${travel.ticket_number}','${travel.agent_name}','${travel.portAgent}','${travel.travel_amount}',event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteTravel('${travel.id}')">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;
            travelTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching travel details:', error);
    }
}

function editTravel(id, travel_date, travel_from, travel_to, travel_mode, travel_status, ticket_number, agent_name, portAgent, travel_amount, event) {
    event.preventDefault();
    console.log('Edit clicked for travel ID:', id);
    window.location.href = `edit-c-travel.html?id=${id}&travel_date=${travel_date}&travel_from=${travel_from}&travel_to=${travel_to}&travel_mode=${travel_mode}&travel_status=${travel_status}&ticket_number=${ticket_number}&agent_name=${agent_name}&portAgent=${portAgent}&travel_amount=${travel_amount}`; // Include all parameters
    // ...
}

// ... At the end of your JavaScript code
async function deleteTravel(travelId) {
const token = localStorage.getItem('token');

try {
    // Make an Axios request to your backend API to delete the travel entry
    const response = await axios.delete(`https://nemo.ivistaz.co/candidate/delete-travel/${travelId}`, {
        headers: { "Authorization": token }
    });

    // Handle success response from the server
    console.log('Travel deleted successfully:', response.data);
    
    // Fetch and display updated travel details
    await fetchAndDisplayTravelDetails();
} catch (error) {
    // Handle error response from the server
    console.error('Error deleting travel:', error);
}
}
// ...
function formatDates(dateString) {
    const parts = dateString.split('-'); // Split the date string into parts
    const year = parseInt(parts[0]); // Get the year
    const month = parseInt(parts[1]) - 1; // Get the month (months are 0-indexed in JavaScript)
    const day = parseInt(parts[2]); // Get the day

    // Construct the date object
    const date = new Date(year, month, day);
    
    // Now you can format the date as you need
    const formattedDate = date.toISOString().split('T')[0];
    
    return formattedDate;
}




async function fetchAndDisplayMedicalDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-hospital-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const medicalDetails = response.data;
        console.log(medicalDetails)
        const medicalTableBody = document.getElementById('hospitalTableBody');
        medicalTableBody.innerHTML = ''; // Clear existing rows

        medicalDetails.forEach(medical => {
            const row = document.createElement('tr');

            const createCell = (value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                return cell;
            };

            // Add data to each cell
            row.appendChild(createCell(medical.hospitalName));
            row.appendChild(createCell(medical.place));
            row.appendChild(createCell(medical.date));
            row.appendChild(createCell(medical.expiry_date)); // Update to match the Sequelize model
            row.appendChild(createCell(medical.done_by));
            row.appendChild(createCell(medical.status));
            row.appendChild(createCell(medical.amount));
            row.appendChild(createCell(medical.upload));

            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.className = 'btn border-0 m-0 p-0';
            editButton.innerHTML = '<i class="fa fa-pencil" onMouseOver="this.style.color=\'seagreen\'" onMouseOut="this.style.color=\'gray\'"></i>';
            editButton.addEventListener('click', () => editMedical(medical.id, medical.hospitalName, medical.place, medical.date, medical.expiry_date, medical.done_by, medical.status, medical.amount, medical.upload, event));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn border-0 m-0 p-0';
            deleteButton.innerHTML = '<i class="fa fa-trash" onMouseOver="this.style.color=\'red\'" onMouseOut="this.style.color=\'gray\'"></i>';
            deleteButton.addEventListener('click', () => deleteMedical(medical.id, event));

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            // Append the row to the table body
            medicalTableBody.appendChild(row);
        });
        
    } catch (err) {
        console.error(err);
    }
}

const editMedical = async (id, hospitalName, place, date, expiryDate, done_by, status, amount, uploadFile, event) => {
    event.preventDefault();
    console.log(id, hospitalName, place, date, expiryDate, done_by, status, amount, uploadFile);

    // Update the URL parameters to match the expected parameter names in the edit-c-medicals.html page
    window.location.href = `edit-c-medicals.html?id=${id}&hospitalName=${hospitalName}&place=${place}&date=${date}&expiry_date=${formatDate(expiryDate)}&done_by=${done_by}&status=${status}&amount=${amount}&upload=${uploadFile}`;
};


const deleteMedical = async (id, event) => {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this medical entry?');
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://nemo.ivistaz.co/candidate/delete-medical/${id}`, { headers: { "Authorization": token } });
            console.log(response.data);
            // Fetch and display medical details again after deletion
            fetchAndDisplayMedicalDetails(candidateId);
        }
    } catch (error) {
        console.error('Error deleting medical entry:', error);
    }
};





const fetchAndDisplayNkdData = async (candidateId) => {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-nkd-details/${candidateId}`, { headers: { "Authorization": token } });

        // Assuming response.data contains an array of NKD objects
        const nkdData = response.data;

        // Get the table body element
        const tableBody = document.getElementById('nkdTableBody');
        tableBody.innerHTML = ''; // Clear existing table content

        // Iterate through the NKD data and append rows to the table
        nkdData.forEach((nkd) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = nkd.kin_name;
            row.insertCell(1).innerText = nkd.kin_relation;
            row.insertCell(2).innerText = nkd.kin_contact_number;
            row.insertCell(3).innerText = nkd.kin_contact_address;

            // Create a new cell for kin_priority with the specified class
            const priorityCell = row.insertCell(4);
            priorityCell.innerHTML = `<span class="badge ${getPriorityClass(nkd.kin_priority)}">${nkd.kin_priority}</span>`;

            const editButton = document.createElement('button');
            editButton.className = 'btn border-0 m-0 p-0';
            editButton.innerHTML = '<i class="fa fa-pencil" onMouseOver="this.style.color=\'seagreen\'" onMouseOut="this.style.color=\'gray\'"></i>';
            editButton.addEventListener('click', () => editNkd(nkd.id, nkd.kin_name, nkd.kin_relation, nkd.kin_contact_number, nkd.kin_contact_address, nkd.kin_priority));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn border-0 m-0 p-0';
            deleteButton.innerHTML = '<i class="fa fa-trash" onMouseOver="this.style.color=\'red\'" onMouseOut="this.style.color=\'gray\'"></i>';
            deleteButton.addEventListener('click', () => deleteNkd(nkd.id));

            // Add buttons to the row
            const cell = row.insertCell(5);
            cell.appendChild(editButton);
            cell.appendChild(deleteButton);
        });

    } catch (error) {
        console.error('Error fetching NKD data:', error);
    }
};

// Function to determine the class based on priority value
function getPriorityClass(priority) {
    // Adjust this logic as needed based on your priority criteria
    if (priority === 'HIGH') {
        return 'bg-danger';
    } else if (priority === 'MID') {
        return 'bg-warning';
    } else {
        return 'bg-info';
    }
}


function editNkd(id, kinName, kinRelation, kinContactNumber, kinContactAddress, kinPriority) {
    // Your edit logic here, you can open a modal or navigate to an edit page
    console.log(`Editing NKD with ID: ${id}`);

    window.location.href = `edit-c-nkd.html?id=${id}&kinName=${kinName}&kinRelation=${kinRelation}&kinContactNumber=${kinContactNumber}&kinContactAddress=${kinContactAddress}&kinPriority=${kinPriority}`;

    // Populate the edit form with the provided details if needed
}


// Function to delete NKD entry
async function deleteNkd(id) {
    try {
        const confirmDelete = confirm('Are you sure you want to delete this NKD entry?');
        if (confirmDelete) {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`https://nemo.ivistaz.co/candidate/delete-nkd/${id}`, { headers: { "Authorization": token } });
            console.log(response.data);
            // Fetch and display NKD data again after deletion
            fetchAndDisplayNkdData();
        }
    } catch (error) {
        console.error('Error deleting NKD entry:', error);
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const candidateId = localStorage.getItem('memId');
        console.log(candidateId)
        await   fetchAndDisplayDiscussions(candidateId);
        await displayCandidateDetails();
        await fetchAndDisplayContractDetails(candidateId)
        await fetchAndDisplayDocumentDetails(candidateId)
        await fetchAndDisplayBankDetails(candidateId)
        await fetchAndDisplayTravelDetails(candidateId)
        await fetchAndDisplayMedicalDetails(candidateId)
        await fetchAndDisplayNkdData(candidateId);
        await fetchAndDisplaySeaService(candidateId);
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
        // You can call loadContent function here if needed
        // loadContent('personnel'); // Example: Load personnel information by default

        
async function displayCandidateDetails() {
    try {
        // Fetch candidate data based on the candidate ID
        const id = localStorage.getItem('memId')
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-candidate/${id}`,{headers:{"Authorization":token}});
        const candidateData = response.data.candidate;
        document.getElementById('candidateId').value = candidateData.candidateId;
        document.getElementById('edit_candidate_c_rank').value = candidateData.c_rank;
        document.getElementById('edit_candidate_nationality').value = candidateData.nationality;
        document.getElementById('edit_candidate_c_vessel').value = candidateData.c_vessel;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_grade').value = candidateData.grade;
        document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
       
        document.getElementById('edit_candidate_fname').value = candidateData.fname;
        document.getElementById('edit_candidate_lname').value = candidateData.lname;
        document.getElementById('edit_candidate_avb_date').value = formatDate(candidateData.avb_date);
        document.getElementById('edit_candidate_dob').value = formatDate(candidateData.dob);  
        document.getElementById('edit_candidate_company_status').value = candidateData.company_status;
        document.getElementById('edit_candidate_birth_place').value = candidateData.birth_place;
        document.getElementById('edit_candidate_work_nautilus').value = candidateData.work_nautilus;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_zone').value = candidateData.zone;
        
        document.getElementById('edit_candidate_boiler_suit_size').value = candidateData.boiler_suit_size;
        document.getElementById('edit_candidate_safety_shoe_size').value = candidateData.safety_shoe_size;
        document.getElementById('edit_candidate_height').value = candidateData.height;
        document.getElementById('edit_candidate_weight').value = candidateData.weight;
        document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
        document.getElementById('edit_candidate_indos_number').value = candidateData.indos_number;
        document.getElementById('edit_company_status').value = candidateData.m_status;
        document.getElementById('edit_candidate_group').value = candidateData.group;
        document.getElementById('edit_candidate_vendor').value = candidateData.vendor;
        document.getElementById('edit_candidate_photos').value= candidateData.photos
        document.getElementById('edit_candidate_resume').value= candidateData.resume
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

        const photoValue = document.getElementById('edit_candidate_photos').value;

        // Extract the photo name from the photo value
        const photoName = photoValue.substring(photoValue.lastIndexOf('/') + 1);
    
        // Update the src attribute of the img tag
        const imageContainer = document.getElementById('imageContainer');
        const image = imageContainer.querySelector('img');
        image.src = "/photos/" + photoName;
        image.alt = "Description of the image"; // Add alt attribute if needed
        console.log(image.src)
        // Hidden fields
    } catch (error) {
        console.error('Error displaying candidate details:', error);
    }
}

    } catch (error) {
        console.error('Error fetching and displaying data:', error);
    }
   

});

async function editCandidate() {
    // Get values from the form
    var id = document.getElementById('candidateId').value; // Add the ID value if applicable
    var fname = document.getElementById('edit_candidate_fname').value;
    var lname = document.getElementById('edit_candidate_lname').value;
    var rank = document.getElementById('edit_candidate_c_rank').value;
    var avbDate = document.getElementById('edit_candidate_avb_date').value;
    var nationality = document.getElementById('edit_candidate_nationality').value;
    var maritalStatus = document.getElementById('edit_company_status').value;
    var dob = document.getElementById('edit_candidate_dob').value;
    var birthPlace = document.getElementById('edit_candidate_birth_place').value;
    var workNautilus = document.getElementById('edit_candidate_work_nautilus').value;
    var vesselType = document.getElementById('edit_candidate_c_vessel').value;
    var experience = document.getElementById('edit_candidate_experience').value;
    var zone = document.getElementById('edit_candidate_zone').value;
    var grade = document.getElementById('edit_candidate_grade').value;
    var boilerSuitSize = document.getElementById('edit_candidate_boiler_suit_size').value;
    var safetyShoeSize = document.getElementById('edit_candidate_safety_shoe_size').value;
    var height = document.getElementById('edit_candidate_height').value;
    var weight = document.getElementById('edit_candidate_weight').value;
    var licenseCountry = document.getElementById('edit_candidate_I_country').value;
    var indosNumber = document.getElementById('edit_candidate_indos_number').value;
    var candidateStatus = document.getElementById('edit_candidate_company_status').value;
    var group = document.getElementById('edit_candidate_group').value;
    var vendor = document.getElementById('edit_candidate_vendor').value;
    var photo = document.getElementById('edit_candidate_photos').value; // Assuming this is a file input, consider handling file uploads appropriately
    var resume = document.getElementById('edit_candidate_resume').value; // Assuming this is a file input, consider handling file uploads appropriately
    var address1 = document.getElementById('edit_candidate_c_ad1').value;
    var address2 = document.getElementById('edit_candidate_c_ad2').value;
    var city = document.getElementById('edit_candidate_city').value;
    var state = document.getElementById('edit_candidate_c_state').value;
    var permanentCity = document.getElementById('edit_candidate_p_city').value;
    var permanentState = document.getElementById('edit_candidate_p_state').value;
    var pincode = document.getElementById('edit_candidate_pin').value;
    var permanentPincode = document.getElementById('edit_candidate_p_pin').value;
    var mobile1 = document.getElementById('edit_candidate_c_mobi1').value;
    var mobile2 = document.getElementById('edit_candidate_c_mobi2').value;
    var landline1 = document.getElementById('edit_candidate_c_tel1').value;
    var landline2 = document.getElementById('edit_candidate_c_tel2').value;
    var email1 = document.getElementById('edit_candidate_email1').value;
    var email2 = document.getElementById('edit_candidate_email2').value;

    // Construct the URL with the values
    var url = `edit-candidate-2.html?memId=${id}&fname=${fname}&lname=${lname}&rank=${rank}&avbDate=${avbDate}&nationality=${nationality}&maritalStatus=${maritalStatus}&dob=${dob}&birthPlace=${birthPlace}&workNautilus=${workNautilus}&vesselType=${vesselType}&experience=${experience}&zone=${zone}&grade=${grade}&boilerSuitSize=${boilerSuitSize}&safetyShoeSize=${safetyShoeSize}&height=${height}&weight=${weight}&licenseCountry=${licenseCountry}&indosNumber=${indosNumber}&candidateStatus=${candidateStatus}&group=${group}&vendor=${vendor}&photo=${photo}&resume=${resume}&address1=${address1}&address2=${address2}&city=${city}&state=${state}&permanentCity=${permanentCity}&permanentState=${permanentState}&pincode=${pincode}&permanentPincode=${permanentPincode}&mobile1=${mobile1}&mobile2=${mobile2}&landline1=${landline1}&landline2=${landline2}&email1=${email1}&email2=${email2}`;

    // Redirect to the edit-candidate-2.html page
    window.location.href = url;
}

// Add an event listener to the form submission
document.getElementById('view-candidate-form').addEventListener('submit', function(event) {
    event.preventDefault();
    editCandidate();
});







function editDocument(documentId, documents, documentNumber, issueDate, issuePlace, documentFiles, stcw) {
    // Redirect to the edit-c-document.html page with parameters
    const memId = localStorage.getItem('memId');
    window.location.href = `./edit-c-document.html?memId=${memId}&documentId=${documentId}&documents=${documents}&documentNumber=${documentNumber}&issueDate=${issueDate}&issuePlace=${issuePlace}&documentFiles=${documentFiles}&stcw=${stcw}`;
}


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



async function fetchAndDisplayContractDetails(candidateId) {
    try {
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-contract-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });


        const contractDetails = response.data;

        // Assuming contractDetails is an array of objects
        const contractTableBody = document.getElementById('contractTableBody');
        contractTableBody.innerHTML = ''; // Clear existing rows

        contractDetails.forEach(contract => {
            const row = document.createElement('tr');

            // Add data to each cell
            row.innerHTML = `
                <td>${contract.rank}</td>
                <td>${contract.company}</td>
                <td>${contract.vslName}</td>
                <td>${contract.vesselType}</td>
                <td>${contract.sign_on_port}</td>
                <td>${formatDate(contract.sign_on)}</td>
                <td>${formatDate(contract.wage_start)}</td>
                <td>${formatDate(contract.eoc)}</td>
                <td>${contract.wages}</td>
                <td>${contract.currency}</td>
                <td>${contract.wages_types}</td>
                <td>${formatDate(contract.sign_off)}</td>
                <td>${contract.sign_off_port}</td>
                <td>${contract.reason_for_sign_off}</td>
                <td>${contract.aoa_number}</td>
                <td>${contract.emigrate_number}</td>
                <td>${contract.documents}</td>
                <td>${contract.aoa}</td>
                <td>
                <button class="btn border-0 m-0 p-0" onclick="editContract('${contract.id}','${contract.rank}','${contract.company}','${contract.vslName}','${contract.vesselType}','${contract.sign_on_port}','${contract.sign_on}','${contract.wage_start}','${contract.eoc}','${contract.wages}','${contract.currency}','${contract.wages_types}','${contract.sign_off}','${contract.sign_off_port}','${contract.reason_for_sign_off}','${contract.aoa_number}','${contract.emigrate_number}','${contract.documents}','${contract.aoa}',event)">
                    <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                </button>
                <button class="btn border-0 m-0 p-0" onclick="deleteContract('${contract.id}',event)">
                    <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                </button>
            </td>
            
            `;

            // Append the row to the table body
            contractTableBody.appendChild(row);

        });
        
    } catch (err) {
        console.error(err);
    }
}

function editContract (id,rank,company,vslName,vesselType,sign_on_port,sign_on,wage_start,eoc,wages,currency,wages_types,sign_off,sign_off_port,reason_for_sign_off,aoa_number,emigrate_number,documents,aoa,event){
    event.preventDefault();
    console.log(id,rank,company,vslName,vesselType,sign_on_port,sign_on,wage_start,eoc,wages,currency,wages_types,sign_off,sign_off_port,reason_for_sign_off,aoa_number,emigrate_number,documents,aoa)
        window.location.href = `edit-c-contract.html?id=${id}&rank=${rank}&company=${company}&vslName=${vslName}&vesselType=${vesselType}&sign_on_port=${sign_on_port}&sign_on=${sign_on}&wage_start=${wage_start}&eoc=${eoc}&wages=${wages}&currency=${currency}&wages_types=${wages_types}&sign_off=${sign_off}&sign_off_port=${sign_off_port}&reason_for_sign_off=${reason_for_sign_off}&aoa_number=${aoa_number}&emigrate_number=${emigrate_number}&documents=${documents}&aoa=${aoa}`; // Include all parameters
      

}
function deleteContract(id) {
    console.log('deleted',id)
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
  

async function fetchAndDisplaySeaService(candidateId) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/get-sea-service/${candidateId}`, {
            headers: { "Authorization": token }
        });

        const seaServices = response.data;

        // Check if seaServices is an array
        if (Array.isArray(seaServices)) {
            const seaServiceList = document.getElementById('seaServiceList');
            seaServiceList.innerHTML = ''; // Clear existing data

            seaServices.forEach(seaService => {
                const seaServiceRow = document.createElement('tr');
                seaServiceRow.innerHTML = `
                    <td>${seaService.company}</td>
                    <td>${seaService.rank}</td>
                    <td>${seaService.vessel}</td>
                    <td>${seaService.type}</td>
                    <td>${seaService.DWT}</td>
                    <td>${seaService.from1}</td>
                    <td>${seaService.to1}</td>
                    <td>${seaService.total_MMDD}</td>
                    <td>${seaService.reason_for_sign_off}</td>
                    <td>
                      
                        <button class="btn border-0 m-0 p-0" onclick="editSeaService('${seaService.id}')">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteSeaService('${seaService.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                    </td>
                `;
                seaServiceList.appendChild(seaServiceRow);
            });
        } else {
            console.error('Sea service data is not in the expected format:', seaServices);
        }
    } catch (error) {
        console.error('Error fetching and displaying sea service records:', error);
    }
}


async function deleteSeaService(id) {
    if (confirm('Are you sure you want to delete this sea service record?')) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://nemo.ivistaz.co/candidate/delete-sea-service/${id}`, { headers: { "Authorization": token } });
            // Remove the corresponding row from the table
            const seaServiceRow = document.getElementById(`seaServiceRow-${id}`);
            seaServiceRow.remove();
        } catch (error) {
            console.error('Error deleting sea service record:', error);
        }
    }
}

function editSeaService(id) {
    // Redirect to seaservice.html with the ID parameter
    window.location.href = `seaserviceedit.html?memId=${id}`;
}

async function fetchAndDisplayDiscussions(candidateId) {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get(`https://nemo.ivistaz.co/candidate/get-discussionplus-details/${candidateId}`, { headers: { "Authorization": token } });
        let discussions = serverResponse.data.discussions;

        // Sort discussions by created_date in descending order
        discussions.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

        // Assuming you have an element in your HTML to display discussions
        const discussionsContainer = document.getElementById('fetchedcomments');
        discussionsContainer.innerHTML = ''; // Clear previous discussions

        for (const discussion of discussions) {
            const discussionElement = document.createElement('div');
            discussionElement.classList.add('discussion'); // Add CSS class for styling
            
            // Fetch username based on user ID (post_by value)
            const usernameResponse = await axios.get(`https://nemo.ivistaz.co/user/get-user/${discussion.post_by}`, { headers: { "Authorization": token } });
            const username = usernameResponse.data.user.userName;

            // Format the created date
            const createdDate = new Date(discussion.created_date);
            const formattedDate = `${createdDate.getDate()}/${createdDate.getMonth() + 1}/${createdDate.getFullYear()}`;

            // Display username, discussion content, and created date with proper styling
            discussionElement.innerHTML = `
                <div class="discussion-content">
                    <strong class='text-primary'>${username}</strong>: ${discussion.discussion}
                </div>
                <div class="created-date text-success badge ">
                    ${formattedDate}
                </div>
            `;
            discussionsContainer.appendChild(discussionElement);
        }
    } catch (error) {
        console.error('Error fetching discussions:', error);
    }
}


// Call the function to update the photo




// document.getElementById('discussionPlusForm').addEventListener('submit', async function (event) {
//     event.preventDefault();

//     // Fetch basic comments value
//     let basicCommentsValue = document.getElementById('basic_comments').value;

//     // Get the selected status
//     let status;
//     if (document.getElementById('proposed').checked) {
//         status = 'Proposed';
//     } else if (document.getElementById('joined').checked) {
//         status = 'Joined';
//     } else if (document.getElementById('approved').checked) {
//         status = 'Approved';
//     } else if (document.getElementById('rejected').checked) {
//         status = 'Rejected';
//     }

//     // Get company name input value
//     const companyName = document.getElementById('company_name').value;

//     const companyDropdown = document.getElementById('company_name');
//     const company_dropdown_text = companyDropdown.options[companyDropdown.selectedIndex].text;

//     // Get status date input value
//     // Get status date input value
//     const statusDate = document.getElementById('status_date').value;
//     const r_date = document.getElementById('reminder_date').value;

//     // Get reason input value
//     const reason = document.getElementById('reason').value;

//     // Check if special comment checkbox is checked
//     if (document.getElementById('special_comments_checkbox').checked) {
//         basicCommentsValue = document.getElementById('basic_comments').value;

//         // Update basic comments value in candidate table
//         try {
//             await axios.put(`https://nemo.ivistaz.co/candidate/update-candidates/${currentCandidateId}`, { basicCommentsValue }, {
//                 headers: {
//                     'Authorization': token,
//                     'Content-Type': 'application/json',
//                 },
//             });
//         } catch (error) {
//             console.error('Error updating basic comments value:', error);
//         }
//     }

//     // Get reference check text value
//     let referenceCheckText = null;
//     if (document.getElementById('reference_check_checkbox').checked) {
//         referenceCheckText = document.getElementById('reference_check_text').value;
        
//         // Update reference check text value in candidate table
//         try {
//             await axios.put(`https://nemo.ivistaz.co/candidate/update-candidates/${currentCandidateId}`, { referenceCheckText }, {
//                 headers: {
//                     'Authorization': token,
//                     'Content-Type': 'application/json',
//                 },
//             });
//         } catch (error) {
//             console.error('Error updating reference check text value:', error);
//         }
//     }

//     // Update comments section
//     const commentsSection = document.getElementById('comments-section');
//     if (status === 'Rejected') {
//         commentsSection.textContent = `${status}: ${basicCommentsValue} Reason: ${reason} Date: ${statusDate} Company Name: ${company_dropdown_text}`;
//     } else if (status) {
//         commentsSection.textContent = `${status}: ${basicCommentsValue} Date: ${statusDate} Company Name: ${company_dropdown_text}`;
//     } else {
//         commentsSection.textContent = `${basicCommentsValue}`;
//     }

    
//     // Create discussion plus data object
//     const discussionPlusData = {
//         post_by: localStorage.getItem('userId'),
//         discussion: commentsSection.textContent,
//         r_date: r_date || null,
//         reminder: document.getElementById('set_reminder_checkbox').checked,
//         companyname: companyName,
//         reason: reason,
//         join_date: null,
//         created_date: new Date(),
//     };

//     // If Special Comment checkbox is checked, include special comment data
//     if (document.getElementById('special_comments_checkbox').checked) {
//         discussionPlusData.special_comment = basicCommentsValue;
//         discussionPlusData.basic_comments = null; // Reset basic comments if special comments are stored
//     }

//     // If Reference Check checkbox is checked, include reference check data
//     if (document.getElementById('reference_check_checkbox').checked) {
//         discussionPlusData.reference_check = true;
//         discussionPlusData.reference_check_text = referenceCheckText;
//     }

//     try {
//         const response = await axios.post(`https://nemo.ivistaz.co/candidate/discussion-plus-detail/${currentCandidateId}`, discussionPlusData, {
//             headers: {
//                 'Authorization': token,
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log(response.data);
//         event.target.reset();
//     } catch (error) {
//         console.error(error);
//     }
// });





  
  // Call the async function to fetch and display discussions
// Fetch and display evaluation data for the candidate
async function fetchAndDisplayEvaluationData() {
    try {
        // Fetch evaluation data from the server
        const id = localStorage.getItem('memId');
        const response = await axios.get(`https://nemo.ivistaz.co/candidate/evaluation-data/${id}`);

        // Extract evaluation data from the response
        const evaluationData = response.data; // Access data property

        // Display evaluation data in a table
        displayEvaluationData(evaluationData);
    } catch (error) {
        console.error('Error fetching evaluation data:', error.message);
        // Optionally, you can display an error message to the user
    }
}

// Function to display evaluation data in a table
function displayEvaluationData(evaluationData) {
    const tableBody = document.getElementById('evaluationTableBody');

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Iterate over evaluation data and create table rows
    evaluationData.forEach(evaluation => {
        const row = tableBody.insertRow();

        // Insert cells into the row
        const evalTypeCell = row.insertCell();
        evalTypeCell.textContent = evaluation.eval_type;

        const interviewerNameCell = row.insertCell();
        interviewerNameCell.textContent = evaluation.interviewer_name;

        const appliedRankCell = row.insertCell();
        appliedRankCell.textContent = evaluation.applied_rank;

        const appliedDateCell = row.insertCell();
        appliedDateCell.textContent = evaluation.applied_date;

        const timeCell = row.insertCell();
        timeCell.textContent = evaluation.time;

        const remoteCell = row.insertCell();
        remoteCell.textContent = evaluation.remote;

        const appliedByCell = row.insertCell();
        appliedByCell.textContent = evaluation.applied_by;

    });
}


// Call the function to fetch and display evaluation data
fetchAndDisplayEvaluationData();
