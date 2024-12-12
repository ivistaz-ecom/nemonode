// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = './loginpage.html';
}

var filedName = ['sno', 'portAgentName', 'contactPerson', 'address', 'phone', 'email', 'city', 'state', 'country', 'edit']

async function displayPortagent(page = 1, limit = 10) {
    try {
        // Fetch port agents from the server with pagination parameters
        const portAgentResponse = await axios.get(`${config.APIURL}others/view-port-agent?page=${page}&limit=${limit}`, { headers: { "Authorization": token } });
        const portAgentTable = document.getElementById("port-agent-table");

        // Clear existing rows
        portAgentTable.innerHTML = "";
        let sno = (page - 1) * limit + 1;

        // Add each port agent to the table
        console.log(filedName, 'filedName')
        portAgentResponse.data.portAgents.forEach((portAgent, index) => {
            const row = document.createElement("tr");
            let result  = ''; 
            filedName.map((item)=> {
                if(item==='sno') {
                    result+= `<td>${sno + index}</td>`;
                }else if(item==='edit') {
                    result+= `<td>
                    <button class="btn border-0 m-0 p-0" onclick="editPortagent('${portAgent.id}','${portAgent.portAgentName}','${portAgent.contactPerson}','${portAgent.address}','${portAgent.phone}','${portAgent.email}','${portAgent.city}','${portAgent.state}','${portAgent.country}',event)">
                        <i onMouseOver="this.style.color='seagreen'" onMouseOut="this.style.color='gray'" class="fa fa-pencil"></i>
                    </button>
                    <button class="btn border-0 m-0 p-0" onclick="deletePortagent('${portAgent.id}',event)">
                        <i onMouseOver="this.style.color='red'" onMouseOut="this.style.color='gray'" class="fa fa-trash"></i>
                    </button>
                </td>`
                }else {
                    result+= `<td>${portAgent[item]}</td>`;
                }
                return result;
            })
            row.innerHTML = result;
            portAgentTable.appendChild(row);
        });
        loadPagenation('pagination-controls', page, portAgentResponse.data.totalPages, portAgentResponse.data.totalCount, 'portagent')

    } catch (error) {
        console.error('Error:', error);
    }
}

function loadPageData(page, tableType) {
    displayPortagent(page);
}

window.onload = async function () {
    displayPortagent();
};


async function editPortagent(portAgentId, portAgentName, contactPerson, address, phone, email, city, state, country, event) {
    event.preventDefault();

    // Construct the URL with query parameters
    const editUrl = `edit-portagent-2.html?portAgentId=${encodeURIComponent(portAgentId)}&portAgentName=${encodeURIComponent(portAgentName)}&contactPerson=${encodeURIComponent(contactPerson)}&address=${encodeURIComponent(address)}&phone=${encodeURIComponent(phone)}&email=${encodeURIComponent(email)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}`;

    // Redirect to edit-portagent-2.html with the constructed URL
    window.location.href = editUrl;  // Fix: Use the constructed URL here
}

async function deletePortagent(portAgentId, event) {
    event.preventDefault();

    const id = portAgentId;
    const url = `${config.APIURL}others/delete-port-agent/${id}`;

    try {
        const response = await axios.delete(url,{headers:{"Authorization":token}});
        console.log(response);
        displayPortagent();
    } catch (error) {
        console.error('Error during delete request:', error.message);
    }
}