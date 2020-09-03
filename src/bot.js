'use strict'

require('dotenv').config()
const { Client } = require('discord.js')
const ytdl = require('ytdl-core');
const cron = require('node-cron');

const { MongoClient } = require('mongodb')
const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority`

const hourNotice = (channel,voiceChannel) => 
cron.schedule('0 * * * *', () => {
    const currHour = new Date().getHours()
    channel.send(`It's ${currHour} o'clock 🕒`)
    if (voiceChannel) {
        playBell(voiceChannel, currHour % 12)
    }
})

const halfHourNotice = (channel,voiceChannel) => 
cron.schedule('30 * * * *', () => {
    const currHour = new Date().getHours()
    channel.send(`It's half past ${currHour} 🕒`)
    if (voiceChannel) {
            playBell(voiceChannel, 2)
        }
    })
    
    const status = {
        clockNotice: false,
        clockChannels: [null,null],
        hourNotice: null,
        halfHourNotice: null
    }
    
async function playYoutube(channel, link) {   
    const connection = await channel.join();
    connection.play(ytdl(link, { filter: 'audioonly' }))
    .on('finish', () => setTimeout(() => { channel.leave() }, 500))
}
    
async function playBell(channel, rings) {
    if (rings === 0) {
        setTimeout(() => { channel.leave() }, 500)
    }
    else {
        const connection = await channel.join();
        connection.play(ytdl('https://www.youtube.com/watch?v=dNl4-w9ZrBs', { filter: 'audioonly', volume: 0.35 }))
        .on('finish', () => playBell(channel, rings - 1))
    }
}
    
async function getRandomQuote(){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true });
    let quote = ''
    try {
        await DBclient.connect();
        const database=DBclient.db(process.env.DB_NAME)
        const collection = database.collection('quotes')
        
        const n = await collection.countDocuments()
        const skips=Math.floor(Math.random()*n)
        const cursor = collection.find({},{skip:skips})
        const quoteObj= await cursor.next()
        quote = `${quoteObj.text} - ${quoteObj.author}`
      
    }catch(error){
      // quote = 'There was an error at line 😥'
      quote = error.toString()
    } finally {
      await DBclient.close()
    }
    return quote
}

async function getAllQuotes(){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true });
    let quotes = ''
    try {
        await DBclient.connect();
        const database=DBclient.db(process.env.DB_NAME)
        const collection = database.collection('quotes')
        
        const cursor = collection.find({})

        quotes=(await cursor.toArray())
            .reduce((quotes,quoteObj)=>quotes.concat(`${quoteObj.text} - ${quoteObj.author}`,'\n'),'\n')
      
    }catch(error){
      // quote = 'There was an error at line 😥'
      quotes = error.toString()
    } finally {
      await DBclient.close()
    }
    return quotes
}

async function addQuote(authorIn,textIn){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true });
    let status = ''
    try {
        await DBclient.connect();
        const database=DBclient.db(process.env.DB_NAME)
        const collection = database.collection('quotes')
  
        collection.insertOne({author: authorIn,text: textIn})
        status = 'The quote has been added 🙂' 
    }catch(error){
        status = error.toString()
        // status = 'There was an error 😥'
    } finally {
        await DBclient.close()
    }
    return status
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

    if (message.content === 'bob say hi') {
        message.reply('Wtf is up!!')
    }

    if (message.content === 'bob say the n word') {
        message.channel.send('N🧑🏿')
    }

    if (message.content === 'bob ride the wave') {
        message.channel.send('🏄‍♂️ bruh')
    }

    if (message.content === 'bob start the clock') {
        const voiceChannel = message.member.voice.channel
        
        if (status.clockNotice === true) {
            message.reply(`There's already a clock 🕒 running on Text: ${status.clockChannels[0]} and Voice: ${status.clockChannels[1]}`)
        }
        else {
            status.clockChannels=[message.channel,voiceChannel]
            message.channel.send(`Starting the clock 🕒 on Text: ${message.channel} and Voice: ${voiceChannel}`)
            status.clockNotice = true;
            status.hourNotice = hourNotice(message.channel,voiceChannel)
            status.halfHourNotice = halfHourNotice(message.channel,voiceChannel)
        }

    }

    if (message.content === 'bob stop the clock') {
        
        if (status.clockNotice === false) {
            message.reply("There's no clock 🕒 running")
        }
        else {
            message.channel.send('Die clock 🕒')
            status.clockNotice = false;
            status.hourNotice.destroy()
            status.halfHourNotice.destroy()
        }
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
                    playBell(voiceChannel, msgTokens[2])
                    break
                case 'belldie':
                    playYoutube(voiceChannel, 'https://www.youtube.com/watch?v=zDBrQWq82-Q')
                    break
            }
        } else {
            message.reply('You need to join a voice channel first!')
        }
    }
    if (msgTokens[0] === 'baq') {
        let i=1
        let author=''
        let text=''
        while(msgTokens[i]!='-'){
            text=text.concat(msgTokens[i],' ')
            i++
        }
        i++
        while(msgTokens[i]){
            author=author.concat(msgTokens[i],' ')
            i++
        }
        message.reply(await addQuote(author,text))

    }
    if (msgTokens[0] === 'brq') {
        const quote = await getRandomQuote()
        message.reply(quote)
    }
    if (msgTokens[0] === 'blq') {
        const quotes = await getAllQuotes()
        message.reply(quotes)
    }
})

client.login(process.env.BOT_TOKEN)