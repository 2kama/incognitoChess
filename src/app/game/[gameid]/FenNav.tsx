"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  end: boolean;
  fen: string;
  setHistory: Dispatch<SetStateAction<number>>;
  history: number;
  limit: number;
};

function FenNav({ fen, end, setHistory, limit, history }: Props) {
  return (
    <div className="flex flex-row gap-2 w-full">
      {end && (
        <button
          onClick={() => setHistory(history + 1)}
          disabled={history >= limit - 1}
          className={`${
            history >= limit - 1
              ? "bg-gray-400"
              : "bg-green-400 hover:bg-green-500"
          } text-white rounded  w-12 h-10`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      )}

      <div className="bg-gray-600 p-2 rounded flex-1 flex mb-5 overflow-y-scroll text-nowrap text-white">
        {fen}
      </div>
      {end && (
        <button
          className={`${
            history <= 1 ? "bg-gray-400" : "bg-green-400 hover:bg-green-500"
          } text-white rounded  w-12 h-10`}
          onClick={() => setHistory(history - 1)}
          disabled={history <= 1}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      )}
    </div>
  );
}

export default FenNav;
