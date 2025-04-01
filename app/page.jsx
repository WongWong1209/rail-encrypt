"use client";

import { useState, useEffect } from "react";

const MainPage = () => {
  let [text, setText] = useState("");
  let [result, setResult] = useState("");
  let [tracks, setTrack] = useState(4);
  let result_text = Array.from({ length: tracks }).fill("");

  useEffect(() => {
    setResult(() => {
      let temp = "";
      result_text.forEach((e) => {
        temp += e;
      });
      return temp;
    });
  }, [text]);

  const cells = [...text].map((c, index) => {
    let pos;
    if (Math.floor(index / (tracks - 1)) % 2 === 1) {
      // go up
      pos = tracks - (index % (tracks - 1)) - 1;
    } else {
      // go down
      pos = index % (tracks - 1);
    }

    result_text[pos] += c;

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
    <div className='flex flex-col items-center gap-4 w-[100vw]'>
      <h1 className='font-black text-[1.5rem] mt-[1rem]'>
        Trail Encrypt & Decrypt
      </h1>
      <div className='flex flex-col'>
        <label htmlFor='plain-text'>Plain Text:</label>
        <textarea
          spellCheck={false}
          id='plain-text'
          className='border min-w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2'
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
        <button></button>
        <label>Trail Number:</label>
        <input
          type='number'
          className='border rounded-sm border-white/50 p-1'
          defaultValue={4}
          onChange={(e) => setTrack(e.target.value)}
        />
      </div>
      <div className='flex flex-row gap-3'>
        <select className='bg-black text-white border border-gray-500 rounded-lg p-2 cursor-pointer appearance-none'>
          <option className='bg-black text-white' value='encrypt'>
            Encrypt
          </option>
          <option className='bg-black text-white' value='decrypt'>
            Decrypt
          </option>
        </select>
      </div>
      <div>
        <textarea
          readOnly
          className='border min-w-[30rem] min-h-[10rem] rounded-md border-white/50 p-2'
          value={result}
        />
      </div>
      <div className='flex flex-row flex-wrap max-w-[80vw]'>{cells}</div>
    </div>
  );
};

export default MainPage;
