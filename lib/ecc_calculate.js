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

const modSymmetric = (n, p) => {
  const m = ((n % p) + p) % p; // 正常的模運算
  return m > p / 2 ? m - p : m; // 映射到 -p/2 ~ p/2 範圍
};

// 點加法
export const addPoints = (P, Q, p, doMod) => {
  if (P === null) return Q; // Point at infinity + Q = Q
  if (Q === null) return P; // P + Point at infinity = P

  if (P.x === Q.x && P.y === Q.y) {
    const denominator = mod(2 * P.y, p);
    const s =
      denominator !== 0
        ? mod(3 * P.x * P.x * modInverse(denominator, p), p)
        : null;

    if (s === null) return null; // Point at infinity

    const xR = doMod
      ? mod(s * s - 2 * P.x, p)
      : modSymmetric(s * s - 2 * P.x, p);
    const yR = doMod
      ? mod(s * (P.x - xR) - P.y, p)
      : modSymmetric(s * (P.x - xR) - P.y, p);

    return { x: xR, y: yR };
  } else {
    const denominator = mod(Q.x - P.x, p);
    const s =
      denominator !== 0
        ? mod((Q.y - P.y) * modInverse(denominator, p), p)
        : null;

    if (s === null) return null; // Point at infinity

    const xR = doMod
      ? mod(s * s - P.x - Q.x, p)
      : modSymmetric(s * s - P.x - Q.x, p);
    const yR = doMod
      ? mod(s * (P.x - xR) - P.y, p)
      : modSymmetric(s * (P.x - xR) - P.y, p);

    return { x: xR, y: yR };
  }
};

export const getMultiples = (G, d, p, doMod) => {
  const result = [G];
  let current = G;
  for (let i = 1; i < d; i++) {
    current = addPoints(current, G, p, doMod);
    result.push(current);
  }
  return result;
};
