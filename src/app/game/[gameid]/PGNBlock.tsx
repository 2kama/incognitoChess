import React from "react";

type Props = {
  pgn: string[];
};

function PGNBlock({ pgn }: Props) {
  return (
    <div className="ml-5 flex flex-col">
      <div>PGN</div>
      <div className="grid grid-cols-5 gap-2">
        {pgn.map((move, idx) => (
          <>
            {idx % 2 === 0 && <div>{(idx + 2) / 2}</div>}
            <div className="col-span-2">{move}</div>
          </>
        ))}
      </div>
    </div>
  );
}

export default PGNBlock;
