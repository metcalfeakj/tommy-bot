import { Sequelize } from 'sequelize-typescript';
import { CassetteTapeTable } from '../database/models';
import { Client, Message, TextChannel, DMChannel } from "discord.js";
import ChatMessagesCollection from '../models/chat-messages-collection';
import ChatMessages from '../models/chat-messages';

interface messageEvent  {
    authorId: string;
    authorName: string;
    serverId: string | null;
    serverName: string | null;
    channelId: string;
    channelName: string | null;
    messageContent: string;
    messageDate: Date;
    isBot: boolean;
}

export const messageHandler = async (message: Message, client: Client, database: Sequelize, chatMessagesCollection: ChatMessagesCollection): Promise<messageEvent> => {
    const document = mapMessage(message, client);
    await upsertMessage(database,document as any);

    await addToChatMessages(chatMessagesCollection, document);

    // Get ChatMessages instance by channel id.
    

    return document;
};

const mapMessage = (message: Message, client: Client): messageEvent => {
    const author = message.author;
    const channel = message.channel as DMChannel | TextChannel;

    let serverId: string | null = null;
    let serverName: string | null = null;
    let channelName: string | null = null;

    if (channel instanceof TextChannel) {
        serverId = message.guild?.id || null;
        serverName = message.guild?.name || null;
        channelName = channel.name;
    }

    const document: messageEvent = {
        authorId: author.id,
        authorName: author.username,
        serverId: serverId,
        serverName: serverName,
        channelId: channel.id,
        channelName: channelName,
        messageContent: message.content,
        messageDate: message.createdAt,
        isBot: message.author.bot
    }

    return document;
};

const upsertMessage = async (database: Sequelize, document: messageEvent): Promise<void> => {
    try {
        await CassetteTapeTable.create(document as any);
    }
    catch (e) {
        console.log('Error - failed to save message to database.', e);
        throw e;
    }
}

const addToChatMessages = async (chatMessagesCollection: ChatMessagesCollection, document: messageEvent) => {
    const channelId = document.channelId;
    const chatMessages = chatMessagesCollection.getChatMessagesInstance(channelId);
        if (chatMessages){
            if (document.isBot === true){
                //chatMessages.addMessage('assistant', document.messageContent);
            } else{
                chatMessages.addMessage('user', `User ${document.authorName} said: ${document.messageContent}`);
                chatMessages.setProcessed(false);
            }
        }
}