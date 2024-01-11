

export const useCheckDB = (
    gameid: string
) => {

    const exist = localStorage.GAMES_PATCH && typeof JSON.parse(localStorage.GAMES_PATCH) === "object"
    const player = exist ? JSON.parse(localStorage.GAMES_PATCH).hasOwnProperty(gameid) : false
    const color = exist ? JSON.parse(localStorage.GAMES_PATCH)[gameid] || "white" : "white"

    let currentPath = exist ? JSON.parse(localStorage.GAMES_PATCH) : {}
    
    const setGame = (side: string) => {
        localStorage.GAMES_PATCH = JSON.stringify({...currentPath, [gameid]: side})
    }

    

    return { exist, player, color, setGame }

}