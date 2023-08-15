import ChatMessagesCollection, { ChatMessagesConfig } from '../../models/chat-messages-collection';
import { ChannelConfigsTable } from '../../database/models';
import TommyClient from '../../tommy-client';

async function updatePersistentContentByChannelId(channelId: string, newValue: string) {
    // 1. Fetch the record by channelId
    const channelConfig = await ChannelConfigsTable.findOne({ where: { channelId } });

    if (channelConfig) {
        // 2. Modify the attribute
        channelConfig.persistentContent = newValue;

        // 3. Save the modified record
        await channelConfig.save();
    } else {
        console.log('Record not found for channelId:', channelId);
    }
}


export const reloadChannelConfigs = async (client: TommyClient, channelId: string, persona: string): Promise<string> => {

    try {
        if (persona !== '') {
            await updatePersistentContentByChannelId(channelId, persona);

        }
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
