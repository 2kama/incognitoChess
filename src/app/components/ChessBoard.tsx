"use client";

import React, { useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useCheckDB } from "../hooks/useCheckDB";
import { db, doc, updateDoc } from "@/utils/firebase";

type BoardType = {
  gameid: string;
  fen: string[];
  orientation: "white" | "black";
  white: string;
  black: string;
  end: boolean;
};

function ChessBoard({
  gameid,
  fen,
  orientation,
  white,
  black,
  end,
}: BoardType) {
  const { player, color } = useCheckDB(gameid);
  const [clickPiece, setPiece] = useState("");
  const [squareStyles, setSquareStyles] = useState({});

  let newSquareStyles = {};

  const game = new Chess(fen[fen.length - 1]);

  const onSquareClick = async (square: string) => {
    if (!player || end) return;

    const sendPlay = (fen: string[]) => {
        updateDoc(doc(db, 'games', gameid), {
            fen
        })
    }

    const setSquareColor = () => {
      setPiece(square);
      setSquareStyles({
        [square]: { backgroundColor: "rgba(255, 255, 0, 0.3)" },
      });
    };

    if (clickPiece === "") {
      setSquareColor();
    } else {
      if (
        !(
          (game.turn() === "w" && player && color === "white") ||
          (game.turn() === "b" && player && color === "black")
        )
      ) {
        return setSquareColor();
      }

      try {
        game.move({
          from: clickPiece,
          to: square,
          promotion: "q", //for simplicity now
        });
      } catch (error) {
        return setSquareColor();
      }

      setPiece("");
      sendPlay([...fen, game.fen()])
      
    }
  };

  const draggable = () => {
    return (
      player &&
      !game.isCheckmate() &&
      !game.isDraw() &&
      !game.isStalemate() &&
      !game.isThreefoldRepetition() &&
      !end
    );
  };

  const allowDrag = ({ piece }: { piece: string }) => {
    if (
      (game.turn() === "w" &&
        player &&
        color === "white" &&
        piece.search(/^w/) >= 0) ||
      (game.turn() === "b" &&
        player &&
        color === "black" &&
        piece.search(/^b/) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div>{orientation === "white" ? black : white}</div>
      <Chessboard
        id={gameid}
        position={fen[fen.length - 1]}
        orientation={orientation}
        allowDrag={allowDrag}
        draggable={draggable()}
        onSquareClick={onSquareClick}
        squareStyles={{ ...newSquareStyles, ...squareStyles }}
      />
      <div>{orientation === "white" ? white : black}</div>
    </>
  );
}

export default ChessBoard;
