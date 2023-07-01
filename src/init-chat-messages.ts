import { ChannelConfigsTable } from "./database/models";
import { ChatMessagesConfig } from "./models/chat-messages-collection";
const chatMessagesConfig = async ():Promise<ChatMessagesConfig[]> => {


    // Fetch all records from ChannelConfigsTable
    const channelConfigs: ChannelConfigsTable[] = await ChannelConfigsTable.findAll();

    // Convert the records into ChatMessagesConfig format
    const chatMessagesConfigs: ChatMessagesConfig[] = channelConfigs.map(config => ({
        channelId: config.channelId,
        persistentRole: config.persistentRole,
        persistentContent: config.persistentContent,
        totalMessageLength: config.totalMessageLength,
        sentient: config.sentient,
    }));


    console.log('ChatMessagesCollection has been successfully populated');
    return chatMessagesConfigs;


};
export default chatMessagesConfig;