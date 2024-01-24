"use client";

import React, { useEffect, useState } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";
import { useCheckDB } from "../hooks/useCheckDB";
import useSound from "use-sound";

type BoardType = {
  gameid: string;
  fen: string;
  orientation: "white" | "black";
  end: boolean;
  previousMove: string;
  width: number;
  pgn: string;
  sendPlay: (
    gameFen: string,
    gameMove: string,
    gamePgn: string,
    outCome: any[]
  ) => void;
  notStarted: boolean;
};

const highlight = { backgroundColor: "rgba(255, 255, 0, 0.3)" };
const checkHighlight = { backgroundColor: "rgba(255, 0, 0, 0.5)" };

function ChessBoard({
  gameid,
  fen,
  orientation,
  end,
  previousMove,
  sendPlay,
  notStarted,
  width,
  pgn,
}: BoardType) {
  const { player, color } = useCheckDB();
  const [clickPiece, setPiece] = useState("");
  const [squareStyles, setSquareStyles] = useState({});
  const [previousMoveStyles, setPreviousMoveStyles] = useState({});
  const [inCheckStyles, setInCheckStyles] = useState({});

  //BOARD SOUNDS
  const [playMove] = useSound("/sounds/move.mp3");
  const [playCheck] = useSound("/sounds/check.mp3");
  const [playCapture] = useSound("/sounds/capture.mp3");
  const [playCastle] = useSound("/sounds/castle.mp3");
  const [playPromote] = useSound("/sounds/promote.mp3");

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

  //DISPLAY CURRENT GAME STATUS
  const outCome = () => {
    let color = "";
    if (game.turn() === "w") {
      color = "White";
    } else {
      color = "Black";
    }

    if (game.isThreefoldRepetition()) {
      return [`Game drawn by threefold repetition`, "1/2 - 1/2", true];
    }
    if (game.isStalemate()) {
      return ["Game is a stalement", "1/2 - 1/2", true];
    }
    if (game.isDraw()) {
      return ["Game drawn", "1/2 - 1/2", true];
    }
    if (game.isCheckmate()) {
      return [
        `${color === "Black" ? "White" : "Black"} won by checkmate`,
        `${color === "Black" ? "1 - 0" : "0 - 1"}`,
        true,
      ];
    }
    if (game.inCheck()) {
      return [
        `${color === "Black" ? "Black king in check" : "White king in check"}`,
        "",
        false,
      ];
    }
    return [
      `${color === "Black" ? "Black to play" : "White to play"}`,
      "",
      false,
    ];
  };

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
    sendPlay(
      game.fen(),
      `${sourceSquare},${targetSquare}`,
      game.history()[game.history().length - 1],
      outCome()
    );
  };

  //FIND PIECE POSITION ON THE BOARD
  const get_piece_position = (piece: { type: string; color: string }) => {
    let squares: string[] = [];
    game.board().map((row) => {
      row.map((p) => {
        if (p?.color === piece.color && p?.type === piece.type) {
          squares.push(p.square);
        }
      });
    });
    return squares;
  };

  //HIGHLIGHT KING IN CHECK AND PLAY SOUNDS
  useEffect(() => {
    if (game.isCheck()) {
      const piece = { type: "k", color: game.turn() };
      const square = get_piece_position(piece);
      setInCheckStyles({
        [square[0]]: checkHighlight,
      });
    } else {
      setInCheckStyles({});
    }

    setTimeout(() => {
      if (game.isCheck()) {
        playCheck();
      } else if (pgn === "O-O" || pgn === "O-O-O") {
        playCastle();
      } else if (pgn?.includes("=")) {
        playPromote();
      } else if (pgn?.includes("x")) {
        playCapture();
      } else {
        playMove();
      }
    }, 500);
  }, [fen]);

  //TRACK SQUARE CLICKS AND MOVES BY CLICKS
  const onSquareClick = async (square: string) => {
    if (!player(gameid) || end || notStarted) return;

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
          (game.turn() === "w" && player(gameid) && color(gameid) === "white") ||
          (game.turn() === "b" && player(gameid) && color(gameid) === "black")
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

      sendPlay(
        game.fen(),
        `${clickPiece},${square}`,
        game.history()[game.history().length - 1],
        outCome()
      );
      setPiece("");
    }
  };

  //ARE PIECES DRAGGABLE
  const draggable = () => {
    return (
      player(gameid) &&
      !game.isCheckmate() &&
      !game.isDraw() &&
      !game.isStalemate() &&
      !game.isThreefoldRepetition() &&
      !end &&
      !notStarted
    );
  };

  //IS USER ALLOWED TO DRAG PIECES
  const allowDrag = ({ piece }: { piece: string }) => {
    if (
      (game.turn() === "w" &&
        player(gameid) &&
        color(gameid) === "white" &&
        piece.search(/^w/) >= 0) ||
      (game.turn() === "b" &&
        player(gameid) &&
        color(gameid) === "black" &&
        piece.search(/^b/) >= 0)
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <Chessboard
        id={gameid}
        position={fen}
        orientation={orientation}
        allowDrag={allowDrag}
        draggable={draggable()}
        onSquareClick={onSquareClick}
        onDrop={onDrop}
        squareStyles={{
          ...inCheckStyles,
          ...previousMoveStyles,
          ...squareStyles,
        }}
        width={width}
        showNotation={false}
      />
    </>
  );
}

export default ChessBoard;
