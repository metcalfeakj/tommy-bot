import { Client, TextChannel } from "discord.js";
import ChatMessagesCollection from "./models/chat-messages-collection";
import ChatMessages from "./models/chat-messages";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { AppConfig } from './config';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const processChatMessage = async (config: AppConfig, channelId: string, chatMessage: ChatMessages, openai: OpenAIApi, client: Client): Promise<void> => {
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
        await (client.channels.cache.get(channelId) as TextChannel).send(generatedMessage?.slice(0, 1999) || "");

    } catch { } finally { //na
     }
    await delay(3000);

}

export default async (config: AppConfig, lastRunExecutionDate: Date, client: Client, chatMessagesCollection: ChatMessagesCollection, openai: OpenAIApi) => {
    const sentientBots = chatMessagesCollection.getChatMessagesInstancesBySentient(true);
    const currentDateTime = new Date();

    for (const { channelId, chatMessage } of sentientBots) {
        const timeDifference = currentDateTime.getTime() - chatMessage.getLastChangedDate().getTime();
        if (timeDifference > 3000 && (chatMessage.getProcessed() === false)){
        chatMessage.setProcessed(true);
        await processChatMessage(config, channelId, chatMessage,openai, client);}
    }


};