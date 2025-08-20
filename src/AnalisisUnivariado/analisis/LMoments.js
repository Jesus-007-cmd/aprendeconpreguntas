// src/AnalisisUnivariado/analisis/LMoments.js

// Combinaciones cerradas para r=0..3 (lo que necesitamos para b0..b3)
function comb(a, r) {
    if (r < 0) return 0;
    if (r === 0) return 1;
    if (r === 1) return a;
    if (r === 2) return (a * (a - 1)) / 2;
    if (r === 3) return (a * (a - 1) * (a - 2)) / 6;
    // No necesitamos r>3, pero lo dejo por si quieres extender
    let num = 1, den = 1;
    for (let i = 1; i <= r; i++) {
      num *= (a - (i - 1));
      den *= i;
    }
    return num / den;
  }
  
  // b_r = (1/n) * sum_{k=r+1..n} [ C(k-1, r) / C(n-1, r) ] * x_{k:n}
  function pwmBr(sorted, r) {
    const n = sorted.length;
    if (n === 0) return NaN;
    if (r >= n) return NaN;
    const denom = comb(n - 1, r);
    if (denom <= 0) return NaN;
    let acc = 0;
    for (let k = r + 1; k <= n; k++) {
      const w = comb(k - 1, r) / denom;
      acc += w * sorted[k - 1];
    }
    return acc / n;
  }
  
  /**
   * Calcula L-momentos hasta l4 y L-skewness/kurtosis (tau3,tau4)
   * returns:
   * {
   *   n, mean, sorted,
   *   b0,b1,b2,b3,
   *   l1,l2,l3,l4,
   *   tau3,tau4,
   *   weights: { r1: [...], r2: [...], r3: [...] } // opcional, para tablar pesos/contribuciones
   * }
   */
  export function computeLMoments(values, withWeights = true) {
    const xs = (values || []).filter(Number.isFinite);
    const n = xs.length;
    if (n < 1) return null;
  
    const sorted = xs.slice().sort((a, b) => a - b);
    const mean = xs.reduce((a, b) => a + b, 0) / n;
  
    const b0 = pwmBr(sorted, 0); // = l1
    const b1 = n >= 2 ? pwmBr(sorted, 1) : NaN;
    const b2 = n >= 3 ? pwmBr(sorted, 2) : NaN;
    const b3 = n >= 4 ? pwmBr(sorted, 3) : NaN;
  
    let l1 = b0;
    let l2 = NaN, l3 = NaN, l4 = NaN, tau3 = NaN, tau4 = NaN;
  
    if (Number.isFinite(b1)) {
      l2 = 2 * b1 - b0;
    }
    if (Number.isFinite(b2) && Number.isFinite(b1)) {
      l3 = 6 * b2 - 6 * b1 + b0;
    }
    if (Number.isFinite(b3) && Number.isFinite(b2) && Number.isFinite(b1)) {
      l4 = 20 * b3 - 30 * b2 + 12 * b1 - b0;
    }
  
    if (Number.isFinite(l2) && Math.abs(l2) > 0) {
      if (Number.isFinite(l3)) tau3 = l3 / l2;
      if (Number.isFinite(l4)) tau4 = l4 / l2;
    }
  
    // Opcional: tabla de pesos/contribuciones para r=1..3 (como apoyo visual)
    let weights = undefined;
    if (withWeights) {
      weights = {};
      const makeRows = (r) => {
        if (n <= r) return [];
        const denom = comb(n - 1, r);
        const rows = [];
        for (let k = r + 1; k <= n; k++) {
          const w = comb(k - 1, r) / denom;
          const x = sorted[k - 1];
          rows.push({
            k,
            x,
            weight: w,
            contribution: (w * x) / n // ojo: b_r = (1/n)*sum w*x  => contrib para promediar
          });
        }
        return rows;
      };
      weights.r1 = n >= 2 ? makeRows(1) : [];
      weights.r2 = n >= 3 ? makeRows(2) : [];
      weights.r3 = n >= 4 ? makeRows(3) : [];
    }
  
    return {
      n, mean, sorted,
      b0, b1, b2, b3,
      l1, l2, l3, l4,
      tau3, tau4,
      weights
    };
  }
  