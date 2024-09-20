let captchaText;

// Function to generate a random string CAPTCHA
function generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const captchaLength = 6; // Set length of CAPTCHA text
    captchaText = '';

    // Loop to generate a random string of 6 characters
    for (let i = 0; i < captchaLength; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Render the CAPTCHA on the canvas
    const canvas = document.getElementById("captchaCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font style
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";

    // Draw random lines for distortion
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Draw the CAPTCHA text
    ctx.fillText(captchaText, 20, 30);
}

// Function to validate the CAPTCHA on form submission
function validateCaptcha() {
    const userAnswer = document.getElementById("captchaInput").value;

    // Check if the user input matches the generated CAPTCHA
    if (userAnswer === captchaText) {
        return true; // CAPTCHA is correct, allow form submission
    } else {
        alert("Incorrect CAPTCHA. Please try again.");
        generateCaptcha(); // Regenerate a new CAPTCHA
        return false; // Block form submission
    }
}

// Generate CAPTCHA when the page loads
window.onload = generateCaptcha;
