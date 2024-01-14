import { DocumentData } from "@/utils/firebase";
import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

type TimerProp = {
  expiryTimestamp: Date;
  onExpire: () => void;
};

const setNumber = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
};

const MyTimer = ({ expiryTimestamp, onExpire }: TimerProp) => {
  const { minutes, seconds } = useTimer({ expiryTimestamp, onExpire });

  return (
    <>
      {setNumber(minutes)}:{setNumber(seconds)}
    </>
  );
};

type Props = {
  movesTime: { data: DocumentData }[];
  minutes: number;
  addSeconds: number;
  color: string;
  timerStart: boolean;
  playerTurn: boolean;
};

function Timer({
  movesTime,
  minutes,
  addSeconds,
  color,
  timerStart,
  playerTurn,
}: Props) {
  let timeGone = 0;
  let numberOfPlays = 0;

  movesTime.map((move, idx) => {
    if (move.data.color === color) {
      numberOfPlays += 1;
      timeGone +=
        move.data.timestamp?.seconds -
        movesTime[idx - 1].data.timestamp.seconds;
    }
  });

  const timer = minutes * 60 - timeGone + numberOfPlays * addSeconds;

  const time = new Date();
  time.setSeconds(time.getSeconds() + timer);

  return (
    <>
      {Number.isFinite(timer) ? (
        timerStart && playerTurn ? (
          <MyTimer expiryTimestamp={time} onExpire={() => alert("done")} />
        ) : (
          `${setNumber(Math.floor(timer / 60))}:${setNumber(timer % 60)}`
        )
      ) : (
        ""
      )}
    </>
  );
}

export default Timer;
