import { DocumentData } from "@/utils/firebase";
import React from "react";

type Props = {
  movesTime: { data: DocumentData }[];
  minutes: number;
  addSeconds: number;
  color: string;
};

function Timer({ movesTime, minutes, addSeconds, color }: Props) {
  let timeGone = 0;
  let numberOfPlays = 0;

  movesTime.map((move, idx) => {
    if (move.data.color === color) {
      numberOfPlays += 1;
      timeGone +=
        move.data.timestamp?.toMillis() -
        movesTime[idx - 1].data.timestamp.toMillis();
    }
  });

  const timer =
    (minutes * 60000 - timeGone + numberOfPlays * addSeconds * 1000) / 1000;

  return <>{Number.isFinite(timer) ? timer : ""}</>;
}

export default Timer;
