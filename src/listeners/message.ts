
import { Client, Message } from "discord.js";
import { Sequelize } from "sequelize-typescript";
import ChatMessagesCollection from '../models/chat-messages-collection';
import { messageHandler } from "../events/message-handler";


export default (client: Client, database: Sequelize, chatMessagesCollection: ChatMessagesCollection): void => {
    client.on("messageCreate", async (message: Message) => {
        const doc = await messageHandler(message, client, database, chatMessagesCollection);

    });
}
