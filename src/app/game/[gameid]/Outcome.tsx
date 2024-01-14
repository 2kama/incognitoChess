import React from "react";

type Props = {
  outcome: string;
  result: string;
};

function Outcome({ outcome, result }: Props) {
  return (
    <div>
      {outcome} {result ? `: ${result}` : ""}
    </div>
  );
}

export default Outcome;
