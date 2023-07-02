import axios from 'axios';
import ChatMessagesCollection from '../../models/chat-messages-collection';
import ChatMessages from '../../models/chat-messages';
import { ChatMessagesTable } from '../../models/chat-messages-table';

export const saveChatMessages = async (channelId: string, chatMessagesCollection: ChatMessagesCollection): Promise<string> => {

    try {
        const dump = await chatMessagesCollection.saveChatMessagesInstance(channelId) || 
        'Error getting dump';

        if (dump) {
          await ChatMessagesTable.upsert({ channelId: channelId, serializedData: dump });
        }
        chatMessagesCollection.getChatMessagesInstance(channelId)?.clearMessages();

        return dump;
    } catch (e) {
        console.error('Error fetching current time.',e);
        return 'Error fetching current time';
    }

}