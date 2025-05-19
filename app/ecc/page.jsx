"use client";

import ECCDots from "@/components/ecc/ecc_gs_figure";
import ECCLine from "@/components/ecc/ecc_line_figure";

import {
  addPoints,
  getCurvePoints,
  multiplyPoints,
  substractPoints,
} from "@/lib/ecc_calculate";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

import { Switch } from "@/components/ui/switch";
import { ArrowBigLeft } from "lucide-react";

export default function ECCPage() {
  const G = { x: 15, y: 13 };

  const [private_key, setPrivateKey] = useState(1);
  const [public_key, setPublicKey] = useState(G);
  const [display, setDisplay] = useState(false);
  const [nk, setNk] = useState(1);

  const ops = getCurvePoints(0, 7, 17).filter((dot) => dot !== null);

  const [messageIndex, setMessageIndex] = useState(null);

  useEffect(() => {
    let P = G;
    for (let i = 1; i < private_key; i++) {
      P = addPoints(P, G, 17);
    }
    setPublicKey(P);
  }, [private_key]);

  return (
    <div className='flex flex-row p-[3rem] gap-[3rem]'>
      <div className='flex flex-rol gap-2 align-middle border-2 border-white/30 h-fit w-fit p-2 rounded-4xl'>
        <p>Dot</p>
        <Switch onCheckedChange={(checked) => setDisplay(checked)} />
        <p>Line</p>
      </div>
      <div className='flex flex-col'>
        {display ? <ECCLine /> : <ECCDots publicKey={public_key} />}
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row'>
          <div className='border-2 p-4 rounded-2xl border-white/50 w-[20rem]'>
            <p>Generator Point G : (15, 13)</p>
            <p>Line : y&#178; = x&#179; + 7 mod 17</p>
          </div>
          <p className='flex flex-row items-center ml-4'>
            <ArrowBigLeft />
            Chosen Elliptic Curve Parameters
          </p>
        </div>

        <div className='flex flex-row'>
          <div className='border-2 p-4 rounded-2xl border-white/50 w-[20rem]'>
            <div className='flex flex-row items-center gap-2'>
              <p>Private Key d :</p>
              <input
                type='number'
                min={1}
                defaultValue={1}
                className='border w-[5rem] h-[1.5rem] text-center'
                onChange={(e) => setPrivateKey(Number(e.target.value))}
              />
            </div>
            <div>
              <p>Public Key Q :</p>
              <textarea
                className='border text-center'
                readOnly
                value={
                  public_key
                    ? "( " + public_key.x + ", " + public_key.y + " )"
                    : "Point at Infinity"
                }
              />
            </div>
          </div>
          <p className='flex flex-row items-center ml-4'>
            <ArrowBigLeft />
            "A" user's keys
          </p>
        </div>

        <div className='flex flex-row'>
          <div className='border-2 p-4 rounded-2xl border-white/50 w-[20rem] flex flex-col gap-3'>
            <div className='border-2 rounded-2xl p-2'>
              <p>Choose a message P :</p>
              <div>
                {ops.map((dot, index) => {
                  console.log("awd");
                  return (
                    <button
                      key={index}
                      className={clsx(
                        "border-white/30 border-2 p-1 rounded-2xl m-0.5 hover:bg-white/10 w-[5rem]",
                        index === messageIndex && "bg-red-500"
                      )}
                      onClick={() => {
                        setMessageIndex(index);
                        console.log(index);
                      }}
                    >
                      {"( " + dot.x + ", " + dot.y + " )"}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className='flex flex-row items-center gap-2'>
              <p>Number k :</p>
              <input
                type='number'
                min={1}
                defaultValue={1}
                className='border w-[5rem] h-[1.5rem] text-center'
                onChange={(e) => setNk(Number(e.target.value))}
              />
            </div>
            <div className='border-2 rounded-2xl p-2'>
              <p>data sended to "A" :</p>
              <div className='border-2 rounded-2xl p-2 m-2'>
                <p>C&#8321; = kG</p>
                <p>
                  = {nk}G ={" "}
                  {multiplyPoints(G, nk, 17)
                    ? "( " +
                      multiplyPoints(G, nk, 17).x +
                      ", " +
                      multiplyPoints(G, nk, 17).y +
                      " )"
                    : "null"}
                </p>
                <hr className='border-2' />
                <p>C&#8322; = P + kQ</p>
                <p>
                  ={" "}
                  {messageIndex !== null
                    ? "( " +
                      ops[messageIndex].x +
                      ", " +
                      ops[messageIndex].y +
                      " )"
                    : "null"}{" "}
                  + {nk}Q
                </p>
                <p>
                  ={" "}
                  {messageIndex !== null
                    ? "( " +
                      ops[messageIndex].x +
                      ", " +
                      ops[messageIndex].y +
                      " )"
                    : "null"}{" "}
                  + {nk}
                  {public_key
                    ? "( " + public_key.x + ", " + public_key.y + " )"
                    : "null"}
                </p>
                <p>
                  ={" "}
                  {messageIndex !== null
                    ? "( " +
                      ops[messageIndex].x +
                      ", " +
                      ops[messageIndex].y +
                      " )"
                    : "null"}{" "}
                  +{" "}
                  {public_key !== null
                    ? multiplyPoints(public_key, nk, 17) !== null
                      ? "( " +
                        multiplyPoints(public_key, nk, 17).x +
                        ", " +
                        multiplyPoints(public_key, nk, 17).y +
                        " )"
                      : "null"
                    : "null"}
                </p>
                <p>
                  ={" "}
                  {messageIndex !== null && public_key !== null
                    ? addPoints(
                        ops[messageIndex],
                        multiplyPoints(public_key, nk, 17),
                        17
                      ) !== null
                      ? "( " +
                        addPoints(
                          ops[messageIndex],
                          multiplyPoints(public_key, nk, 17),
                          17
                        ).x +
                        ", " +
                        addPoints(
                          ops[messageIndex],
                          multiplyPoints(public_key, nk, 17),
                          17
                        ).y +
                        " )"
                      : "null"
                    : "null"}
                </p>
              </div>
            </div>
          </div>
          <p className='flex flex-row items-center ml-4'>
            <ArrowBigLeft />
            "B" user send message to "A" user
          </p>
        </div>

        <div className='flex flex-row'>
          <div className='border-2 p-4 rounded-2xl border-white/50 w-[20rem]'>
            <p>dC&#8321;</p>
            <p>
              = {private_key}
              {multiplyPoints(G, nk, 17) !== null
                ? "( " +
                  multiplyPoints(G, nk, 17).x +
                  ", " +
                  multiplyPoints(G, nk, 17).y +
                  " )"
                : "null"}
            </p>
            <p>
              ={" "}
              {multiplyPoints(G, nk, 17) !== null
                ? multiplyPoints(multiplyPoints(G, nk, 17), private_key, 17) !==
                  null
                  ? "( " +
                    multiplyPoints(multiplyPoints(G, nk, 17), private_key, 17)
                      .x +
                    ", " +
                    multiplyPoints(multiplyPoints(G, nk, 17), private_key, 17)
                      .y +
                    " )"
                  : "null"
                : "null"}
            </p>
            <p>= dkG = kQ</p>
            <hr className='border-2' />
            <p>P = C&#8322; - dC&#8321;</p>
            <p>= P + kQ - kQ</p>
            <p>
              ={" "}
              {messageIndex !== null && public_key !== null
                ? addPoints(
                    ops[messageIndex],
                    multiplyPoints(public_key, nk, 17),
                    17
                  ) !== null
                  ? "( " +
                    addPoints(
                      ops[messageIndex],
                      multiplyPoints(public_key, nk, 17),
                      17
                    ).x +
                    ", " +
                    addPoints(
                      ops[messageIndex],
                      multiplyPoints(public_key, nk, 17),
                      17
                    ).y +
                    " )"
                  : "null"
                : "null"}
              {" - "}
              {private_key}
              {multiplyPoints(G, nk, 17)
                ? "( " +
                  multiplyPoints(G, nk, 17).x +
                  ", " +
                  multiplyPoints(G, nk, 17).y +
                  " )"
                : "null"}
            </p>
            <p>
              ={" "}
              {messageIndex !== null &&
              public_key !== null &&
              multiplyPoints(G, nk, 17) !== null
                ? multiplyPoints(multiplyPoints(G, nk, 17), private_key, 17) !==
                  null
                  ? substractPoints(
                      addPoints(
                        ops[messageIndex],
                        multiplyPoints(public_key, nk, 17),
                        17
                      ),
                      multiplyPoints(
                        multiplyPoints(G, nk, 17),
                        private_key,
                        17
                      ),
                      17
                    ) !== null
                    ? "( " +
                      substractPoints(
                        addPoints(
                          ops[messageIndex],
                          multiplyPoints(public_key, nk, 17),
                          17
                        ),
                        multiplyPoints(
                          multiplyPoints(G, nk, 17),
                          private_key,
                          17
                        ),
                        17
                      ).x +
                      ", " +
                      substractPoints(
                        addPoints(
                          ops[messageIndex],
                          multiplyPoints(public_key, nk, 17),
                          17
                        ),
                        multiplyPoints(
                          multiplyPoints(G, nk, 17),
                          private_key,
                          17
                        ),
                        17
                      ).y +
                      " )"
                    : "null"
                  : "null"
                : "null"}
            </p>
          </div>
          <p className='flex flex-row items-center ml-4'>
            <ArrowBigLeft />
            "A" user decrypt "B" user's message
          </p>
        </div>
      </div>
    </div>
  );
}
