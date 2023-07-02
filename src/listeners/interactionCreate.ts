import { ChatInputCommandInteraction, Client, Interaction } from "discord.js";
import { Commands } from "../Commands";
import ChatMessagesCollection from "../models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { AppConfig } from "../config";

export default (client: Client, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommand(client, interaction, chatMessagesCollection, config, openai);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction: ChatInputCommandInteraction, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        interaction.followUp({ content: "An error has occurred" });
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction, chatMessagesCollection, config, openai);
}; 