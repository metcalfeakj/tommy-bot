import { ChatInputCommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "../Commands";
import ChatMessagesCollection from "../models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { AppConfig } from "../app-config";
import TommyClient from "../tommy-client";

export default (client: TommyClient): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: TommyClient, interaction: ChatInputCommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
}; 