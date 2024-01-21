"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import {
  faChessKing,
  faFlag,
  faHandshake,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type Props = {
  updateGame: (updateData: any) => void;
  color: string;
  drawOffer: string;
};

function Offers({ updateGame, color, drawOffer }: Props) {
  const dialog = useRef<any>();

  const sendUpdate = (data: any) => {
    dialog.current.close();
    updateGame({
      ...data,
    });
  };

  return (
    <div className="flex mt-5 gap-4 w-full">
      <dialog className="w-96 rounded p-4" ref={dialog}>
        <div className="flex flex-col w-full">
          <p className="w-full text-center mb-5">Do you want to resign?</p>
          <div className="flex flex-row gap-2">
            <button
              onClick={() =>
                sendUpdate({
                  end: true,
                  outCome: `${color} resigned`,
                  result: color === "white" ? "0 - 1" : "1 - 0",
                })
              }
              className="w-1/2 bg-blue-400 text-white rounded py-2 hover:bg-blue-500"
            >
              Yes
            </button>
            <button
              className="w-1/2 bg-red-400 text-white rounded py-2 hover:bg-red-500"
              onClick={() => dialog.current.close()}
            >
              No
            </button>
          </div>
        </div>
      </dialog>
      {drawOffer ? (
        drawOffer === color ? (
          <></>
        ) : (
          <div className="w-1/2 flex gap-2">
            <div className="flex-1 bg-gray-600 rounded p-2 text-white">
              Draw Offered!
            </div>

            <button
              onClick={() =>
                sendUpdate({
                  end: true,
                  outCome: "Settled in a draw",
                  result: "1/2 - 1/2",
                })
              }
              className="bg-blue-400 text-white rounded p-3 hover:bg-blue-500 w-12"
            >
              <FontAwesomeIcon icon={faHandshake} />
            </button>
            <button
              className="bg-red-400 text-white w-12 rounded p-3 hover:bg-red-500"
              onClick={() => sendUpdate({ drawOffer: "" })}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )
      ) : (
        <button
          className="w-1/2 bg-blue-400 text-white rounded py-3 hover:bg-blue-500"
          onClick={() => sendUpdate({ drawOffer: color })}
        >
          Offer Draw <FontAwesomeIcon icon={faFlag} />
        </button>
      )}

      <button
        className="w-1/2 bg-red-400 text-white rounded py-3 hover:bg-red-500"
        onClick={() => dialog.current.showModal()}
      >
        Resign <FontAwesomeIcon icon={faChessKing} />
      </button>
    </div>
  );
}

export default Offers;
