import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { loadChatMessages } from "./logic/load-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../app-config";
import TommyClient from "../tommy-client";

export const Load: Command = {
    name: "load",
    description: "Load saved chat.",
    run: async (client: TommyClient, interaction: ChatInputCommandInteraction) => {
        
        const content:string  = await loadChatMessages(interaction.channelId,client.chatMessagesCollection);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 