// Check if the token is not present
if (!token) {
  // Redirect to the login page

  window.location.href = "./loginpage.html";
}

document.getElementById("port-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const portName = document.getElementById("port_name").value.trim();

  try {
    const serverResponse = await axios.post(
      `${config.APIURL}others/create-port`,
      { portName },
      { headers: { Authorization: token } }
    );
    console.log("Response:", serverResponse.data);
  } catch (error) {
    console.error("Error:", error);
  }
});
