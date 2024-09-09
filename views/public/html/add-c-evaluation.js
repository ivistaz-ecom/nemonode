document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    console.log(decodedToken);
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

    document.getElementById("logout").addEventListener("click", function () {
        var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
        myModal.show();
        localStorage.clear();

        setTimeout(function () {
            document.getElementById("logoutMessage").textContent = "Shutting down all sessions...";
        }, 1000);

        setTimeout(function () {
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

    updateDateTime();
    setInterval(updateDateTime, 1000);

    function displayDropdown() {
        return axios.get("https://nsnemo.com/others/get-ranks", { headers: { "Authorization": token } })
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
        return axios.get("https://nsnemo.com/user/userdropdown")
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
        const decodedToken = decodeToken(token);
        const appliedBy = decodedToken.userName;
    
        const evaluationData = {
           
        };
    
        try {
            const response = await axios.post(`https://nsnemo.com/candidate/sendmail/${id}`, { eval_type: evalType,
            applied_rank: appliedRank,
            applied_date: appliedDate,
            time: time,
            remote: remoteLink,
            interviewer_name: interviewerName,
            applied_by: appliedBy,
            values: null, // or any other value you want to set
                headers: { 'Authorization': token }
            });
            console.log('Evaluation dataset created and email sent successfully:', response.data);
        } catch (error) {
            console.error('Error creating evaluation dataset or sending email:', error.message);
        }
    });
    
    document.getElementById('evalType').addEventListener('change', function () {
        console.log("Evaluation type changed");
        const evalType = document.getElementById('evalType');
        const selectedType = this.value;
        const remoteLinkInput = document.getElementById('remoteLink');
        const urlParams = new URLSearchParams(window.location.search);
        const candidateId = urlParams.get('memId');
        const appliedDate = document.getElementById('appliedDate').value;
        const appliedRank = document.getElementById('appliedRank').value;
        const interviewerName = document.getElementById('interviewer_name').value;
        const time = document.getElementById('time').value;
        let baseUrl = 'https://nsnemo.com/views/public/html/';
        let formUrl = '';
    
        const engineerRanks = [
            'CHIEF ENGINEER', 
            '2ND ENGINEER', 
            '3RD ENGINEER', 
            '4TH ENGINEER', 
            'JUNIOR ENGINEER'
        ];

        const engineerRanks2 = [
            'MASTER', 
            'CHIEF OFFICER', 
            '2ND OFFICER', 
            '3RD OFFICER', 
            'JUNIOR OFFICER'
        ];
    
    
        if (selectedType === '1' || engineerRanks.includes(appliedRank)) {
            evalType.value = '1';
            formUrl = 'Evaluation-OfficersEngine.html';
        } else if (selectedType === '2' || engineerRanks2.includes(appliedRank)) {
            evalType.value = '2';

            formUrl = 'Evaluation-OfficersDeck.html';
        } else if (selectedType === '3') {
            
            formUrl = 'Evaluation-EngineOfficer.html';
        } else {
            formUrl = ''; // Clear the input if another option is selected
        }
    
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
        const engineerRanks = [
            'CHIEF ENGINEER', 
            '2ND ENGINEER', 
            '3RD ENGINEER', 
            '4TH ENGINEER', 
            'JUNIOR ENGINEER'
        ];

        const engineerRanks2 = [
            'MASTER', 
            'CHIEF OFFICER', 
            '2ND OFFICER', 
            '3RD OFFICER', 
            'JUNIOR OFFICER'
        ];
    
        if (engineerRanks.includes(appliedRank)) {
            evalType.value = '1';
        } 
        else if (engineerRanks2.includes(appliedRank))
        {
            evalType.value='2'
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

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
