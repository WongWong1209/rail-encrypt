"use client";

import { useState, useEffect } from "react";

const MainPage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [tracks, setTracks] = useState(4);
  const [mode, setMode] = useState("encrypt");
  const [cellResource, setCellResource] = useState("");

  useEffect(() => {
    if (!text) {
      setResult("");
      return;
    }

    if (mode === "encrypt") {
      const resultText = Array(tracks).fill("");
      let row = 0;
      let step = 1;

      for (let i = 0; i < text.length; i++) {
        resultText[row] += text[i];
        if (row === 0) step = 1;
        else if (row === tracks - 1) step = -1;
        row += step;
      }
      setResult(resultText.join(""));
      setCellResource(text);
    } else if (mode === "decrypt") {
      // Calculate lengths of each row
      const rowLengths = Array(tracks).fill(0);
      let row = 0;
      let step = 1;

      // Calculate lengths
      for (let i = 0; i < text.length; i++) {
        rowLengths[row]++;
        if (row === 0) step = 1;
        else if (row === tracks - 1) step = -1;
        row += step;
      }

      // Split text into rows
      const rows = [];
      let start = 0;
      for (let i = 0; i < tracks; i++) {
        rows[i] = text.slice(start, start + rowLengths[i]);
        start += rowLengths[i];
      }

      // Reconstruct original text
      let decrypted = "";
      row = 0;
      step = 1;
      const rowIndices = Array(tracks).fill(0);

      for (let i = 0; i < text.length; i++) {
        decrypted += rows[row][rowIndices[row]];
        rowIndices[row]++;
        if (row === 0) step = 1;
        else if (row === tracks - 1) step = -1;
        row += step;
      }

      setResult(decrypted);
      setCellResource(decrypted);
    }
  }, [text, tracks, mode]);

  const cells = cellResource.split("").map((c, index) => {
    let pos;
    let cycle = 2 * (tracks - 1);
    let positionInCycle = index % cycle;

    if (positionInCycle < tracks) {
      pos = positionInCycle;
    } else {
      pos = cycle - positionInCycle;
    }

    return (
      <div key={index} className='flex flex-col mb-[1rem]'>
        {Array.from({ length: tracks }, (_, i) => (
          <div
            key={`${index}-${i}`}
            className='h-8 w-8 flex items-center justify-center border border-white/20'
          >
            {i === pos ? c : ""}
          </div>
        ))}
      </div>
    );
  });

  return (
    <div className='flex flex-col items-center gap-4 w-fit max-w-[90vw]'>
      <h1 className='font-black text-[1.5rem] mt-[1rem]'>
        Rail Encrypt & Decrypt
      </h1>
      <div className='flex flex-col'>
        <label htmlFor='plain-text'>Text:</label>
        <textarea
          spellCheck={false}
          id='plain-text'
          className='border w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2 max-w-[90vw]'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <label className='mt-1'>Track Number:</label>
        <input
          type='number'
          className='border rounded-sm border-white/50 p-1'
          value={tracks}
          min='2'
          onChange={(e) =>
            setTracks(Math.max(2, parseInt(e.target.value) || 2))
          }
        />
      </div>
      <div className='flex flex-row gap-3'>
        <select
          className='bg-black text-white border border-gray-500 rounded-lg p-2 cursor-pointer appearance-none'
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option className='bg-black text-white' value='encrypt'>
            Encrypt
          </option>
          <option className='bg-black text-white' value='decrypt'>
            Decrypt
          </option>
        </select>
      </div>
      <div className='flex flex-col'>
        <label>Result:</label>
        <textarea
          readOnly
          className='border w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2 max-w-[90vw]'
          value={result}
        />
        <button
          className='bg-black text-white border border-gray-500 rounded-lg p-2 cursor-pointer mt-2'
          onClick={() => navigator.clipboard.writeText(result)}
        >
          Copy Result
        </button>
      </div>
      <div className='flex flex-row flex-wrap max-w-[80vw]'>{cells}</div>
    </div>
  );
};

export default MainPage;
