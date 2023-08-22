import { Client, TextChannel } from "discord.js";
import ChatMessagesCollection from "./models/chat-messages-collection";
import ChatMessages from "./models/chat-messages";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import { AppConfig } from './app-config';
import TommyClient from "./tommy-client";

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const processChatMessage = async (channelId: string, chatMessage: ChatMessages, client: TommyClient): Promise<void> => {
    try {
        if (client.openai && client.config) {
            await (client.channels.cache.get(channelId) as TextChannel).sendTyping();
            const response = await client.openai.createChatCompletion({
                model: client.config.model,
                messages: chatMessage.getAllMessages(),
                max_tokens: Number(client.config.maxTokens) || 4096,
                temperature: Number(client.config.temperature) || 0.7,
                n: 1
            });
            const { choices } = response.data || { choices: [] };
            const generatedMessage = choices[0].message?.content;
            // chatMessage.addMessage('assistant', generatedMessage || 'Error retreiving response.');
            await (client.channels.cache.get(channelId) as TextChannel).send(generatedMessage?.slice(0, 1999) || "");
        }
    } catch { } finally { //na
    }
    await delay(3000);

}

export default async (client: TommyClient) => {
    const sentientBots = client.chatMessagesCollection.getChatMessagesInstancesBySentient(true);
    const currentDateTime = new Date();

    for (const { channelId, chatMessage } of sentientBots) {
        const timeDifference = currentDateTime.getTime() - chatMessage.getLastChangedDate().getTime();
        if (timeDifference > 3000 && (chatMessage.getProcessed() === false)) {
            chatMessage.setProcessed(true);
            await processChatMessage(channelId, chatMessage, client);
        }
    }


};