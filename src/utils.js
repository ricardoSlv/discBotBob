
export function parseAddQuote(msgTokens){
    let [i,author,text]=[1,'','']

    for(i;msgTokens[i]!='-';i++)
        text=text.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i];i++)
        author=author.concat(msgTokens[i],' ')

    return [author.trimEnd(),text.trimEnd()]
}

export function parsePlaylist (msgTokens) {
    let [i,playList]=[1,'']

    for(i;msgTokens[i];i++)
        playList=playList.concat(msgTokens[i],' ')

    return [playList.trimEnd()]
}

export function parsePlaylistSongLink (msgTokens) {
    let [i,playlist,song,ytbLink]=[1,'','','']

    for(i;msgTokens[i]!='-';i++)
        playlist=playlist.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i]!='-';i++)
        song=song.concat(msgTokens[i],' ')
    i++
    ytbLink=ytbLink.concat(msgTokens[i],' ')

    return [playlist.trimEnd(),song.trimEnd(),ytbLink.trimEnd()]
}
