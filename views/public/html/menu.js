$.getJSON("menu.json", function(json) {
    let menuHtml = "";
    if(json.length>0) {
        json.forEach(menu => {
            let menuID = menu?.id || '';
            let menuStyle = menu?.display||'';
            if(menu.type==="static") {
                menuHtml+=`<li class="menu-header small text-uppercase" ${menuID!==""?'id="'+menuID+'"':""} ${menuStyle!==""?'style="display:'+menuStyle+';"':""}>
                <span class="menu-header-text">${menu.title}</span>
                </li>`;
            }else {

                menuHtml+=`<li class="menu-item ${menu.active==activeMenu?'open active':''}" ${menuID!==""?'id="'+menuID+'"':""}  ${menuStyle!==""?'style="display:'+menuStyle+';"':""}>
                <a href="${(menu.link!=="")?menu.link:'javascript:void(0);'}" class="menu-link ${menu.submenu.length>0?'menu-toggle':''}">
                  <i class="menu-icon tf-icons bx ${menu.icon}"></i>
                  <div data-i18n="Analytics">${menu.title}</div>
                </a>`;
                if(menu.submenu.length>0) {
                    menuHtml+=`<ul class="menu-sub">`;
                    menu.submenu.forEach(submenu => {
                        menuHtml+=`<li class="menu-item">
                        <a href="${submenu.link}" class="menu-link ${submenu.active===activesub?'active':''}">
                            <div data-i18n="${submenu.title}">${submenu.title}</div>
                        </a>
                        </li>`;
                    });
                    menuHtml+=`</ul>`;
                }
                 menuHtml+=`
              </li>
              `;
            }
        })
        menuHtml+=`<li class="d-flex justify-content-center align-items-center m-4">
                <a class="dropdown-item btn text-danger text-center" id="logout">
                <i class="bx bx-power-off me-0 "></i>
                <span class="align-middle">Log Out</span>
                </a>
              </li>`;
    }
    $('#menuList').append(menuHtml);
     // this will show the info it in firebug console
});

const token = localStorage.getItem('token');
window.onload = async function () {

    const hasReadOnly = decodedToken.readOnly;
    const hasUserManagement = decodedToken.userManagement;
    const vendorManagement = decodedToken.vendorManagement;
    const staff = decodedToken.staff;
    console.log(vendorManagement);
    if (hasUserManagement && decodedToken.userGroup !== 'vendor') {
        document.getElementById('userManagementSection').style.display = 'block';
        document.getElementById('userManagementSections').style.display = 'block';
    }
    if (vendorManagement) {
        document.getElementById('vendorManagementSection').style.display = 'block';
        document.getElementById('vendorManagementSections').style.display = 'block';

    }
    if(staff) {
        // Hide the settings container
        document.getElementById('settingsContainer').style.display = 'none';
        document.getElementById('settingsCard').style.display='block'
        // Show a message indicating the user does not have permission
        
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
setTimeout(function () {
updateDateTime();
setInterval(updateDateTime, 1000);
}, 500);



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


// Add Left Logo
const leftLogo = ` <a href="indexpage.html" class="app-brand-link">
              <span class="app-brand-logo demo mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="383.146"
                  height="163.169"
                  viewBox="0 0 383.146 163.169"
                >
                  <g
                    id="Group_1"
                    data-name="Group 1"
                    transform="translate(-941.509 -160.676)"
                  >
                    <g
                      id="Group_4320"
                      data-name="Group 4320"
                      transform="translate(941.648 255.186)"
                    >
                      <path
                        id="Path_598"
                        data-name="Path 598"
                        d="M970.183,276.369a1.123,1.123,0,0,1,1.271,1.271v38q0,1.114-.727,1.113a1.233,1.233,0,0,1-.337-.051,5.439,5.439,0,0,1-1.5-.6l-13.643-8.766c-.468-.292-.7-.207-.7.26q-.025,2.257,0,3.708v3.71a1.352,1.352,0,0,1-1.555,1.5H942.975a1.134,1.134,0,0,1-1.3-1.27V277.431q0-1.215.985-1.062a3.867,3.867,0,0,1,1.349.414l13.3,9.078a1.55,1.55,0,0,0,.778.338c.346,0,.519-.313.519-.934V277.64q0-1.323,1.5-1.271,2.8.052,5.033,0Z"
                        transform="translate(-941.679 -276.108)"
                        fill="#fff"
                      />
                      <path
                        id="Path_599"
                        data-name="Path 599"
                        d="M1017.118,278.055l18.648,36.929a1.462,1.462,0,0,1,.182.623q0,.882-1.842.883h-8.042a5.737,5.737,0,0,1-1.763-.159,3.236,3.236,0,0,1-1.062-1.345,2.923,2.923,0,0,0-2.88-1.609q-3.682.053-6.536,0h-6.485a2.519,2.519,0,0,0-2.49,1.5,3.32,3.32,0,0,1-.934,1.388,4.337,4.337,0,0,1-1.763.22l-4.124-.027q-1.348,0-4.1-.025-1.867,0-1.867-.908a1.687,1.687,0,0,1,.206-.726l18.546-36.752a3.483,3.483,0,0,1,6.3,0Zm-1.246,22.666q-.467-.933-1.375-2.774a.783.783,0,0,0-.544-.313.715.715,0,0,0-.544.338q-.521.962-1.427,2.828c-.208.484-.07.762.415.829h3.164a.344.344,0,0,0,.389-.389A.922.922,0,0,0,1015.872,300.721Z"
                        transform="translate(-950.792 -276.054)"
                        fill="#fff"
                      />
                      <path
                        id="Path_600"
                        data-name="Path 600"
                        d="M1071.161,276.277a1.124,1.124,0,0,1,1.27,1.272v23.913a18.054,18.054,0,0,0,.387,2.463,1.917,1.917,0,0,0,1.987,1.116,1.952,1.952,0,0,0,2.141-1.791l.31-1.788V277.574a1.258,1.258,0,0,1,.417-.868,1.2,1.2,0,0,1,.857-.428h10.214a1.208,1.208,0,0,1,.857.428,1.257,1.257,0,0,1,.416.868v24.043a14.145,14.145,0,0,1-4.539,10.5,15.138,15.138,0,0,1-21.346.013,14.368,14.368,0,0,1-4.46-10.622V277.549a1.123,1.123,0,0,1,1.271-1.272Z"
                        transform="translate(-963.02 -276.094)"
                        fill="#fff"
                      />
                      <path
                        id="Path_601"
                        data-name="Path 601"
                        d="M1112.307,276.467h27.364q1.556,0,1.556,1.193v9.57q0,1.194-1.551,1.193h-6.181q-1.111,0-1.111,1.245v25.626a1.124,1.124,0,0,1-1.273,1.27h-10.214a1.125,1.125,0,0,1-1.274-1.27V289.669q0-1.245-1.089-1.245h-6.225q-1.556,0-1.557-1.193v-9.57Q1110.75,276.467,1112.307,276.467Z"
                        transform="translate(-972.258 -276.129)"
                        fill="#fff"
                      />
                      <path
                        id="Path_602"
                        data-name="Path 602"
                        d="M1173.478,276.4a1.122,1.122,0,0,1,1.269,1.271v37.609a1.122,1.122,0,0,1-1.269,1.27h-10.221a1.122,1.122,0,0,1-1.269-1.27V277.674a1.123,1.123,0,0,1,1.269-1.271Z"
                        transform="translate(-981.525 -276.117)"
                        fill="#fff"
                      />
                      <path
                        id="Path_603"
                        data-name="Path 603"
                        d="M1203.09,276.4a1.123,1.123,0,0,1,1.271,1.271v24.8q0,1.323,1.219,1.323h10.582a1.123,1.123,0,0,1,1.271,1.271v10.22a1.123,1.123,0,0,1-1.271,1.27H1192.9a1.134,1.134,0,0,1-1.3-1.27V277.674a1.134,1.134,0,0,1,1.3-1.271Z"
                        transform="translate(-986.881 -276.117)"
                        fill="#fff"
                      />
                      <path
                        id="Path_604"
                        data-name="Path 604"
                        d="M1248.66,276.277a1.124,1.124,0,0,1,1.272,1.272v23.913a17.718,17.718,0,0,0,.387,2.463,1.915,1.915,0,0,0,1.985,1.116,1.951,1.951,0,0,0,2.141-1.791l.31-1.788V277.574a1.267,1.267,0,0,1,.415-.868,1.211,1.211,0,0,1,.857-.428h10.215a1.205,1.205,0,0,1,.858.428,1.253,1.253,0,0,1,.416.868v24.043a14.145,14.145,0,0,1-4.54,10.5,15.137,15.137,0,0,1-21.346.013,14.369,14.369,0,0,1-4.46-10.622V277.549a1.123,1.123,0,0,1,1.27-1.272Z"
                        transform="translate(-995.123 -276.094)"
                        fill="#fff"
                      />
                      <path
                        id="Path_605"
                        data-name="Path 605"
                        d="M1317.273,296.8a9.729,9.729,0,0,1,3.995,7.781q0,5.6-5.68,9.026a20.637,20.637,0,0,1-10.841,2.931,21.721,21.721,0,0,1-8.018-1.479,14.371,14.371,0,0,1-6.483-4.773.994.994,0,0,1-.129-1.114,1.889,1.889,0,0,1,.8-.754l8.923-4.2a3.133,3.133,0,0,1,2.257.233,8.737,8.737,0,0,0,2.619.727,6.286,6.286,0,0,0,2.335-.44q1.452-.6,1.451-1.634,0-2.025-3.758-1.973a22.8,22.8,0,0,1-4.54-.389,16.437,16.437,0,0,1-7.988-3.942,10.562,10.562,0,0,1-3.968-8.066q0-5.731,5.576-9.286a19.711,19.711,0,0,1,10.921-3.113,20.769,20.769,0,0,1,8.87,1.921,13.1,13.1,0,0,1,6.56,6.067,1.769,1.769,0,0,1,.207.779c0,.555-.388.925-1.165,1.116l-9.39,3.451q-1.038.388-1.4.1l-.806-.572a4.945,4.945,0,0,0-2.9-.752,6.186,6.186,0,0,0-2.307.441q-1.452.6-1.451,1.606,0,1.038,1.451,1.608a5.946,5.946,0,0,0,2.307.442,21.857,21.857,0,0,1,6.589,1.246A18.43,18.43,0,0,1,1317.273,296.8Z"
                        transform="translate(-1004.362 -276.106)"
                        fill="#fff"
                      />
                    </g>
                    <g
                      id="Group_4321"
                      data-name="Group 4321"
                      transform="translate(941.509 305.65)"
                    >
                      <path
                        id="Path_606"
                        data-name="Path 606"
                        d="M951,350.394a9.415,9.415,0,0,1-.6,3.43q-.806,2.031-2.3,2.031h-6.011v-1.524h4.687q.978,0,1.5-1.3a6.088,6.088,0,0,0,.4-2.255,4.257,4.257,0,0,0-.546-2.477,1.929,1.929,0,0,0-1.5-.667h-2.3a2.4,2.4,0,0,1-2.215-1.751,7.623,7.623,0,0,1-.6-3.154,8.219,8.219,0,0,1,.6-3.218q.778-1.848,2.215-1.847h5.437v1.523h-4.114a1.545,1.545,0,0,0-1.409,1.117,5.259,5.259,0,0,0-.374,2.042,5.016,5.016,0,0,0,.374,2.012,1.544,1.544,0,0,0,1.409,1.117H948.3q1.411,0,2.157,1.778A8.275,8.275,0,0,1,951,350.394Z"
                        transform="translate(-941.509 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_607"
                        data-name="Path 607"
                        d="M1007.037,355.855h-2.473V347.5h-5.12v8.352h-2.5v-18.2h2.5v8.32h5.12v-8.32h2.473Z"
                        transform="translate(-951.535 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_608"
                        data-name="Path 608"
                        d="M1055.614,355.855h-2.5v-18.2h2.5Z"
                        transform="translate(-961.694 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_609"
                        data-name="Path 609"
                        d="M1109.877,343.2a9.754,9.754,0,0,1-.547,3.407q-.747,1.978-2.243,1.976h-3.594V347.06h2.271q.948,0,1.438-1.5a7.976,7.976,0,0,0,.345-2.424,8.165,8.165,0,0,0-.345-2.425q-.489-1.528-1.437-1.53h-3.25v16.673h-2.5v-18.2h7.075q1.466,0,2.243,2.068A10.5,10.5,0,0,1,1109.877,343.2Z"
                        transform="translate(-970.176 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_610"
                        data-name="Path 610"
                        d="M1165.764,343.2a9.715,9.715,0,0,1-.547,3.407q-.746,1.978-2.243,1.976h-3.595V347.06h2.271q.95,0,1.438-1.5a7.922,7.922,0,0,0,.346-2.424,8.11,8.11,0,0,0-.346-2.425q-.487-1.528-1.437-1.53H1158.4v16.673h-2.5v-18.2h7.076q1.467,0,2.243,2.068A10.452,10.452,0,0,1,1165.764,343.2Z"
                        transform="translate(-980.284 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_611"
                        data-name="Path 611"
                        d="M1214.293,355.855h-2.5v-18.2h2.5Z"
                        transform="translate(-990.393 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_612"
                        data-name="Path 612"
                        d="M1268.64,355.855h-3.164l-4.889-12.767v12.767h-1.9v-18.2h2.722l5.243,14.264V337.66h1.986Z"
                        transform="translate(-998.876 -337.66)"
                        fill="#fff"
                      />
                      <path
                        id="Path_613"
                        data-name="Path 613"
                        d="M1324.288,355.855H1317.5a2.412,2.412,0,0,1-2.187-1.683,7.039,7.039,0,0,1-.631-3.05v-8.669a7.126,7.126,0,0,1,.631-3.08,2.418,2.418,0,0,1,2.187-1.714h5.638v1.523h-4.315c-.614,0-1.083.4-1.41,1.207a5.456,5.456,0,0,0-.375,2.064v8.669a5.217,5.217,0,0,0,.375,2.035q.517,1.176,1.41,1.174h3.221v-6.859h-3.625v-1.524h5.868Z"
                        transform="translate(-1009.003 -337.66)"
                        fill="#fff"
                      />
                    </g>
                    <g
                      id="Group_4322"
                      data-name="Group 4322"
                      transform="translate(1127.464 160.676)"
                    >
                      <path
                        id="Path_614"
                        data-name="Path 614"
                        d="M1367.252,195.8s-61.235,27.783-66.94,60.252h-34.3c1.08-1.57,16.018-23,32.433-32.4,0,0-40.531,6.508-66.513,32.4h-54.9S1237.254,195.8,1367.252,195.8Z"
                        transform="translate(-1170.061 -167.029)"
                        fill="#fff"
                      />
                      <path
                        id="Path_615"
                        data-name="Path 615"
                        d="M1173.032,212.085c8.709-8.71,12.746-11.047,12.746-11.047V175.547s1.7-14.871,28.04-14.871l4.25,29.74s32.713-21.668,32.713,12.321c0,0-58.7,21.207-79.872,46.964C1170.909,249.7,1164.323,220.8,1173.032,212.085Z"
                        transform="translate(-1168.522 -160.676)"
                        fill="#fff"
                      />
                    </g>
                  </g>
                </svg>
              </span>
            </a>

            <a
              href="javascript:void(0);"
              class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
            >
              <i class="bx bx-chevron-left bx-sm align-middle"></i>
            </a>`;
$('#leftLogo').append(leftLogo);

//Top Navication
const topNav = `<div
              class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none"
            >
              <a
                class="nav-item nav-link px-0 me-xl-4"
                href="javascript:void(0)"
              >
                <i class="bx bx-menu bx-sm"></i>
              </a>
            </div>
            <div class="navbar-nav-right d-flex align-items-center">
              ${currentPage}
            </div>
            <div
              class="navbar-nav-right d-flex align-items-center"
              id="navbar-collapse"
            >
              <ul class="navbar-nav flex-row align-items-center ms-auto">
                <li>
                  <div class="dropdown-divider"></div>
                </li>
                <li>
                  <a class="dropdown-item" href="./profile.html">
                    <i class="bx bx-user me-2"></i>
                    <span class="align-middle">My Profile</span>
                  </a>
                </li>

                <li>
                  <div class="dropdown-divider"></div>
                </li>
                <li>
                  <a class="dropdown-item" id="logout" href="#" data-bs-toggle="modal" data-bs-target="#logoutModal">
    <i class="bx bx-power-off me-2"></i>
   <span class="align-middle">Log Out</span>
</a>
                </li>
              </ul>
            </div>
`;
$('#layout-navbar').append(topNav)

//Permissing Details
const permMsg= `
 <h4>Permission Required! Contact Admin.</h4>
            <p>
              For more details regarding permission visit
              <strong class="text-primary">My Profile</strong>
            </p>
`;
$('#settingsCard').append(permMsg)

//Footer Content
const footetcontent = `<div class="container">
              <div class="d-flex justify-content-between">
                <span id="datetime"></span>
                <span>Nautilus Shipping</span>
              </div>
            </div>`;
$('#footetcontent').append(footetcontent);

const logoutContent = `
<div
      class="modal fade"
      id="logoutModal"
      tabindex="-1"
      aria-labelledby="logoutModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="logoutModalLabel">NSNEMO</h5>
          </div>
          <div class="modal-body text-center mb-4">
            <img
              src="../../public/assets/img/illustrations/undraw_cabin_hkfr.svg"
              style="width: 50px; height: auto"
            />
            <p id="logoutMessage">Logging you out...</p>
            <div class="d-flex justify-content-center">
              <div class="loader"></div>
            </div>
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>`;
$('#logoutContent').html(logoutContent);

document.getElementById("logout").addEventListener("click", function() {
    // Display the modal with initial message
    var myModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    myModal.show();
    
    // Send request to update logged status to false
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.put(`https://nsnemo.com/user/${userId}/logout`)
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