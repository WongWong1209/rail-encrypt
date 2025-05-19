"use client";
import { useEffect, useRef } from "react";
import { getCurvePoints, getMultiples } from "@/lib/ecc_calculate";

export default function ECCDots() {
  const canvasRef = useRef(null);

  const p = 17; //mod
  const a = 0;
  const b = 7;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 540;
    const cell = 30;
    const canvasSize = size + 50;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // 畫網格
    ctx.strokeStyle = "white";
    for (let i = 0; i <= p + 1; i++) {
      ctx.beginPath();
      ctx.moveTo(canvasSize - i * cell, 0);
      ctx.lineTo(canvasSize - i * cell, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(canvasSize, i * cell);
      ctx.lineTo(canvasSize - size, i * cell);
      ctx.stroke();
    }

    // 畫座標文字
    ctx.fillStyle = "white";
    ctx.font = "12px monospace";
    for (let i = 0; i <= p; i++) {
      ctx.fillText(i.toString(), i * cell + canvasSize - size - 3, size + 15);
      ctx.fillText(i.toString(), canvasSize - size - 20, size - i * cell + 3);
    }

    // 畫橢圓曲線上的點
    const points = getCurvePoints(a, b, p);
    ctx.fillStyle = "blue";
    points.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(
        x * cell + canvasSize - size,
        (p + 1 - y) * cell,
        4,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });

    // 選定基點 G
    const G = { x: 15, y: 13 };
    const multiples = getMultiples(G, 17, p, true);

    // 畫倍點
    ctx.fillStyle = "red";
    multiples.forEach((point, i) => {
      if (point === null) return; // Skip point at infinity
      const cx = point.x * cell + canvasSize - size;
      const cy = (p + 1 - point.y) * cell;
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
      <canvas ref={canvasRef} width={500} height={500} className='w-[25rem]' />
    </div>
  );
}
