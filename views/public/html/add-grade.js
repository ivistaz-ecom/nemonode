// Check if the token is not present
if (!token) {
  // Redirect to the login page
  window.location.href = './loginpage.html';
}
document.getElementById("grade-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const gradeExp = document.getElementById("grade_exp").value.trim();
    try {
        const serverResponse = await axios.post(`${config.APIURL}others/create-grade`, { gradeExp },{headers:{"Authorization":token}});
        console.log('Response:', serverResponse.data);
    } catch (error) {
        console.error('Error:', error);
    }
});