"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { faPenNib } from "@fortawesome/free-solid-svg-icons";

type Props = {
  outcome: string;
  result: string;
};

function Outcome({ outcome, result }: Props) {
  return (
    <div className="bg-gray-600 p-2 rounded w-full mb-5 text-white">
      <FontAwesomeIcon icon={faPenNib} className="mr-2" /> {outcome}{" "}
      {result ? `: ${result}` : ""}
    </div>
  );
}

export default Outcome;
