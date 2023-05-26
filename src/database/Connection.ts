import { Sequelize } from "sequelize-typescript";
import * as dotenv from 'dotenv';
import {MessageTable, CassetteTapeTable} from './models';
dotenv.config()

const connection = new Sequelize({
  dialect: "mariadb",
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  host: process.env.MARIADB_HOST,
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  logging: false,
  models: [MessageTable, CassetteTapeTable],
  sync: { force: true },
});

export default connection;