// src/AnalisisUnivariado/analisis/utils.js

/** ---------- básicos ---------- **/
export const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

export const varianceUnbiased = (xs) => {
  const n = xs.length; if (n < 2) return NaN;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1);
};

export const varianceMLE = (xs) => {
  const n = xs.length; if (n < 1) return NaN;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / n;
};

/** ---------- util: Horner ---------- **/
function horner(coeffs, x) {
  let y = 0;
  for (let i = 0; i < coeffs.length; i++) y = y * x + coeffs[i];
  return y;
}

/** ---------- inversa Normal estándar (Acklam; sin nidos) ---------- **/
export function normInv(p) {
  if (!(p > 0 && p < 1) || Number.isNaN(p)) {
    throw new Error("p must be in (0,1)");
  }
  const A = [
    -39.6968302866538, 220.946098424521, -275.928510446969,
    138.357751867269, -30.6647980661472, 2.50662827745924
  ];
  const B = [
    -54.4760987982241, 161.585836858041, -155.698979859887,
    66.8013118877197, -13.2806815528857
  ];
  const C = [
    -0.00778489400243029, -0.3223964580411365, -2.40075827716184,
    -2.54973253934373, 4.37466414146497, 2.93816398269878
  ];
  const D = [0.00778469570904146, 0.32246712907004, 2.44513413714299, 3.75440866190742];

  const plow = 0.02425, phigh = 1 - plow;

  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    const num = horner(C, q);
    const den = horner([...D, 1], q);
    return num / den;
  }

  if (p > phigh) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    const num = horner(C, q);
    const den = horner([...D, 1], q);
    return -(num / den);
  }

  const q = p - 0.5;
  const r = q * q;
  const num = q * horner(A, r);
  const den = horner([...B, 1], r);
  return num / den;
}

/** ---------- RMSE por ajuste de cuantiles a Normal ---------- **/
export function rmseQuantileFitNormal(xs, mu, sigma) {
  if (!xs || xs.length === 0 || !(sigma > 0)) return NaN;
  const sorted = [...xs].sort((a, b) => a - b);
  const n = sorted.length;
  let sse = 0;
  for (let i = 0; i < n; i++) {
    const p = (i + 0.5) / n;
    const z = normInv(p);
    const q = mu + sigma * z;
    const e = sorted[i] - q;
    sse += e * e;
  }
  return Math.sqrt(sse / n);
}

/** ---------- RMSE genérico con invCDF ---------- **/
export function rmseQuantileFit(xs, invCDF) {
  if (!xs || xs.length === 0 || typeof invCDF !== "function") return NaN;
  const sorted = [...xs].sort((a, b) => a - b);
  const n = sorted.length;
  let sse = 0;
  for (let i = 0; i < n; i++) {
    const p = (i + 0.5) / n;
    const q = invCDF(p);
    const e = sorted[i] - q;
    sse += e * e;
  }
  return Math.sqrt(sse / n);
}

/** ---------- helper interfaz de fila ---------- **/
export function row(momParamString, momErr, mleParamString, mleErr) {
  const fmt = (x) => (Number.isFinite(x) ? x.toFixed(4) : "—");
  return {
    mom: { param: momParamString ?? "—", error: fmt(momErr) },
    mle: { param: mleParamString ?? "—", error: fmt(mleErr) }
  };
}
