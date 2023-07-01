import ChatMessages from './chat-messages'; 

export interface ChatMessagesConfig {
  channelId: string;
  persistentRole: string;
  persistentContent: string;
  totalMessageLength: number;
  sentient: boolean;
}

class ChatMessagesCollection {
  private chatMessagesMap: Map<string, ChatMessages>;

  constructor(configs?: ChatMessagesConfig[]) { // Make configs parameter optional
    this.chatMessagesMap = new Map<string, ChatMessages>();

    // If configs parameter is provided, initialize the instances
    if (configs) {
      for (const config of configs) {
        this.initializeChatMessagesInstance(config);
      }
    }
  }

  initializeChatMessagesInstance(config: ChatMessagesConfig) {
    this.chatMessagesMap.set(config.channelId, new ChatMessages(config.persistentRole, config.persistentContent, config.totalMessageLength, config.sentient));
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

  getChatMessagesInstancesBySentient(isSentient: boolean): {channelId: string, chatMessage: ChatMessages}[] {
    const matchingInstances: {channelId: string, chatMessage: ChatMessages}[] = [];

    for (const [channelId, chatMessage] of this.chatMessagesMap.entries()) {
        if (chatMessage.getSentient() === isSentient) {
            matchingInstances.push({ channelId, chatMessage });
        }
    }

    return matchingInstances;
}

}

// Export the ChatMessagesCollection class as a module.
export default ChatMessagesCollection;