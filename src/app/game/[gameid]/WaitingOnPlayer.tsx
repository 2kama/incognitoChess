import { DocumentData } from "@/utils/firebase";
import React, { useState } from "react";

type Props = {
  movesTime: { data: DocumentData }[];
  name: string;
  startGame: (updateData: any) => void;
};

function WaitingOnPlayer({ movesTime, name, startGame }: Props) {
  const [buttonText, setButtonText] = useState("Copy link");
  const [buttonDisable, setButtonDisable] = useState(false);

  const startingGame = () => {
    setButtonDisable(true);
    startGame({ color: name });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setButtonText("Copied");
    setTimeout(() => {
      setButtonText("Copy link");
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center absolute h-full w-full z-50 opacity-90 bg-black left-0 top-0 text-center">
      {movesTime.some((el) => el.data.color === name) ? (
        <div className="text-gray-500 text-2xl">Waiting on Opponent...</div>
      ) : (
        <button
          className="text-gray-500 px-10 py-4 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-black"
          onClick={startingGame}
          disabled={buttonDisable}
        >
          Start Game
        </button>
      )}
      <div className="text-gray-200 mt-4">
        Share link to invite an opponent or invite watchers.{" "}
        <button
          onClick={() => copyLink()}
          className="bg-green-700 p-2 rounded hover:bg-green-950"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default WaitingOnPlayer;
