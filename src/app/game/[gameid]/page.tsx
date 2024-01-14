"use client";
import ChessBoard from "@/app/components/ChessBoard";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { notFound } from "next/navigation";
import { useCheckDB } from "@/app/hooks/useCheckDB";
import {
  DocumentData,
  addDoc,
  collection,
  db,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "@/utils/firebase";
import PGNBlock from "./PGNBlock";
import Player from "./Player";
import Timer from "./Timer";
import WaitingOnPlayer from "./WaitingOnPlayer";
import Outcome from "./Outcome";

type Props = {
  params: { gameid: string };
};

function GamePage({ params: { gameid } }: Props) {
  const [gameData, setGameData] = useState<DocumentData | null>();
  const { exist, color, player, setGame } = useCheckDB(gameid);
  const [orientation, setOrientation] = useState(color);
  const [isPlayer, setIsPlayer] = useState(false);
  const [acceptChallenge, showAcceptChallenge] = useState(false);
  const [name, setName] = useState("");

  //GAMEBOARD DATA
  const [fen, setFen] = useState("");
  const [previousMove, setPreviousMove] = useState("");
  const [movesTime, setMovesTime] = useState<{ data: DocumentData }[]>([]);

  //SEND MOVE
  const sendPlay = (
    gameFen: string,
    gameMove: string,
    gamePgn: string,
    outCome: string[]
  ) => {
    updateDoc(doc(db, "games", gameid), {
      fen: [...gameData?.fen, gameFen],
      moves: [...gameData?.moves, gameMove],
      pgn: [...gameData?.pgn, gamePgn],
      turn: gameData?.turn === "white" ? "black" : "white",
      outCome: outCome[0],
      result: outCome[1],
      end: outCome[2],
    });

    addDoc(collection(db, `games/${gameid}/movesTime`), {
      timestamp: serverTimestamp(),
      color: orientation,
    });
  };

  const startGame = () => {
    addDoc(collection(db, `games/${gameid}/movesTime`), {
      timestamp: serverTimestamp(),
      color: orientation === "white" ? gameData?.white : gameData?.black,
    });
  };

  useEffect(() => {
    const q = query(
      collection(db, `games/${gameid}/movesTime`),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (querySnapshot) => {
      setMovesTime(
        querySnapshot.docs.map((doc) => ({
          data: doc.data(),
        }))
      );
    });

    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "games", gameid), (doc) => {
      if (doc.exists()) {
        setGameData(() => doc.data());
      } else {
        alert("not found");
      }
    });

    return unsub;
  }, []);

  const sendAccept = async () => {
    const pickSide = gameData?.white === "" ? "white" : "black";
    await updateDoc(doc(db, "games", gameid), {
      [pickSide]: name,
    }).then(() => {
      setIsPlayer(true);
      setOrientation(pickSide);
      setGame(pickSide);
    });
  };

  useEffect(() => {
    exist && player ? setIsPlayer(true) : setIsPlayer(false);
  }, []);

  useEffect(() => {
    if ((gameData?.white === "" || gameData?.black === "") && !isPlayer) {
      showAcceptChallenge(true);
    } else {
      showAcceptChallenge(false);
    }

    setFen(gameData?.fen[gameData.fen.length - 1]);
    setPreviousMove(gameData?.moves[gameData.moves.length - 1]);
  }, [gameData]);

  return (
    <>
      <div>GamePage {gameid}</div>
      {isPlayer && movesTime.length < 2 && (
        <WaitingOnPlayer
          startGame={startGame}
          movesTime={movesTime}
          name={orientation === "white" ? gameData?.white : gameData?.black}
        />
      )}
      {gameData && acceptChallenge && (
        <>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={sendAccept}>Accept</button>
        </>
      )}
      <div className="flex">
        {gameData && (
          <>
            <div className="flex flex-col">
              <Player
                name={orientation === "white" ? gameData.black : gameData.white}
              />
              <Timer
                movesTime={movesTime}
                minutes={gameData.minutes}
                addSeconds={gameData.addSeconds}
                color={orientation === "white" ? "black" : "white"}
                timerStart={movesTime.length > 1}
                playerTurn={
                  orientation === "white"
                    ? gameData.turn === "black"
                    : gameData.turn === "white"
                }
                end={gameData.end}
              />
              <ChessBoard
                gameid={gameid}
                fen={fen}
                orientation={orientation}
                end={gameData.end}
                previousMove={previousMove}
                sendPlay={sendPlay}
              />

              <Player
                name={orientation === "white" ? gameData.white : gameData.black}
              />
              <Timer
                movesTime={movesTime}
                minutes={gameData.minutes}
                addSeconds={gameData.addSeconds}
                color={orientation === "white" ? "white" : "black"}
                timerStart={movesTime.length > 1}
                playerTurn={
                  orientation === "white"
                    ? gameData.turn === "white"
                    : gameData.turn === "black"
                }
                end={gameData.end}
              />
            </div>
            <div className="flex flex-col">
              <Outcome outcome={gameData.outCome} result={gameData.result} />
              <PGNBlock pgn={gameData.pgn} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default GamePage;
