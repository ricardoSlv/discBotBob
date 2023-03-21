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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const sound_1 = require("./sound");
function default_1(message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const voiceChannel = (_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
        const msgTokens = message.content.split(/ +/);
        const [command, ...rest] = msgTokens;
        const args = rest.join(' ').split(/ *- */);
        if (['bp', 'bppl', 'bppls', 'bpyl'].includes(command)) {
            if (!voiceChannel) {
                message.reply('You need to join a voice channel first!');
                return;
            }
            else {
                switch (command) {
                    case 'bp':
                        const [soundMapKey] = args;
                        if ((0, sound_1.isValidSound)(soundMapKey)) {
                            const soundYtbLink = sound_1.soundMap[soundMapKey];
                            (0, sound_1.playYoutube)(voiceChannel, soundYtbLink);
                        }
                        else {
                            message.reply('あなたが要求した音はありません 👲🏻');
                        }
                        break;
                    case 'bppl':
                        {
                            const [playlistName] = args;
                            const playlist = yield (0, db_1.getPlaylist)(playlistName);
                            if ((_b = playlist === null || playlist === void 0 ? void 0 : playlist.songs) === null || _b === void 0 ? void 0 : _b.length) {
                                message.reply(`Playing ${playlist.name}`);
                                (0, sound_1.playPlaylist)(voiceChannel, playlist.songs);
                            }
                            else {
                                console.log(playlist);
                                message.reply('Database is being a bitch, try again later');
                            }
                        }
                        break;
                    case 'bppls':
                        {
                            const [playlistName] = args;
                            const playlist = yield (0, db_1.getPlaylist)(playlistName);
                            if (playlist) {
                                message.reply(`Playing ${playlist.name}`);
                                const shuffle = true;
                                (0, sound_1.playPlaylist)(voiceChannel, playlist.songs, shuffle);
                            }
                            else {
                                message.reply(`Couldn't find the playlist, fuck you 🫵🏻`);
                            }
                        }
                        break;
                    case 'bpyl':
                        {
                            const [ytblink] = args;
                            yield (0, sound_1.playYtbLink)(voiceChannel, ytblink);
                            message.reply(`Playing YtbLink`);
                        }
                        break;
                }
            }
        }
        else {
            switch (command) {
                case 'baq':
                    {
                        const [text, author] = args;
                        message.reply(yield (0, db_1.addQuote)(author, text));
                    }
                    break;
                case 'brq':
                    {
                        const quote = yield (0, db_1.getRandomQuote)();
                        if (quote) {
                            message.reply(quote);
                        }
                        else {
                            message.reply(`Couldn't find the quote, fuck you 🫵🏻`);
                        }
                    }
                    break;
                case 'blq':
                    {
                        const quotes = yield (0, db_1.getAllQuotes)();
                        if (quotes) {
                            message.reply(quotes);
                        }
                        else {
                            message.reply(`I stray cat 🐈 stole the list of quotes from me, oh well 🤷🏻‍♂️`);
                        }
                    }
                    break;
                case 'bapl':
                    {
                        const [icon, playlist] = args;
                        message.reply(yield (0, db_1.addPlayList)(icon, playlist));
                    }
                    break;
                case 'baspl':
                    {
                        const [playlist, songName, ytbLink] = args;
                        message.reply(yield (0, db_1.addSongToPlayList)(playlist, songName, ytbLink));
                    }
                    break;
                case 'brspl':
                    {
                        const [playlist, songName] = args;
                        message.reply(yield (0, db_1.removeSongFromPlayList)(playlist, songName));
                    }
                    break;
                case 'blpl':
                    {
                        const playlists = yield (0, db_1.getAllPlaylists)();
                        if (playlists) {
                            message.reply(playlists);
                        }
                        else {
                            message.reply('The DJ in on strike and refused to hand me the list of playslist, asshole 😤');
                        }
                    }
                    break;
                case 'bupln':
                    {
                        const [oldplaylistName, newPlaylistName] = args;
                        message.reply(yield (0, db_1.renamePlaylist)(oldplaylistName, newPlaylistName));
                    }
                    break;
            }
        }
    });
}
exports.default = default_1;
