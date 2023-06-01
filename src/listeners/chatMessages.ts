import { ChatCompletionRequestMessage } from 'openai';

class ChatMessages {
  private messages: ChatCompletionRequestMessage[];
  private totalCharacterCount: number;
  private totalMessageLength: number;

  constructor(
    persistentRole: string,
    persistentContent: string,
    totalMessageLength: number
  ) {
    this.messages = [
      {
        role: persistentRole as ChatCompletionRequestMessage['role'],
        content: persistentContent,
      },
    ];
    this.totalCharacterCount = persistentContent.length;
    this.totalMessageLength = totalMessageLength;
  }

  addMessage(role: string, content: string) {
    if (content.length > 2000) {
      throw new Error('Content length exceeds the limit of 2000 characters.');
    }

    const message: ChatCompletionRequestMessage = {
      role: role as ChatCompletionRequestMessage['role'],
      content,
    };
    const messageLength = content.length;

    while (this.totalCharacterCount + messageLength > this.totalMessageLength) {
      const removedMessage = this.messages.pop() as ChatCompletionRequestMessage;
      this.totalCharacterCount -= removedMessage.content.length;
    }

    this.messages.push(message);
    this.totalCharacterCount += messageLength;
  }

  clearMessages() {
    this.messages = this.messages.slice(0, 1);
    this.totalCharacterCount = this.messages[0].content.length;
  }

  appendBuffer(chatBuffer: ChatCompletionRequestMessage[]) {
    for (const message of chatBuffer) {
      this.addMessage(message.role, message.content);
    }
  }

  getAllMessages() {
    return this.messages;
  }
}

export default ChatMessages;