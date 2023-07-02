import { ChatInputCommandInteraction, ChatInputApplicationCommandData, Client } from "discord.js";
import ChatMessagesCollection from "./models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { AppConfig } from "./config";

export interface Command extends ChatInputApplicationCommandData {
    run: (client: Client, interaction: ChatInputCommandInteraction, chatMessagesCollection: ChatMessagesCollection, config: AppConfig, openai: OpenAIApi) => void;
} 