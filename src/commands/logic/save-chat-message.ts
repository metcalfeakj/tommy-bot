import ChatMessagesCollection from '../../models/chat-messages-collection';
import { ChatMessagesTable } from '../../models/chat-messages-table';

export const saveChatMessages = async (channelId: string, chatMessagesCollection: ChatMessagesCollection): Promise<string> => {

        let dump = chatMessagesCollection.saveChatMessagesInstance(channelId) || 
        'Error getting dump';

          await ChatMessagesTable.upsert({ channelId: channelId, serializedData: dump });
          dump = 'Saved!'
        chatMessagesCollection.getChatMessagesInstance(channelId)?.clearMessages();
        return dump;


}