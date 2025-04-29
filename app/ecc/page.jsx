"use client";
import { useEffect, useRef } from "react";

export default function ECCCurve() {
  const canvasRef = useRef(null);

  const p = 17; // 模數
  const a = 0;
  const b = 7;

  const mod = (n, m) => ((n % m) + m) % m;

  // 計算所有滿足 y^2 ≡ x^3 + 7 (mod 17) 的點
  const getCurvePoints = () => {
    const points = [];
    for (let x = 0; x < p; x++) {
      const rhs = mod(x ** 3 + a * x + b, p);
      for (let y = 0; y < p; y++) {
        if (mod(y * y, p) === rhs) {
          points.push({ x, y });
        }
      }
    }
    return points;
  };

  // 模逆元
  const modInverse = (a, m) => {
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) return x;
    }
    return null;
  };

  // 點加法
  const addPoints = (P, Q) => {
    if (P === null) return Q; // Point at infinity + Q = Q
    if (Q === null) return P; // P + Point at infinity = P
    if (P.x === Q.x && P.y === Q.y) {
      const denominator = mod(2 * P.y, p);
      const s =
        denominator !== 0
          ? mod(3 * P.x * P.x * modInverse(denominator, p), p)
          : null;
      if (s === null) return null; // Point at infinity
      const xR = mod(s * s - 2 * P.x, p);
      const yR = mod(s * (P.x - xR) - P.y, p);
      return { x: xR, y: yR };
    } else {
      const denominator = mod(Q.x - P.x, p);
      const s =
        denominator !== 0
          ? mod((Q.y - P.y) * modInverse(denominator, p), p)
          : null;
      if (s === null) return null; // Point at infinity
      const xR = mod(s * s - P.x - Q.x, p);
      const yR = mod(s * (P.x - xR) - P.y, p);
      return { x: xR, y: yR };
    }
  };

  const getMultiples = (G, d) => {
    const result = [G];
    let current = G;
    for (let i = 1; i < d; i++) {
      current = addPoints(current, G);
      result.push(current);
    }
    return result;
  };

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
    const points = getCurvePoints();
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
    const multiples = getMultiples(G, 17);

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
      <canvas ref={canvasRef} width={500} height={500} className='' />
    </div>
  );
}
