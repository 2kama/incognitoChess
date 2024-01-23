import { faChessKing, faChessKnight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  outCome: string;
  result: string;
  setShowEndGame: Dispatch<SetStateAction<boolean>>;
};

function EndGame({ outCome, result, setShowEndGame }: Props) {
  return (
    <div className="flex flex-col items-center justify-center absolute h-full w-full z-50 opacity-90 bg-black left-0 top-0 text-center">
      <div className="flex flex-col bg-white w-80 p-4 rounded">
        <div className="text-right w-full font-bold">
          <div
            onClick={() => setShowEndGame(false)}
            className="text-red-800 cursor-pointer w-1"
          >
            X
          </div>
        </div>
        {
            result === '1/2 - 1/2' ? <FontAwesomeIcon size="4x" color='gray' className="mb-5" icon={faChessKnight} /> : <FontAwesomeIcon size="4x" color={result === "1 - 0" ? 'white' : 'black'} strokeWidth={12} stroke="black" className="mb-5" icon={faChessKing} />
        }
        
        <div className="text-2xl mb-2">{outCome}</div>
        <div className="text-4xl text-red-800 font-bold">{result}</div>
      </div>
    </div>
  );
}

export default EndGame;
