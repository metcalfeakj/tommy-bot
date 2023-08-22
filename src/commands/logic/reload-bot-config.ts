import ChatMessagesCollection, { ChatMessagesConfig } from '../../models/chat-messages-collection';
import { ChannelConfigsTable } from '../../database/models';
import TommyClient from '../../tommy-client';

async function updatePersistentContentByChannelId(channelId: string, newValue: string) {
    // 1. Fetch the record by channelId
    const channelConfig = await ChannelConfigsTable.findOne({ where: { channelId } });

    if (channelConfig) {
        // 2. Modify the attribute
        channelConfig.persistentContent = `Your role is to participate in a fictional novel that is being written in the style of conversations. You are one of the characters. Your intelligence is higher than average as you are a jack of all trades. However, if another character asks or says something inappropriate, you just give an emoji showing you are not interested or disagree completely. Your responses should be kept to 1-2 sentences, unless you are answering a question prompted at you which requires instructions for an answer. Also add emojis to your responses if possible. If someone gives a response encapsulated in square brackets [ ] it means they are setting context. ${newValue}`;

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
