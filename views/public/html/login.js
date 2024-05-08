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

        const response = await axios.post(
            "https://nemonode.ivistaz.co/user/login",
            loginCredentials
        );

        if (response.data.success) {
            const username = response.data.username;
            const token = response.data.token;

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
            },850);
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