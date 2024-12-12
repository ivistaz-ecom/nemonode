window.onload = async function () {

    try {
        await displayCandidates();
    } catch (err) {
        console.log('No entries present');
        console.log(err);
    }
};

async function fetchData(url) {
    try {
        const response = await axios.get(url, { headers: { "Authorization": token } });
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
/* document.getElementById('search-input').addEventListener('input', function() {
    searchCandidates(this.value);
}); */

async function searchCandidates(query) {
    try {
        const url = `${config.APIURL}candidate/search?search=${query}`;
        const responseData = await fetchData(url);
        const candidates = responseData.candidates;
        const candidateTable = document.getElementById("candidate-table");
        candidateTable.innerHTML = ""; // Clear existing table content

        let sno = 1;

        candidates.forEach(candidate => {
            const dob = new Date(candidate.dob);
            const age = calculateAge(dob);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td>${candidate.candidateId}</td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.c_vessel}</td>
                <td>${candidate.c_mobi1}</td>
                <td>${age}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="viewCandidate('${candidate.candidateId}')">
                        <i class="fa fa-eye" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="editCandidate('${candidate.candidateId}')">
                        <i class="fa fa-pencil" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteCandidate('${candidate.candidateId}', event)">
                        <i class="fa fa-trash" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                </td>`;
            candidateTable.appendChild(row);
            sno++;
        });
        var totalPages = responseData?.totalPages || 0;
        if(totalPages>0) {
            loadPagenation('pagination-controls', page, totalPages, responseData.totalCount, 'candidate')
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function displayCandidates(page = 1, limit = 10, search = '') {
    try {
        showLoader('candidate-list')
        const url = `${config.APIURL}candidate/view-candidate?page=${page}&limit=${limit}&search=${search}`;
        const responseData = await fetchData(url);
        hideLoader('candidate-list')
        console.log(responseData, 'responseDataresponseData')
        const candidates = responseData.candidates;
        const candidateTable = document.getElementById("candidate-table");
        candidateTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        candidates.forEach(candidate => {
            const dob = new Date(candidate.dob);
            const age = calculateAge(dob);

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sno}</td>
                <td>${candidate.candidateId}</td>
                <td>${candidate.fname} ${candidate.lname}</td>
                <td>${candidate.c_rank}</td>
                <td>${candidate.c_vessel}</td>
                <td>${candidate.c_mobi1}</td>
                <td>${age}</td>
                <td>
                    <button class="btn border-0 m-0 p-0" onclick="viewCandidate('${candidate.candidateId}')">
                        <i class="fa fa-eye" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="editCandidate('${candidate.candidateId}')">
                        <i class="fa fa-pencil" onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deleteCandidate('${candidate.candidateId}', event)">
                        <i class="fa fa-trash" onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'"></i>
                    </button>
                </td>`;
            candidateTable.appendChild(row);
            sno++;
        });
        const totalPages = responseData?.totalPages|| 0;
        if(totalPages>0) {
            loadPagenation('pagination-controls', page, totalPages, responseData.totalCount, 'candidate')
        }  
        

    } catch (error) {
        hideLoader('candidate-list')
        console.error('Error:', error);
    }
}

function loadPageData(page, tableType) {
    displayCandidates(page);
}

async function deleteCandidate(candidateId, event) {
    event.preventDefault();
    let id = candidateId;
    console.log(id);
    const url = `${config.APIURL}candidate/delete-candidate/${id}`;
    console.log(url);
    try {
        const response = await axios.delete(url, { headers: { "Authorization": token } });
        console.log(response);
        displayCandidates();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}

function calculateAge(birthdate) {
    const currentDate = new Date();
    const birthDate = new Date(birthdate);

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function viewCandidate(id) {
    // Add your view logic here
    window.open(`./view-candidate.html?id=${id}`, '_blank');
}

function editCandidate(memId) {
    console.log('memId:', memId);
    const canEdit = decodedToken.Write; // Assuming decodedToken is globally accessible

    if (canEdit) {
        console.log('Edited:', memId);
        window.open(`./edit-candidate-2.html?memId=${memId}`, '_blank'); // Open in new tab
    } else {
        alert('You do not have permission to edit this candidate.');
    }
}