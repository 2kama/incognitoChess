"use client";
import ChessBoard from "@/app/components/ChessBoard";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

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
import Offers from "./Offers";
import FenNav from "./FenNav";
import AcceptChallenge from "./AcceptChallenge";

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
  const [history, setHistory] = useState(1);
  const [boardWidth, setBoardWidth] = useState(0);

  //GAMEBOARD DATA
  const [fen, setFen] = useState("");
  const [previousMove, setPreviousMove] = useState("");
  const [movesTime, setMovesTime] = useState<{ data: DocumentData }[]>([]);

  const boardRef = useRef<any>();

  //UPDATE GAME
  const updateGame = (updateData: any) => {
    return updateDoc(doc(db, "games", gameid), {
      ...updateData,
    });
  };

  //UPDATE MOVES
  const updateMoves = (updateData: any) => {
    addDoc(collection(db, `games/${gameid}/movesTime`), {
      ...updateData,
      timestamp: serverTimestamp(),
    });
  };

  //SEND MOVE
  const sendPlay = (
    gameFen: string,
    gameMove: string,
    gamePgn: string,
    outCome: string[]
  ) => {
    updateGame({
      fen: [...gameData?.fen, gameFen],
      moves: [...gameData?.moves, gameMove],
      pgn: [...gameData?.pgn, gamePgn],
      turn: gameData?.turn === "white" ? "black" : "white",
      outCome: outCome[0],
      result: outCome[1],
      end: outCome[2],
    });

    updateMoves({
      color: orientation,
    });
  };

  //SET WIDTH OF CHESSBOARD
  useEffect(() => {
    if (boardRef.current) {
      setBoardWidth(boardRef.current.offsetWidth);
    }
    window.addEventListener("resize", () =>
      setBoardWidth(boardRef.current.offsetWidth)
    );

    return () => {
      window.addEventListener("resize", () =>
        setBoardWidth(boardRef.current.offsetWidth)
      );
    };
  }, [gameData]);

  //GET MOVES LIST
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

  //GET GAME DATA
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

  //ACCEPT GAME
  const sendAccept = async () => {
    if (name) {
      const pickSide = gameData?.white === "" ? "white" : "black";
      await updateGame({
        [pickSide]: name,
      }).then(() => {
        setIsPlayer(true);
        setOrientation(pickSide);
        setGame(pickSide);
      });
    }
  };

  //CHECK IF IS A PLAYER
  useEffect(() => {
    exist && player ? setIsPlayer(true) : setIsPlayer(false);
  }, []);

  //CHECK IF GAME DOESN'T HAVE COMPLETE OPPONENTS
  useEffect(() => {
    if ((gameData?.white === "" || gameData?.black === "") && !isPlayer) {
      showAcceptChallenge(true);
    } else {
      showAcceptChallenge(false);
    }

    setFen(gameData?.fen[gameData.fen.length - history]);
    setPreviousMove(gameData?.moves[gameData.moves.length - history]);
  }, [gameData, history]);

  return (
    <div className="flex flex-col w-full h-screen bg-gray-800 overflow-y-scroll">
      <div className="flex-row flex bg-black h-16 w-full"></div>
      <div className="flex-1 flex-col p-5 w-full lg:max-w-[1024px] mx-auto bg-gray-800">
        <div className="w-full text-center bg-gray-600 text-white p-2 rounded">{`${gameData?.white} vs ${gameData?.black}`}</div>
        {gameData && isPlayer && movesTime.length < 2 && (
          <WaitingOnPlayer
            startGame={updateMoves}
            movesTime={movesTime}
            name={orientation === "white" ? gameData?.white : gameData?.black}
          />
        )}
        {gameData && acceptChallenge && (
          <AcceptChallenge
            sendAccept={sendAccept}
            name={name}
            setName={setName}
          />
        )}
        <div className="flex flex-col md:flex-row">
          {gameData && (
            <>
              <div
                ref={boardRef}
                className="flex flex-col mt-5 w-full md:w-3/5"
              >
                <div className="flex flex-row bg-gray-600 p-2 rounded w-full mb-5">
                  <Player
                    name={
                      orientation === "white" ? gameData.black : gameData.white
                    }
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
                    isPlayer={isPlayer}
                    updateGame={updateGame}
                  />
                </div>
                <ChessBoard
                  gameid={gameid}
                  fen={fen}
                  orientation={orientation}
                  end={gameData.end}
                  notStarted={movesTime.length < 2}
                  previousMove={previousMove}
                  sendPlay={sendPlay}
                  width={boardWidth}
                  pgn={gameData.pgn[gameData.pgn.length - history]}
                />
                <div className="flex flex-row bg-gray-600 p-2 rounded w-full mt-5">
                  <Player
                    name={
                      orientation === "white" ? gameData.white : gameData.black
                    }
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
                    isPlayer={isPlayer}
                    updateGame={updateGame}
                  />
                </div>
                {isPlayer && !gameData.end && (
                  <Offers
                    drawOffer={gameData.drawOffer}
                    updateGame={updateGame}
                    color={orientation}
                  />
                )}
              </div>
              <div className="flex flex-col mt-12 md:mt-5 md:pl-5 lg:pl-24 w-full md:w-2/5">
                <Outcome outcome={gameData.outCome} result={gameData.result} />
                <FenNav
                  fen={fen}
                  end={gameData.end}
                  setHistory={setHistory}
                  history={history}
                  limit={gameData.fen.length}
                />
                <PGNBlock
                  history={history}
                  end={gameData.end}
                  setHistory={setHistory}
                  pgn={gameData.pgn}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
