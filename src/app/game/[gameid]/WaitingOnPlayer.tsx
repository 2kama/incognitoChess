import { DocumentData } from "@/utils/firebase";
import React from "react";

type Props = {
  movesTime: { data: DocumentData }[];
  name: string;
  startGame: (updateData: any) => void;
};

function WaitingOnPlayer({ movesTime, name, startGame }: Props) {
  return (
    <>
      {movesTime.some((el) => el.data.color === name) ? (
        "Waiting on Opponent"
      ) : (
        <button onClick={() => startGame({ color: name })}>Start Game</button>
      )}
    </>
  );
}

export default WaitingOnPlayer;
