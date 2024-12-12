// Get the token from localStorage

// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = './loginpage.html';
}

document.getElementById("port-agent-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const portAgentName = document.getElementById("port-agent-name").value.trim();
    const contactPerson = document.getElementById("port-agent-contact").value.trim();
    const address = document.getElementById("port-agent-address").value.trim();
    const phone = document.getElementById("port-agent-phone").value.trim();
    const email = document.getElementById("port-agent-email").value.trim();
    const city = document.getElementById("port-agent-city").value.trim();
    const state = document.getElementById("port-agent-state").value.trim();
    const country = document.getElementById("port-agent-country").value.trim();

    try {
        const serverResponse = await axios.post(`${config.APIURL}others/create-port-agent`, {
            portAgentName,
            contactPerson,
            address,
            phone,
            email,
            city,
            state,
            country,
        },{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
    } catch (error) {
        console.error('Error:', error);
    }
});
