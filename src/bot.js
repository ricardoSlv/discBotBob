'use strict'

require('dotenv').config()
const { Client } = require('discord.js')
const ytdl = require('ytdl-core');
const cron = require('node-cron');

async function playYoutube(channel, link) {

    const connection = await channel.join();
    connection.play(ytdl(link, { filter: 'audioonly' }))
        .on('finish', () => setTimeout(() => { channel.leave() }, 500))
}

async function playBell(channel,rings){
    if(rings===0){
        setTimeout(() => { channel.leave() }, 500)
    }
    else{
        const connection = await channel.join();
        connection.play(ytdl('https://www.youtube.com/watch?v=dNl4-w9ZrBs', { filter: 'audioonly' }))
        .on('finish', () => playBell(channel,rings-1))
    }
}

cron.schedule('0 * * * *', () => {
    console.log('running a task every minute');
});

const client = new Client()

client.on('ready', () => {
    console.log(`${client.user.username} has logged in`)
})

client.on('message', async (message) => {

    if (message.author.bot === true) {
        return
    }

    console.log(`${message.author.tag} said: ${message.content}`)

    // if (message.author.tag === 'Faria#9688') {
    //     message.reply('Faria stfu')
    //     return
    // }

    if (message.content === 'BobBot say hi') {
        message.reply('Wtf is up!!')
        message.channel.send('I sleep now')
    }

    if(message.content==='bob count the hours'){
        const channel = message.channel
        const voiceChannel = message.member.voice.channel
        channel.send('Starting the time 🕒')
        cron.schedule('0 * * * *', () => {
            const currHour = new Date().getHours()
            channel.send(`It's ${currHour} o'clock 🕒`)
            if(voiceChannel){
                playBell(voiceChannel,currHour)
            }
        });
        cron.schedule('30 * * * *', () => {
            channel.send(`It's half past ${new Date().getHours()} o'clock 🕒`)
            if(voiceChannel){
                playBell(voiceChannel,2)
            }
        });
    }

    const voiceChannel = message.member.voice.channel
    const msgTokens = message.content.split(' ')
    if (msgTokens[0] === 'bp') {
        if (voiceChannel) {
            switch (msgTokens[1]) {
                case 'gong':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=r7oAsDWy6n4')
                    break
                case 'chingchong':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=8yKG9VncnBI')
                    break
                case 'bruh':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=2ZIpFytCSVc')
                    break;
                case 'die': 
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=PtcHNvVooLQ')
                    break
                case 'bell':
                    playBell(voiceChannel,msgTokens[2])
                    break  
                case 'belldie':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=zDBrQWq82-Q')
                    break
            }
        } else {
            message.reply('You need to join a voice channel first!')
        }
    }
})

client.login(process.env.BOT_TOKEN)