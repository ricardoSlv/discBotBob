'use strict'

import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'discord.js';

import {addQuote,getRandomQuote,getAllQuotes} from './db.js'
import {soundMap,hourNotice,halfHourNotice,playBell,playYoutube} from './sound.js'
import {parseQuote} from './utils.js'

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
    }

    switch (msgTokens[0]){
        case 'bp':
            if (voiceChannel&&soundMap.get(msgTokens[1])) 
                playYoutube(voiceChannel,soundMap.get(msgTokens[1]))
            else 
                message.reply('You need to join a voice channel first!')
            break
        case 'baq':
            const [author,text] = parseQuote(msgTokens)
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

            
    }
})

client.login(process.env.BOT_TOKEN)