import { useState } from "react";
import React from "react";

const Form = () => {
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const getImage = async () => {
    setLoading(true);
    const response = await fetch(
      process.env.NEXT_PUBLIC_HUGGING_FACE_BASE_URL || "",
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY || "",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = await response.blob();
    const url = URL.createObjectURL(result);
    setLoading(false);
    setImageUrl(url);
  };
  return (
    <>
      <input
        type="text"
        placeholder="Enter something..."
        className="mt-6 p-2 h-60 rounded-lg bg-gray-800 text-white border-2 border-steampunk-bronze focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md placeholder-gray-400 text-center"
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Button */}
      <button
        // onClick={handleGenerateAvatar}
        className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
        onClick={getImage}
      >
        Generate New Avatar
      </button>
      {/* <button
          className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-lg shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
          onClick={downloadImage}
        >
          Download
        </button> */}
    </>
  );
};

export default Form;
