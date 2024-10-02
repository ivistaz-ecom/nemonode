if (!token) {
  // Redirect to the login page
  window.location.href = "./loginpage.html";
}

document.getElementById("rank-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const rank = document.getElementById("rank").value.trim();
  const rankOrder = document.getElementById("rank_order").value.trim();
  const category = document.getElementById("category").value.trim();
  const eval_type = document.getElementById("eval_type").value;
  try {
    const serverResponse = await axios.post(
      `${config.APIURL}others/create-rank`,
      {
        rank,
        rankOrder,
        category,
        eval_type,
      },
      { headers: { Authorization: token } }
    );
    console.log("Response:", serverResponse.data);
  } catch (error) {
    console.error("Error:", error);
  }
});
