
export function parseQuote(msgTokens){
    let [i,author,text]=[1,'','']

    for(i;msgTokens[i]!='-';i++)
        text=text.concat(msgTokens[i],' ')
    i++
    for(i;msgTokens[i];i++)
        author=author.concat(msgTokens[i],' ')

    return [author,text]
}