
import { Client, Message, TextChannel } from "discord.js";

const getChannelName = async (client: Client, message: Message): Promise<string> => {
    try {
        const channel = await client.channels.fetch(message.channel.id);
        return (channel as TextChannel).name;

    } catch (e) {
        return "Unknown Channel";
    }
};

const getAuthorName = async (client: Client, message: Message): Promise<string> => {
    try {    
        const author = await client.users.fetch(message.author);
        return author.username;
     
    } catch (e) {
        console.log('Error - failed retreiving author name.')
        return message.author.id;
    }
};

export default (client: Client): void => {
    client.on("messageCreate", async (message: Message) => {
        const channelName = await getChannelName(client, message);
        const authorName = await getAuthorName(client, message);
        console.log(`${message.guild?.name} - ${channelName} - ${authorName}: ${message.content}`);
    });
};
