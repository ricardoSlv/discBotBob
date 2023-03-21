"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playYtbLink = exports.playPlaylist = exports.playYoutube = exports.halfHourNotice = exports.hourNotice = exports.soundMap = exports.isValidSound = void 0;
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const node_cron_1 = require("node-cron");
const sounds = ['gong', 'chingchong', 'bruh', 'die', 'bell', 'belldie', 'pocoto'];
function isValidSound(value) {
    return sounds.includes(value);
}
exports.isValidSound = isValidSound;
exports.soundMap = {
    gong: 'https://www.youtube.com/watch?v=r7oAsDWy6n4',
    chingchong: 'https://www.youtube.com/watch?v=8yKG9VncnBI',
    bruh: 'https://www.youtube.com/watch?v=2ZIpFytCSVc',
    die: 'https://www.youtube.com/watch?v=PtcHNvVooLQ',
    bell: 'https://www.youtube.com/watch?v=dNl4-w9ZrBs',
    belldie: 'https://www.youtube.com/watch?v=zDBrQWq82-Q',
    pocoto: 'https://www.youtube.com/shorts/NeNN1nDv_Bc'
};
function playBell(channel, rings) {
    return __awaiter(this, void 0, void 0, function* () {
        if (rings === 0) {
            setTimeout(() => {
                channel.leave();
            }, 500);
        }
        else {
            const connection = yield channel.join();
            connection
                .play((0, ytdl_core_1.default)('https://www.youtube.com/watch?v=dNl4-w9ZrBs', {
                filter: 'audioonly'
            }))
                .on('finish', () => playBell(channel, rings - 1));
        }
    });
}
function hourNotice(channel, voiceChannel) {
    return (0, node_cron_1.schedule)('0 * * * *', () => {
        const currHour = new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            hour12: false,
            timeZone: 'Europe/Lisbon'
        });
        channel.send(`It's ${currHour} o'clock 🕒`);
        if (voiceChannel) {
            playBell(voiceChannel, parseInt(currHour) % 12);
        }
    });
}
exports.hourNotice = hourNotice;
function halfHourNotice(channel, voiceChannel) {
    return (0, node_cron_1.schedule)('30 * * * *', () => {
        const currHour = new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            hour12: false,
            timeZone: 'Europe/Lisbon'
        });
        channel.send(`It's half past ${currHour} 🕒`);
        if (voiceChannel) {
            playBell(voiceChannel, 2);
        }
    });
}
exports.halfHourNotice = halfHourNotice;
function playYoutube(channel, link) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield channel.join();
        connection.play((0, ytdl_core_1.default)(link, { filter: 'audioonly' })).on('finish', () => setTimeout(() => {
            channel.leave();
        }, 500));
    });
}
exports.playYoutube = playYoutube;
function playPlaylist(channel, songs, shuffle, connection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection)
            connection = yield channel.join();
        if (songs.length === 0)
            setTimeout(() => {
                channel.leave();
            }, 500);
        else {
            const nextSong = shuffle ? Math.floor(Math.random() * songs.length) : 0;
            let nextSongs = [...songs];
            nextSongs.splice(nextSong, 1);
            connection
                .play((0, ytdl_core_1.default)(songs[nextSong].ytbLink, { filter: 'audioonly' }))
                .on('finish', () => setTimeout(() => {
                playPlaylist(channel, nextSongs, shuffle, connection);
            }, 500))
                .on('error', () => {
                setTimeout(() => {
                    channel.leave();
                }, 500);
            });
        }
    });
}
exports.playPlaylist = playPlaylist;
function playYtbLink(channel, ytblink) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield channel.join();
        connection
            .play((0, ytdl_core_1.default)(ytblink, { filter: 'audioonly' }))
            .on('finish', () => setTimeout(() => {
            channel.leave();
        }, 500))
            .on('error', () => {
            setTimeout(() => {
                channel.leave();
            }, 500);
        });
    });
}
exports.playYtbLink = playYtbLink;
