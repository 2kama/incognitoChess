"use client";

import React, { useRef } from "react";

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
    <div className="flex">
      <dialog ref={dialog}>
        <p>Do you want to resign?</p>
        <button
          onClick={() =>
            sendUpdate({
              end: true,
              outCome: `${color} resigned`,
              result: color === "white" ? "0 - 1" : "1 - 0",
            })
          }
        >
          Yes
        </button>
        <button onClick={() => dialog.current.close()}>No</button>
      </dialog>
      {drawOffer ? (
        drawOffer === color ? (
          <></>
        ) : (
          <div>
            Draw Offered!{" "}
            <button
              onClick={() =>
                sendUpdate({
                  end: true,
                  outCome: "Settled in a draw",
                  result: "1/2 - 1/2",
                })
              }
            >
              Accept
            </button>
            <button onClick={() => sendUpdate({ drawOffer: "" })}>
              Reject
            </button>
          </div>
        )
      ) : (
        <button onClick={() => sendUpdate({ drawOffer: color })}>
          Offer Draw
        </button>
      )}

      <button onClick={() => dialog.current.showModal()}>Resign</button>
    </div>
  );
}

export default Offers;
