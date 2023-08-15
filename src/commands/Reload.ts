import { ApplicationCommandOptionType, ChatInputCommandInteraction, Client } from "discord.js";
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
    options: [{
        name: 'persona',
        type: ApplicationCommandOptionType.String,
        description: 'Set the bots persona',
        required: false
    }],
    run: async (client: TommyClient, interaction: ChatInputCommandInteraction) => {
        const persona = interaction.options.getString('persona');
        // const content:string  = await processChatMessages(interaction.channelId, client);
        const content:string = await reloadChannelConfigs(client, interaction.channelId,persona || '');
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 