document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    await displayDropdown();
    await displayUserDropdown();
    const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('memId');

    let dropdownItems = document.querySelectorAll(".dropdown-item");

    dropdownItems.forEach(function (item) {
        item.addEventListener("click", function () {
            var itemId = item.id;
            const urlParams = new URLSearchParams(window.location.search);
            const memId = urlParams.get('memId');
            var destinationPage = "";
            switch (itemId) {
                case "personal":
                    destinationPage = `./edit-candidate-2.html?memId=${memId}`;
                    break;
                case "discussion":
                    destinationPage = `./edit-discussion.html?memId=${memId}`;
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
                    destinationPage = `./seaservicetable.html?memId=${memId};`;
                    break;
                case 'evaluation':
                    destinationPage = `./add-c-evaluation.html?memId=${memId};`;
                    break;
                default:
                    break;
            }
            if (destinationPage !== "") {
                window.location.href = destinationPage;
            }
        });
    });


    function displayDropdown() {
        return axios.get(`${config.APIURL}others/get-ranks`, { headers: { "Authorization": token } })
            .then(response => {
                const rankDropdown = document.getElementById('appliedRank');
                rankDropdown.innerHTML = ''; // Clear existing options

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = '-- Select Rank --';
                rankDropdown.appendChild(defaultOption);

                const rankOptions = response.data.ranks;
                const rankNames = rankOptions.map(rank => rank.rank);

                for (let i = 0; i < rankNames.length; i++) {
                    const option = document.createElement('option');
                    option.value = rankNames[i];
                    option.text = rankNames[i];
                    rankDropdown.appendChild(option);
                }
            })
            .catch(error => console.error('Error fetching ranks:', error));
    }

    function displayUserDropdown() {
        return axios.get(`${config.APIURL}user/userdropdown`)
            .then(response => {
                const userDropdown = document.getElementById('interviewer_name');
                userDropdown.innerHTML = ''; // Clear existing options

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.text = '-- Select User --';
                userDropdown.appendChild(defaultOption);

                const users = response.data;

                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.userEmail; // Assuming 'id' is the correct attribute for user ID
                    option.text = `${user.userName}`; // Assuming 'userName' is the correct attribute for user name
                    userDropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    const evaluationForm = document.getElementById('evaluationForm');

    evaluationForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('memId');
        const evalType = document.getElementById('evalType').value;
        const appliedRank = document.getElementById('appliedRank').value;
        const appliedDate = document.getElementById('appliedDate').value;
        const time = document.getElementById('time').value;
        const remoteLink = document.getElementById('remoteLink').value;
        const interviewerName = document.getElementById('interviewer_name').value;
        const appliedBy = decodedToken.userName;
    
        const evaluationData = {
           
        };
    
        try {
            const response = await axios.post(`${config.APIURL}candidate/sendmail/${id}`, { eval_type: evalType,
            applied_rank: appliedRank,
            applied_date: appliedDate,
            time: time,
            remote: remoteLink,
            interviewer_name: interviewerName,
            applied_by: appliedBy,
            values: null, // or any other value you want to set
                headers: { 'Authorization': token }
            });
            Swal.fire({
                title: "Success",
                text: "Evaluation data created and email sent successfully ",
                icon: "success"
              });
            console.log('Evaluation dataset created and email sent successfully:', response.data);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.message,
              });
            console.error('Error creating evaluation dataset or sending email:', error.message);
        }
    });
    
    document.getElementById('evalType').addEventListener('change', function () {
       // console.log("Evaluation type changed");
        const evalType = document.getElementById('evalType');

        const selectedType = this.value;
        const remoteLinkInput = document.getElementById('remoteLink');
        const urlParams = new URLSearchParams(window.location.search);
        const candidateId = urlParams.get('memId');
        const appliedDate = document.getElementById('appliedDate').value;
        const appliedRank = document.getElementById('appliedRank').value;
        const interviewerName = document.getElementById('interviewer_name').value;
        const time = document.getElementById('time').value;
        let baseUrl = `${config.APIURL}views/public/html/`;
        let formUrl = '';
    
        const engineOfficers = [
            'CHIEF ENGINEER', 
            '2ND ENGINEER', 
            '3RD ENGINEER', 
            '4TH ENGINEER', 
            'JUNIOR ENGINEER',
            'ADDL. CHIEF ENGINEER',
            'ELECTRICAL OFFICER',
            'TRAINEE E/O',
            'NCV CHIEF ENGINEER',
            'NCV 2ND ENGINEER',
            'NCV 3RD ENGINEER',
            'NCV 4TH ENGINEER',
            'PANAMA CENG',
            'PANAMA 2ND ENGINEER',
            'PANAMA 3ENG',
            'PANAMA 4ENG',
            'GAS ENGINEER',
            'SUPERNUMERY',
            'TME',
            '2ND ASST ENGINEER',
            'ELECTRO TECHNICAL OFFICER',
            'PORT ENGINEER',
            'RIG ASSISTANT ELECTRICIAN',
            'RIG ELECTRICIAN',
        ];

        const deckOfficers = [
            'MASTER', 
            'CHIEF OFFICER', 
            '2ND OFFICER', 
            '3RD OFFICER', 
            'JUNIOR OFFICER','DECK CADET',
            'TUG MASTER',
            'NCV MASTER',
            'NCV CHIEF OFFICER',
            'NCV NWKO',
            'PANAMA MASTER',
            'PANAMA CHIEF OFFICER',
            'PANAMA 2ND OFFICER',
            'PANAMA 3RD OFFICER',
            'DREDGER OPERATOR',
            'RADIO OFFICER',
            'DPO',
            'PIPE OPERATOR',
            'TUBE OPERATOR',
            'MEDICAL OFFICER',
            'DREDGE MASTER',
            'SAFETY OFFICER',
            'RIG RADIO OPERATOR',
        ];


    const deckRatings =[
        'BOSUN', 'RPTM CLEANER', 'FITTER-DECK', 'AB', 'STORE KEEPER', 'OS', 'TR OS', 'WELDER', 'CRANE OPERATOR', 'IV LASKER', 'IV SERANG', 'IV MASTER', 'IV FITTER', 'IV DECK HAND', 'RIGGER', 'NAVIGATION HANDLER', 'RIG HEAVY LIFT CRANE OPERATOR', 'RIG BALLAST CRANE OPERATOR', 'RIG ASSISTANT BALLAST CRANE OPERATOR', 'RIG ASSISTANT DRILLER', 'RIG FLOORMAN', 'RIG WELDER', 'RIG DECK PUSHER', 'RIG CRANE OPERATOR', 'RIG ASSISTANT CRANE OPERATOR', 'RIG LEAD ROUSTABOUT', 'RIG ROUSTABOUT', 'RIG LEAD PAINTER / AB', 'RIG PAINTER / AB', 'TRAINEE OS'
    ]

    const engineRatings = [
        'PUMPMAN', 'REPAIR TEAM FITTER', 'WIPER', 'FITTER-ENGINE', 'TR WIPER', 'MTM/OILER', 'IV ENGINEER', 'IV OILER', 'IV 2ND DRIVER', 'FITTER', 'HYDRAULIC TECHNICIAN', 'ENGINE MECHANIC', 'TECHNICIAN', 'MECHANIC', 'RIG SENIOR PUMPMAN', 'RIG PUMPMAN', 'RIG DERRICK MAN', 'RIG MECHANIC', 'RIG MOTORMAN'
    ]

    const galleyRanks = [
        'CHIEF COOK', 'SECOND COOK', 'TR. GS', 'IV BOSUN', 'COOK', 'MSM/GS'
    ]

  



   // Ensure `selectedType` and `appliedRank` are defined and initialized

// Check if the selected type matches any of the conditions
// Ensure `selectedType` and `appliedRank` are defined and initialized
evalType.value = ''; // or any default value you prefer

// Check for galleyRanks condition first if it needs to be prioritized




if (selectedType === '5' || galleyRanks.includes(appliedRank)) {
    console.log(appliedRank)
    evalType.value = '5';
    formUrl = 'Evaluation-GalleyOfficer.html';
} else if (selectedType === '4' || engineRatings.includes(appliedRank)) {
    evalType.value = '4';
    formUrl = 'Evaluation-EngineRatings.html';
} else if (selectedType === '3' || deckRatings.includes(appliedRank)) {
    evalType.value = '3';
    formUrl = 'Evaluation-EngineOfficer.html';
} else if (selectedType === '2' || deckOfficers.includes(appliedRank)) {
    evalType.value = '2';
    formUrl = 'Evaluation-OfficersDeck.html';
} else if (selectedType === '1' || engineOfficers.includes(appliedRank)) {
    evalType.value = '1';
    formUrl = 'Evaluation-OfficersEngine.html';
} else {
    // Handle the case where none of the conditions are met
    console.log('No matching condition');
}

// Further code to handle the formUrl and evalType.value


// Further code to handle the formUrl and evalType.value

         
    
        if (formUrl) {
            const encodedAppliedRank = encodeURIComponent(appliedRank);
            remoteLinkInput.value = `${baseUrl}${formUrl}?candidateId=${candidateId}&appliedDate=${appliedDate}&appliedRank=${encodedAppliedRank}&interviewerName=${encodeURIComponent(interviewerName)}&time=${encodeURIComponent(time)}`;
        } else {
            remoteLinkInput.value = ''; // Clear the input if no valid form URL
        }
    
        // Trigger the change event manually if needed
        const event = new Event('change');
        evalType.dispatchEvent(event);
    });
    
    // Set up an initial event listener to handle changes and updates
    document.getElementById('appliedRank').addEventListener('input', function () {
        const evalType = document.getElementById('evalType');
        const appliedRank = this.value;
        console.log(appliedRank)
        //console.log(evalType)
        const engineOfficers = [
            'CHIEF ENGINEER', 
            '2ND ENGINEER', 
            '3RD ENGINEER', 
            '4TH ENGINEER', 
            'JUNIOR ENGINEER',
            'ADDL. CHIEF ENGINEER',
            'ELECTRICAL OFFICER',
            'TRAINEE E/O',
            'NCV CHIEF ENGINEER',
            'NCV 2ND ENGINEER',
            'NCV 3RD ENGINEER',
            'NCV 4TH ENGINEER',
            'PANAMA CENG',
            'PANAMA 2ND ENGINEER',
            'PANAMA 3ENG',
            'PANAMA 4ENG',
            'GAS ENGINEER',
            'SUPERNUMERY',
            'TME',
            '2ND ASST ENGINEER',
            'ELECTRO TECHNICAL OFFICER',
            'PORT ENGINEER',
            'RIG ASSISTANT ELECTRICIAN',
            'RIG ELECTRICIAN',


        ];

        const deckOfficers = [
            'MASTER', 
            'CHIEF OFFICER', 
            '2ND OFFICER', 
            '3RD OFFICER', 
            'JUNIOR OFFICER','DECK CADET',
            'TUG MASTER',
            'NCV MASTER',
            'NCV CHIEF OFFICER',
            'NCV NWKO',
            'PANAMA MASTER',
            'PANAMA CHIEF OFFICER',
            'PANAMA 2ND OFFICER',
            'PANAMA 3RD OFFICER',
            'DREDGER OPERATOR',
            'RADIO OFFICER',
            'DPO',
            'PIPE OPERATOR',
            'TUBE OPERATOR',
            'MEDICAL OFFICER',
            'DREDGE MASTER',
            'SAFETY OFFICER',
            'RIG RADIO OPERATOR',
        ];


    const deckRatings =[
        'BOSUN', 'RPTM CLEANER', 'FITTER-DECK', 'AB', 'STORE KEEPER', 'OS', 'TR OS', 'WELDER', 'CRANE OPERATOR', 'IV LASKER', 'IV SERANG', 'IV MASTER', 'IV FITTER', 'IV DECK HAND', 'RIGGER', 'NAVIGATION HANDLER', 'RIG HEAVY LIFT CRANE OPERATOR', 'RIG BALLAST CRANE OPERATOR', 'RIG ASSISTANT BALLAST CRANE OPERATOR', 'RIG ASSISTANT DRILLER', 'RIG FLOORMAN', 'RIG WELDER', 'RIG DECK PUSHER', 'RIG CRANE OPERATOR', 'RIG ASSISTANT CRANE OPERATOR', 'RIG LEAD ROUSTABOUT', 'RIG ROUSTABOUT', 'RIG LEAD PAINTER / AB', 'RIG PAINTER / AB', 'TRAINEE OS'
    ]

    const galleyRanks = [
        'CHIEF COOK', 'SECOND COOK', 'TR. GS', 'IV BOSUN', 'COOK', 'MSM/GS'
    ]

    const engineRatings = [
        'PUMPMAN', 'REPAIR TEAM FITTER', 'WIPER', 'FITTER-ENGINE', 'TR WIPER', 'MTM/OILER', 'IV ENGINEER', 'IV OILER', 'IV 2ND DRIVER', 'FITTER', 'HYDRAULIC TECHNICIAN', 'ENGINE MECHANIC', 'TECHNICIAN', 'MECHANIC', 'RIG SENIOR PUMPMAN', 'RIG PUMPMAN', 'RIG DERRICK MAN', 'RIG MECHANIC', 'RIG MOTORMAN'
    ]






        if (engineOfficers.includes(appliedRank)) {
            evalType.value = '1';
        } 
        else if (deckOfficers.includes(appliedRank))
        {
            evalType.value='2'
        }
        else if (deckRatings.includes(appliedRank))
        {
            evalType.value='3'
        }
        else if (galleyRanks.includes(appliedRank))
        {
            evalType.value='5'
        }
        else if (engineRatings.includes(appliedRank))
        {
            evalType.value='4'
        }
        else {
            evalType.value = ''; // Or set to another value if needed
        }
        
        // Trigger the change event manually
        const event = new Event('change');
        evalType.dispatchEvent(event);
    });
    
    


});

function goBack() {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('memId');
    if (candidateId) {
        const url = `./view-candidate.html?id=${candidateId}`;
        window.location.href = url;
    } else {
        console.error('Candidate ID not found in URL parameters');
    }
}