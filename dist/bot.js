"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMessages
    ]
});
const interaction_1 = __importDefault(require("./src/interaction"));
const command_1 = __importDefault(require("./src/command"));
client.on(discord_js_1.Events.ClientReady, () => {
    console.log(`${client?.user?.username} has logged in`);
});
client.on(discord_js_1.Events.MessageCreate, (message) => {
    if (message.author.bot === true)
        return;
    console.log(`${message.author.tag} said: ${message.content}`);
    try {
        (0, interaction_1.default)(message);
        (0, command_1.default)(message);
    }
    catch (error) {
        message.reply(`An error has occurred processing the message ${error}`);
    }
});
client.login(process.env.BOT_TOKEN);
