document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.querySelector('form');
    const pseudoInput = document.getElementById('pseudo');
    const nomInput = document.getElementById('nom');
    const prenomInput = document.getElementById('prenom');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateForm() {
        const pseudoValue = pseudoInput.value.trim();
        const nomValue = nomInput.value.trim();
        const prenomValue = prenomInput.value.trim();
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (pseudoValue === '') {
            setErrorFor(pseudoInput, 'Pseudo ne peut pas être vide');
            return false;
        } else {
            setSuccessFor(pseudoInput);
        }

        if (nomValue === '') {
            setErrorFor(nomInput, 'Nom ne peut pas être vide');
            return false;
        } else {
            setSuccessFor(nomInput);
        }

        if (prenomValue === '') {
            setErrorFor(prenomInput, 'Prénom ne peut pas être vide');
            return false;
        } else {
            setSuccessFor(prenomInput);
        }

        if (emailValue === '') {
            setErrorFor(emailInput, 'Email ne peut pas être vide');
            return false;
        } else if (!isValidEmail(emailValue)) {
            setErrorFor(emailInput, 'Entrez une adresse email valide');
            return false;
        } else {
            setSuccessFor(emailInput);
        }

        if (passwordValue === '') {
            setErrorFor(passwordInput, 'Mot de passe ne peut pas être vide');
            return false;
        } else if (passwordValue.length < 6) {
            setErrorFor(passwordInput, 'Le mot de passe doit avoir au moins 6 caractères');
            return false;
        } else {
            setSuccessFor(passwordInput);
        }

        return true;
    }

    function setErrorFor(input, message) {
        const formControl = input.parentElement;
        const errorMessage = formControl.querySelector('small');

        errorMessage.innerText = message;
        formControl.className = 'input-icon error';
    }

    function setSuccessFor(input) {
        const formControl = input.parentElement;
        formControl.className = 'input-icon success';
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (validateForm()) {
            form.submit();
        }
    });
});
