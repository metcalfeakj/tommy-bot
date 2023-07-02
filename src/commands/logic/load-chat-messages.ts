import axios from 'axios';
import ChatMessagesCollection from '../../models/chat-messages-collection';
import ChatMessages from '../../models/chat-messages';
import { ChatMessagesTable } from '../../models/chat-messages-table';

export const loadChatMessages = async (channelId: string, chatMessagesCollection: ChatMessagesCollection): Promise<string> => {

    try {
        const dump = await ChatMessagesTable.findOne({ where: { channelId: channelId } });

        if (dump) {
            chatMessagesCollection.getChatMessagesInstance(channelId)?.clearMessages();
            chatMessagesCollection.loadChatMessagesInstance(channelId, dump.serializedData);
            return 'Loaded save state.';
        } else{
            return 'Save state not found.';
        }
        
    } catch (e) {
        console.error('Error fetching current time.',e);
        return 'Error fetching current time';
    }

}