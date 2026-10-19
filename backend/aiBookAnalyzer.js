require("dotenv").config();

const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ==========================================
// MINEPTHE AI BOOK ANALYZER
// ==========================================

async function analyzeBookImage(imageData) {

    if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not configured.");
    }

    const response = await client.responses.create({

        model: "gpt-4.1-mini",

        input: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        text: `
You are the MINEPTHE book verification AI.

Analyze the provided book image.

Try to identify ONLY information that is actually visible
or reasonably readable from the image.

Return these fields:

title
author
subject
language
isbn

Rules:

1. Do not invent information.
2. If a field cannot be detected, return null.
3. A wrong guess is worse than null.
4. Use the visible book cover or book pages as evidence.
5. If the image is not a book or the information is unclear,
   return null for the unknown fields.
6. Return ONLY valid JSON.
`
                    },
                    {
                        type: "input_image",
                        image_url: imageData
                    }
                ]
            }
        ]
    });


    const text = response.output_text;

    let book;

    try {
        book = JSON.parse(text);
    } catch (error) {

        console.error(
            "AI returned invalid JSON:",
            text
        );

        book = {
            title: null,
            author: null,
            subject: null,
            language: null,
            isbn: null
        };
    }


    return {
        success: true,

        book: {
            title: book.title || null,
            author: book.author || null,
            subject: book.subject || null,
            language: book.language || null,
            isbn: book.isbn || null
        },

        message: "Book image analyzed successfully."
    };
}


module.exports = {
    analyzeBookImage
};

