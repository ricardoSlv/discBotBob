'use strict'

import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'discord.js';

import {addQuote,getRandomQuote,getAllQuotes,
        getAllPlaylists,addPlayList,addSongToPlayList,getPlaylist
    } from './db.js'
import {soundMap,hourNotice,halfHourNotice,playBell,playYoutube,playPlaylist} from './sound.js'
import {parseAddQuote,
        parsePlaylist,parseIconPlaylist,parsePlaylistSongLink} from './utils.js'

const status = {
    clockNotice: false,
    clockChannels: [null,null],
    hourNotice: null,
    halfHourNotice: null
}

const client = new Client()

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`)
})

client.on('message', async (message) => {

    if (message.author.bot === true) {
        return
    }

    console.log(`${message.author.tag} said: ${message.content}`)
    
    const voiceChannel = message.member.voice.channel
    const textChannel = message.channel
    const msgTokens = message.content.split(' ').filter(x=>x!=='')

    switch(message.content){
        case 'bob say hi':
            message.reply('Wtf is up!!')
            break
        case 'bob say the n word':
            textChannel.send('N🧑🏿')
            break
        case 'bob ride the wave':
            textChannel.send('🏄‍♂️ bruh')
            break
        case 'bob start the clock':
            if (status.clockNotice === true) {
                message.reply(`There's already a clock 🕒 running on Text: ${status.clockChannels[0]} and Voice: ${status.clockChannels[1]}`)
            }
            else {
                status.clockChannels=[textChannel,voiceChannel]
                textChannel.send(`Starting the clock 🕒 on Text: ${textChannel} and Voice: ${voiceChannel}`)
                status.clockNotice = true;
                status.hourNotice = hourNotice(textChannel,voiceChannel)
                status.halfHourNotice = halfHourNotice(textChannel,voiceChannel)
            }  
            break  
        case 'bob stop the clock':
            if (status.clockNotice === false) {
                message.reply("There's no clock 🕒 running")
            }
            else {
                textChannel.send('Die clock 🕒')
                status.clockNotice = false;
                status.hourNotice.destroy()
                status.halfHourNotice.destroy()
            }
            break 
        case 'bob help':
            const sounds = Array.from(soundMap.keys()).join(', ')
            message.reply(
                `Available commands: 
                👄 Speech:
                \u2001➤ bob say hi 
                \u2001➤ bob say the n word 
                \u2001➤ bob ride the wave  
                
                🕒 Clock: 
                \u2001➤ bob start the clock  
                \u2001➤ bob stop the clock 
                
                🔊 Sounds: 
                \u2001➤ bp + [${sounds}] 
                 
                📝 Quotes: 
                \u2001➤ baq + Author - Quote (Add quote) 
                \u2001➤ brq (Random Quote) 
                ‎‎‎‎‎‎‎‎‎‎‎‎‎‎\u2001➤ blq (List Quotes)
                
                🎵 Playlists
                \u2001➤ bapl + PlaylistName (Add playlist) 
                \u2001➤ baspl + PlaylistName - SongName - YoutubeLink (Add song to playlist) 
                \u2001➤ blpl (List playlists) 
                \u2001➤ bppl + PlaylistName (Play Playlist) `.replace(/   +/g, '')
            )           
    }

    switch (msgTokens[0]){
        case 'bp':
            if (voiceChannel&&soundMap.get(msgTokens[1])) 
                playYoutube(voiceChannel,soundMap.get(msgTokens[1]))
            else 
                message.reply('You need to join a voice channel first!')
            break
        case 'baq':
            const [author,text] = parseAddQuote(msgTokens)
            message.reply(await addQuote(author,text))
            break
        case 'brq':
            const quote = await getRandomQuote()
            message.reply(quote)
            break
        case 'blq':
            const quotes = await getAllQuotes()
            message.reply(quotes)
            break   
        case 'bapl':
            const [icon,playlist] = parseIconPlaylist(msgTokens)
            message.reply(await addPlayList(icon,playlist))
            break  
        case 'baspl':
            const [playlist2,songName,ytbLink] = parsePlaylistSongLink(msgTokens)
            message.reply(await addSongToPlayList(playlist2,songName,ytbLink))
            break  
        case 'blpl':
            const playlists = await getAllPlaylists()
            message.reply(playlists)
            break  
        case 'bppl':
            const [playlistName] = parsePlaylist(msgTokens)
            const playlist3 = await getPlaylist(playlistName)
            message.reply(`Playing ${playlist3.name}`)
            playPlaylist(voiceChannel,playlist3.songs)
            break            
    }
})

client.login(process.env.BOT_TOKEN)