import * as dotenv from 'dotenv'
import { Client, Partials, GatewayIntentBits } from "discord.js";
import ready from "./listeners/ready";
import message from "./listeners/message";
import interactionCreate from './listeners/interactionCreate';

dotenv.config()

const discord_token = process.env.DISCORD_TOKEN

console.log("Bot is starting...");

const client = new Client({
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages]
});

ready(client);
interactionCreate(client);
message(client);

client.login(discord_token);