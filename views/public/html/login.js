const user_id = document.getElementById("user_id");
const user_pass = document.getElementById("user_pass");
const form = document.getElementById("login-form");
const welcomeUsername = document.getElementById("welcomeUsername");
const welcomeModal = new bootstrap.Modal(document.getElementById('welcomeModal'));

form.addEventListener("submit", login);

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

async function login(e) {
    try {
        e.preventDefault();

        const loginCredentials = {
            userName: user_id.value.trim(),
            userPassword: user_pass.value.trim(),
        };

        const response = await axios.post(
            "https://nemo.ivistaz.co/user/login",
            loginCredentials
        );

        if (response.data.success) {
            const username = response.data.username;
            const token = response.data.token;
            const userId = response.data.userId;

            // Save token, username, and userId in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", userId);

            // Check if user is already logged in
            const decodedToken = decodeToken(token);
            const logged = decodedToken.logged;
            if (logged) {
                // Send request to update logged status to false
                const logoutResponse = await axios.put(
                    `https://nemo.ivistaz.co/user/${userId}/logout`
                );

                if (logoutResponse.data.success) {
                    alert("Session already exists. You have been signed out of all devices.");
                    // Try login again to update the logged status
                    login(e);
                } else {
                    console.error("Failed to sign out of all devices:", logoutResponse.data.message);
                }
            } else {
                // Display success message and redirect to index page
                welcomeUsername.textContent = username;
            welcomeModal.show();
                window.location.href = "./indexpage.html";
            }
        } else {
            if (response.status === 200) {
                const signoutAllDevices = confirm("Session already exists. Do you want to sign out of all devices?");
                if (signoutAllDevices) {
                    // Try login again to sign out of all devices
                    welcomeUsername.textContent = username;
                    welcomeModal.show();
                    window.location.href = "./indexpage.html";

                }
            } else {
                console.error("Login failed:", response.data.message);
                // Handle login failure
                // Display an error message to the user
            }
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
