import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { processChatMessages } from "./logic/process-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../app-config";
import TommyClient from "../tommy-client";

export const Reply: Command = {
    name: "reply",
    description: "Reply to convo.",
    run: async (client: TommyClient, interaction: ChatInputCommandInteraction) => {
        
        const content:string  = await processChatMessages(interaction.channelId, client);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 