const user_id = document.getElementById("user_id");
const user_pass = document.getElementById("user_pass");
const form = document.getElementById("login-form");
const welcomeUsername = document.getElementById("welcomeUsername");
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));

form.addEventListener("submit", login);

async function login(e) {
    e.preventDefault(); // Prevent default form submission

    const loginCredentials = {
        userName: user_id.value.trim(),
        userPassword: user_pass.value.trim(),
    };

    try {
        const response = await axios.post(
            "https://nsnemo.com/user/login",
            loginCredentials
        );

        if (response.data.success) {
            const username = response.data.username;
            const token = response.data.token;
            const userGroup = decodeToken(token).userGroup;

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
            handleLoginError();
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        handleLoginError();
    }
}

function handleLoginError() {
    // Highlight the password input border in red
    user_pass.style.borderColor = "red";

    // Alert the user
    alert("Username and password don't match");
}

function togglePassword() {
    const inputType = user_pass.type === "password" ? "text" : "password";
    user_pass.type = inputType;
}

function decodeToken(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}
