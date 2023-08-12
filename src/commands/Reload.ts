import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"
import ChatMessagesCollection from "../models/chat-messages-collection";
import ChatMessages from "../models/chat-messages";
import { processChatMessages } from "./logic/process-chat-messages";
import { OpenAIApi } from "openai";
import { AppConfig } from "../app-config";
import TommyClient from "../tommy-client";
import { reloadChannelConfigs } from "./logic/reload-bot-config";

export const Reload: Command = {
    name: "reload",
    description: "Reload ChannelConfig.",
    run: async (client: TommyClient, interaction: ChatInputCommandInteraction) => {
        
        // const content:string  = await processChatMessages(interaction.channelId, client);
        const content:string = await reloadChannelConfigs(client);
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 