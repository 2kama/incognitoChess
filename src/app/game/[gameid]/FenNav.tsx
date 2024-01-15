import React, { Dispatch, SetStateAction } from "react";

type Props = {
  end: boolean;
  fen: string;
  setHistory: Dispatch<SetStateAction<number>>;
  history: number;
  limit: number;
};

function FenNav({ fen, end, setHistory, limit, history }: Props) {
  return (
    <div className="flex flex-row gap-2">
      {end && (
        <button
          onClick={() => setHistory(history + 1)}
          disabled={history >= limit - 1}
        >
          &lt;
        </button>
      )}

      <div>{fen}</div>
      {end && (
        <button onClick={() => setHistory(history - 1)} disabled={history <= 1}>
          &gt;
        </button>
      )}
    </div>
  );
}

export default FenNav;
