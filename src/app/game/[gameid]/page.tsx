"use client";
import ChessBoard from "@/app/components/ChessBoard";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { notFound } from "next/navigation";
import { useCheckDB } from "@/app/hooks/useCheckDB";
import { DocumentData, db, doc, onSnapshot, updateDoc } from "@/utils/firebase";

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
  }, [gameData]);

  return (
    <>
      <div>GamePage {gameid}</div>
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
      {gameData && (
        <ChessBoard
          gameid={gameid}
          fen={gameData?.fen}
          orientation={orientation}
          white={gameData.white}
          black={gameData.black}
          end={gameData.end}
        />
      )}
    </>
  );
}

export default GamePage;
