import dotenv from 'dotenv'
dotenv.config()

import mongodb from 'mongodb'
const { MongoClient } = mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority`

const DBclient = new MongoClient(uri, { useUnifiedTopology: true })
let dbquotes: mongodb.Collection<any>
let dbplaylists: mongodb.Collection<any>
DBclient.connect().then(() => {
  const database = DBclient.db(process.env.DB_NAME)
  dbquotes = database.collection('quotes')
  dbplaylists = database.collection('playlists')
})

export async function getRandomQuote() {
  let quote = ''
  try {
    const quoteObj = await dbquotes.aggregate([{ $sample: { size: 1 } }]).next()
    console.log('Quote:', quoteObj)
    quote = `${quoteObj.text} - ${quoteObj.author}`
  } catch (error) {
    quote = (error as Error).toString()
  }
  return quote
}

export async function getAllQuotes() {
  let quotes = ''
  try {
    const quotesdocs: { text: any; author: any }[] = await dbquotes.find({}).toArray()

    quotes = quotesdocs.reduce(
      (quotes, quoteObj) => quotes.concat(`${quoteObj.text} - ${quoteObj.author}`, '\n'),
      '\n'
    )
  } catch (error) {
    quotes = (error as Error).toString()
  }
  return quotes
}

export async function addQuote(author: string, text: string) {
  let status = ''
  try {
    await dbquotes.insertOne({ author, text })
    status = 'The quote has been added 🙂'
  } catch (error) {
    status = (error as Error).toString()
  }
  return status
}

export async function addPlayList(icon: string, playlistName: string) {
  let status = ''
  try {
    await dbplaylists.insertOne({ icon: icon, name: playlistName, songs: [] })
    status = 'The playlist has been created 🙂'
  } catch (error) {
    status = (error as Error).toString()
  }
  return status
}

export async function addSongToPlayList(playlistName: string, songName: string, ytbLink: string) {
  let status = ''
  try {
    const playlist: { name: string; icon: string; songs: { name: string; ytbLink: string }[] } =
      await dbplaylists.findOne({ name: playlistName })
    if (playlist) {
      if (playlist.songs.find((x) => x.name === songName)) {
        status = 'The song is already in the playlist 🙂'
      } else {
        await dbplaylists.updateOne(
          { name: playlistName },
          { $push: { songs: { name: songName, ytbLink: ytbLink } } }
        )
        status = 'The song has been added to the playlist 🙂'
      }
    } else {
      status = "The playlist doesn't exist 🙁"
    }
  } catch (error) {
    status = (error as Error).toString()
  }
  return status
}

export async function removeSongFromPlayList(playlistName: string, songName: string) {
  let status = ''
  try {
    const playlist: { name: string; icon: string; songs: { name: string; ytbLink: string }[] } =
      await dbplaylists.findOne({ name: playlistName })
    if (playlist) {
      if (!playlist.songs.find((x) => x.name === songName)) {
        status = 'This song does not exist in the playlist 😯'
      } else {
        await dbplaylists.updateOne(
          { name: playlistName },
          { $pull: { songs: { name: songName } } }
        )
        status = 'The song has been removed to the playlist 👀'
      }
    } else {
      status = "The playlist doesn't exist 🙁"
    }
  } catch (error) {
    status = (error as Error).toString()
  }
  return status
}

export async function getAllPlaylists() {
  let playlists = ''
  try {
    const cursor = dbplaylists.find({})

    playlists = (await cursor.toArray())
      .map(
        (playlist: { name: string; icon: string; songs: Array<{ name: string }> }) =>
          `\n${playlist.icon} ${playlist.name}\n${playlist.songs
            .map(({ name }) => `\u2001➤ ${name}`)
            .join('\n')}`
      )
      .join('\n')
  } catch (error) {
    playlists = (error as Error).toString()
  }
  return playlists
}

export async function getPlaylist(playlistName: string) {
  try {
    return await dbplaylists.findOne({ name: playlistName })
  } catch (error) {
    return (error as Error).toString()
  }
}

export async function renamePlaylist(playlistName: string, newPlayListName: string) {
  let status: string
  try {
    await dbplaylists.updateOne({ name: playlistName }, { $set: { name: newPlayListName } })
    status = 'The playlist was renamed 🙂'
  } catch (error) {
    status = (error as Error).toString()
  }
  return status
}
