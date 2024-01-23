"use client";
import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useCheckDB } from "../hooks/useCheckDB";
import {
  addDoc,
  and,
  collection,
  db,
  doc,
  getDocs,
  limit,
  or,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "@/utils/firebase";

function Game() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(0);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [gameID, setGameID] = useState('unknown');

  const { setGame } = useCheckDB(gameID);

  const side = ["black", "white"];

  const createGame = async () => {
    setButtonDisable(true);
    const shuffleSide = side[Math.round(Math.random())];
    await addDoc(collection(db, "games"), {
      fen: ["rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"],
      pgn: [],
      minutes: min,
      addSeconds: sec,
      white: shuffleSide === "white" ? name : "",
      black: shuffleSide === "black" ? name : "",
      timestamp: serverTimestamp(),
      end: false,
      moves: [],
      turn: "white",
      outCome: "White to play",
      result: "",
      drawOffer: "",
    }).then((docRef) => {
      setGameID(docRef.id)
      setGame(shuffleSide);
      router.push(`/game/${docRef.id}`);
    });
  };

  const findGame = async () => {
    setButtonDisable(true);
    const q = query(
      collection(db, "games"),
      and(
        or(where("black", "==", ""), where("white", "==", "")),
        where("minutes", "==", min),
        where("addSeconds", "==", sec)
      ),
      limit(1)
    );
    const request = await getDocs(q);

    if (request.docs.length) {
      const gameData = request.docs[0];
      const pickSide = gameData.data().white === "" ? "white" : "black";

      updateDoc(doc(db, "games", gameData.id), {
        [pickSide]: name,
      }).then(() => {
        setGameID(gameData.id);
        setGame(pickSide);
        router.push(`/game/${gameData.id}`);
      });
    } else {
      setButtonDisable(false);
      alert("Looks like there are currently no open games with your specifics");
    }
  };

  const minsOpt = [1, 2, 3, 5, 10, 20];
  const secsOpt = [0, 1, 3, 5];

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <title>Incognito Chess | Play New Game</title>
      <div className="text-gray-300 text-3xl mb-4">Play New Game</div>
      <div className="flex flex-col w-full rounded bg-gray-600 p-4 items-center">
        <input
          placeholder="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-gray-200 w-80 max-w-[100%] focus:border-orange-300 p-4 border-2 outline-none border-gray-200 bg-transparent rounded mb-4 text-center"
        />

        <div className="flex">
          <select
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="text-gray-200 outline-none p-4 border-2 border-gray-200 bg-transparent rounded"
          >
            {minsOpt.map((m) => (
              <option value={m} key={m}>
                {m} min
              </option>
            ))}
          </select>
          <select
            value={sec}
            onChange={(e) => setSec(Number(e.target.value))}
            className="text-gray-800 p-2 outline-none rounded"
          >
            {secsOpt.map((s) => (
              <option value={s} key={s}>
                {s}s
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-5">
          <div className="flex flex-col">
            <button
              disabled={!name || buttonDisable}
              className="px-10 py-4 text-gray-200 bg-blue-400 rounded hover:bg-blue-800"
              onClick={createGame}
            >
              Create Game
            </button>
            <div className="text-xs text-gray-200 py-1 px-4">
              You already have an opponent you wanna play with
            </div>
          </div>
          <div className="flex flex-col">
            <button
              disabled={!name || buttonDisable}
              className="px-10 py-4 text-gray-200 bg-red-400 rounded hover:bg-red-800"
              onClick={findGame}
            >
              Find Game
            </button>
            <div className="text-xs text-gray-200 py-1 px-4">
              You would like to be randomly matched with an opponent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
