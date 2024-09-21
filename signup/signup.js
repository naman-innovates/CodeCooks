document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const passwordValue = password.value.trim();

        if (email && passwordValue) {
            // Here you would typically send the data to your server for processing
            console.log('Sign-up successful');
            console.log('Email:', email);
            console.log('Password:', passwordValue);

            // Redirect to the home page
            window.location.href = "../home-page/home.html";
        } else {
            console.log('Please fill in both email and password fields');
            // You might want to show an error message to the user here
        }
    });
});