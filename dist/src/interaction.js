"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var sound_js_1 = require("./sound.js");
var status = {
    clockNotice: false,
    clockChannels: [null, null],
    hourNotice: null,
    halfHourNotice: null
};
function default_1(message) {
    var _a, _b, _c;
    var voiceChannel = (_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
    var textChannel = message.channel;
    switch (message.content) {
        case 'bob say hi':
            message.reply('Wtf is up!!');
            break;
        case 'bob say the n word':
            textChannel.send('N🧑🏿');
            break;
        case 'bob ride the wave':
            textChannel.send('🏄‍♂️ bruh');
            break;
        case 'bob start the clock':
            if (status.clockNotice === true) {
                message.reply("There's already a clock \uD83D\uDD52 running on Text: ".concat(status.clockChannels[0], " and Voice: ").concat(status.clockChannels[1]));
            }
            else if (voiceChannel) {
                status.clockChannels = [textChannel, voiceChannel];
                textChannel.send("Starting the clock \uD83D\uDD52 on Text: ".concat(textChannel, " and Voice: ").concat(voiceChannel));
                status.clockNotice = true;
                status.hourNotice = (0, sound_js_1.hourNotice)(textChannel, voiceChannel);
                status.halfHourNotice = (0, sound_js_1.halfHourNotice)(textChannel, voiceChannel);
            }
            break;
        case 'bob stop the clock':
            if (status.clockNotice === false) {
                message.reply("There's no clock 🕒 running");
            }
            else {
                textChannel.send('Die clock 🕒');
                status.clockNotice = false;
                (_b = status.hourNotice) === null || _b === void 0 ? void 0 : _b.stop();
                (_c = status.halfHourNotice) === null || _c === void 0 ? void 0 : _c.stop();
            }
            break;
        case 'bob help':
            var sounds = __spreadArray([], Object.keys(sound_js_1.soundMap), true).join(', ');
            message.reply("Available commands: \n        \uD83D\uDC44 Speech:\n        \u2001\u27A4 bob say hi \n        \u2001\u27A4 bob say the n word \n        \u2001\u27A4 bob ride the wave  \n        \n        \uD83D\uDD52 Clock: \n        \u2001\u27A4 bob start the clock  \n        \u2001\u27A4 bob stop the clock \n        \n        \uD83D\uDD0A Sounds: \n        \u2001\u27A4 bp + [".concat(sounds, "] \n        \n        \uD83D\uDCDD Quotes: \n        \u2001\u27A4 baq + Quote - Author (Add quote) \n        \u2001\u27A4 brq (Random Quote) \n        \u2001\u27A4 blq (List Quotes)\n        \n        \uD83C\uDFB5 Playlists\n        \u2001\u27A4 bapl + Icon - PlaylistName (Add playlist. Ex:\"bapl \uD83D\uDC35 - monkeySongs\") \n        \u2001\u27A4 baspl + PlaylistName - SongName - YoutubeLink (Add song to playlist. Ex:\"baspl monkeySongs - song1 - https://youtube.com/monkeysong \")\n        \u2001\u27A4 bupln + PlaylistName - NewPlaylistName (Update Playlist Name)\n        \u2001\u27A4 brspl + PlaylistName - SongName (Remove Song from Playlist)\n        \u2001\u27A4 blpl (List playlists) \n        \u2001\u27A4 bppls + PlaylistName (Play Playlist Shuffled)\n        \u2001\u27A4 bppl + PlaylistName (Play Playlist)\n        \u2001\u27A4 bpyl + YtbLink (Play Youtube Link)").replace(/   +/g, ''));
    }
}
exports.default = default_1;
