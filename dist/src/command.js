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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_js_1 = require("./db.js");
var sound_js_1 = require("./sound.js");
function default_1(message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var voiceChannel, msgTokens, command, rest, args, _c, soundMapKey, soundYtbLink, playlistName, playlist, playlistName, playlist, shuffle, ytblink, _d, text, author, _e, _f, quote, quotes, icon, playlist, _g, _h, playlist, songName, ytbLink, _j, _k, playlist, songName, _l, _m, playlists, oldplaylistName, newPlaylistName, _o, _p;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0:
                    voiceChannel = (_a = message === null || message === void 0 ? void 0 : message.member) === null || _a === void 0 ? void 0 : _a.voice.channel;
                    msgTokens = message.content.split(/ +/);
                    command = msgTokens[0], rest = msgTokens.slice(1);
                    args = rest.join(' ').split(/ *- */);
                    if (!['bp', 'bppl', 'bppls', 'bpyl'].includes(command)) return [3 /*break*/, 10];
                    if (!!voiceChannel) return [3 /*break*/, 1];
                    message.reply('You need to join a voice channel first!');
                    return [2 /*return*/];
                case 1:
                    _c = command;
                    switch (_c) {
                        case 'bp': return [3 /*break*/, 2];
                        case 'bppl': return [3 /*break*/, 3];
                        case 'bppls': return [3 /*break*/, 5];
                        case 'bpyl': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 2:
                    soundMapKey = args[0];
                    if ((0, sound_js_1.isValidSound)(soundMapKey)) {
                        soundYtbLink = sound_js_1.soundMap[soundMapKey];
                        (0, sound_js_1.playYoutube)(voiceChannel, soundYtbLink);
                    }
                    else {
                        message.reply('あなたが要求した音はありません 👲🏻');
                    }
                    return [3 /*break*/, 9];
                case 3:
                    playlistName = args[0];
                    return [4 /*yield*/, (0, db_js_1.getPlaylist)(playlistName)];
                case 4:
                    playlist = _q.sent();
                    if ((_b = playlist === null || playlist === void 0 ? void 0 : playlist.songs) === null || _b === void 0 ? void 0 : _b.length) {
                        message.reply("Playing ".concat(playlist.name));
                        (0, sound_js_1.playPlaylist)(voiceChannel, playlist.songs);
                    }
                    else {
                        console.log(playlist);
                        message.reply('Database is being a bitch, try again later');
                    }
                    return [3 /*break*/, 9];
                case 5:
                    playlistName = args[0];
                    return [4 /*yield*/, (0, db_js_1.getPlaylist)(playlistName)];
                case 6:
                    playlist = _q.sent();
                    message.reply("Playing ".concat(playlist.name));
                    shuffle = true;
                    (0, sound_js_1.playPlaylist)(voiceChannel, playlist.songs, shuffle);
                    return [3 /*break*/, 9];
                case 7:
                    ytblink = args[0];
                    return [4 /*yield*/, (0, sound_js_1.playYtbLink)(voiceChannel, ytblink)];
                case 8:
                    _q.sent();
                    message.reply("Playing YtbLink");
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 27];
                case 10:
                    _d = command;
                    switch (_d) {
                        case 'baq': return [3 /*break*/, 11];
                        case 'brq': return [3 /*break*/, 13];
                        case 'blq': return [3 /*break*/, 15];
                        case 'bapl': return [3 /*break*/, 17];
                        case 'baspl': return [3 /*break*/, 19];
                        case 'brspl': return [3 /*break*/, 21];
                        case 'blpl': return [3 /*break*/, 23];
                        case 'bupln': return [3 /*break*/, 25];
                    }
                    return [3 /*break*/, 27];
                case 11:
                    text = args[0], author = args[1];
                    _f = (_e = message).reply;
                    return [4 /*yield*/, (0, db_js_1.addQuote)(author, text)];
                case 12:
                    _f.apply(_e, [_q.sent()]);
                    return [3 /*break*/, 27];
                case 13: return [4 /*yield*/, (0, db_js_1.getRandomQuote)()];
                case 14:
                    quote = _q.sent();
                    message.reply(quote);
                    return [3 /*break*/, 27];
                case 15: return [4 /*yield*/, (0, db_js_1.getAllQuotes)()];
                case 16:
                    quotes = _q.sent();
                    message.reply(quotes);
                    return [3 /*break*/, 27];
                case 17:
                    icon = args[0], playlist = args[1];
                    _h = (_g = message).reply;
                    return [4 /*yield*/, (0, db_js_1.addPlayList)(icon, playlist)];
                case 18:
                    _h.apply(_g, [_q.sent()]);
                    return [3 /*break*/, 27];
                case 19:
                    playlist = args[0], songName = args[1], ytbLink = args[2];
                    _k = (_j = message).reply;
                    return [4 /*yield*/, (0, db_js_1.addSongToPlayList)(playlist, songName, ytbLink)];
                case 20:
                    _k.apply(_j, [_q.sent()]);
                    return [3 /*break*/, 27];
                case 21:
                    playlist = args[0], songName = args[1];
                    _m = (_l = message).reply;
                    return [4 /*yield*/, (0, db_js_1.removeSongFromPlayList)(playlist, songName)];
                case 22:
                    _m.apply(_l, [_q.sent()]);
                    return [3 /*break*/, 27];
                case 23: return [4 /*yield*/, (0, db_js_1.getAllPlaylists)()];
                case 24:
                    playlists = _q.sent();
                    message.reply(playlists);
                    return [3 /*break*/, 27];
                case 25:
                    oldplaylistName = args[0], newPlaylistName = args[1];
                    _p = (_o = message).reply;
                    return [4 /*yield*/, (0, db_js_1.renamePlaylist)(oldplaylistName, newPlaylistName)];
                case 26:
                    _p.apply(_o, [_q.sent()]);
                    return [3 /*break*/, 27];
                case 27: return [2 /*return*/];
            }
        });
    });
}
exports.default = default_1;
