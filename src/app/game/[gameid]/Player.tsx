"use client";
import React from "react";

type Props = {
  name: string;
};

function Player({ name }: Props) {
  return <div>{name}</div>;
}

export default Player;
