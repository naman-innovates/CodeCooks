const form = document.getElementById("websiteForm");
const promptInput = document.getElementById("prompt");
const generateButton = document.getElementById("generateButton");
const codeOutput = document.getElementById("codeOutput");
const previewFrame = document.getElementById("previewFrame");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");

let generatedHtml = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  generateButton.disabled = true;
  loadingIndicator.classList.remove("hidden");
  errorMessage.classList.add("hidden");
  codeOutput.textContent = "";
  previewFrame.srcdoc = "";
  generatedHtml = "";

  const originalPrompt = promptInput.value;
  const enhancedPrompt = `Generate a single HTML file by giving just the code and no extra text, make css in <styles></styles> and javascript in <script></script> for the following: ${originalPrompt}`;

  try {
    const response = await fetch(`/generate-website?prompt=${encodeURIComponent(enhancedPrompt)}`);
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            generatedHtml += data.content;
            codeOutput.textContent = generatedHtml;
            updatePreview();
          }
        }
      }
    }

    generateButton.disabled = false;
    loadingIndicator.classList.add("hidden");
  } catch (error) {
    console.error("Error generating website:", error);
    errorMessage.textContent = "An error occurred while generating the website. Please try again.";
    errorMessage.classList.remove("hidden");
    generateButton.disabled = false;
    loadingIndicator.classList.add("hidden");
  }
});

function updatePreview() {
  const sanitizedHtml = DOMPurify.sanitize(generatedHtml);
  previewFrame.srcdoc = sanitizedHtml;
}