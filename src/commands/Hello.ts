import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../Command";
import { getCurrentTime } from "./logic/getCurrentTime"

export const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const content:string  = await getCurrentTime();

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 