import { Sequelize } from 'sequelize-typescript';
import { CassetteTapeTable, MessageTable } from '../database/models';
import { Op } from 'sequelize';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import * as fs from 'fs';

const getSummary = async (chatHistory: ChatCompletionRequestMessage[], openai: OpenAIApi) => {
    await new Promise(resolve => setTimeout(resolve, 5000));

    chatHistory.unshift({role: 'system', content: 'Here is the last 5 most recent chat messages. Give a one paragraph summary of what the conversation might be about.'})
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


export const summariseMessages = async (database: Sequelize, limit: number, lastRunDate: Date, openai:OpenAIApi): Promise<void> => {
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
            const summary = await getSummary(completionRequestMessages,openai);
            const record = {chat_history: JSON.stringify(chatHistory), summary: summary, model: 'gpt-3.5-turbo'}
            await database.getRepository(CassetteTapeTable).create(record);
            console.log('Recorded to cassette tape')
            chatHistory.length = 0;
        }
    } catch (e) {
        console.log('error', e)
    }

}
