import { Client, ClientOptions } from 'discord.js';
import { AppConfig } from './app-config';
import ChatMessagesCollection from "./models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { Sequelize } from "sequelize-typescript";

class TommyClient extends Client {
    config: AppConfig;
    database: Sequelize;
    chatMessagesCollection: ChatMessagesCollection;
    openai: OpenAIApi;
    lastRunExecutionDate: Date;

    private static instance: TommyClient;

    private constructor(
        clientOptions: ClientOptions,
        config: AppConfig,
        database: Sequelize,
        chatMessagesCollection: ChatMessagesCollection,
        openai: OpenAIApi,
        lastRunExecutionDate: Date
    ) {
        super(clientOptions); // Pass the clientOptions to the base class constructor
        this.config = config;
        this.database = database;
        this.chatMessagesCollection = chatMessagesCollection;
        this.openai = openai;
        this.lastRunExecutionDate = lastRunExecutionDate;
    }

    public static initialize(
        clientOptions: ClientOptions,
        config: AppConfig,
        database: Sequelize,
        chatMessagesCollection: ChatMessagesCollection,
        openai: OpenAIApi,
        lastRunExecutionDate: Date
    ) {
        if (!this.instance) {
            this.instance = new TommyClient(clientOptions, config, database, chatMessagesCollection, openai, lastRunExecutionDate);
        }
    }

    public static getInstance(): TommyClient {
        if (!this.instance) {
            throw new Error("TommyClient must be initialized before getting the instance.");
        }
        return this.instance;
    }
}

export default TommyClient;
