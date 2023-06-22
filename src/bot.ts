import dotenv from "dotenv";
import path from "path";
import BotClient from "@/structures/BotClient";
import registerCommands from "@/loaders/registerCommands";
import registerListeners from "@/loaders/registerListeners";

dotenv.config();

const token = process.env.BOT_TOKEN;

global.src = path.resolve(__dirname);

console.log("Bot is starting...");

const client = new BotClient({
    intents: ["Guilds", "GuildMessages"],
});

registerCommands(client);
registerListeners(client);

client.login(token);
