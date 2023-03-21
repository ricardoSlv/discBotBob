"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const discord_js_1 = require("discord.js");
const client = new discord_js_1.Client();
const interaction_1 = __importDefault(require("./src/interaction"));
const command_1 = __importDefault(require("./src/command"));
client.on('ready', () => {
    var _a;
    console.log(`${(_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.username} has logged in`);
});
client.on('message', (message) => {
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
