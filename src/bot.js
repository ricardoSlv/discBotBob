'use strict'

require('dotenv').config()
const { Client } = require('discord.js')
const ytdl = require('ytdl-core');

async function playYoutube(channel, link) {

    const connection = await channel.join();
    connection.play(ytdl(link, { filter: 'audioonly' }))
        .on('finish', () => setTimeout(() => { channel.leave() }, 500))
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

    if (message.author.tag === 'Faria#9688') {
        message.reply('Faria stfu')
        return
    }

    if (message.content === 'BobBot say hi') {
        message.reply('Wtf is up!!')
        message.channel.send('I sleep now')
    }

    const voiceChannel = message.member.voice.channel
    const msgTokens = message.content.split(' ')
    if (msgTokens[0] === 'bp') {
        if (voiceChannel) {
            switch (msgTokens[1]) {
                case 'gong':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=r7oAsDWy6n4')
                    break;
                case 'chingchong':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=8yKG9VncnBI')
                    break;
                case 'bruh':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=2ZIpFytCSVc')
                    break;
            }
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
})

client.login(process.env.BOT_TOKEN)