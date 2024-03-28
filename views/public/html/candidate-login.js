document.getElementById('candidate_login').addEventListener('submit', async function submitForm(e) {
  try {
    e.preventDefault();
    // Get values using document.getElementById
    const email = document.getElementById(`email`).value.trim();
    const password = document.getElementById(`password`).value.trim();

    const formData = {
      email: email,
      password: password
    };

    // Send data to the server using Axios
    const response = await axios.post('https://nemonode.ivistaz.co/candidate/login', formData);

    console.log(response.data);
    const token = response.data.token;
    const cmemId = response.data.candidateId;
    
    localStorage.setItem('ctoken',token)
    localStorage.setItem('cmemId',cmemId)
    
    
    window.location.href='./candidate-indexpage.html'
    // Handle success (if needed)

  } catch (error) {
    console.error(error);
    // Handle error (if needed)
  }
});


function updateDateTime() {
  const dateTimeElement = document.getElementById('datetime');
  const now = new Date();

  const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      ordinal: 'numeric',
  };

  const dateTimeString = now.toLocaleString('en-US', options);

  dateTimeElement.textContent = dateTimeString;
}

// Update date and time initially and every second
updateDateTime();
setInterval(updateDateTime, 1000);