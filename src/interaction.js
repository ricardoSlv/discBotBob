//@ts-check

import { soundMap, hourNotice, halfHourNotice } from './sound.js'

const status = {
  clockNotice: false,
  clockChannels: [null, null],
  hourNotice: null,
  halfHourNotice: null,
}

import { Message } from 'discord.js'

/**
 * @param {Message} message
 */
export default function (message) {
  const voiceChannel = message.member.voice.channel
  const textChannel = message.channel

  switch (message.content) {
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
        message.reply(
          `There's already a clock 🕒 running on Text: ${status.clockChannels[0]} and Voice: ${status.clockChannels[1]}`
        )
      } else {
        status.clockChannels = [textChannel, voiceChannel]
        textChannel.send(
          `Starting the clock 🕒 on Text: ${textChannel} and Voice: ${voiceChannel}`
        )
        status.clockNotice = true
        status.hourNotice = hourNotice(textChannel, voiceChannel)
        status.halfHourNotice = halfHourNotice(textChannel, voiceChannel)
      }
      break
    case 'bob stop the clock':
      if (status.clockNotice === false) {
        message.reply("There's no clock 🕒 running")
      } else {
        textChannel.send('Die clock 🕒')
        status.clockNotice = false
        status.hourNotice.destroy()
        status.halfHourNotice.destroy()
      }
      break
    case 'bob help':
      const sounds = [...soundMap.keys()].join(', ')
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
        \u2001➤ baq + Quote - Author (Add quote) 
        \u2001➤ brq (Random Quote) 
        ‎‎‎‎‎‎‎‎‎‎‎‎‎‎\u2001➤ blq (List Quotes)
        
        🎵 Playlists
        \u2001➤ bapl + Icon - PlaylistName (Add playlist. Ex:"bapl 🐵 - monkeySongs") 
        \u2001➤ baspl + PlaylistName - SongName - YoutubeLink (Add song to playlist. Ex:"baspl monkeySongs - song1 - https://youtube.com/monkeysong ")
        \u2001➤ bupln + PlaylistName - NewPlaylistName (Update Playlist Name)
        \u2001➤ blpl (List playlists) 
        \u2001➤ bppls + PlaylistName (Play Playlist Shuffled)
        \u2001➤ bppl + PlaylistName (Play Playlist) `.replace(/   +/g, '')
      )
  }
}
