import { Client, ClientOptions } from 'discord.js';
import { AppConfig } from './app-config';
import ChatMessagesCollection from "./models/chat-messages-collection";
import { OpenAIApi } from "openai";
import { Sequelize } from "sequelize-typescript";

class TommyClient extends Client {
    config: AppConfig;
    database: Sequelize;
    openai: OpenAIApi;
    lastRunExecutionDate: Date;
    counter: number;
    lastCounterAuthor: string;

    // Step 1: Create a private property
    private _chatMessagesCollection: ChatMessagesCollection;

    // Step 2: Modify the public property to use the getter and setter
    public get chatMessagesCollection(): ChatMessagesCollection {
        return this._chatMessagesCollection;
    }

    public set chatMessagesCollection(value: ChatMessagesCollection) {
        // Step 3: Inside the setter, you can add any logic you want for setting the property
        if (value) {
            this._chatMessagesCollection = value;
        } else {
            throw new Error("Invalid value for chatMessagesCollection");
        }
    }
    private static instance: TommyClient;

    private constructor(
        clientOptions: ClientOptions,
        config: AppConfig,
        database: Sequelize,
        chatMessagesCollection: ChatMessagesCollection,
        openai: OpenAIApi,
        lastRunExecutionDate: Date,
        counter: number,
        lastCounterAuthor: string
    ) {
        super(clientOptions); // Pass the clientOptions to the base class constructor
        this.config = config;
        this.database = database;
        this._chatMessagesCollection = chatMessagesCollection;
        this.openai = openai;
        this.lastRunExecutionDate = lastRunExecutionDate;
        this.counter = counter;
        this.lastCounterAuthor = lastCounterAuthor;
    }

    public static initialize(
        clientOptions: ClientOptions,
        config: AppConfig,
        database: Sequelize,
        chatMessagesCollection: ChatMessagesCollection,
        openai: OpenAIApi,
        lastRunExecutionDate: Date,
        counter: number,
        lastCounterAuthor: string
    ) {
        if (!this.instance) {
            this.instance = new TommyClient(clientOptions, config, database, chatMessagesCollection, openai, lastRunExecutionDate, counter, lastCounterAuthor);
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
