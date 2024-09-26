// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token is not present
if (!token) {
  // Redirect to the login page

  window.location.href = './vendorlogin.html';
}

function formatDateNew(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}


function formatDate(dateString) {
    // Assuming dateString is in the format "YYYY-MM-DD HH:mm:ss"
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }
function loadContent(section) {
    // Hide all content divs
    document.getElementById('personalContent').style.display = 'none';
    document.getElementById('discussionContent').style.display = 'none';
    document.getElementById('contractContent').style.display = 'none';
    document.getElementById('documentContent').style.display = 'none';
    document.getElementById('bankContent').style.display = 'none';
    document.getElementById('travelContent').style.display = 'none';
    document.getElementById('medicalContent').style.display = 'none';
    document.getElementById('nkdContent').style.display = 'none';
    document.getElementById('seaServiceContent').style.display = 'none';
    document.getElementById('evaluationContent').style.display = 'none';
    document.getElementById('filesContent').style.display = 'none';

    // Show the selected content div
    document.getElementById(`${section}Content`).style.display = 'block';
}

async function fetchAndDisplayDocumentDetails(candidateId) {
    try {
        const response = await axios.get(`http://localhost:8001/candidate/get-document-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const documentDetails = response.data;
        const documentTableBody = document.getElementById('documentTableBody');
        documentTableBody.innerHTML = ''; // Clear existing rows

        const searchInput = document.getElementById('documentSearchInput').value.toLowerCase(); // Get search input and convert to lowercase

        let index = 1;
        documentDetails.forEach(doc => {
            // Check if search input matches any document details
            if (
                doc.document.toLowerCase().includes(searchInput) ||
                doc.document_number.toLowerCase().includes(searchInput) ||
                doc.issue_date.toLowerCase().includes(searchInput) ||
                doc.issue_place.toLowerCase().includes(searchInput) ||
                doc.stcw.toLowerCase().includes(searchInput) ||
                doc.expiry_date.toLowerCase().includes(searchInput)
            ) {
                const row = document.createElement('tr');

                // Add data to each cell
                row.innerHTML = `
                    <td>${index++}</td>
                    <td>${doc.document}</td>
                    <td>${doc.document_number}</td>
                    <td>${formatDateNew(doc.issue_date)}</td>
                    <td>${doc.issue_place}</td>
                    <td>${doc.document_files}</td>

                    <td><a href='http://localhost:8001/views/public/files/${doc.document_files}' target="_blank">Click here to view!</a></td>
                    <td>${doc.stcw}</td>
                    <td>${formatDateNew(doc.expiry_date)}</td>
                   
                `;
                
                documentTableBody.appendChild(row);
            }
        });

    } catch (error) {
        console.error('Error fetching document details:', error);
    }
}

document.getElementById('documentSearchInput').addEventListener('input', function() {

    const urlParams = new URLSearchParams(window.location.search);
    
    // Get the candidateId from the URL parameter
    const candidateId = urlParams.get('id');
        fetchAndDisplayDocumentDetails(candidateId);
});



async function fetchAndDisplayBankDetails(candidateId) {
    try {
        const response = await axios.get(`http://localhost:8001/candidate/get-bank-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const bankDetails = response.data;

        const generalBankList = document.getElementById('general-bank-list');
        const nriBankList = document.getElementById('nri-bank-list');

        generalBankList.innerHTML = ''; // Clear existing general bank list
        nriBankList.innerHTML = ''; // Clear existing NRI bank list

        let generalCount = 0;
        let nriCount = 0;

        bankDetails.forEach((bank, index) => {
            const bankDetailsHTML = `
                <li class="list-group-item">
                    <h5>S.no: ${index + 1}</h5>
                    <p><strong>Bank Name:</strong> ${bank.bank_name}</p>
                    <p><strong>Account Number:</strong> ${bank.account_num}</p>
                    <p><strong>Bank Address:</strong> ${bank.bank_addr}</p>
                    <p><strong>IFSC Code:</strong> ${bank.ifsc_code}</p>
                    <p><strong>Swift Code:</strong> ${bank.swift_code}</p>
                    <p><strong>Beneficiary:</strong> ${bank.beneficiary}</p>
                    <p><strong>Beneficiary Address:</strong> ${bank.beneficiary_addr}</p>
                    <p><strong>PAN Number:</strong> ${bank.pan_num}</p>
                    <p><strong>Passbook:</strong> <a href='http://localhost:8001/views/public/bank_details/${bank.passbook}' target="_blank">View Document</a></p>
                    <p><strong>PAN Card:</strong> <a href='http://localhost:8001/views/public/bank_details/pan_card/${bank.pan_card}' target="_blank">View Document</a></p>
                    <p><strong>Branch:</strong> ${bank.branch}</p>
                    <p><strong>Type:</strong> ${bank.types}</p>
                    <p><strong>Created By:</strong> ${bank.created_by}</p>
                    
                </li>
            `;

            if (bank.types.toLowerCase() === 'nri') {
                nriBankList.innerHTML += bankDetailsHTML;
                nriCount++;
            } else if (bank.types.toLowerCase() === 'general') {
                generalBankList.innerHTML += bankDetailsHTML;
                generalCount++;
            }
        });

        if (generalCount > 1) {
            alert('Invalid bank details. Contact admin.');
        }
    } catch (error) {
        console.error('Error fetching bank details:', error);
    }
}





async function fetchAndDisplayTravelDetails(candidateId) {
    try {
        // Make an Axios request to your backend API to get travel details
        const response = await axios.get(`http://localhost:8001/candidate/get-travel-details/${candidateId}`, {
            headers: { "Authorization": token }
        });
        let index=1;
        // Clear existing table rows
        const travelTableBody = document.getElementById('travelTableBody');
        travelTableBody.innerHTML = '';

        // Iterate over the fetched data and append rows to the table
        response.data.forEach(travel => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index++}</td>
                <td>${formatDateNew(travel.travel_date)}</td>
                <td>${travel.travel_from}</td>
                <td>${travel.travel_to}</td>
                <td>${travel.travel_mode}</td>
                <td>${travel.travel_status}</td>
                <td>${travel.ticket_number}</td>
                <td>${travel.agent_name}</td>
                <td>${travel.portAgent}</td>
                <td>${travel.travel_amount}</td>
                
            
            `;
            travelTableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching travel details:', error);
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
        const response = await axios.get(`http://localhost:8001/candidate/get-hospital-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const hospitalResponse = await axios.get('http://localhost:8001/others/get-hospital', {
            headers: {
                'Authorization': token
            }
        });
       const hospitalsmed = hospitalResponse.data.hospital
        const hospitals = {}; // Map to store company details by ID
        hospitalsmed.forEach(hospital => {
            hospitals[hospital.id] = hospital.hospitalName; // Store company details by ID
        });

        let index=1;

        const medicalDetails = response.data;
        const medicalTableBody = document.getElementById('hospitalTableBody');
        medicalTableBody.innerHTML = ''; // Clear existing rows

        medicalDetails.forEach(medical => {
            const row = document.createElement('tr');

            const createCell = (value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                return cell;
            };
            const hospitalName = hospitals[medical.hospitalName];

            // Add data to each cell
            row.appendChild(createCell(index++));

            row.appendChild(createCell(hospitalName));
            row.appendChild(createCell(medical.place));
            row.appendChild(createCell(formatDateNew(medical.date)));
            row.appendChild(createCell(formatDateNew(medical.expiry_date))); // Update to match the Sequelize model
            row.appendChild(createCell(medical.done_by));
            row.appendChild(createCell(medical.status));
            row.appendChild(createCell(medical.amount));
            row.appendChild(createCell(medical.upload));
            
            const linkCell = document.createElement('td');
            const link = document.createElement('a');
            link.href = `http://localhost:8001/views/public/uploads/medical/${medical.upload}`;
            link.textContent = 'Click here to view!';
            linkCell.appendChild(link);
            row.appendChild(linkCell);



           

            // Append the row to the table body
            medicalTableBody.appendChild(row);
        });
        
    } catch (err) {
        console.error(err);
    }
}








const fetchAndDisplayNkdData = async (candidateId) => {
    try {
        
        const response = await axios.get(`http://localhost:8001/candidate/get-nkd-details/${candidateId}`, { headers: { "Authorization": token } });

        // Assuming response.data contains an array of NKD objects
        const nkdData = response.data;
        let index=1;
        // Get the table body element
        const tableBody = document.getElementById('nkdTableBody');
        tableBody.innerHTML = ''; // Clear existing table content

        // Iterate through the NKD data and append rows to the table
        nkdData.forEach((nkd) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText=index++;
            row.insertCell(1).innerText = nkd.kin_name;
            row.insertCell(2).innerText = nkd.kin_relation;
            row.insertCell(3).innerText = nkd.kin_contact_number;
            row.insertCell(4).innerText = nkd.kin_contact_address;
          

            // Create a new cell for kin_priority with the specified class
            const priorityCell = row.insertCell(5);
            priorityCell.innerHTML = `<span class="badge ${getPriorityClass(nkd.kin_priority)}">${nkd.kin_priority}</span>`;

          

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
        function getObfuscatedIdFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }
    
        // Function to set the href of the button
        function updateButtonHref() {
            const obfuscatedId = getObfuscatedIdFromUrl();
            if (obfuscatedId) {
                const addContractButton = document.getElementById('addContractButton');
                const addDocumentButton = document.getElementById('addDocumentButton');
                
                if (addContractButton) {
                    addContractButton.href = `./vendor-add-contract.html?id=${encodeURIComponent(obfuscatedId)}`;
                }
                
                if (addDocumentButton) {
                    addDocumentButton.href = `./vendor-add-document.html?id=${encodeURIComponent(obfuscatedId)}`;
                }
            } else {
                console.error('Obfuscated ID not found in URL');
            }
        }
    
        // Call the function to update the button href
        updateButtonHref();
        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }

        function deobfuscateId(obfuscatedId) {
            // Decode Base64 and reverse the string to get the original ID
            const reversedId = atob(obfuscatedId);
            return reversedId.split('').reverse().join('');
        }

        // Get the obfuscated ID from the URL and deobfuscate it
        const obfuscatedId = getParameterByName('id');
        let result;
        if (obfuscatedId) {
            const decodedId = deobfuscateId(obfuscatedId);
            result = decodedId; // Store the original number
        }

        // Use result as the candidateId
        const candidateId = result;
                //  memId.textContent= candidateId
        await   fetchAndDisplayDiscussions(candidateId);
        await displayCandidateDetails();
        await fetchAndDisplayContractDetails(candidateId)
        await fetchAndDisplayDocumentDetails(candidateId)
        await fetchAndDisplayBankDetails(candidateId)
        await fetchAndDisplayTravelDetails(candidateId)
        await fetchAndDisplayMedicalDetails(candidateId)
        await fetchAndDisplayNkdData(candidateId);
        await fetchAndDisplaySeaService(candidateId);
        await fetchFilesByCandidateId(candidateId)
        updateCandidatePhoto(candidateId)
        fetchAndDisplayFiles(candidateId)
        const hasUserManagement = decodedToken.userManagement;
        const vendorManagement = decodedToken.vendorManagement;
        if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
            document.getElementById('userManagementSection').style.display = 'block';
            document.getElementById('userManagementSections').style.display = 'block';
        }
        if (vendorManagement) {
            document.getElementById('vendorManagementSection').style.display = 'block';
            document.getElementById('vendorManagementSections').style.display = 'block';
    
        }

        
        // You can call loadContent function here if needed
        // loadContent('personal'); // Example: Load personal information by default
        async function nationalityFetch(nationalityId) {
            try {
                const nationality = await axios.get("http://localhost:8001/others/country-codes");
                const countries = nationality.data.countryCodes;
                let id = nationalityId
                for (const country of countries) {
                    if (id == country.code) {
                      return country.country
                    }
                   
                }
        
                // If no match found
                
            } catch (error) {
                console.error("Error fetching nationality:", error);
                return null; // or throw error based on your preference
            }
        }
        


async function displayCandidateDetails() {
    try {
        // Fetch candidate data based on the candidate ID
    
        function getParameterByName(name, url = window.location.href) {
            name = name.replace(/[\[\]]/g, '\\$&');
            const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
    
        // Get the obfuscated ID from the URL
        const obfuscatedId = getParameterByName('id');
    
        // Deobfuscate the ID and store the original number in const result
        let result;
        if (obfuscatedId) {
            const decodedId = deobfuscateId(obfuscatedId);
            result = decodedId; // Store the original number
        }
    
        function deobfuscateId(obfuscatedId) {
            // Decode Base64 and reverse the string to get the original ID
            const reversedId = atob(obfuscatedId);
            return reversedId.split('').reverse().join('');
        }
    
    
        // Get the candidateId from the URL parameter
        const id = result
        const response = await axios.get(`http://localhost:8001/candidate/get-candidate/${id}`,{headers:{"Authorization":token}});
        const candidateData = response.data.candidate;
      
        // document.getElementById('creator').textContent = candidateData.createdby
        // document.getElementById('editor').textContent = candidateData.editedby
        document.getElementById('candidateId').value = candidateData.candidateId;
        document.getElementById('edit_candidate_c_rank').value = candidateData.c_rank;
        nationalityFetch(candidateData.nationality)
        .then(nationality => {
          document.getElementById('edit_candidate_nationality').value = nationality;
        })
        .catch(error => {
          console.error("Error setting nationality:", error);
          // Handle error
        });
              document.getElementById('edit_candidate_c_vessel').value = candidateData.c_vessel;
        document.getElementById('edit_candidate_experience').value = candidateData.experience;
        document.getElementById('edit_candidate_grade').value = candidateData.grade;
        // document.getElementById('edit_candidate_I_country').value = candidateData.l_country;
       
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
        document.getElementById('edit_candidate_p_mobi1').value=candidateData.p_mobi1
        nationalityFetch(candidateData.l_country)
        .then(nationality => {
          document.getElementById('edit_candidate_I_country').value = nationality;
        })
        .catch(error => {
          console.error("Error setting nationality:", error);
          // Handle error
        });
        document.getElementById('edit_candidate_indos_number').value = candidateData.indos_number;
        document.getElementById('edit_company_status').value = candidateData.m_status;
        document.getElementById('edit_candidate_group').value = candidateData.group;
        document.getElementById('edit_candidate_nemo_source').value = candidateData.nemo_source;
        document.getElementById('edit_candidate_active_details').value = candidateData.active_details === 1 ? 'Active' : 'Inactive';
        // Assuming you have the candidateData object available
const photoName = candidateData.photos;
const resumeName = candidateData.resume;

const prevPhotoButton = document.getElementById('prevPhoto');
const prevResButton = document.getElementById('prevRes');
if (photoName) {
    prevPhotoButton.value = photoName;
    prevPhotoButton.onclick = function() {
        window.open(`http://localhost:8001/views/public/files/photos/${photoName}`, '_blank');
    };
} else {
    prevPhotoButton.value = 'No photo available';
    prevPhotoButton.onclick = function() {
        alert('No photo available');
    };
}

if (resumeName) {
    prevResButton.value = resumeName;
    prevResButton.onclick = function() {
        window.open(`http://localhost:8001/views/public/files/resume/${resumeName}`, '_blank');
    };
} else {
    prevResButton.value = 'No resume available';
    prevResButton.onclick = function() {
        alert('No resume available');
    };
}


        document.getElementById('edit_candidate_c_ad1').value = candidateData.c_ad1;
        document.getElementById('edit_candidate_city').value = candidateData.c_city;
        document.getElementById('edit_candidate_c_state').value = candidateData.c_state;
        document.getElementById('edit_candidate_pin').value = candidateData.c_pin;
        document.getElementById('edit_candidate_c_mobi1').value = candidateData.c_mobi1;
        document.getElementById('edit_candidate_email1').value = candidateData.email1;
        document.getElementById('edit_candidate_c_tel1').value = candidateData.c_tel1;
        document.getElementById('edit_candidate_c_ad2').value = candidateData.c_ad2;
        document.getElementById('edit_candidate_city').value = candidateData.p_city;
        document.getElementById('edit_candidate_c_state').value = candidateData.p_state;
        document.getElementById('edit_candidate_pin').value = candidateData.p_pin;
        document.getElementById('edit_candidate_c_mobi2').value = candidateData.c_mobi2;
        document.getElementById('edit_candidate_c_tel2').value = candidateData.c_tel2;
        document.getElementById('edit_candidate_email2').value = candidateData.email2;
        document.getElementById('edit_candidate_us_visa').value = candidateData.us_visa;

       

        // Call the function to update the photo
        
        // Hidden fields
    } catch (error) {
        console.error('Error displaying candidate details:', error);
    }
}

    } catch (error) {
        console.error('Error fetching and displaying data:', error);
    }
   

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

async function fetchAndDisplayContractDetails(candidateId) {
    try {
        console.log("test:>>>>",candidateId) 
        const response = await axios.get(`http://localhost:8001/candidate/get-contract-details/${candidateId}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });

        const companyResponse = await axios.get('http://localhost:8001/company/dropdown-company', {
            headers: {
                'Authorization': token
            }
        });
        const companies = {};
        companyResponse.data.companies.forEach(company => {
            companies[company.company_id] = company.company_name;
        });

        const portsResponse = await axios.get('http://localhost:8001/others/get-ports', {
            headers: {
                'Authorization': token
            }
        });
        const ports = {};
        portsResponse.data.ports.forEach(port => {
            ports[port.id] = port.portName;
        });

        const vesselsResponse = await axios.get('http://localhost:8001/others/get-vsls', {
            headers: {
                'Authorization': token
            }
        });
        const vessels = {};
        vesselsResponse.data.vessels.forEach(vessel => {
            vessels[vessel.id] = vessel.vesselName;
        });

        const contractDetails = response.data;
        contractDetails.sort((a, b) => b.id - a.id);

        const contractTableBody = document.getElementById('contractTableBody');
        contractTableBody.innerHTML = '';
        let index = 1;
        contractDetails.forEach(contract => {
            const row = document.createElement('tr');

            const companyName = companies[contract.company];
            const signOffPortName = ports[contract.sign_off_port];
            const signOnPortName = ports[contract.sign_on_port];
            const vesselName = vessels[contract.vslName];

            // Calculate duration between sign_on and sign_off dates
            let badgeText = '';
            if (contract.sign_off === '1970-01-01') {
                // Calculate duration from sign_on to today's date
                const signOnDate = new Date(contract.sign_on);
                const today = new Date();
                const diffTime = Math.abs(today - signOnDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                badgeText = `${months} months and ${days} days`;
            } else {
                // Calculate duration between sign_on and sign_off
                const signOnDate = new Date(contract.sign_on);
                const signOffDate = new Date(contract.sign_off);
                const diffTime = Math.abs(signOffDate - signOnDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                badgeText = `${months} months and ${days} days`;
            }

            function calculateContractDuration(signOn, eoc) {
                if (!signOn || signOn === '1970-01-01' || !eoc || eoc === '1970-01-01') {
                    return 'Both sign_on and eoc must be updated for duration of contract to reflect';
                }

                const signOnDate = new Date(signOn);
                const endDate = new Date(eoc);
                const diffTime = Math.abs(endDate - signOnDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const months = Math.floor(diffDays / 30);
                const days = diffDays % 30;
                return `${months} months and ${days} days`;
            }

            const contractDuration = calculateContractDuration(contract.sign_on, contract.eoc);

            row.innerHTML = `
                <td>${index++}</td>
                <td>${contract.rank}</td>
                <td>${companyName}</td>
                <td>${vesselName}</td>
                <td>${contract.vesselType}</td>
                <td>${signOnPortName}</td>
                <td>${contract.sign_on}</td>
                <td>${contract.wage_start}</td>
                <td>${contract.eoc}</td>
                <td>${contract.wages}</td>
                <td>${contract.currency}</td>
                <td>${contract.wages_types}</td>
                <td>${contract.sign_off}</td>
                <td>${signOffPortName}</td>
                <td>${contract.reason_for_sign_off}</td>
                <td>${contract.aoa_number}</td>
                <td>${contract.emigrate_number}</td>
                <td>${contract.documents}</td>
                <td><a href='http://localhost:8001/views/public/uploads/contract/${contract.documents}' target="_blank">Click here to view Document!</a></td>
                <td>${contract.aoa}</td>
                <td><a href='http://localhost:8001/views/public/uploads/aoa/${contract.aoa}' target="_blank">Click here to view AOA!</a></td>
                <td>${contractDuration}</td>
                <td >${badgeText}</td>
               
            `;

            contractTableBody.appendChild(row);
        });
    } catch (err) {
        console.error(err);
    }
}






document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`http://localhost:8001/user/${userId}/logout`)
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
        let index=1;
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8001/candidate/get-sea-service/${candidateId}`, {
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
                <td>${index++}</td>
                    <td>${seaService.company}</td>
                    <td>${seaService.rank}</td>
                    <td>${seaService.vessel}</td>
                    <td>${seaService.type}</td>
                    <td>${seaService.DWT}</td>
                    <td>${formatDateNew(seaService.from1)}</td>
                    <td>${formatDateNew(seaService.to1)}</td>
                    <td>${seaService.total_MMDD}</td>
                    <td>${seaService.reason_for_sign_off}</td>
                    
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

async function fetchAndDisplayDiscussions(candidateId) {
    try {
        const token = localStorage.getItem('token');
        const serverResponse = await axios.get(`http://localhost:8001/candidate/get-discussionplus-details/${candidateId}`, { headers: { "Authorization": token } });
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
            const usernameResponse = await axios.get(`http://localhost:8001/user/get-user/${discussion.post_by}`, { headers: { "Authorization": token } });
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


// async function fetchAndDisplayEvaluationData() {
//     try {
//         // Fetch evaluation data from the server
//         const urlParams = new URLSearchParams(window.location.search);
    
//     // Get the candidateId from the URL parameter
//     const candidateId = urlParams.get('id');
    
//         const response = await axios.get(`http://localhost:8001/candidate/evaluation-data/${id}`);

//         // Extract evaluation data from the response
//         const evaluationData = response.data; // Access data property

//         // Display evaluation data in a table
//         displayEvaluationData(evaluationData);
//     } catch (error) {
//         console.error('Error fetching evaluation data:', error.message);
//         // Optionally, you can display an error message to the user
//     }
// }

// // Function to display evaluation data in a table
// function displayEvaluationData(evaluationData) {
//     const tableBody = document.getElementById('evaluationTableBody');
//     let index =1;
//     // Clear existing table rows
//     tableBody.innerHTML = '';

//     // Iterate over evaluation data and create table rows
//     evaluationData.forEach(evaluation => {
//         const row = tableBody.insertRow();

//         const indexrow = row.insertCell();
//         indexrow.textContent = index++;
//         // Insert cells into the row
//         const evalTypeCell = row.insertCell();
//         evalTypeCell.textContent = evaluation.eval_type;

//         const interviewerNameCell = row.insertCell();
//         interviewerNameCell.textContent = evaluation.interviewer_name;

//         const appliedRankCell = row.insertCell();
//         appliedRankCell.textContent = evaluation.applied_rank;

//         const appliedDateCell = row.insertCell();
//         appliedDateCell.textContent = evaluation.applied_date;

//         const timeCell = row.insertCell();
//         timeCell.textContent = evaluation.time;

//         const remoteCell = row.insertCell();
//         remoteCell.textContent = evaluation.remote;

//         const appliedByCell = row.insertCell();
//         appliedByCell.textContent = evaluation.applied_by;

//     });
// }


// // Call the function to fetch and display evaluation data
// fetchAndDisplayEvaluationData();


async function updateCandidatePhoto(id) {
    // Simulate fetching the photo value from a database or other source
    // Set the fetched photo value to the input field
    
    const response = await axios.get(`http://localhost:8001/candidate/get-candidate/${id}`,{headers:{"Authorization":token}});
    const fetchedPhotoValue = response.data.candidate.photos
    console.log(fetchedPhotoValue)
    // Fetch the photo value from the form
    const photoValue = fetchedPhotoValue

    // Extract the photo name from the photo value
    const photoName = photoValue.substring(photoValue.lastIndexOf('/') + 1);
    console.log(photoName)
    // Update the src attribute of the img tag
    const imageContainer = document.getElementById('imageContainer');
    const image = imageContainer.querySelector('img');
    image.src = "/photos/" + photoName;
    image.alt = "Description of the image"; // Add alt attribute if needed
    console.log(image.src); // Check the src attribute in the console
}

// Call the function to update the photo
async function fetchFilesByCandidateId(candidateId) {
    try {
        const response = await axios.get(`http://localhost:8001/fetch-files/${candidateId}`);
        const filePaths = response.data;

        // Display the filtered files
        const fileListContainer = document.getElementById('fileListContainer');
        fileListContainer.innerHTML = '';

        if (filePaths.length === 0) {
            console.log('No files found for candidate:', candidateId);
            return;
        }

        const fileList = document.createElement('ul');

        const baseURL = 'http://localhost:8001/views/public/files/evaluation'; // Adjust base URL

        filePaths.forEach(filePath => {
            const listItem = document.createElement('li');
            const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
            const adjustedURL = `${baseURL}/${fileName}`; // Concatenate base URL with file path
            const fileLink = document.createElement('a');
            fileLink.href = adjustedURL;
            fileLink.textContent = fileName; // Display only the filename
            fileLink.target = "_blank"; // Open the link in a new tab
            listItem.appendChild(fileLink);
            fileList.appendChild(listItem);
        });
        

        fileListContainer.appendChild(fileList);
    } catch (error) {
        console.error('Error fetching files:', error.message);
    }
}


function uploadFile(file, uploadUrl) {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        if (response.status === 200) {
            alert('Resume uploaded succesfully')
            return response.data; // You can return any data from the response if needed
        } else {
            console.error('Error uploading file:', response.statusText);
            throw new Error('Upload failed');
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error.message);
        throw error;
    });
}

// Get elements

async function fetchAndDisplayFiles(candidateId) {
    try {
        
      // Fetch photos
      const photosResponse = await axios.get(`/fetch-files1/${candidateId}`);
      const photos = photosResponse.data;
      const photosContainer = document.getElementById('photosPresent');
      photosContainer.innerHTML = ''; // Clear previous content
      photos.forEach(photo => {
        const imgElement = document.createElement('img');
        imgElement.src = photo;
        imgElement.alt = 'Candidate Photo';
        photosContainer.appendChild(imgElement);
      });

      // Fetch resumes
      const resumesResponse = await axios.get(`/fetch-files2/${candidateId}`);
      const resumes = resumesResponse.data;
      const resumesContainer = document.getElementById('resumesPresent');
      resumesContainer.innerHTML = ''; // Clear previous content
      resumes.forEach(resume => {
        const linkElement = document.createElement('a');
        linkElement.href = resume;
        linkElement.textContent = 'View Resume';
       
        resumesContainer.appendChild(linkElement);
      });

     

    } catch (error) {
      console.error('Error fetching files:', error);
    }
  }
  
