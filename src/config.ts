import dotenv from 'dotenv';
import { config as loadEnvVariables } from 'dotenv';

// Load system environment variables
loadEnvVariables();

// Load environment variables from .env file if not set in system environment
if (!process.env.DISCORD_TOKEN ||
    !process.env.MARIADB_USERNAME ||
    !process.env.MARIADB_PASSWORD ||
    !process.env.MARIADB_HOST ||
    !process.env.MARIADB_DATABASE ||
    !process.env.OPENAI_API_KEY ||
    !process.env.SEED ||
    !process.env.BEGIN ||
    !process.env.MODEL ||
    !process.env.MAX_TOKENS ||
    !process.env.TEMPERATURE) {
  dotenv.config();
}

// Define your configuration logic
interface AppConfig {
  discordToken: string;
  mariadbUsername: string;
  mariadbPassword: string;
  mariadbHost: string;
  mariadbDatabase: string;
  openaiApiKey: string;
  seed: string;
  begin: string;
  model: string;
  maxTokens: string;
  temperature: string;
}

const config: AppConfig = {
  discordToken: process.env.DISCORD_TOKEN!,
  mariadbUsername: process.env.MARIADB_USERNAME!,
  mariadbPassword: process.env.MARIADB_PASSWORD!,
  mariadbHost: process.env.MARIADB_HOST!,
  mariadbDatabase: process.env.MARIADB_DATABASE!,
  openaiApiKey: process.env.OPENAI_API_KEY!,
  seed: process.env.SEED!,
  begin: process.env.BEGIN!,
  model: process.env.MODEL!,
  maxTokens: process.env.MAX_TOKENS!,
  temperature: process.env.TEMPERATURE!
};

export default config;
