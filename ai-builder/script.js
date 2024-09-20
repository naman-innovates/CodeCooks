const form = document.getElementById('websiteForm');
const promptInput = document.getElementById('prompt');
const generateButton = document.getElementById('generateButton');
const showCodeButton = document.getElementById('showCodeButton');
const generatedContent = document.getElementById('generatedContent');
const preview = document.getElementById('preview');
const codeContainer = document.getElementById('codeContainer');
const codeOutput = document.getElementById('codeOutput');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

let generatedHtml = '';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    generateButton.disabled = true;
    loadingIndicator.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    generatedContent.classList.add('hidden');
    codeContainer.classList.add('hidden');

    try {
        const response = await fetch('/generate-website', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: promptInput.value }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate website');
        }

        const data = await response.json();
        generatedHtml = data.content;

        preview.innerHTML = DOMPurify.sanitize(generatedHtml);
        generatedContent.classList.remove('hidden');
    } catch (error) {
        console.error('Error generating website:', error);
        errorMessage.textContent = 'An error occurred while generating the website. Please try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        generateButton.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
});

showCodeButton.addEventListener('click', () => {
    codeOutput.textContent = generatedHtml;
    codeContainer.classList.remove('hidden');
});