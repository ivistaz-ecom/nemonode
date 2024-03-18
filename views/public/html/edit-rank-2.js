const updateRankButton = document.getElementById("update-rank-form");
updateRankButton.addEventListener("submit", async (e) => {
    e.preventDefault();
    const rankId = document.getElementById("u_rank_id").value;
    
    const updatedRankDetails = {
        id: rankId,
        rank: document.getElementById("u_rank_name").value,
        rankOrder: document.getElementById("u_rank_order").value,
        category: document.getElementById("u_rank_category").value,
        // Add other fields specific to Rank entity
    };

    try {
        const response = await axios.put(`http://nemonode.ivistaz.co:8000/others/update-rank/${rankId}`, updatedRankDetails,{headers:{"Authorization":token}});
        console.log('Response:', response.data);
        alert("Rank Updated Successfully!");
        window.location.href ="./edit-rank.html"
    } catch (error) {
        console.error('Error:', error);
    }
});

const token = localStorage.getItem('token')
window.onload = async function(){ 
    const hasUserManagement = decodedToken.userManagement;
    console.log(hasUserManagement)
    if (hasUserManagement) {
      document.getElementById('userManagementSection').style.display = 'block';
      document.getElementById('userManagementSections').style.display = 'block';

    }
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Fetch values from query parameters
    const rankId = getQueryParameter('rankId');
    const rank = getQueryParameter('rank');
    const rankOrder = getQueryParameter('rankOrder');
    const category = getQueryParameter('category');

    // Set values into the input fields
    document.getElementById("u_rank_id").value = rankId;
    document.getElementById("u_rank_name").value = decodeURIComponent(rank);
    document.getElementById("u_rank_order").value = decodeURIComponent(rankOrder);
    document.getElementById("u_rank_category").value = decodeURIComponent(category);
}

document.getElementById('logout').addEventListener('click', function() {
    // Clear local storage
    localStorage.clear();

    // Perform logout actions
    // You may want to redirect to a login page or perform other logout-related tasks

    // For example, redirect to a login page
    window.location.href = './loginpage.html';
});





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