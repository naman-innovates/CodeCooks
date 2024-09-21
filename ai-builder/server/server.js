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

app.get('/generate-website', async (req, res) => {
    const { prompt } = req.query;

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    try {
        const response = await axios.post(OLLAMA_API_URL, {
            model: 'llama2',
            prompt: `Generate an HTML website based on the following description: ${prompt}. Include inline CSS for styling and any necessary JavaScript. The response should be a complete, valid HTML document.`,
            stream: true
        }, { responseType: 'stream' });

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            lines.forEach(line => {
                if (line.trim() !== '') {
                    const parsedData = JSON.parse(line);
                    if (parsedData.response) {
                        res.write(`data: ${JSON.stringify({ content: parsedData.response })}\n\n`);
                    }
                }
            });
        });

        response.data.on('end', () => {
            res.write('event: done\ndata: null\n\n');
            res.end();
        });
    } catch (error) {
        console.error('Error generating website:', error);
        res.write(`data: ${JSON.stringify({ error: 'An error occurred while generating the website' })}\n\n`);
        res.end();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});