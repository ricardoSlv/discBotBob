
export function parseAddQuote(msgTokens){
    let [i,author,text]=[1,'','']

    for(i;msgTokens[i]!='-';i++)
        text=text.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i];i++)
        author=author.concat(msgTokens[i],' ')

    return [author.trimEnd(),text.trimEnd()]
}

export function parsePlaylist(msgTokens) {
    let [i,playList]=[1,'']

    for(i;msgTokens[i];i++)
        playList=playList.concat(msgTokens[i],' ')

    return [playList.trimEnd()]
}

export function parseTwoPlaylists(msgTokens) {
    let [i,oldPlaylistName,newPlaylistName]=[1,'','']

    for(i;msgTokens[i]!=='-';i++)
        oldPlaylistName=oldPlaylistName.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i];i++)
        newPlaylistName=newPlaylistName.concat(msgTokens[i],' ')
    
    return [oldPlaylistName.trimEnd(),newPlaylistName.trimEnd()]
}

export function parseIconPlaylist(msgTokens) {
    let [i,icon,playlist]=[1,'','']
    
    icon=msgTokens[i]
    i++
    for(i;msgTokens[i];i++)
        playlist=playlist.concat(msgTokens[i],' ')

    return [icon,playlist.trimEnd()]
}

export function parsePlaylistSongLink(msgTokens) {
    let [i,playlist,song,ytbLink]=[1,'','','']

    for(i;msgTokens[i]!='-';i++)
        playlist=playlist.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i]!='-';i++)
        song=song.concat(msgTokens[i],' ')
    i++
    ytbLink=ytbLink.concat(msgTokens[i])

    return [playlist.trimEnd(),song.trimEnd(),ytbLink.trimEnd()]
}
