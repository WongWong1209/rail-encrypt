export const mod = (n, m) => ((n % m) + m) % m;

// 計算所有滿足 y^2 ≡ x^3 + 7 (mod 17) 的點
export const getCurvePoints = (a, b, p) => {
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
export const modInverse = (a, m) => {
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
};

// 點加法
export const addPoints = (P, Q, p) => {
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

export const getMultiples = (G, d, p) => {
  const result = [G];
  let current = G;
  for (let i = 1; i < d; i++) {
    current = addPoints(current, G, p);
    result.push(current);
  }
  return result;
};

export const negatePoint = (P, p) => {
  if (P === null) return null;
  return { x: P.x, y: mod(-P.y, p) };
};

export const substractPoints = (P, Q, p) => {
  return addPoints(P, negatePoint(Q, p), p);
};

export const multiplyPoints = (G, n, p) => {
  if (!G) return null;
  let result = null;
  for (let i = 0; i < n; i++) {
    result = addPoints(result, G, p);
  }
  return result;
};
