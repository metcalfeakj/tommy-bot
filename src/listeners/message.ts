
import { Client, Message, TextChannel } from "discord.js";
import { Optional } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { MessageTable} from "../database/models";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import * as dotenv from 'dotenv';
import { summariseMessages } from "./summariseMessages";



dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const chatHistory: ChatCompletionRequestMessage[] = []
const openai = new OpenAIApi(configuration);

const getResponse = async (userInput: string) => {
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
}

const getSummary = async () => {
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
}


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

const upsertMessage = async (database: Sequelize, record: Optional<any, string> | undefined): Promise<void> => {
    try {
        const newRecord = database.models.MessageTable.build(record);
        await newRecord.save();
    }
    catch (e)
    {console.log('Error - failed to save message to database.',e)}
}

export default (client: Client, database: Sequelize, lastRunDate:Date): void => {
    client.on("messageCreate", async (message: Message) => {
        const channelName = await getChannelName(client, message);
        const authorName = await getAuthorName(client, message);
        const record = {server_name: message.guild?.name, server_channel: channelName, author: authorName, message: message.content};
        // console.log(`${message.guild?.name} - ${channelName} - ${authorName}: ${message.content}`);
        await upsertMessage(database, record);
        await summariseMessages(database, 5, lastRunDate, openai);
        // if (!message.author.bot){
        //     const response = await getResponse(message.content);
        //     if (response) {
        //         await message.reply(response);
        //     }
        // }
    });
// have a counter that goes up every time the messageCreate event occurs. After 100, it will call the getSummary function and then reset the counter.
}
