"use client";
import React from "react";

type Props = {
  name: string;
};

function Player({ name }: Props) {
  return <div>{name ? name : "[No Opponent yet]"}</div>;
}

export default Player;
