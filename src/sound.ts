import ytdl from 'ytdl-core'
import { schedule } from 'node-cron'

const sounds = ['gong', 'chingchong', 'bruh', 'die', 'bell', 'belldie', 'pocoto'] as const

export function isValidSound(value: string): value is typeof sounds[number] {
  return sounds.includes(value as typeof sounds[number])
}

export const soundMap: Record<typeof sounds[number], string> = {
  gong: 'https://www.youtube.com/watch?v=r7oAsDWy6n4',
  chingchong: 'https://www.youtube.com/watch?v=8yKG9VncnBI',
  bruh: 'https://www.youtube.com/watch?v=2ZIpFytCSVc',
  die: 'https://www.youtube.com/watch?v=PtcHNvVooLQ',
  bell: 'https://www.youtube.com/watch?v=dNl4-w9ZrBs',
  belldie: 'https://www.youtube.com/watch?v=zDBrQWq82-Q',
  pocoto: 'https://www.youtube.com/shorts/NeNN1nDv_Bc'
}

import { VoiceBasedChannel, TextBasedChannel } from 'discord.js'
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnection
} from '@discordjs/voice'

async function playBell(channel: VoiceBasedChannel, rings: number) {
  if (rings === 0) {
    setTimeout(() => {
      //channel.leave()
    }, 500)
  } else {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    })
    // connection
    //   .play(
    //     ytdl('https://www.youtube.com/watch?v=dNl4-w9ZrBs', {
    //       filter: 'audioonly'
    //     })
    //   )
    //   .on('finish', () => playBell(channel, rings - 1))
  }
}

export function hourNotice(channel: TextBasedChannel, voiceChannel: VoiceBasedChannel) {
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

export function halfHourNotice(channel: TextBasedChannel, voiceChannel: VoiceBasedChannel) {
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

export async function playPlaylist(
  channel: VoiceBasedChannel,
  songs: { name: string; ytbLink: string }[],
  shuffle?: boolean,
  connection?: VoiceConnection
) {
  if (!connection)
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    })

  if (songs.length === 0)
    setTimeout(() => {
      connection?.destroy()
    }, 500)
  else {
    const nextSong = shuffle ? Math.floor(Math.random() * songs.length) : 0
    let nextSongs = [...songs]
    nextSongs.splice(nextSong, 1)
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

export async function playYtbLink(channel: VoiceBasedChannel, ytblink: string) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  })

  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause
    }
  })

  player.play(createAudioResource(ytdl(ytblink, { filter: 'audioonly' })))
  connection.subscribe(player)
  player.on(AudioPlayerStatus.Idle, () => {
    setTimeout(() => {
      connection.destroy()
    }, 500)
  })
  player.on('error', () => {
    setTimeout(() => {
      connection.destroy()
    }, 500)
  })
}
