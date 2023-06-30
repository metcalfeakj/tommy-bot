
import { Client, Message, TextChannel } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import * as dotenv from 'dotenv';
import { upsertMessage } from '../events/upsertMessage';
import ChatMessages from "../models/chat-messages";
import ChatMessagesCollection from '../models/chat-messages-collection';
import { messageHandler } from "../events/message-handler";

let halt: boolean = false;

dotenv.config();
const chatHistory: ChatCompletionRequestMessage[] = []
const chatBuffer: ChatCompletionRequestMessage[] = []
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY
}));
const chat = new ChatMessages('system', `${process.env.SEED}`, 11000);
// const records: Record[] = [];

/* const getResponse = async (userInput: string) => {
    chatHistory.push({ role: 'user', content: userInput });
    if (chatHistory.length > 5) {
        const data = await getSummary();
        chatHistory.shift();
    }
    chatHistory.unshift({role: 'system', content: 'Here is the last 5 most recent chat messages. Reply to the latest message while pretending to be a cowboy from texas.'})
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 0.7,
        n: 1
    })
    chatHistory.shift()
    const { choices } = response.data || { choices: [] };
    const generatedMessage = choices[0].message?.content;
    //console.log(generatedMessage)
    chatHistory.push({role: 'system', content: generatedMessage || 'Sorry, I did not understand that.'})
    //console.log(chatHistory);
    return generatedMessage;
} */

/* const getSummary = async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));

    chatHistory.unshift({role: 'system', content: 'Here is the last 5 most recent chat messages. Give a one sentence summary of what the conversation might be about.'})
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 0.7,
        n: 1
    })
    const { choices } = response.data || { choices: [] };
    const generatedMessage = choices[0].message?.content;
    console.log(generatedMessage)
    
    return generatedMessage;
} */


const getChannelName = async (client: Client, message: Message): Promise<string> => {
    try {
        const channel = await client.channels.fetch(message.channel.id);
        return (channel as TextChannel).name;

    } catch (e) {
        return "Unknown Channel";
    }
};

const getAuthorName = async (client: Client, message: Message): Promise<string> => {
    try {
        const author = await client.users.fetch(message.author);
        return author.username;

    } catch (e) {
        console.log('Error - failed retreiving author name.')
        return message.author.id;
    }
};

/* async function tickExecution(lastExecutionRun: Date, chatHistory: ChatCompletionRequestMessage[], chatBuffer: ChatCompletionRequestMessage[], client: Client) {
    const currentDateTime = new Date();
    const timeDifference = currentDateTime.getTime() - lastExecutionRun.getTime();

    if (timeDifference > 3000 && chatBuffer.length > 0 && !halt) {
        halt = true;

        chat.appendBuffer(chatBuffer)


        lastExecutionRun.setTime(lastExecutionRun.getTime())
        lastExecutionRun.setDate(lastExecutionRun.getDate())
    
        try {
        const response = await openai.createChatCompletion({
            model: process.env.MODEL || "gpt-3.5-turbo",
            messages: chat.getAllMessages(),
            max_tokens: Number(process.env.MAX_TOKENS) || 4096,
            temperature: Number(process.env.TEMPERATURE) || 0.7,
            n: 1
        })
        const { choices } = response.data || { choices: [] };
        const generatedMessage = choices[0].message?.content;
        chat.addMessage('system',`${generatedMessage}`)
        console.log(`JSON DUMP:\n${chat.getAllMessagesJSON()}\n`);
        await (client.channels.cache.get('1113746443480600676') as TextChannel).send(generatedMessage?.slice(0,1999) || "");

    
    }catch(e){console.log(e)
        await (client.channels.cache.get('1113746443480600676') as TextChannel).send("❌ ERROR - Resetting Message Buffer. Starting fresh.");}finally{

        chatBuffer.length = 0;
        halt = false;
        }
    }
}
 */
export default (client: Client, database: Sequelize, lastExecutionRun: Date): void => {
    // setInterval(() => tickExecution(lastExecutionRun, chatHistory, chatBuffer, client), 3000);
    client.on("messageCreate", async (message: Message) => {
        const doc = await messageHandler(message, client, database);
        console.log(doc);
       /*  const currentDateTime = new Date();
        lastExecutionRun.setDate(currentDateTime.getDate());
        lastExecutionRun.setTime(currentDateTime.getTime());
        const channelName = await getChannelName(client, message);
        const authorName = await getAuthorName(client, message);
        const record = { server_name: message.guild?.name, server_channel: channelName, author: authorName, message: message.content };
        if (channelName === 'talk-to-tommy') {
            await upsertMessage(database, record);
            // await summariseMessages(database, 5, lastExecutionRun, openai, client);
            if (message.content.length <= 1999 && !message.author.bot) {
                const chatMessagesInstance = ChatMessagesCollection.getChatMessagesInstance(`${message.channelId}`);
                
                if (chatMessagesInstance){
                    chatMessagesInstance?.addMessage('user', `${authorName}: ${message.content}`);
                    chatMessagesInstance?.setProcessed(false);
                };
            }

        } */
    });
}
