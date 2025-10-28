import { createPartFromUri, createUserContent, GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

import { TEST_PROMPT } from "./prompts";

dotenv.config();

class Gemini {
    ai: GoogleGenAI;
    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env["GEMINI_API_KEY"]
        });
    }

    async test(q: number) {
        const pdf = await this.ai.files.upload({
            file: "C:\\Users\\zgjun\\Projects\\noto\\ai\\test.txt",
        });
        const res = await this.ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                createUserContent([
                    TEST_PROMPT(q),
                    createPartFromUri(pdf.uri as string, pdf.mimeType as string)
                ])
            ]
        });

        return res.text;
    }
}

export default Gemini;