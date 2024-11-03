"use client";

import axios from "axios";
import { Contract, BrowserProvider } from "ethers";
import MyNFTMinter from "./artifacts/contracts/MyNFTMinter.json";
import MetaMaskConnect from "./components/MetamaskConnect";
import { createMetadata } from "./utils/createMetadata";
import { mintNFT } from "./utils/mintNFT";
import { uploadToIpfs } from "./utils/uploadToIpfs";
import { ethers } from "ethers";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  type Category =
    | "Style"
    | "Character Type"
    | "Direction"
    | "Facial Feature"
    | "Mood - Emotion"
    | "Mood - Color"
    | "Mood - Tone"
    | "Era"
    | "Location"
    | "Lighting";
  type InputName =
    | "firstInput"
    | "secondInput"
    | "thirdInput"
    | "fourthInput"
    | "fifthInput"
    | "sixthInput"
    | "sevenInput"
    | "eightInput"
    | "ninthInput"
    | "tenthInput"
    | "elevenInput"
    | "twelveInput"
    | "thirteenInput";

  type SuggestionsData = Record<InputName, string[]>;
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [inputValues, setInputValues] = useState({
    firstInput: "",
    secondInput: "",
    thirdInput: "",
    fourthInput: "",
    fifthInput: "",
    sixthInput: "",
    sevenInput: "",
    eightInput: "",
    ninthInput: "",
    tenthInput: "",
    elevenInput: "",
    twelveInput: "",
    thirteenInput: "",
  });

  const suggestionsData: SuggestionsData = {
    firstInput: ["Realistic", "Anime", "Cartoon", "Cyberpunk", "Vintage"],
    secondInput: ["Human", "Giraffe", "Dog", "Cat", "Robot"],
    thirdInput: [
      "Clean Shaved",
      "Subtle Beard",
      "Tattoo",
      "Scar",
      "Face Paint",
    ],
    fourthInput: ["Right", "Left", "Straight", "Behind"],
    fifthInput: [],
    sixthInput: ["Sad", "Anger", "Joyful", "Fearful", "Surprised"],
    sevenInput: [
      "Deep Blue",
      "Dark Purple",
      "Calming Green",
      "Soft Pink",
      "Fiery Red",
    ],
    eightInput: [
      "Expressing Melancholy",
      "Enigmatic",
      "Serene",
      "Dreamy",
      "Explosive",
    ],
    ninthInput: [],
    tenthInput: [],
    elevenInput: ["Victorian-era", "Retro-era", "Cyberpunk-era"],
    twelveInput: [
      "Urban Alleyway",
      "Underground Bunker",
      "Bazaar Complex",
      "Residential Complex",
      "Industrial Complex",
    ],
    thirteenInput: ["Golden Hour", "Neon", "Moonlight", "Backlight", "Dim"],
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>("Style");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [activeInput, setActiveInput] = useState<InputName | null>(null);

  const inputRefs = useRef<Record<InputName, HTMLInputElement | null>>({
    firstInput: null,
    secondInput: null,
    thirdInput: null,
    fourthInput: null,
    fifthInput: null,
    sixthInput: null,
    sevenInput: null,
    eightInput: null,
    ninthInput: null,
    tenthInput: null,
    elevenInput: null,
    twelveInput: null,
    thirteenInput: null,
  });

  const [filteredSuggestions, setFilteredSuggestions] = useState<
    Partial<Record<InputName, string[]>>
  >({});

  const handleInputChange = (name: InputName, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    for (const key in filteredSuggestions) {
      const inputName = key as InputName;
      inputRefs.current[inputName]?.focus();
    }

    const matches = suggestionsData[name].filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [name]: matches,
    }));
    setActiveInput(name);
  };

  // Handle suggestion click
  const handleSuggestionClick = (name: InputName, suggestion: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: suggestion,
    }));
    setFilteredSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [name]: [],
    }));
    setActiveInput(null);
  };

  const handleInputFocus = (name: InputName) => {
    setActiveInput(name);
    setFilteredSuggestions((prevSuggestions) => ({
      ...prevSuggestions,
      [name]: suggestionsData[name],
    }));
  };

  useEffect(() => {
    for (const key in filteredSuggestions) {
      const inputName = key as InputName;
      inputRefs.current[inputName]?.focus();
    }
  }, [filteredSuggestions]);

  const getImage = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `Generate a steampunk-themed avatar in a 
    ${inputValues.firstInput || "realistic"}
     style. The face resembles a 
    ${inputValues.secondInput || "giraffe"}
    with facial features such as 
    ${inputValues.thirdInput || "beard"}
      , looking towards the 
    ${inputValues.fourthInput || "right"}
      , and wearing apparel such as
    ${inputValues.fifthInput || "goggles"}.
      The eyes are a 
      ${inputValues.sixthInput || "sad"},
      ${inputValues.sevenInput || "deep blue"},
      ${inputValues.eightInput || "expressing melancholy"}
    }. The image should incorporate steampunk elements, such as 
    ${inputValues.ninthInput || "metallic gears"}
      ${inputValues.tenthInput || "pipes"}
    }, and the background is of a 
    ${inputValues.elevenInput || "Victorian-era styled"} 
    ${inputValues.twelveInput || "industrial complex"} with 
    ${inputValues.thirteenInput || "dim"} lighting.`;

    console.log(prompt);
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
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
    const file = new (File as any)([result], "Steampunk NFT", {
      type: result.type,
    });

    console.log(file);

    setFile(file);
    setLoading(false);
    setImageUrl(url);
  };

  // Combine steps to handle the minting process
  const handleMint = async () => {
    if (!file) {
      alert("Image not generated");
      return;
    }

    setMinting(true);
    setStatus("Uploading image to IPFS...");

    const metadata = {
      name: "Steampunk NFT",
      description: "This Steampunk NFT was generated at HackNJIT",
      image: imageUrl,
      attributes: [],
    };

    try {
      const metadataURL = await uploadToIpfs(file, metadata);
      console.log("Metadata URL:", metadataURL);

      setStatus("Minting NFT on Polygon...");
      await mintNFT(metadataURL || "");

      setStatus("Successfully minted");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Error minting NFT. Check console for details.");
    } finally {
      setMinting(false);
    }
  };

  const InputField = ({
    label,
    name,
    value,
    placeholder,
    suggestions,
  }: {
    label: string;
    name: InputName;
    value: string;
    placeholder: string;
    suggestions: string[];
  }) => (
    <div className="m-3 relative">
      <label htmlFor={name} className="block mb-2">
        {label}
      </label>
      <input
        ref={(el) => {
          inputRefs.current[name] = el;
        }}
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => handleInputChange(name, e.target.value)}
        onFocus={() => setActiveInput(name)}
        className="p-2 border rounded w-full"
        placeholder={placeholder}
        autoComplete="off"
      />
      {activeInput === name && suggestions.length > 0 && (
        <ul className="absolute mt-1 bg-white border rounded shadow-lg w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(name, suggestion)}
              className="cursor-pointer hover:bg-blue-100 p-2"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
      <header className="mt-3 flex flex-col">
        <div className="text-8xl font-[family-name:var(--font-wake-snake)]">
          Steampunk Avatar
        </div>

        <MetaMaskConnect />
      </header>
      <main className="flex flex-col w-full gap-8 row-start-2 items-center">
        <div className="flex w-full">
          <div className="flex-1 p-5 max-w-lg items-start bg-gray-900 rounded-lg border-4 border-steampunk-bronze shadow-cyberpunk">
            {loading ? (
              <div className="white">Loading...</div>
            ) : (
              imageUrl && (
                <img
                  className="h-auto rounded"
                  src={imageUrl}
                  alt="Cyberpunk Avatar"
                  height="full"
                />
              )
            )}
          </div>
          <div className="flex flex-1 flex-col min-w-96 ml-28">
            <form
              className="space-y-4 p-4 border rounded-md flex flex-col"
              onSubmit={getImage}
            >
              {/* Row 1 */}
              <div className="flex flex-row">
                <InputField
                  label="Theme"
                  name="firstInput"
                  value={inputValues.firstInput}
                  placeholder="realistic"
                  suggestions={filteredSuggestions.firstInput || []}
                />
                <InputField
                  label="Face"
                  name="secondInput"
                  value={inputValues.secondInput}
                  placeholder="giraffe"
                  suggestions={filteredSuggestions.secondInput || []}
                />
                <InputField
                  label="Facial Features"
                  name="thirdInput"
                  value={inputValues.thirdInput}
                  placeholder="subtle beard"
                  suggestions={filteredSuggestions.thirdInput || []}
                />
              </div>

              {/* Row 2 */}
              <div className="flex flex-row">
                <InputField
                  label="Looking Towards"
                  name="fourthInput"
                  value={inputValues.fourthInput}
                  placeholder="right"
                  suggestions={filteredSuggestions.fourthInput || []}
                />
                <InputField
                  label="Wearing Apparel"
                  name="fifthInput"
                  value={inputValues.fifthInput}
                  placeholder="goggles"
                  suggestions={filteredSuggestions.fifthInput || []}
                />
                <InputField
                  label="Emotion"
                  name="sixthInput"
                  value={inputValues.sixthInput}
                  placeholder="Sad"
                  suggestions={filteredSuggestions.sixthInput || []}
                />
              </div>

              {/* Row 3 */}
              <div className="flex flex-row">
                <InputField
                  label="Eye Color"
                  name="sevenInput"
                  value={inputValues.sevenInput}
                  placeholder="deep-blue"
                  suggestions={filteredSuggestions.sevenInput || []}
                />
                <InputField
                  label="Eyes Expression"
                  name="eightInput"
                  value={inputValues.eightInput}
                  placeholder="expressing melancholy"
                  suggestions={filteredSuggestions.eightInput || []}
                />
                <InputField
                  label="Steampunk Element 1"
                  name="ninthInput"
                  value={inputValues.ninthInput}
                  placeholder="metallic gears"
                  suggestions={filteredSuggestions.ninthInput || []}
                />
              </div>

              {/* Row 4 */}
              <div className="flex flex-row">
                <InputField
                  label="SP Element 2"
                  name="tenthInput"
                  value={inputValues.tenthInput}
                  placeholder="pipes"
                  suggestions={filteredSuggestions.tenthInput || []}
                />
                <InputField
                  label="Background Style"
                  name="elevenInput"
                  value={inputValues.elevenInput}
                  placeholder="Victorian-era styled"
                  suggestions={filteredSuggestions.elevenInput || []}
                />
                <InputField
                  label="Background Place"
                  name="twelveInput"
                  value={inputValues.twelveInput}
                  placeholder="industrial complex"
                  suggestions={filteredSuggestions.twelveInput || []}
                />
                <InputField
                  label="Lighting"
                  name="thirteenInput"
                  value={inputValues.thirteenInput}
                  placeholder="dim"
                  suggestions={filteredSuggestions.thirteenInput || []}
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Generate New Avatar
              </button>
            </form>
            {/* <button
              className="mt-4 px-6 py-2 rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-lg shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={downloadImage}
            >
              Download
            </button> */}
            <a
              href={imageUrl}
              download={"Steampunk NFT.jpg"}
              className="mt-4 px-6 py-2 w-fit rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Download image
            </a>
            <button
              className="mt-4 px-6 py-2 w-fit rounded-lg bg-steampunk-bronze text-gray-800 font-bold border border-gray-600 hover:bg-gray-800 hover:text-steampunk-bronze transition-colors duration-200 ease-in-out shadow-cyberpunk focus:outline-none focus:ring-2 focus:ring-cyan-400"
              onClick={handleMint}
            >
              Mint as NFT
            </button>
            {status}
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Testing
      </footer>
    </div>
  );
}
