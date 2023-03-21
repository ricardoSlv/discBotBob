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
exports.renamePlaylist = exports.getPlaylist = exports.getAllPlaylists = exports.removeSongFromPlayList = exports.addSongToPlayList = exports.addPlayList = exports.addQuote = exports.getAllQuotes = exports.getRandomQuote = void 0;
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var mongodb_1 = require("mongodb");
var MongoClient = mongodb_1.default.MongoClient;
var uri = "mongodb+srv://".concat(process.env.DB_USER, ":").concat(process.env.DB_PWD, "@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority");
var DBclient = new MongoClient(uri, { useUnifiedTopology: true });
var dbquotes;
var dbplaylists;
DBclient.connect().then(function () {
    var database = DBclient.db(process.env.DB_NAME);
    dbquotes = database.collection('quotes');
    dbplaylists = database.collection('playlists');
});
function getRandomQuote() {
    return __awaiter(this, void 0, void 0, function () {
        var quote, quoteObj, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quote = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbquotes.aggregate([{ $sample: { size: 1 } }]).next()];
                case 2:
                    quoteObj = _a.sent();
                    console.log('Quote:', quoteObj);
                    quote = "".concat(quoteObj.text, " - ").concat(quoteObj.author);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    quote = error_1.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, quote];
            }
        });
    });
}
exports.getRandomQuote = getRandomQuote;
function getAllQuotes() {
    return __awaiter(this, void 0, void 0, function () {
        var quotes, quotesdocs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    quotes = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbquotes.find({}).toArray()];
                case 2:
                    quotesdocs = _a.sent();
                    quotes = quotesdocs.reduce(function (quotes, quoteObj) { return quotes.concat("".concat(quoteObj.text, " - ").concat(quoteObj.author), '\n'); }, '\n');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    quotes = error_2.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, quotes];
            }
        });
    });
}
exports.getAllQuotes = getAllQuotes;
function addQuote(author, text) {
    return __awaiter(this, void 0, void 0, function () {
        var status, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbquotes.insertOne({ author: author, text: text })];
                case 2:
                    _a.sent();
                    status = 'The quote has been added 🙂';
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    status = error_3.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, status];
            }
        });
    });
}
exports.addQuote = addQuote;
function addPlayList(icon, playlistName) {
    return __awaiter(this, void 0, void 0, function () {
        var status, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, dbplaylists.insertOne({ icon: icon, name: playlistName, songs: [] })];
                case 2:
                    _a.sent();
                    status = 'The playlist has been created 🙂';
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    status = error_4.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, status];
            }
        });
    });
}
exports.addPlayList = addPlayList;
function addSongToPlayList(playlistName, songName, ytbLink) {
    return __awaiter(this, void 0, void 0, function () {
        var status, playlist, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, dbplaylists.findOne({ name: playlistName })];
                case 2:
                    playlist = _a.sent();
                    if (!playlist) return [3 /*break*/, 6];
                    if (!playlist.songs.find(function (x) { return x.name === songName; })) return [3 /*break*/, 3];
                    status = 'The song is already in the playlist 🙂';
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, dbplaylists.updateOne({ name: playlistName }, { $push: { songs: { name: songName, ytbLink: ytbLink } } })];
                case 4:
                    _a.sent();
                    status = 'The song has been added to the playlist 🙂';
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    status = "The playlist doesn't exist 🙁";
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_5 = _a.sent();
                    status = error_5.toString();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, status];
            }
        });
    });
}
exports.addSongToPlayList = addSongToPlayList;
function removeSongFromPlayList(playlistName, songName) {
    return __awaiter(this, void 0, void 0, function () {
        var status, playlist, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    status = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, dbplaylists.findOne({ name: playlistName })];
                case 2:
                    playlist = _a.sent();
                    if (!playlist) return [3 /*break*/, 6];
                    if (!!playlist.songs.find(function (x) { return x.name === songName; })) return [3 /*break*/, 3];
                    status = 'This song does not exist in the playlist 😯';
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, dbplaylists.updateOne({ name: playlistName }, { $pull: { songs: { name: songName } } })];
                case 4:
                    _a.sent();
                    status = 'The song has been removed to the playlist 👀';
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    status = "The playlist doesn't exist 🙁";
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_6 = _a.sent();
                    status = error_6.toString();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, status];
            }
        });
    });
}
exports.removeSongFromPlayList = removeSongFromPlayList;
function getAllPlaylists() {
    return __awaiter(this, void 0, void 0, function () {
        var playlists, cursor, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playlists = '';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    cursor = dbplaylists.find({});
                    return [4 /*yield*/, cursor.toArray()];
                case 2:
                    playlists = (_a.sent())
                        .map(function (playlist) {
                        return "\n".concat(playlist.icon, " ").concat(playlist.name, "\n").concat(playlist.songs
                            .map(function (_a) {
                            var name = _a.name;
                            return "\u2001\u27A4 ".concat(name);
                        })
                            .join('\n'));
                    })
                        .join('\n');
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    playlists = error_7.toString();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, playlists];
            }
        });
    });
}
exports.getAllPlaylists = getAllPlaylists;
function getPlaylist(playlistName) {
    return __awaiter(this, void 0, void 0, function () {
        var error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dbplaylists.findOne({ name: playlistName })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_8 = _a.sent();
                    return [2 /*return*/, error_8.toString()];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getPlaylist = getPlaylist;
function renamePlaylist(playlistName, newPlayListName) {
    return __awaiter(this, void 0, void 0, function () {
        var status, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, dbplaylists.updateOne({ name: playlistName }, { $set: { name: newPlayListName } })];
                case 1:
                    _a.sent();
                    status = 'The playlist was renamed 🙂';
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    status = error_9.toString();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, status];
            }
        });
    });
}
exports.renamePlaylist = renamePlaylist;
