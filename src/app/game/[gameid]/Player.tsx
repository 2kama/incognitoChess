"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faChessKnight } from "@fortawesome/free-solid-svg-icons";

type Props = {
  name: string;
};

function Player({ name }: Props) {
  return (
    <div className="flex-1 text-white">
      <FontAwesomeIcon className="mr-2" icon={faChessKnight} />
      {name ? name : "[No Opponent yet]"}
    </div>
  );
}

export default Player;
