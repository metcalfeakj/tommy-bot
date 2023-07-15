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
  private lastDateChanged: Date;
  private processed: boolean;
  private sentient: boolean;

  constructor(
    persistentRole: string,
    persistentContent: string,
    totalMessageLength: number,
    sentient: boolean,
  ) {
    const initialMessage = {
      role: persistentRole as ChatCompletionRequestMessage['role'],
      content: persistentContent,
    };
    this.messages = [initialMessage];
    this.totalCharacterCounter = new TotalCharacterCounter(JSON.stringify(initialMessage).length);
    this.totalMessageLength = totalMessageLength;
    this.lastDateChanged = new Date();
    this.processed = true;
    this.sentient = sentient;
  }

  addMessage(role: string, content: string) {
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
    this.updateLastChangedDate();
  }

  /**
   * Clears all messages, leaving only the initial message in the array.
   * This is intentional behavior to maintain a persistent initial message.
   */
  clearMessages(): void {
    this.messages = this.messages.slice(0, 1);
    this.totalCharacterCounter = new TotalCharacterCounter(this.messages[0]?.content?.length ?? 0);
    this.updateLastChangedDate();
  }

  appendBuffer(chatBuffer: ChatCompletionRequestMessage[]) {
    for (const message of chatBuffer) {
      this.addMessage(message.role, message.content || '');
    }
  }

  getAllMessages(): ChatCompletionRequestMessage[] {
    return this.messages;
  }

  getAllMessagesJSON(): string {
    return JSON.stringify(this.messages);
  }

  updateLastChangedDate(): void {
    const currentDateTime = new Date();
    this.lastDateChanged.setDate(currentDateTime.getDate());
    this.lastDateChanged.setTime(currentDateTime.getTime());
  }

  setProcessed(isProcessed: boolean): void{
    this.processed = isProcessed;
  }

  getProcessed(): boolean{
    return this.processed;
  }

  getLastChangedDate(): Date {
    return this.lastDateChanged;
  }

  setSentient(isSentient: boolean): void{
    this.sentient = isSentient;
  }

  getSentient(): boolean {
    return this.sentient;
  }

  serialize(): string {
    return JSON.stringify(this);
  }

  static deserialize(serialized: string): ChatMessages {
    const obj = JSON.parse(serialized);

    const chatMessages = new ChatMessages(
      obj.messages[0].role,
      obj.messages[0].content,
      obj.totalMessageLength,
      obj.sentient,
    );

    chatMessages.messages = obj.messages;
    chatMessages.totalCharacterCounter = new TotalCharacterCounter(obj.totalCharacterCounter.totalCount);
    chatMessages.lastDateChanged = new Date(obj.lastDateChanged);
    chatMessages.processed = obj.processed;

    return chatMessages;
  }
}

export default ChatMessages;
