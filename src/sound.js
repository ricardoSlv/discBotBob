//@ts-check

import ytdl from 'ytdl-core'
import cron from 'node-cron'
const { schedule } = cron

// import { VoiceConnection } from 'discord.js'

export const soundMap = new Map([
  ['gong', 'https://www.youtube.com/watch?v=r7oAsDWy6n4'],
  ['chingchong', 'https://www.youtube.com/watch?v=8yKG9VncnBI'],
  ['bruh', 'https://www.youtube.com/watch?v=2ZIpFytCSVc'],
  ['die', 'https://www.youtube.com/watch?v=PtcHNvVooLQ'],
  ['bell', 'https://www.youtube.com/watch?v=dNl4-w9ZrBs'],
  ['belldie', 'https://www.youtube.com/watch?v=zDBrQWq82-Q'],
])

import { VoiceChannel, TextChannel, DMChannel, NewsChannel } from 'discord.js'

/**
 * @param {VoiceChannel} channel
 * @param {number} rings
 */
async function playBell(channel, rings) {
  if (rings === 0) {
    setTimeout(() => {
      channel.leave()
    }, 500)
  } else {
    const connection = await channel.join()
    connection
      .play(
        ytdl('https://www.youtube.com/watch?v=dNl4-w9ZrBs', {
          filter: 'audioonly',
        })
      )
      .on('finish', () => playBell(channel, rings - 1))
  }
}

/**
 * @param {TextChannel | DMChannel | NewsChannel} channel
 * @param {VoiceChannel} voiceChannel
 */
export function hourNotice(channel, voiceChannel) {
  return schedule('0 * * * *', () => {
    const currHour = new Date().toLocaleString('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Europe/Lisbon',
    })
    channel.send(`It's ${currHour} o'clock 🕒`)
    if (voiceChannel) {
      playBell(voiceChannel, parseInt(currHour) % 12)
    }
  })
}

/**
 * @param {TextChannel | DMChannel | NewsChannel} channel
 * @param {VoiceChannel} voiceChannel
 */
export function halfHourNotice(channel, voiceChannel) {
  return schedule('30 * * * *', () => {
    const currHour = new Date().toLocaleString('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Europe/Lisbon',
    })
    channel.send(`It's half past ${currHour} 🕒`)
    if (voiceChannel) {
      playBell(voiceChannel, 2)
    }
  })
}

/**
 * @param {VoiceChannel} channel
 * @param {string} link
 */
export async function playYoutube(channel, link) {
  const connection = await channel.join()
  connection.play(ytdl(link, { filter: 'audioonly' })).on('finish', () =>
    setTimeout(() => {
      channel.leave()
    }, 500)
  )
}

/**
 * @param {VoiceChannel} channel
 * @param {{name: string, ytbLink: string}[]} songs
 * @param {boolean} [shuffle]
 //  * @param {VoiceConnection} [connection]
 * @param {any} [connection]
 */
export async function playPlaylist(channel, songs, shuffle, connection) {
  if (!connection) connection = await channel.join()

  if (songs.length === 0)
    setTimeout(() => {
      channel.leave()
    }, 500)
  else {
    const nextSong = shuffle ? Math.floor(Math.random() * songs.length) : 0
    let nextSongs = [...songs]
    nextSongs.splice(nextSong, 1)
    connection
      .play(ytdl(songs[nextSong].ytbLink, { filter: 'audioonly' }))
      .on('finish', () =>
        setTimeout(() => {
          playPlaylist(channel, nextSongs, shuffle, connection)
        }, 500)
      )
      .on('error', () => {
        setTimeout(() => {
          channel.leave()
        }, 500)
      })
  }
}

/**
 * @param {VoiceChannel} channel
 * @param {string} [ytblink]
 */
export async function playYtbLink(channel, ytblink) {
  const connection = await channel.join()

  connection
    .play(ytdl(ytblink, { filter: 'audioonly' }))
    .on('finish', () =>
      setTimeout(() => {
        channel.leave()
      }, 500)
    )
    .on('error', () => {
      setTimeout(() => {
        channel.leave()
      }, 500)
    })
}
