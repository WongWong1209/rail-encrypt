"use client";

import { useRef, useEffect } from "react";
import { getMultiples } from "@/lib/ecc_calculate";

export default function ECCLine() {
  const canvasRef = useRef(null);

  const p = 34;
  const a = 0;
  const b = 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 540;
    const cell = 15;
    const canvasSize = size;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    function drawPoint(x, y) {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(size / 2 + x * cell, size / 2 - y * cell, 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 畫網格
    ctx.strokeStyle = "white";
    for (let i = 0; i <= p + 2; i++) {
      if (i === p / 2 + 1) ctx.globalAlpha = 1;
      else ctx.globalAlpha = 0.3;

      ctx.beginPath();
      ctx.moveTo(canvasSize - i * cell, 0);
      ctx.lineTo(canvasSize - i * cell, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasSize, i * cell);
      ctx.lineTo(canvasSize - size, i * cell);
      ctx.stroke();
    }

    for (let x = -34; x <= 34; x += 0.0001) {
      const ySquared = x ** 3 + 7;
      if (ySquared >= 0) {
        const y = Math.sqrt(ySquared);
        drawPoint(x, y);
        drawPoint(x, -y); // 對稱的點
      }
    }

    ctx.globalAlpha = 1;
    // 選定基點 G
    const G = { x: 15, y: 13 };
    const multiples = [];
    //getMultiples(G, 17, p, false);
    multiples.push(G);

    // 畫倍點
    ctx.fillStyle = "red";
    multiples.forEach((point, i) => {
      if (point === null) return; // Skip point at infinity
      const cx = canvasSize / 2 + point.x * cell;
      const cy = canvasSize / 2 - point.y * cell;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "yellow";
      ctx.fillText(`${i + 1}G`, cx + 6, cy - 6);
      ctx.fillStyle = "red";
    });
  }, []);

  return (
    <div className='flex justify-center mt-4'>
      <canvas ref={canvasRef} width={500} height={500} className='w-fit' />
    </div>
  );
}
