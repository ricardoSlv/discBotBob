import ytdl from 'ytdl-core'
import cron from 'node-cron'
const { schedule } = cron

const sounds = ['gong', 'chingchong', 'bruh', 'die', 'bell', 'belldie'] as const

export function isValidSound(value: string): value is typeof sounds[number] {
  return sounds.includes(value as typeof sounds[number])
}

export const soundMap = {
  gong: 'https://www.youtube.com/watch?v=r7oAsDWy6n4',
  chingchong: 'https://www.youtube.com/watch?v=8yKG9VncnBI',
  bruh: 'https://www.youtube.com/watch?v=2ZIpFytCSVc',
  die: 'https://www.youtube.com/watch?v=PtcHNvVooLQ',
  bell: 'https://www.youtube.com/watch?v=dNl4-w9ZrBs',
  belldie: 'https://www.youtube.com/watch?v=zDBrQWq82-Q'
} satisfies Record<typeof sounds[number], string>

import { VoiceChannel, TextChannel, DMChannel, NewsChannel, VoiceConnection } from 'discord.js'

async function playBell(channel: VoiceChannel, rings: number) {
  if (rings === 0) {
    setTimeout(() => {
      channel.leave()
    }, 500)
  } else {
    const connection = await channel.join()
    connection
      .play(
        ytdl('https://www.youtube.com/watch?v=dNl4-w9ZrBs', {
          filter: 'audioonly'
        })
      )
      .on('finish', () => playBell(channel, rings - 1))
  }
}

export function hourNotice(
  channel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel
) {
  return schedule('0 * * * *', () => {
    const currHour = new Date().toLocaleString('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Europe/Lisbon'
    })
    channel.send(`It's ${currHour} o'clock 🕒`)
    if (voiceChannel) {
      playBell(voiceChannel, parseInt(currHour) % 12)
    }
  })
}

export function halfHourNotice(
  channel: TextChannel | DMChannel | NewsChannel,
  voiceChannel: VoiceChannel
) {
  return schedule('30 * * * *', () => {
    const currHour = new Date().toLocaleString('en-GB', {
      hour: '2-digit',
      hour12: false,
      timeZone: 'Europe/Lisbon'
    })
    channel.send(`It's half past ${currHour} 🕒`)
    if (voiceChannel) {
      playBell(voiceChannel, 2)
    }
  })
}

export async function playYoutube(channel: VoiceChannel, link: string) {
  const connection = await channel.join()
  connection.play(ytdl(link, { filter: 'audioonly' })).on('finish', () =>
    setTimeout(() => {
      channel.leave()
    }, 500)
  )
}

export async function playPlaylist(
  channel: VoiceChannel,
  songs: { name: string; ytbLink: string }[],
  shuffle?: boolean,
  connection?: VoiceConnection
) {
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

export async function playYtbLink(channel: VoiceChannel, ytblink: string) {
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
