import ChatMessagesCollection, { ChatMessagesConfig } from '../../models/chat-messages-collection';
import { ChannelConfigsTable } from '../../database/models';
import TommyClient from '../../tommy-client';
export const reloadChannelConfigs = async (client: TommyClient): Promise<string> => {

    try {
        const channelConfigs: ChannelConfigsTable[] = await ChannelConfigsTable.findAll();


        if (channelConfigs) {
            const chatMessagesConfigs: ChatMessagesConfig[] = channelConfigs.map(config => ({
                channelId: config.channelId,
                persistentRole: config.persistentRole,
                persistentContent: config.persistentContent,
                totalMessageLength: config.totalMessageLength,
                sentient: config.sentient,
            }));
            client.chatMessagesCollection = new ChatMessagesCollection(chatMessagesConfigs);
            
            return 'Cleared bot memory and reloaded new config.';
        } else{
            return 'Save state not found.';
        }
        
    } catch (e) {
        console.error('Error reloading bot channel configs.',e);
        return 'Error reloading bot channel configs.';
    }

}
