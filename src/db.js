
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
        const database=DBclient.db(process.env.DB_NAME)
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
        const database=DBclient.db(process.env.DB_NAME)
        const collection = database.collection('quotes')
        const cursor = collection.find({})

        quotes=(await cursor.toArray())
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
        collection.insertOne({author: authorIn,text: textIn})
        
        status = 'The quote has been added 🙂' 
    }catch(error){
        status = error.toString()
    } finally {
        await DBclient.close()
    }
    return status
}