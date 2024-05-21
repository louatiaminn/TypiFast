document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('input-name');
    const emailInput = document.getElementById('input-email');
    const subjectInput = document.getElementById('input-subject');
    const messageInput = document.getElementById('input-message');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting

        // Check if each input is valid
        if (validateName() && validateEmail() && validateSubject() && validateMessage()) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim()
            };

            fetch('/submit-message', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
              .then(data => {
                  if (data.message) {
                      alert('Form submitted successfully!');
                  } else {
                      alert('Failed to submit form: ' + data.error);
                  }
              }).catch(error => {
                  console.error('Error:', error);
              });
        }
    });

    // Function to validate name
    function validateName() {
        const nameValue = nameInput.value.trim();
        if (nameValue === '') {
            alert('Please enter your name.');
            return false;
        }
        return true;
    }

    // Function to validate email
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            alert('Please enter a valid email address.');
            return false;
        }
        return true;
    }

    // Function to validate subject
    function validateSubject() {
        const subjectValue = subjectInput.value.trim();
        if (subjectValue === '') {
            alert('Please enter a subject.');
            return false;
        }
        return true;
    }

    // Function to validate message
    function validateMessage() {
        const messageValue = messageInput.value.trim();
        if (messageValue === '') {
            alert('Please enter a message.');
            return false;
        }
        return true;
    }
});
