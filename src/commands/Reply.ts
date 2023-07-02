import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { processChatMessages } from "./logic/process-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../config";

export const Reply: Command = {
    name: "reply",
    description: "Reply to convo.",
    run: async (client: Client, interaction: ChatInputCommandInteraction, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi) => {
        
        const content:string  = await processChatMessages(interaction.channelId,chatMessagesCollection,config, openai, client);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 