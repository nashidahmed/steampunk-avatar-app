import Image from "next/image"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <header className="text-8xl font-[family-name:var(--font-wake-snake)]">
          Steampunk Avatar
        </header>
        <div className="relative p-5 bg-gray-900 rounded-lg border-4 border-steampunk-bronze shadow-cyberpunk">
          <Image
            className="w-full h-auto rounded"
            src="/Colorful-Modern-Steampunk-Digital-Art-47929309-1.png"
            alt="Cyberpunk Avatar"
            width={180}
            height={38}
            priority
          />
        </div>
        <input
          type="text"
          placeholder="Enter something..."
          className="mt-6 p-2 w-64 rounded-lg bg-gray-800 text-white border-2 border-steampunk-bronze focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md placeholder-gray-400 text-center"
        />

        {/* Button */}
        <button
          // onClick={handleGenerateAvatar}
          className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-lg shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Generate New Avatar
        </button>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  )
}
