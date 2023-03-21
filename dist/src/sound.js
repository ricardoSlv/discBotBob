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
exports.playYtbLink = exports.playPlaylist = exports.playYoutube = exports.halfHourNotice = exports.hourNotice = exports.soundMap = exports.isValidSound = void 0;
var ytdl_core_1 = require("ytdl-core");
var node_cron_1 = require("node-cron");
var schedule = node_cron_1.default.schedule;
var sounds = ['gong', 'chingchong', 'bruh', 'die', 'bell', 'belldie', 'pocoto'];
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
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(rings === 0)) return [3 /*break*/, 1];
                    setTimeout(function () {
                        channel.leave();
                    }, 500);
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, channel.join()];
                case 2:
                    connection = _a.sent();
                    connection
                        .play((0, ytdl_core_1.default)('https://www.youtube.com/watch?v=dNl4-w9ZrBs', {
                        filter: 'audioonly'
                    }))
                        .on('finish', function () { return playBell(channel, rings - 1); });
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function hourNotice(channel, voiceChannel) {
    return schedule('0 * * * *', function () {
        var currHour = new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            hour12: false,
            timeZone: 'Europe/Lisbon'
        });
        channel.send("It's ".concat(currHour, " o'clock \uD83D\uDD52"));
        if (voiceChannel) {
            playBell(voiceChannel, parseInt(currHour) % 12);
        }
    });
}
exports.hourNotice = hourNotice;
function halfHourNotice(channel, voiceChannel) {
    return schedule('30 * * * *', function () {
        var currHour = new Date().toLocaleString('en-GB', {
            hour: '2-digit',
            hour12: false,
            timeZone: 'Europe/Lisbon'
        });
        channel.send("It's half past ".concat(currHour, " \uD83D\uDD52"));
        if (voiceChannel) {
            playBell(voiceChannel, 2);
        }
    });
}
exports.halfHourNotice = halfHourNotice;
function playYoutube(channel, link) {
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, channel.join()];
                case 1:
                    connection = _a.sent();
                    connection.play((0, ytdl_core_1.default)(link, { filter: 'audioonly' })).on('finish', function () {
                        return setTimeout(function () {
                            channel.leave();
                        }, 500);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.playYoutube = playYoutube;
function playPlaylist(channel, songs, shuffle, connection) {
    return __awaiter(this, void 0, void 0, function () {
        var nextSong, nextSongs_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!connection) return [3 /*break*/, 2];
                    return [4 /*yield*/, channel.join()];
                case 1:
                    connection = _a.sent();
                    _a.label = 2;
                case 2:
                    if (songs.length === 0)
                        setTimeout(function () {
                            channel.leave();
                        }, 500);
                    else {
                        nextSong = shuffle ? Math.floor(Math.random() * songs.length) : 0;
                        nextSongs_1 = __spreadArray([], songs, true);
                        nextSongs_1.splice(nextSong, 1);
                        connection
                            .play((0, ytdl_core_1.default)(songs[nextSong].ytbLink, { filter: 'audioonly' }))
                            .on('finish', function () {
                            return setTimeout(function () {
                                playPlaylist(channel, nextSongs_1, shuffle, connection);
                            }, 500);
                        })
                            .on('error', function () {
                            setTimeout(function () {
                                channel.leave();
                            }, 500);
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.playPlaylist = playPlaylist;
function playYtbLink(channel, ytblink) {
    return __awaiter(this, void 0, void 0, function () {
        var connection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, channel.join()];
                case 1:
                    connection = _a.sent();
                    connection
                        .play((0, ytdl_core_1.default)(ytblink, { filter: 'audioonly' }))
                        .on('finish', function () {
                        return setTimeout(function () {
                            channel.leave();
                        }, 500);
                    })
                        .on('error', function () {
                        setTimeout(function () {
                            channel.leave();
                        }, 500);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.playYtbLink = playYtbLink;
