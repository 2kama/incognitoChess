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
    <div className="ml-5 flex flex-col">
      <div>PGN</div>
      <div className="grid grid-cols-5 gap-2">
        {pgn.map((move, idx) => (
          <>
            {idx % 2 === 0 && <div>{(idx + 2) / 2}</div>}
            <div
              onClick={end ? () => setHistory(pgn.length - idx) : () => null}
              className={`col-span-2 ${
                end
                  ? `cursor-pointer hover:bg-green-100 ${
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
