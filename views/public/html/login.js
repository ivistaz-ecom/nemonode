const user_id = document.getElementById("user_id");
const user_pass = document.getElementById("user_pass");
const form = document.getElementById("login-form");

function decodeToken(token) {
    // Implementation depends on your JWT library
    // Here, we're using a simple base64 decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
}

form.addEventListener("submit", login);

async function login(e) {
    try {
        e.preventDefault();

        const loginCredentials = {
            userName: user_id.value.trim(),
            userPassword: user_pass.value.trim(),
        };

        console.log(loginCredentials);

        const response = await axios.post(
            "https://nemonode.ivistaz.co/user/login",
            loginCredentials
        );
        console.log("Response:", response.data);

        if (response.data.success) {
            const token = response.data.token;
            const decodedToken = decodeToken(token);
            if (decodedToken.disableUser) {
                console.error("User account is disabled. Cannot login.");
                // Handle the disabled account scenario, e.g., display an error message to the user
            } else {
                localStorage.setItem("token", token);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("userId", response.data.userId);

                window.location.href = "./indexpage.html";
                redirect('/user-managment')



            }
        } else {
            console.error("Login failed:", response.data.message);
            // Handle the error here, e.g., display an error message to the user
        }
    } catch (error) {
        console.error("Error during login:", error.message);
        // Handle network errors or other unexpected issues here
        // Display an error message to the user
    }
}


const user_p = document.getElementById("user_pass");

function togglePassword() {
    const inputType = user_p.type === "password" ? "text" : "password";
    user_p.type = inputType;
}

