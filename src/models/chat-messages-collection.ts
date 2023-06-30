import ChatMessages from './chat-messages'; 

interface ChatMessagesConfig {
  channelId: string;
  persistentRole: string;
  persistentContent: string;
  totalMessageLength: number;
}

class ChatMessagesCollection {
  private chatMessagesMap: Map<string, ChatMessages>;

  constructor(configs: ChatMessagesConfig[]) {
    this.chatMessagesMap = new Map<string, ChatMessages>();

    for (const config of configs) {
      this.initializeChatMessagesInstance(config);
    }
  }

  initializeChatMessagesInstance(config: ChatMessagesConfig) {
    this.chatMessagesMap.set(config.channelId, new ChatMessages(config.persistentRole, config.persistentContent, config.totalMessageLength));
  }

  getChatMessagesInstance(channelId: string): ChatMessages | undefined {
    return this.chatMessagesMap.get(channelId);
  }

  addChatMessagesInstance(config: ChatMessagesConfig) {
    if (!this.chatMessagesMap.has(config.channelId)) {
      this.initializeChatMessagesInstance(config);
    } else {
      console.log(`ChatMessages instance with key ${config.channelId} already exists.`);
    }
  }
  
  saveChatMessagesInstance(channelId: string): string | undefined {
    const chatMessagesInstance = this.chatMessagesMap.get(channelId);
    if (chatMessagesInstance) {
      return chatMessagesInstance.serialize();
    }
    return undefined;
  }

  loadChatMessagesInstance(channelId: string, serialized: string): void {
    const chatMessagesInstance = ChatMessages.deserialize(serialized);
    this.chatMessagesMap.set(channelId, chatMessagesInstance);
  }
}

// Export the ChatMessagesCollection class as a module.
export default ChatMessagesCollection;