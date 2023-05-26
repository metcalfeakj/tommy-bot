import { Sequelize } from "sequelize-typescript";
import * as dotenv from 'dotenv';
import {MessageTable, CassetteTapeTable} from './models';
dotenv.config()

const connection = new Sequelize({
  dialect: "mariadb",
  host: process.env.MARIADB_HOST,
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  logging: false,
  models: [MessageTable, CassetteTapeTable],
  sync: { alter: true },
});

export default connection;