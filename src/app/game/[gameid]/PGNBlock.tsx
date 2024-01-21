"use client";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  pgn: string[];
  setHistory: Dispatch<SetStateAction<number>>;
  end: boolean;
  history: number;
};

function PGNBlock({ pgn, setHistory, history, end }: Props) {
  return (
    <div className="flex flex-col bg-gray-600 p-2 rounded text-white w-full text-xs h-[350px] overflow-y-scroll">
      <div className="grid grid-cols-5 gap-2">
        {pgn.map((move, idx) => (
          <>
            {idx % 2 === 0 && <div className="px-2">{(idx + 2) / 2}</div>}
            <div
              onClick={end ? () => setHistory(pgn.length - idx) : () => null}
              className={`col-span-2 px-2 ${
                end
                  ? `rounded cursor-pointer hover:bg-green-100 hover:text-gray-800 ${
                      pgn.length - history === idx ? "bg-green-300" : ""
                    }`
                  : ""
              }`}
            >
              {move}
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default PGNBlock;
