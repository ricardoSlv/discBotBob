"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interaction_1 = require("./src/interaction");
var command_1 = require("./src/command");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var discord_js_1 = require("discord.js");
var client = new discord_js_1.Client();
client.on('ready', function () {
    var _a;
    console.log("".concat((_a = client === null || client === void 0 ? void 0 : client.user) === null || _a === void 0 ? void 0 : _a.username, " has logged in"));
});
client.on('message', function (message) {
    if (message.author.bot === true)
        return;
    console.log("".concat(message.author.tag, " said: ").concat(message.content));
    try {
        (0, interaction_1.default)(message);
        (0, command_1.default)(message);
    }
    catch (error) {
        message.reply("An error has occurred processing the message ".concat(error));
    }
});
client.login(process.env.BOT_TOKEN);
