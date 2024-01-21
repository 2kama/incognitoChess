import { DocumentData } from "@/utils/firebase";
import React from "react";

type Props = {
  movesTime: { data: DocumentData }[];
  name: string;
  startGame: (updateData: any) => void;
};

function WaitingOnPlayer({ movesTime, name, startGame }: Props) {
  return (
    <div className="flex items-center justify-center absolute h-full w-full z-50 opacity-90 bg-black left-0 top-0 text-center">
      {movesTime.some((el) => el.data.color === name) ? (
        <div className="text-gray-500 text-2xl">Waiting on Opponent...</div>
      ) : (
        <button
          className="text-gray-500 px-10 py-4 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-black"
          onClick={() => startGame({ color: name })}
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default WaitingOnPlayer;
