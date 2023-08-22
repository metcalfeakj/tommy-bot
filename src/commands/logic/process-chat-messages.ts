import ChatMessages from '../../models/chat-messages';
import TommyClient from '../../tommy-client';

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const processChatMessage = async (chatMessage: ChatMessages, client: TommyClient): Promise<string> => {
    let res: string = '';
    try {
        const response = await client.openai.createChatCompletion({
            model: client.config.model || "gpt-3.5-turbo",
            messages: chatMessage.getAllMessages(),
            max_tokens: Number(client.config.maxTokens) || 4096,
            temperature: Number(client.config.temperature) || 0.7,
            n: 1
        });
        const { choices } = response.data || { choices: [] };
        const generatedMessage = choices[0].message?.content;
        if ((generatedMessage) && generatedMessage !== ''){
            chatMessage.addMessage('assistant', generatedMessage);
        res = generatedMessage?.slice(0, 1999) || "Error retreiving response.";
        }
        else {
            res = 'Error retreiving response.';
            chatMessage.addMessage('assistant', 'Error retreiving response.');
        }
        
        

    } catch { } finally { //na
        return res;
     }
    await delay(3000);

}


export const processChatMessages = async (channelId: string, client: TommyClient): Promise<string> => {

    try {
        const chatMessage = client.chatMessagesCollection.getChatMessagesInstance(channelId);
        if (chatMessage) {
        const response = await processChatMessage(chatMessage,client)
        return response;
        }else {
            return 'Not found.'
        }
        
    } catch (e) {
        console.error('Error fetching current time.',e);
        return 'Error fetching current time';
    }

}