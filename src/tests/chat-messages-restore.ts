
import { ChatMessagesTable } from '../models/chat-messages-table';
import ChatMessagesCollection from '../models/chat-messages-collection';
import connection from '../database/Connection';

connection.authenticate();
connection.sync();

(async () => {
  const configs = [
    { channelId: '1', persistentRole: 'user', persistentContent: 'Hello', totalMessageLength: 1000 },
    { channelId: '2', persistentRole: 'bot', persistentContent: 'Hi', totalMessageLength: 1000 }
  ];

  const chatMessagesCollection = new ChatMessagesCollection(configs);

  // Primary keys to process
  const primaryKeys = ['1', '2'];

  // Loop to save instances to the database
  for (const key of primaryKeys) {
    const serialized = chatMessagesCollection.saveChatMessagesInstance(key);
    if (serialized) {
      await ChatMessagesTable.upsert({ channelId: key, serializedData: serialized });
    }
    chatMessagesCollection.getChatMessagesInstance(key)?.clearMessages();
  }

  // Loop to load instances from the database
  for (const key of primaryKeys) {
    const result = await ChatMessagesTable.findOne({ where: { channelId: key } });
    if (result) {
      chatMessagesCollection.loadChatMessagesInstance(key, result.serializedData);
      console.log(`Restored instance with primary key ${key}`);
    }
  }

})().catch((error) => {
  console.error('Error:', error);
});