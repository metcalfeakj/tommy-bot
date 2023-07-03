import { ChatInputCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import ChatMessagesCollection from "./models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { AppConfig } from "./app-config";
import TommyClient from "./tommy-client";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: TommyClient, interaction: ChatInputCommandInteraction) => void;
} 