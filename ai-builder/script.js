const form = document.getElementById('websiteForm');
const promptInput = document.getElementById('prompt');
const generateButton = document.getElementById('generateButton');
const codeOutput = document.getElementById('codeOutput');
const previewFrame = document.getElementById('previewFrame');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');

let generatedHtml = '';
let eventSource;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    generateButton.disabled = true;
    loadingIndicator.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    codeOutput.textContent = '';
    previewFrame.srcdoc = '';

    try {
        eventSource = new EventSource(`/generate-website?prompt=${encodeURIComponent(promptInput.value)}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.content) {
                generatedHtml += data.content;
                codeOutput.textContent = generatedHtml;
                updatePreview();
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            generateButton.disabled = false;
            loadingIndicator.classList.add('hidden');
        };

        eventSource.addEventListener('done', () => {
            eventSource.close();
            generateButton.disabled = false;
            loadingIndicator.classList.add('hidden');
        });
    } catch (error) {
        console.error('Error generating website:', error);
        errorMessage.textContent = 'An error occurred while generating the website. Please try again.';
        errorMessage.classList.remove('hidden');
        generateButton.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
});

function updatePreview() {
    const sanitizedHtml = DOMPurify.sanitize(generatedHtml);
    previewFrame.srcdoc = sanitizedHtml;
}