const logout = document.getElementById("logout")
logout.addEventListener("click",()=>{
    localStorage.clear();

    window.location.href ="../login/login.html"
})


window.onload = async function () {
    const userDisplay=document.getElementById("user_name");
    userDisplay.innerHTML+=localStorage.getItem('username');
}

document.getElementById('toggleSidebar').addEventListener('click', function () {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');

    // Toggle the left position of the sidebar
    sidebar.style.left = sidebar.style.left === '0px' ? '-250px' : '0px';

    // Adjust the margin of the content area based on the sidebar visibility
    content.style.marginLeft = sidebar.style.left === '0px' ? '250px' : '0px';
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

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
const token = localStorage.getItem('token'); // Get the JWT token from storage
const decodedToken = decodeToken(token);
const userRole = decodedToken.userGroup; // Assuming your user role is stored in userGroup
const hasUserManagement = decodedToken.userManagement; // Assuming userManagement is a boolean in the JWT payload
const hasReport = decodedToken.reports
console.log(userRole,hasUserManagement)
switch (userRole) {
    case 'admin':
        document.getElementById('adminSection').style.display = 'block';
        break;
    case 'vendor':
        document.getElementById('vendorSection').style.display = 'block';
        if (hasUserManagement) {
            const userLink = document.createElement('a');
            userLink.href = '../user/user.html';
            userLink.innerHTML = '<i class="fas fa-user-plus"></i> &nbsp; Create User';
            document.getElementById('vendorSection').appendChild(userLink);
        }
        if (hasReport) {
            const userLink = document.createElement('a');
            userLink.href = '../report/report.html';
            userLink.innerHTML = '<i class="fas fa-file-alt"></i> &nbsp; Generate Report';
            document.getElementById('vendorSection').appendChild(userLink);
        }
        break;
    // case 'user':
    //     document.getElementById('userSection').style.display = 'block';
    //     break;
    default:
        console.error('Unknown user role:', userRole);
}
