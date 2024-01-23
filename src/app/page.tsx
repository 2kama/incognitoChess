'use client'
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const play = () => {
    router.push('/game/')
  }


  return (
    <>
      <title>Incognito Chess</title>
      <div className="flex text-center w-full items-center justify-center h-full flex-col">
        <div className="text-gray-200 text-6xl italic mb-8">Incognito Chess</div>
        <button onClick={play} className="bg-green-500 text-white text-2xl p-4 rounded hover:bg-green-800">Play A Game</button>
      </div>
    </>
  );
}
