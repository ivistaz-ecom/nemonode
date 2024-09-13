// JavaScript code (login.js)

const user_id = document.getElementById("user_id");
const user_pass = document.getElementById("user_pass");
const form = document.getElementById("login-form");
const welcomeUsername = document.getElementById("welcomeUsername");
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));

form.addEventListener("submit", login);

async function login(e) {
    try {
      
        e.preventDefault();
        const loginCredentials = {
            userName: user_id.value.trim(),
            userPassword: user_pass.value.trim(),
        };
        console.log(loginCredentials)
        const response = await axios.post(
            "http://localhost:8001/user/login",
            loginCredentials
        );
        console.log(response)
        if (response.data.success) {
            const username = response.data.username;
            const token = response.data.token;
            const userGroup = decodeToken(token).userGroup
            console.log(userGroup)
            function decodeToken(token) {
                // Implementation depends on your JWT library
                // Here, we're using a simple base64 decode
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse(atob(base64));
            }

            // Check if the user group is 'vendor'
            if (userGroup === 'vendor') {
                alert('Vendor ID detected, use vendor login');
                console.log('Vendor login detected, function will exit now.');
                return; // Exit the function to prevent further execution
            }
            // Display the welcome message and loading spinner
            welcomeUsername.textContent = username;
            welcomeModal.show();

            // Save token and other data to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", response.data.userId);

            // Redirect to index page after a short delay (e.g., 2 seconds)
            setTimeout(() => {
                window.location.href = "./indexpage.html";
            }, 850);
        } else {
            console.error("Login failed:", response.data.message);
            // Handle login failure
            // Display an error message to the user
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        // Handle network errors or other unexpected issues
        // Display an error message to the user
    }
}

function togglePassword() {
    const inputType = user_pass.type === "password" ? "text" : "password";
    user_pass.type = inputType;
}
