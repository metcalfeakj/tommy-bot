import { Sequelize } from 'sequelize-typescript';
import { CassetteTapeTable, MessageTable } from '../database/models';
import { Op } from 'sequelize';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import * as fs from 'fs';
import { Client, TextChannel } from 'discord.js';

const getSummary = async (chatHistory: ChatCompletionRequestMessage[], openai: OpenAIApi) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    chatHistory.unshift({ role: 'system', content: 'Generate one sentence summary of the conversation.' })
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 0.7,
        n: 1
    })
    const { choices } = response.data || { choices: [] };
    const generatedMessage = choices[0].message?.content;
    return generatedMessage;
}

const getResponse = async (chatHistory: ChatCompletionRequestMessage[], openai: OpenAIApi) => {
    chatHistory.unshift({ role: 'system', content: 'Respond to this conversation pretending to be a twitch streamer and zoomer and use a lot of emojis. Just give the actual meesage itself.' })
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 1.4,
        n: 1
    })
    const { choices } = response.data || { choices: [] };
    const generatedMessage = choices[0].message?.content;
    return generatedMessage;
}


export const summariseMessages = async (database: Sequelize, limit: number, lastRunDate: Date, openai: OpenAIApi, client: Client): Promise<void> => {
    try {
        let executionDate = new Date();
        console.log(lastRunDate)
        const messages = await database.getRepository(MessageTable).findAll<MessageTable>({
            where: {
                createdAt: {
                    [Op.gt]: lastRunDate
                }
            }, limit: limit, order: [['createdAt', 'DESC']]
        });
        const chatHistory = messages.map((message: MessageTable) => ({
            author: message.author,
            content: message.message,
        })).reverse();

        if (chatHistory.length > (limit - 1)) {
            lastRunDate.setDate(executionDate.getDate());
            lastRunDate.setTime(executionDate.getTime());
            fs.utimesSync('./.lastRunTime', lastRunDate, lastRunDate);
            console.log(`summariseMessages: Updated .lastRunTime file with datetime: ${lastRunDate}`);
            const completionRequestMessages: ChatCompletionRequestMessage[] = chatHistory.map((chatMessage) => {
                return {
                    role: 'user',
                    content: `${chatMessage.author} sent message: ${chatMessage.content}`
                };
            });
            const summary = await getSummary(completionRequestMessages, openai);
            const record = { chat_history: JSON.stringify(chatHistory), summary: summary, model: 'gpt-3.5-turbo' }
            await database.getRepository(CassetteTapeTable).create(record);
            console.log('Recorded to cassette tape')
            chatHistory.length = 0;
        }
        //     else if (chatHistory.length % 2 === 0){

        //         const dbSummaryMsg = await database.getRepository(CassetteTapeTable).findAll<CassetteTapeTable>({
        //             where: {
        //                 createdAt: {
        //                     [Op.gte]: lastRunDate
        //                 }
        //             }, limit: 1, order: [['createdAt', 'DESC']]
        //         });
        //         const summaryMsg = dbSummaryMsg[0].summary;
        //         const completionRequestMessages: ChatCompletionRequestMessage[] = chatHistory.map((chatMessage) => {
        //             return {
        //             role: 'user',
        //               content: `${chatMessage.author} sent message: ${chatMessage.content}`
        //             };
        //           });
        //           completionRequestMessages.unshift({role: 'system', content: `${summaryMsg}`});
        //           const botReply = await getResponse(completionRequestMessages,openai);
        //         await ( client.channels.cache.get('1050697616725389337') as TextChannel ).send(botReply|| "");
        // }
    } catch (e) {
        console.log('error', e)
    }

}
