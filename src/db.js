//@ts-check

import dotenv from 'dotenv'
dotenv.config()

import mongodb from 'mongodb'
const { MongoClient } = mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority`

const DBclient = new MongoClient(uri, { useUnifiedTopology: true })
let dbquotes
let dbplaylists
DBclient.connect().then(() => {
  const database = DBclient.db(process.env.DB_NAME)
  dbquotes = database.collection('quotes')
  dbplaylists = database.collection('playlists')
})

export async function getRandomQuote() {
  let quote = ''
  try {
    DBclient.connect()
    const quoteObj = await dbquotes.aggregate([{ $sample: { size: 1 } }]).next()
    quote = `${quoteObj.text} - ${quoteObj.author}`
  } catch (error) {
    quote = error.toString()
  }
  return quote
}

export async function getAllQuotes() {
  DBclient.connect()
  let quotes = ''
  try {
    const cursor = dbquotes.find({})

    /**
     * @type {{ text: any; author: any; }[]} quoteObj
     */
    const quotesdocs = await cursor.toArray()
    quotes = quotesdocs.reduce(
      (quotes, quoteObj) => quotes.concat(`${quoteObj.text} - ${quoteObj.author}`, '\n'),
      '\n'
    )
  } catch (error) {
    quotes = error.toString()
  }
  return quotes
}

/**
 * @param {string} author
 * @param {string} text
 */
export async function addQuote(author, text) {
  DBclient.connect()
  console.log(author, text)
  let status = ''
  try {
    await dbquotes.insertOne({ author, text })
    status = 'The quote has been added 🙂'
  } catch (error) {
    status = error.toString()
  }
  return status
}

/**
 * @param {string} icon
 * @param {string} playlistName
 */
export async function addPlayList(icon, playlistName) {
  DBclient.connect()
  let status = ''
  try {
    await dbplaylists.insertOne({ icon: icon, name: playlistName, songs: [] })
    status = 'The playlist has been created 🙂'
  } catch (error) {
    status = error.toString()
  }
  return status
}

/**
 * @param {string} playlistName
 * @param {string} songName
 * @param {string} ytbLink
 */
export async function addSongToPlayList(playlistName, songName, ytbLink) {
  DBclient.connect()
  let status = ''
  try {
    /**
     * @type {{name: string, icon: string, songs:{name: string, ytbLink: string}[]}}
     */
    const playlist = await dbplaylists.findOne({ name: playlistName })
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
    status = error.toString()
  } finally {
    await DBclient.close()
  }
  return status
}

export async function getAllPlaylists() {
  DBclient.connect()
  let playlists = ''
  try {
    const cursor = dbplaylists.find({})

    playlists = (await cursor.toArray())
      .map(
        ({ name, icon, songs }) =>
          `\n${icon} ${name}\n${songs.map(({ name }) => `\u2001➤ ${name}`).join('\n')}`
      )
      .join('\n')
  } catch (error) {
    playlists = error.toString()
  }
  return playlists
}

/**
 * @param {string} playlistName
 */
export async function getPlaylist(playlistName) {
  let playlist
  try {
    playlist = await dbplaylists.findOne({ name: playlistName })
  } catch (error) {
    playlist = error.toString()
  } finally {
    await DBclient.close()
  }
  return playlist
}

/**
 * @param {string} playlistName
 * @param {string} newPlayListName
 */
export async function renamePlaylist(playlistName, newPlayListName) {
  let status
  try {
    await dbplaylists.updateOne({ name: playlistName }, { $set: { name: newPlayListName } })
    status = 'The playlist was renamed 🙂'
  } catch (error) {
    status = error.toString()
  } finally {
    await DBclient.close()
  }
  return status
}
