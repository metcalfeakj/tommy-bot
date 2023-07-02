import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { saveChatMessages } from "./logic/save-chat-message";
import { OpenAIApi } from "openai";
import { AppConfig } from "../config";

export const Save: Command = {
    name: "save",
    description: "Save current chat.",
    run: async (client: Client, interaction: ChatInputCommandInteraction, chatMessagesCollection: ChatMessagesCollection,  config: AppConfig, openai: OpenAIApi) => {
        const content:string  = await saveChatMessages(interaction.channelId,chatMessagesCollection);

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 