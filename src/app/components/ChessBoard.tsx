"use client";

import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useCheckDB } from "../hooks/useCheckDB";

type BoardType = {
  gameid: string;
  fen: string;
  orientation: "white" | "black";
  white: string;
  black: string;
  end: boolean;
  previousMove: string;
  sendPlay: (gameFen: string, gameMove: string) => void;
};

const highlight = { backgroundColor: "rgba(255, 255, 0, 0.3)" };

function ChessBoard({
  gameid,
  fen,
  orientation,
  white,
  black,
  end,
  previousMove,
  sendPlay,
}: BoardType) {
  const { player, color } = useCheckDB(gameid);
  const [clickPiece, setPiece] = useState("");
  const [squareStyles, setSquareStyles] = useState({});
  const [previousMoveStyles, setPreviousMoveStyles] = useState({});

  const game = new Chess(fen);

  //SHOW PREVIOUS MOVE
  useEffect(() => {
    if (previousMove) {
      const squares = previousMove.split(",");
      setPreviousMoveStyles({
        [squares[0]]: highlight,
        [squares[1]]: highlight,
      });
    }
  }, [previousMove]);

  //MOVES MADE BY DRAGGING AND DROPPING
  const onDrop = async ({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string;
    targetSquare: string;
  }) => {
    try {
      game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", //for simplicity now
      });
    } catch (error) {}
    sendPlay(game.fen(), `${sourceSquare},${targetSquare}`);
  };

  //TRACK SQUARE CLICKS AND MOVES BY CLICKS
  const onSquareClick = async (square: string) => {
    if (!player || end) return;

    const setSquareColor = () => {
      setPiece(square);
      setSquareStyles({
        [square]: highlight,
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

      sendPlay(game.fen(), `${clickPiece},${square}`);
      setPiece("");
    }
  };

  //ARE PIECES DRAGGABLE
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

  //IS USER ALLOWED TO DRAG PIECES
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
        position={fen}
        orientation={orientation}
        allowDrag={allowDrag}
        draggable={draggable()}
        onSquareClick={onSquareClick}
        onDrop={onDrop}
        squareStyles={{ ...previousMoveStyles, ...squareStyles }}
      />
      <div>{orientation === "white" ? white : black}</div>
    </>
  );
}

export default ChessBoard;
