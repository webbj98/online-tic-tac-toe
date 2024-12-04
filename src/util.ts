export function getLobbyKeyFromUrl() {
    if (!window.location.href.includes('lobby')) {
        throw Error('User is not in a lobby');
    }
    const splitUrl = window.location.href.split('/')
    return splitUrl[splitUrl.length - 1]
}