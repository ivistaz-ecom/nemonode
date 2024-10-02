// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = "./loginpage.html";
}

document.getElementById("exp-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const experience = document.getElementById("exp").value.trim();
  try {
    const serverResponse = await axios.post(
      `${config.APIURL}others/create-experience`,
      {
        experience,
      },
      { headers: { Authorization: token } }
    );

    if (serverResponse.status === 200) {
      console.log("Experience added successfully");
    } else {
      console.error("Error:", serverResponse.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
});
