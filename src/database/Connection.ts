import { Sequelize } from "sequelize-typescript";
import {CassetteTapeTable, ChannelConfigsTable} from './models';
import { ChatMessagesTable } from "../models/chat-messages-table";
import config from '../app-config';

const connection = new Sequelize({
  dialect: "mariadb",
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  host: config.mariadbHost,
  username: config.mariadbUsername,
  password: config.mariadbPassword,
  database: config.mariadbDatabase,
  logging: false,
  models: [CassetteTapeTable, ChatMessagesTable, ChannelConfigsTable],
  sync: { alter: true },
});

export default connection;