"use client";

export const useCheckDB = () => {
  const exist = (gameid: string) => {
    return (
      localStorage.GAMES_PATCH &&
      typeof JSON.parse(localStorage.GAMES_PATCH) === "object"
    );
  };

  const player = (gameid: string) => {
    return exist(gameid)
      ? JSON.parse(localStorage.GAMES_PATCH).hasOwnProperty(gameid)
      : false;
  };

  const color = (gameid: string) => {
    return exist(gameid)
      ? JSON.parse(localStorage.GAMES_PATCH)[gameid] || "white"
      : "white";
  };

  const setGame = (side: string, gameid: string) => {
    let currentPath = exist(gameid) ? JSON.parse(localStorage.GAMES_PATCH) : {};

    localStorage.GAMES_PATCH = JSON.stringify({
      ...currentPath,
      [gameid]: side,
    });
  };

  return { exist, player, color, setGame };
};
