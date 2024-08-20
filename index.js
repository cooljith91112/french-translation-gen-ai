const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require('path');
const marked = require('marked');
require('dotenv').config();

const express = require("express");
const multer = require("multer");
const bodyParser = require('body-parser');
const upload = multer();
const app = express();
const port = 3000;

let genAIModel = initGenAI();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post("/translate", upload.single("translatej"), async (req, res) => {
    try {
        const data = String(req.file.buffer);
        const dataToTranslate = JSON.parse(data);
        const genAIResponse = await promptGenAI(dataToTranslate);
        res.send(genAIResponse);
        // res.send("# Marked in the browser\n\nRendered by **marked**.")
    } catch (e) {
        res.send(`<b>Not a valid JSON file.</b>`)
    }
});

app.listen(port, () => {
    console.log(`French Translator is running at ${port}`);
});



function initGenAI() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });

        return model;
    } catch (e) {
        console.log("Error Initializing Generative AI");
    }
}

async function promptGenAI(enTranslations) {
    const translationPromptText = JSON.stringify(enTranslations);
    const prompt = `Translate the following key-value pairs to CA-fr. Provide your confidence level out of 10. 10 for 100% confidence and 0 for not confident at all.
${translationPromptText}

Response should be neatly arranged so that it can be rendered and hightlighted to an html
`;

    const result = await genAIModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
}