"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useCheckDB } from "../hooks/useCheckDB";
import { addDoc, collection, db, serverTimestamp } from "@/utils/firebase";

function Game() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [min, setMin] = useState(0);
  const [sec, setSec] = useState(0);

  const createGame = async () => {
    await addDoc(collection(db, "games"), {
      fen: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
      pgn: [],
      minutes: min,
      addSeconds: sec,
      white: name,
      black: "",
      timestamp: serverTimestamp(),
      end: false,
      moves: [],
      turn: "white",
      outCome: "White to play",
      result: "",
      drawOffer: "",
      chat: [],
    }).then((docRef) => {
      const { setGame } = useCheckDB(docRef.id);
      setGame("white");
      router.push(`/game/${docRef.id}`);
    });
  };

  return (
    <>
      <div>Game Find</div>

      <input
        placeholder="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="min"
        type="number"
        value={min}
        onChange={(e) => setMin(Number(e.target.value))}
      />
      <input
        placeholder="sec"
        type="number"
        value={sec}
        onChange={(e) => setSec(Number(e.target.value))}
      />
      <button onClick={createGame}>Create Game</button>
    </>
  );
}

export default Game;
