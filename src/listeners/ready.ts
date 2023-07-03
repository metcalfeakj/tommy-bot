import { Client, TextChannel } from "discord.js";
import { Commands } from "../Commands";
import TommyClient from "../tommy-client";

export default (client: TommyClient): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application) {
            return;
        }
        await client.application.commands.set(Commands);
        console.log(`${client.user.username} is online`);
        // await (client.channels.cache.get('1113746443480600676') as TextChannel).send(startMessage);

    });
}; 