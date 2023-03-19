import {
  addQuote,
  getRandomQuote,
  getAllQuotes,
  getAllPlaylists,
  addPlayList,
  addSongToPlayList,
  removeSongFromPlayList,
  getPlaylist,
  renamePlaylist
} from './db'

import { soundMap, playYoutube, playPlaylist, playYtbLink, isValidSound } from './sound'

import { Message } from 'discord.js'

export default async function (message: Message) {
  const voiceChannel = message?.member?.voice.channel
  const msgTokens = message.content.split(/ +/)
  const [command, ...rest] = msgTokens
  const args = rest.join(' ').split(/ *- */)

  if (['bp', 'bppl', 'bppls', 'bpyl'].includes(command)) {
    if (!voiceChannel) {
      message.reply('You need to join a voice channel first!')
      return
    } else {
      switch (command) {
        case 'bp':
          const [soundMapKey] = args
          if (isValidSound(soundMapKey)) {
            const soundYtbLink = soundMap[soundMapKey]
            playYoutube(voiceChannel, soundYtbLink)
          } else {
            message.reply('あなたが要求した音はありません 👲🏻')
          }
          break
        case 'bppl':
          {
            const [playlistName] = args
            const playlist = await getPlaylist(playlistName)
            if (playlist?.songs?.length) {
              message.reply(`Playing ${playlist.name}`)
              playPlaylist(voiceChannel, playlist.songs)
            } else {
              console.log(playlist)
              message.reply('Database is being a bitch, try again later')
            }
          }
          break
        case 'bppls':
          {
            const [playlistName] = args
            const playlist = await getPlaylist(playlistName)
            message.reply(`Playing ${playlist.name}`)
            const shuffle = true
            playPlaylist(voiceChannel, playlist.songs, shuffle)
          }
          break
        case 'bpyl':
          {
            const [ytblink] = args
            await playYtbLink(voiceChannel, ytblink)
            message.reply(`Playing YtbLink`)
          }
          break
      }
    }
  } else {
    switch (command) {
      case 'baq':
        {
          const [text, author] = args
          message.reply(await addQuote(author, text))
        }
        break
      case 'brq':
        {
          const quote = await getRandomQuote()
          message.reply(quote)
        }
        break
      case 'blq':
        {
          const quotes = await getAllQuotes()
          message.reply(quotes)
        }
        break
      case 'bapl':
        {
          const [icon, playlist] = args
          message.reply(await addPlayList(icon, playlist))
        }
        break
      case 'baspl':
        {
          const [playlist, songName, ytbLink] = args
          message.reply(await addSongToPlayList(playlist, songName, ytbLink))
        }
        break
      case 'brspl':
        {
          const [playlist, songName] = args
          message.reply(await removeSongFromPlayList(playlist, songName))
        }
        break
      case 'blpl':
        {
          const playlists = await getAllPlaylists()
          message.reply(playlists)
        }
        break
      case 'bupln':
        {
          const [oldplaylistName, newPlaylistName] = args
          message.reply(await renamePlaylist(oldplaylistName, newPlaylistName))
        }
        break
    }
  }
}
