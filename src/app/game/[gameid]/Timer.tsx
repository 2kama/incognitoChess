"use client";
import { DocumentData } from "@/utils/firebase";
import React from "react";
import { useTimer } from "react-timer-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

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
  const { hours, minutes, seconds } = useTimer({ expiryTimestamp, onExpire });

  return (
    <>
      {hours > 0 ? `${setNumber(hours)}:` : ""}
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
  end: boolean;
  isPlayer: boolean;
  updateGame: (updateData: any) => void;
};

function Timer({
  movesTime,
  minutes,
  addSeconds,
  color,
  timerStart,
  playerTurn,
  end,
  isPlayer,
  updateGame,
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

  const sendUpdate = () => {
    updateGame({
      outCome: `${color} lost on time`,
      end: true,
      result: color === "black" ? "1 - 0" : "0 - 1",
    });
  };

  const timer = minutes * 60 - timeGone + numberOfPlays * addSeconds;

  if (timer - addSeconds <= 0) {
    sendUpdate();
  }

  const time = new Date();
  time.setSeconds(time.getSeconds() + timer);

  return (
    <div className="pl-4 flex-row flex gap-3">
      <FontAwesomeIcon className="text-white mt-1" icon={faClock} />{" "}
      {!end && Number.isFinite(timer) ? (
        timerStart && playerTurn ? (
          <div className="text-red-500">
            <MyTimer
              expiryTimestamp={time}
              onExpire={isPlayer ? () => sendUpdate() : () => null}
            />
          </div>
        ) : (
          <div className="text-white">
            {`${
              Math.floor(timer / 3600) > 0
                ? `${setNumber(Math.floor(timer / 3600))}:`
                : ""
            }${setNumber(Math.floor((timer % 3600) / 60))}:${setNumber(
              timer % 60
            )}`}
          </div>
        )
      ) : (
        <div className="text-white">--:--</div>
      )}
    </div>
  );
}

export default Timer;
