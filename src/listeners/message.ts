import { Client, Message } from "discord.js";

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        console.log(`${message.author}: ${message.content}`)
    });
};
