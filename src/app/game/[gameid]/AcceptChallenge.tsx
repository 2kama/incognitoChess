import React, { Dispatch, SetStateAction } from "react";

type Props = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  sendAccept: () => void;
};

function AcceptChallenge({ name, setName, sendAccept }: Props) {
  return (
    <div className="flex flex-col absolute h-full w-full z-50 opacity-90 bg-black left-0 top-0 items-center justify-center text-center">
      <div className="text-gray-500 text-2xl mb-4">Accept Challenge</div>
      <input
        className="text-gray-500 focus:border-orange-300 p-4 border-2 outline-none border-gray-500 bg-transparent rounded mb-4 text-center"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        disabled={!name}
        className="text-gray-500 px-10 py-4 border-2 border-gray-500 rounded-lg hover:bg-gray-500 hover:text-black"
        onClick={sendAccept}
      >
        Accept
      </button>
    </div>
  );
}

export default AcceptChallenge;
