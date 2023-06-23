import { ChatCompletionRequestMessage } from 'openai';

class TotalCharacterCounter {
  private totalCount: number = 0;

  constructor(initialCount: number) {
    this.totalCount = initialCount;
  }

  add(message: ChatCompletionRequestMessage) {
    this.totalCount += JSON.stringify(message).length;
  }

  subtract(message: ChatCompletionRequestMessage) {
    this.totalCount -= JSON.stringify(message).length;
  }

  getTotalCount() {
    return this.totalCount;
  }
}

class ChatMessages {
  private messages: ChatCompletionRequestMessage[];
  private totalCharacterCounter: TotalCharacterCounter;
  private totalMessageLength: number;

  constructor(
    persistentRole: string,
    persistentContent: string,
    totalMessageLength: number
  ) {
    const initialMessage = {
      role: persistentRole as ChatCompletionRequestMessage['role'],
      content: persistentContent,
    };
    this.messages = [initialMessage];
    this.totalCharacterCounter = new TotalCharacterCounter(JSON.stringify(initialMessage).length);
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

    // Determine the length of the JSON string representation of the message
    const messageLength = JSON.stringify(message).length;

    // Loop to remove messages from beginning if total length exceeds limit
    while (this.totalCharacterCounter.getTotalCount() + messageLength > this.totalMessageLength && this.messages.length > 1) {
      const removedMessage = this.messages.splice(1, 1)[0] as ChatCompletionRequestMessage;
      this.totalCharacterCounter.subtract(removedMessage);
    }

    this.messages.push(message);
    this.totalCharacterCounter.add(message);
  }

  /**
   * Clears all messages, leaving only the initial message in the array.
   * This is intentional behavior to maintain a persistent initial message.
   */
  clearMessages() {
    this.messages = this.messages.slice(0, 1);
    this.totalCharacterCounter = new TotalCharacterCounter(this.messages[0].content.length);
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
