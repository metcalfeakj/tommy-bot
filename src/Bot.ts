import { Partials, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import message from "./listeners/message";
import interactionCreate from './listeners/interactionCreate';
import connection from './database/Connection';
import ExecutionTimestamp from './events/execution-timestamp';
import config from './app-config';
import ChatMessagesCollection, { ChatMessagesConfig } from "./models/chat-messages-collection";
import { ChannelConfigsTable } from "./database/models";
import { Configuration, OpenAIApi } from "openai";
import Ticker from './Ticker';
import TommyClient from "./tommy-client";
import audit from "./listeners/audit";
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
  return chatMessagesConfigs
}


async function main() {

  // Init the Last Execution Run Date
  const lastRunExecution = new ExecutionTimestamp('./lastRunTime');
  const lastRunExecutionDate: Date = lastRunExecution.initializeExecutionTimestamp();

  // Connect to Sequelize and sync up models
  connection.authenticate();
  connection.sync();

  // Retrieve saved channel configs
  const chatMessagesConfigs = await initializeChatMessagesCollection();

  // Init openai
  const openai = new OpenAIApi(new Configuration({
    apiKey: config.openaiApiKey
  }));

  // Init TommyClient
  TommyClient.initialize({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember],
    intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildMembers]
  }, config, connection, new ChatMessagesCollection(chatMessagesConfigs), openai, lastRunExecutionDate);

  // Grab singleton
  const client = TommyClient.getInstance();


  ready(client);

  interactionCreate(client);
  setInterval(() => Ticker(client), 3000);
  audit(client);
  // logger(client);
  message(client);
  client.login(config.discordToken);
}

main().catch(error => {
  console.error("An error occurred:", error);
});