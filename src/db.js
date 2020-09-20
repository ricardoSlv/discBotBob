
import dotenv from 'dotenv';
dotenv.config();

import mongodb from 'mongodb';
const { MongoClient } = mongodb;
const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority`

export async function getRandomQuote(){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
    let quote = ''
    try {
      await DBclient.connect();
      const database = DBclient.db(process.env.DB_NAME)
      const collection = database.collection('quotes')
      const quoteObj = await collection.aggregate([{$sample:{size:1}}]).next()
        
      quote = `${quoteObj.text} - ${quoteObj.author}`
      
    }catch(error){
      quote = error.toString()
    } finally {
      await DBclient.close()
    }
    return quote
}

export async function getAllQuotes(){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
    let quotes = ''
    try {
        await DBclient.connect()
        const database = DBclient.db(process.env.DB_NAME)
        const collection = database.collection('quotes')
        const cursor = collection.find({})

        quotes = (await cursor.toArray())
          .reduce((quotes,quoteObj)=>quotes.concat(`${quoteObj.text} - ${quoteObj.author}`,'\n'),'\n')
      
    }catch(error){
      quotes = error.toString()
    } finally {
      await DBclient.close()
    }
    return quotes
}

export async function addQuote(authorIn,textIn){
    const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
    let status = ''
    try {
      await DBclient.connect();
      const database = DBclient.db(process.env.DB_NAME)
      const collection = database.collection('quotes')
      await collection.insertOne({author: authorIn,text: textIn})
        
      status = 'The quote has been added 🙂' 
    }catch(error){
      status = error.toString()
    } finally {
      await DBclient.close()
    }
    return status
}

export async function addPlayList(playlistName){
  const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
  let status = ''
  try {
    await DBclient.connect();
    const database = DBclient.db(process.env.DB_NAME)
    const collection = database.collection('playlists')
    await collection.insertOne({name: playlistName,songs: []})
      
    status = 'The playlist has been created 🙂' 
  }catch(error){
    status = error.toString()
  } finally {
    await DBclient.close()
  }
  return status
}

export async function addSongToPlayList(playlistName,songName,ytbLink){
  const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
  let status = ''
  try {
    await DBclient.connect();
    const database = DBclient.db(process.env.DB_NAME)
    const collection = database.collection('playlists')
    const playlist = await collection.findOne({name:playlistName})
    if(playlist){
      if(playlist.songs.find(x=>x.name===songName)){
        status = 'The song is already in the playlist 🙂'
      }
      else{
        await collection.updateOne({name:playlistName},{$push:{songs:{name:songName,ytbLink:ytbLink}}})
        status = 'The song has been added to the playlist 🙂' 
      }
    }
    else{
      status = 'The playlist doesn\'t exist 🙁'
    }
  }catch(error){
    status = error.toString()
  } finally {
    await DBclient.close()
  }
  return status
}

export async function getAllPlaylists(){
  const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
  let playlists = ''
  try {
    await DBclient.connect()
    const database = DBclient.db(process.env.DB_NAME)
    const collection = database.collection('playlists')
    const cursor = collection.find({})

    playlists = (await cursor.toArray()).map(({name,songs})=>`\n${name}\n${songs.map(({name})=>`\u2001➤ ${name}`).join('\n')}`).join('\n')
    console.log((await cursor.toArray()).map(x=>x.name))
  }catch(error){
    playlists = error.toString()
  } finally {
    await DBclient.close()
  }
  return playlists
}

export async function getPlaylist(playlistName){
  const DBclient = new MongoClient(uri,{ useUnifiedTopology: true })
  let playlist
  try {
    await DBclient.connect()
    const database = DBclient.db(process.env.DB_NAME)
    const collection = database.collection('playlists')
    playlist = await collection.findOne({name: playlistName})

  }catch(error){
    playlist = error.toString()
  } finally {
    await DBclient.close()
  }
  return playlist
}