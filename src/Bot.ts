import { Client, Partials, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import message from "./listeners/message";
import interactionCreate from './listeners/interactionCreate';
import connection from './database/Connection';
import ExecutionTimestamp from './events/execution-timestamp';
import config from './config';
import ChatMessagesCollection, {ChatMessagesConfig} from "./models/chat-messages-collection";
import { ChannelConfigsTable } from "./database/models";
import { Configuration, OpenAIApi} from "openai";
import Ticker from './Ticker';



const lastRunExecution = new ExecutionTimestamp('./lastRunTime');
const lastRunExecutionDate: Date = lastRunExecution.initializeExecutionTimestamp();
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

  
console.log("Bot is starting...");



async function initializeChatMessagesCollection() {
  const channelConfigs: ChannelConfigsTable[] = await ChannelConfigsTable.findAll();

  // Convert the records into ChatMessagesConfig format
  const chatMessagesConfigs: ChatMessagesConfig[] = channelConfigs.map(config => ({
      channelId: config.channelId,
      persistentRole: config.persistentRole,
      persistentContent: config.persistentContent,
      totalMessageLength: config.totalMessageLength,
      sentient: config.sentient,
  }));

  // Initialize ChatMessagesCollection with the converted records
  return new ChatMessagesCollection(chatMessagesConfigs);
}


async function main() {
  const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

const database = connection;
database.authenticate();
database.sync();
  const chatMessagesCollection = await initializeChatMessagesCollection();
  ready(client);
interactionCreate(client);
setInterval(() => Ticker(config, lastRunExecutionDate, client,chatMessagesCollection,openai), 3000);
message(client,database,chatMessagesCollection);
client.login(config.discordToken);

}

main().catch(error => {
  console.error("An error occurred:", error);
});