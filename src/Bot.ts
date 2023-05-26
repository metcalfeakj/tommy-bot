import { checkLastRunTimeFile } from './lastRunTime';
import * as dotenv from 'dotenv'
import { Client, Partials, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import message from "./listeners/message";
import interactionCreate from './listeners/interactionCreate';
import connection from './database/Connection';
import { MessageTable } from './database/models';


const lastModifiedDateTime = checkLastRunTimeFile();
console.log(`Stored last modified datetime variable: ${lastModifiedDateTime}`);


dotenv.config()

const discord_token = process.env.DISCORD_TOKEN

console.log("Bot is starting...");

const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

const database = connection;
database.authenticate();
database.sync();
ready(client);
interactionCreate(client);
message(client,database, lastModifiedDateTime);
client.login(discord_token);