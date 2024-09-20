const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

app.post('/generate-website', async (req, res) => {
    try {
        const { prompt } = req.body;

        const ollamaResponse = await axios.post(OLLAMA_API_URL, {
            model: 'llama2',
            prompt: `Generate an HTML website based on the following description: ${prompt}. Include inline CSS for styling. The response should be a complete, valid HTML document.`,
            stream: false
        });

        const generatedContent = ollamaResponse.data.response;

        res.json({ content: generatedContent });
    } catch (error) {
        console.error('Error generating website:', error);
        res.status(500).json({ error: 'An error occurred while generating the website' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});