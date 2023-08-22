
import { Message } from "discord.js";
import { messageHandler } from "../events/message-handler";
import TommyClient from "../tommy-client";


export default (client: TommyClient): void => {
    client.on("messageCreate", async (message: Message) => {
        const doc = await messageHandler(message, client);

    });
}
