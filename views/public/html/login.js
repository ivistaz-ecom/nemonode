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
            "https://nemo.ivistaz.co/user/login",
            loginCredentials
        );
            console.log(response)
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

let deferredPrompt; // Define deferredPrompt variable

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 76 and later from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
});

document.getElementById('downloadButton').addEventListener('click', () => {
    if (deferredPrompt) {
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Reset the deferredPrompt variable
            deferredPrompt = null;
        });
    }
});

// The rest of your code seems fine
