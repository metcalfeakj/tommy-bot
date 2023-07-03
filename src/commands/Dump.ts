import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { loadChatMessages } from "./logic/load-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../app-config";
import TommyClient from "../tommy-client";

export const Dump: Command = {
    name: "dump",
    description: "Dump chat buffer.",
    run: async (client: TommyClient, interaction: ChatInputCommandInteraction) => {
        
        let content:string  = 'No buffer.'
        const chatMessage = client.chatMessagesCollection.getChatMessagesInstance(interaction.channelId);
        if (chatMessage) {
            content = chatMessage.getAllMessagesJSON();
            }
            
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 