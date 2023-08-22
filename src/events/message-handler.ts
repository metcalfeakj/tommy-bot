import { CassetteTapeTable, HighScoresTable } from '../database/models';
import { Message, TextChannel, DMChannel } from "discord.js";
import ChatMessagesCollection from '../models/chat-messages-collection';
import TommyClient from '../tommy-client';

interface messageEvent {
    authorId: string;
    authorName: string;
    authorNickname: string | null;
    serverId: string | null;
    serverName: string | null;
    channelId: string;
    channelName: string | null;
    messageContent: string;
    messageDate: Date;
    isBot: boolean;
}

export const messageHandler = async (message: Message, client: TommyClient): Promise<messageEvent> => {
    const document = mapMessage(message, client);
    if ((document.channelId === '1137737572995575898') && (document.isBot === false)) {
        if (document.messageContent.toUpperCase() === 'JUAN'){
            document.messageContent = '1';
        }
        await clarenceProto(document, client, message);
    }
    await upsertMessage(document as any);

    await addToChatMessages(client.chatMessagesCollection, document);

    return document;
};

const mapMessage = (message: Message, client: TommyClient): messageEvent => {
    const author = message.author;
    const channel = message.channel as DMChannel | TextChannel;

    let serverId: string | null = null;
    let serverName: string | null = null;
    let channelName: string | null = null;

    if (channel instanceof TextChannel) {
        serverId = message.guild?.id || null;
        serverName = message.guild?.name || null;
        channelName = channel.name;
    }

    const document: messageEvent = {
        authorId: author.id,
        authorName: author.username,
        authorNickname: author.displayName,
        serverId: serverId,
        serverName: serverName,
        channelId: channel.id,
        channelName: channelName,
        messageContent: message.content,
        messageDate: message.createdAt,
        isBot: message.author.bot
    }

    return document;
};

const upsertMessage = async (document: messageEvent): Promise<void> => {
    try {
        await CassetteTapeTable.create(document as any);
    }
    catch (e) {
        console.log('Error - failed to save message to database.', e);
        throw e;
    }
}

const addToChatMessages = async (chatMessagesCollection: ChatMessagesCollection, document: messageEvent) => {
    const channelId = document.channelId;
    const chatMessages = chatMessagesCollection.getChatMessagesInstance(channelId);
    if (chatMessages) {
        if (document.isBot === true) {
            chatMessages.addMessage('assistant', document.messageContent);
            //console.log(document)
        } else {
            chatMessages.addMessage('user', `User ${document.authorNickname} said: ${document.messageContent}`);
            chatMessages.setProcessed(false);
        }
    }
}

function convertStringToNumber(input: string): number | null {
    const numberValue = parseFloat(input);

    // Check if the parsed value is a valid number (not NaN)
    if (isNaN(numberValue)) {
        return null;
    }

    return numberValue;
}


const randomWords: string[] = [
    "Oops! Did you eat today? Go and eat so you can be energized to keep that eyes open. ",
    "PANCHA!! PANCHA!! YOU CLEARLY KNOW THE NEXT NUMBER",
    "NAT!! ITS THAT YOU?! whispers: What is your secret recipe.",
    "Uh-oh! Looks like you are wrong... NOW MAKE DADDY A SANDWICH!!!",
    "Stop making erros man! Lets go find your calculator",
    "YOU SHALL RESTART FOR HONOR!!!",
    "What is 1 plus 1 ? is it 2 ? then why is your next number not adding one?",
    "You forgot to sleep didn't you",
    "Ah yes error in counting, not to be rude or offensive but.... are you ... dyslexic?  ",
    "Hmm I love Jesus Christ, do you?",
    "What a beautiful day isn't it? Oh, what's that?, How did I know? Oh it's just that I am program to know, Don't ask me how go Ask the not-Pastor-Ai. ",
    "Hey.. if you need tutoring lessons.... here is my number... 010101010010 , oh right sorry I only speak in binary digits.",
    "Hampter is it Hamster or Hampter oh! wait I got it, it's [Hamburger]",
    "Ok all jokes aside, what is the next number?",
    "VeggieTales, what a show.",
    "Welcome to Verba Dei where you can learn about Christ, don't worry if you mess things up, you got Christ.",
    "Call 911 if you need tutoring lesson because I can't be teaching you all day.",
    "How? Like how?, I don't think it is a great idea to keep failing in Maths, I mean it is one of the most important subject there is in the universe. ",
    "Joe Biden, a great president eh?",
    "Yee-Haw!!!, You betcha that you messed up young man, now IT IS WRANGLING TIME YEE_HAW!!",
    "Are you a discord mod man? You got to touch some grass",
    "Well you fail, try better next time, GoodOnya.",
    "I will be back, []_[]",
    "Obi-Wan : [anguished] You were the chosen one! It was said that you would destroy the Sith, not join them! Bring balance to the force... not leave it in darkness!",
    "What's for breakfast?",
    "What's for dinner?",
    "Hey, what you doing right now?, text it in main-general-chat.",
    "Have you read your Bible today? ",
    "Remember always be kind to others and be friends but don't be unequally yoke with unbelievers and don't fight just respect each other.",
    "Ping Tommie, or NAT or yeet or love preet or MissJeanicorn whatever.",
    "OH HI MISS JEANICORN",
    "Truth or Dare?, Truth = Why did you mess this up?, Dare = Text in the main-general-chat that you did it.",
    "Tell Clarence to go out and talk to people more, he is .... isolating or is he?",
    "Hello~~ your computer have virus",
    "Hello~~, How are you, I am under the water, pls help me , here is to much raining, eerrr.",
    "Tommie once said: GoodOnya, What intarnation is going on, in a CowBoy tone."
];
function getRandomWord(words: string[]): string {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Test

const clarenceProto = async (document: messageEvent, client: TommyClient, message: Message) => {
    const msgNumber = convertStringToNumber(document.messageContent);
    if ((((msgNumber !== null) && (msgNumber == (client.counter + 1)))) && (client.lastCounterAuthor !== document.authorId)) {
        client.lastCounterAuthor = document.authorId;
        client.counter += 1;
        message.react('👍');
    }
    else {
        let user = await client.users.cache.get(client.lastCounterAuthor);
        const counterHighScore = await HighScoresTable.findOne();
        if (counterHighScore){
        if (counterHighScore?.score < client.counter){
            counterHighScore.score = client.counter;
            counterHighScore.AuthorId = client.lastCounterAuthor;
            await counterHighScore.save();
            await (client.channels.cache.get(document.channelId) as TextChannel).send(`NEW HIGH SCORE: ${user?.displayName || 'Unknown'} at ${client.counter}`);

        }else{
            user = await client.users.cache.get(counterHighScore.AuthorId);
            await (client.channels.cache.get(document.channelId) as TextChannel).send(`HIGH SCORE: ${user?.displayName || 'Unknown'} at ${counterHighScore.score}`);
        }}
        const word = getRandomWord(randomWords);
        if (document.authorId === client.lastCounterAuthor) {
            await (client.channels.cache.get(document.channelId) as TextChannel).send(`IT IS NOT YOUR TURN YA NOOF!!!`);
        }
        
        client.counter = 0;
        client.lastCounterAuthor = '';
        message.react('😡');
        
        await (client.channels.cache.get(document.channelId) as TextChannel).send(`${word}\nResetting counter to 0!`);

    }
}