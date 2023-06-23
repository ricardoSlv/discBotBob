import { MongoClient } from 'mongodb';
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@discbotdb.ildnc.mongodb.net?retryWrites=true&w=majority`;
const DBclient = new MongoClient(uri);
let dbquotes;
let dbplaylists;
DBclient.connect().then(() => {
    const database = DBclient.db(process.env.DB_NAME);
    dbquotes = database.collection('quotes');
    dbplaylists = database.collection('playlists');
});
export async function getRandomQuote() {
    let quote = '';
    try {
        const quoteObj = await dbquotes.aggregate([{ $sample: { size: 1 } }]).next();
        quote = quoteObj
            ? `${quoteObj.text} - ${quoteObj.author}`
            : 'There are no quotes, I see nothing but darkness before me.';
    }
    catch (error) {
        console.log(error.toString());
        return null;
    }
    return quote;
}
export async function getAllQuotes() {
    let quotes = '';
    try {
        const quotesdocs = await dbquotes.find({}).toArray();
        quotes = quotesdocs.reduce((quotes, quoteObj) => quotes.concat(`${quoteObj.text} - ${quoteObj.author}`, '\n'), '\n');
    }
    catch (error) {
        console.log(error.toString());
        return null;
    }
    return quotes;
}
export async function addQuote(author, text) {
    let status = '';
    try {
        await dbquotes.insertOne({ author, text });
        status = 'The quote has been added 🙂';
    }
    catch (error) {
        console.log(error.toString());
        return 'Failed to add Quote, the book of truth was busy 🥴';
    }
    return status;
}
export async function addPlayList(icon, playlistName) {
    let status = '';
    try {
        await dbplaylists.insertOne({ icon: icon, name: playlistName, songs: [] });
        status = 'The playlist has been created 🙂';
    }
    catch (error) {
        console.log(error.toString());
        return (status = 'Failed to add Playlist, your Mom was on the way 😬');
    }
    return status;
}
export async function addSongToPlayList(playlistName, songName, ytbLink) {
    let status = '';
    try {
        const playlist = await dbplaylists.findOne({ name: playlistName });
        if (!playlist) {
            status = "The playlist doesn't exist 🙁";
        }
        else if (playlist.songs.find((x) => x.name === songName)) {
            status = 'The song is already in the playlist 🙂';
        }
        else {
            await dbplaylists.updateOne({ name: playlistName }, { $push: { songs: { name: songName, ytbLink: ytbLink } } });
            status = 'The song has been added to the playlist 🙂';
        }
    }
    catch (error) {
        console.log(error.toString());
        status = 'An error ocurred while adding the song to the playlist, not my fault 🙄';
    }
    return status;
}
export async function removeSongFromPlayList(playlistName, songName) {
    let status = '';
    try {
        const playlist = await dbplaylists.findOne({ name: playlistName });
        if (!playlist) {
            status = "The playlist doesn't exist 🙁";
        }
        else if (!playlist.songs.find((x) => x.name === songName)) {
            status = 'This song does not exist in the playlist 😯';
        }
        else {
            await dbplaylists.updateOne({ name: playlistName }, { $pull: { songs: { name: songName } } });
            status = 'The song has been removed to the playlist 👀';
        }
    }
    catch (error) {
        console.log(error.toString());
        status = 'An unseen force stopped my efforts, operation failed 👹';
    }
    return status;
}
export async function getAllPlaylists() {
    let playlists = '';
    try {
        const cursor = dbplaylists.find({});
        playlists = (await cursor.toArray())
            .map((playlist) => `\n${playlist.icon} ${playlist.name}\n${playlist.songs
            .map(({ name }) => `\u2001➤ ${name}`)
            .join('\n')}`)
            .join('\n');
    }
    catch (error) {
        console.log(error.toString());
        playlists = null;
    }
    return playlists;
}
export async function getPlaylist(playlistName) {
    try {
        return await dbplaylists.findOne({ name: playlistName });
    }
    catch (error) {
        console.log(error.toString());
        return null;
    }
}
export async function renamePlaylist(playlistName, newPlayListName) {
    let status;
    try {
        await dbplaylists.updateOne({ name: playlistName }, { $set: { name: newPlayListName } });
        status = 'The playlist was renamed 🙂';
    }
    catch (error) {
        status = error.toString();
    }
    return status;
}
