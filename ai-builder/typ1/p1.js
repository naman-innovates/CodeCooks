document.getElementById('generateButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    const promptInput = document.getElementById('prompt').value.trim();
    const loadingIndicator = document.getElementById('loadingIndicator');
    const errorMessage = document.getElementById('errorMessage');
    const generatedContent = document.getElementById('generatedContent');
    const codeOutput = document.getElementById('codeOutput');
    const previewFrame = document.getElementById('previewFrame');

    // Clear previous output
    loadingIndicator.classList.add('hidden');
    errorMessage.classList.add('hidden');
    generatedContent.classList.add('hidden');
    codeOutput.textContent = '';
    previewFrame.src = '';

    if (!promptInput) {
        errorMessage.textContent = 'Please enter a description for your website.';
        errorMessage.classList.remove('hidden');
        return;
    }

    // Show loading indicator
    loadingIndicator.classList.remove('hidden');

    // Simulate generating code
    setTimeout(() => {
        loadingIndicator.classList.add('hidden');

        // Example generated code (replace with actual generation logic)
        const generatedCode = `<html>
            <head><title>${promptInput}</title></head>
            <body><h1>Welcome to your new website based on "${promptInput}"!</h1></body>
        </html>`;

        // Display generated code
        codeOutput.textContent = generatedCode;

        // Create a preview
        const blob = new Blob([generatedCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;

        // Trigger animations
        document.querySelector('.prompt-area').classList.add('prompt-animation');
        generatedContent.classList.remove('hidden');
        generatedContent.classList.add('fade-in');
    }, 2000); // Simulate a delay for code generation
});
