import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv';

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const getResponse = async (userInput: string) => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: 'system', content: 'You are very blunt and straight to the point' }, { role: 'user', content: userInput }],
        max_tokens: 50,
        temperature: 0.7,
        n: 1,
        stop: ['\n']
    })
    const { choices } = response.data || { choices: [] };
    const generatedMessage = choices[0].message?.content;
    console.log(generatedMessage);
    return generatedMessage;
}

  getResponse('Are Italian people considered white?');