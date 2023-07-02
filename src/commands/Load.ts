import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { loadChatMessages } from "./logic/load-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../config";

export const Load: Command = {
    name: "load",
    description: "Load saved chat.",
    run: async (client: Client, interaction: ChatInputCommandInteraction, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi) => {
        
        const content:string  = await loadChatMessages(interaction.channelId,chatMessagesCollection);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 