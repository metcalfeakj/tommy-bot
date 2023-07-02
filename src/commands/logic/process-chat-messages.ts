import axios from 'axios';
import ChatMessagesCollection from '../../models/chat-messages-collection';
import ChatMessages from '../../models/chat-messages';
import { ChatMessagesTable } from '../../models/chat-messages-table';
import { Client, TextChannel } from 'discord.js';
import { OpenAIApi } from 'openai';
import { AppConfig } from '../../config';
import { channel } from 'diagnostics_channel';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const processChatMessage = async (config: AppConfig,chatMessage: ChatMessages, openai: OpenAIApi, client: Client): Promise<string> => {
    let res: string = '';
    try {
        const response = await openai.createChatCompletion({
            model: config.model || "gpt-3.5-turbo",
            messages: chatMessage.getAllMessages(),
            max_tokens: Number(config.maxTokens) || 4096,
            temperature: Number(config.temperature) || 0.7,
            n: 1
        });
        const { choices } = response.data || { choices: [] };
        const generatedMessage = choices[0].message?.content;
        chatMessage.addMessage('assistant', generatedMessage || 'Error retreiving response.');
        res = generatedMessage?.slice(0, 1999) || "Error retreiving response.";
        

    } catch { } finally { //na
        return res;
     }
    await delay(3000);

}


export const processChatMessages = async (channelId: string, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi, client: Client): Promise<string> => {

    try {
        const chatMessage = chatMessagesCollection.getChatMessagesInstance(channelId);
        if (chatMessage) {
        const response = await processChatMessage(config, chatMessage,openai,client)
        return response;
        }else {
            return 'Not found.'
        }
        
    } catch (e) {
        console.error('Error fetching current time.',e);
        return 'Error fetching current time';
    }

}