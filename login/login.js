document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const loginForm = document.getElementById('loginForm');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === 'codecooks@gmail.com' && password === 'codecooks') {
            window.location.href = '../home-page/home.html';
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Add functionality for Google and GitHub login buttons if needed
    document.querySelector('.google-btn').addEventListener('click', function() {
        alert('Google login functionality to be implemented');
    });

    document.querySelector('.github-btn').addEventListener('click', function() {
        alert('GitHub login functionality to be implemented');
    });
});