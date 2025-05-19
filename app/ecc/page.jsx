"use client";

import ECCDots from "@/components/ecc/ecc_gs_figure";
import ECCLine from "@/components/ecc/ecc_line_figure";

import { addPoints } from "@/lib/ecc_calculate";
import { useEffect, useState } from "react";

export default function ECCPage() {
  const G = { x: 15, y: 13 };
  const [private_key, setPrivateKey] = useState(null);
  const [public_key, setPublicKey] = useState(G);

  useEffect(() => {
    let P = G;
    for (let i = 1; i < private_key; i++) {
      P = addPoints(P, G, 17);
    }
    setPublicKey(P);
  }, [private_key]);

  return (
    <div className='flex flex-row p-[3rem] gap-[3rem]'>
      <div className='flex flex-col'>
        <ECCDots />
        <ECCLine />
      </div>
      <div className='flex flex-col'>
        <div>
          <p>Generator Point : (15, 13)</p>
          <p>Line : y^2 = x^3 + 7 mod 17</p>
        </div>
        <div>
          <p>Private Key :</p>
          <input
            type='number'
            min={2}
            max={17}
            className='border-2 w-[5rem] h-[3rem]'
            onChange={(e) => setPrivateKey(Number(e.target.value))}
          />
          <p>Public Key :</p>
          <textarea
            readOnly
            value={public_key ? public_key.x + ", " + public_key.y : "error"}
          />
        </div>
      </div>
    </div>
  );
}
