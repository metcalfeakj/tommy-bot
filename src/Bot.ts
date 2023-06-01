import * as dotenv from 'dotenv'
import { Client, Partials, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import message from "./listeners/message";
import interactionCreate from './listeners/interactionCreate';
import connection from './database/Connection';
import ExecutionTimestamp from './handlers/execution-timestamp';

const lastRunExecution = new ExecutionTimestamp('./lastRunTime');
const lastRunExecutionDate: Date = lastRunExecution.initializeExecutionTimestamp();

function formatDate(date: Date): string {
    let day = ("0" + date.getDate()).slice(-2);
    let month = ("0" + (date.getMonth() + 1)).slice(-2);
    let year = date.getFullYear();
  
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
  
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
  

dotenv.config();
const startMessage:string = `🤖 Tommy Bot initialised at ${formatDate(lastRunExecutionDate)} 🕰️
Model: ${process.env.MODEL} 
Max Tokens: ${process.env.MAX_TOKENS} 🔢
Temperature: ${process.env.TEMPERATURE} 🌡️
Seed: ${process.env.SEED} 🌱
Starting message: ${process.env.BEGIN} 🚀
`


const discord_token = process.env.DISCORD_TOKEN

console.log("Bot is starting...");

const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

const database = connection;
database.authenticate();
database.sync();
ready(client, startMessage);
interactionCreate(client);
message(client,database, lastRunExecutionDate);
client.login(discord_token);