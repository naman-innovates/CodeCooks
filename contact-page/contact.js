let captchaText = '';

function generateCaptcha() {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    captchaText = '';

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font style
    ctx.font = '28px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';

    // Generate random string
    for (let i = 0; i < 6; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Add noise
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
    }

    // Draw text
    ctx.fillText(captchaText, 15, 35);
}

function validateForm(e) {
    e.preventDefault();
    const userInput = document.getElementById('captchaInput').value;
    if (userInput === captchaText) {
        alert('Form submitted successfully!');
        document.getElementById('contactForm').reset();
        generateCaptcha();
    } else {
        alert('Incorrect CAPTCHA. Please try again.');
        generateCaptcha();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
    document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);
    document.getElementById('contactForm').addEventListener('submit', validateForm);
});