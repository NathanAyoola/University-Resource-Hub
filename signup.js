// signup.js

function submitForm() {
    const form = document.getElementById("signupForm");
    const formData = new FormData(form);
  
    fetch('/signup', {  // Make sure the endpoint is correct
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  