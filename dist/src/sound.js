"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.playYtbLink = exports.playPlaylist = exports.halfHourNotice = exports.hourNotice = exports.soundMap = exports.isValidSound = void 0;
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
const voice_1 = require("@discordjs/voice");
async function playBell(channel, rings) {
    const currRings = rings;
    const connection = (0, voice_1.joinVoiceChannel)({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    const player = (0, voice_1.createAudioPlayer)({
        behaviors: {
            noSubscriber: voice_1.NoSubscriberBehavior.Pause
        }
    });
    player.play((0, voice_1.createAudioResource)((0, ytdl_core_1.default)('https://www.youtube.com/watch?v=dNl4-w9ZrBs', { filter: 'audioonly' })));
    connection.subscribe(player);
    player.on(voice_1.AudioPlayerStatus.Idle, () => {
        if (rings === 0) {
            setTimeout(() => {
                connection.destroy();
            }, 500);
        }
        else {
            setTimeout(() => {
                connection.destroy();
            }, 500);
        }
    });
    player.on('error', () => {
        setTimeout(() => {
            connection.destroy();
        }, 500);
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
async function playPlaylist(channel, songs, shuffle, connection) {
    if (!connection)
        connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
    if (songs.length === 0)
        setTimeout(() => {
            connection?.destroy();
        }, 500);
    else {
        const nextSong = shuffle ? Math.floor(Math.random() * songs.length) : 0;
        let nextSongs = [...songs];
        nextSongs.splice(nextSong, 1);
        // connection
        //   .play(ytdl(songs[nextSong].ytbLink, { filter: 'audioonly' }))
        //   .on('finish', () =>
        //     setTimeout(() => {
        //       playPlaylist(channel, nextSongs, shuffle, connection)
        //     }, 500)
        //   )
        //   .on('error', () => {
        //     setTimeout(() => {
        //       connection?.destroy()
        //     }, 500)
        //   })
    }
}
exports.playPlaylist = playPlaylist;
async function playYtbLink(channel, ytblink) {
    const connection = (0, voice_1.joinVoiceChannel)({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator
    });
    const player = (0, voice_1.createAudioPlayer)({
        behaviors: {
            noSubscriber: voice_1.NoSubscriberBehavior.Pause
        }
    });
    player.play((0, voice_1.createAudioResource)((0, ytdl_core_1.default)(ytblink, { filter: 'audioonly' })));
    connection.subscribe(player);
    player.on(voice_1.AudioPlayerStatus.Idle, () => {
        console.log('Player Idle: ', ytblink);
        // setTimeout(() => {
        //   // connection.destroy()
        // }, 500)
    });
    player.on('error', (e) => {
        console.log('Player Error: ', ytblink);
        console.error(e);
        // setTimeout(() => {
        //   // connection.destroy()
        // }, 500)
    });
}
exports.playYtbLink = playYtbLink;
