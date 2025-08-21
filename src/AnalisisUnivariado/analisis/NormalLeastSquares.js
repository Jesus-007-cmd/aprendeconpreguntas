// src/AnalisisUnivariado/analisis/NormalLeastSquares.js
import { normInv } from "./utils.js";

// Genera función de posiciones de trazado (r = índice ascendente 1..n)
function pposFactory(method = "Gringorten") {
  const m = (method || "").toLowerCase().trim();

  // AFA (m/n): p = (r-1)/n   (coincide con F(desc) = 1 - rank/n)
  if (["afa", "afa (m/n)", "m/n", "mn", "n/m", "nm"].includes(m)) {
    return (r, n) => (r - 1) / n;
  }

  if (m === "weibull")   return (r, n) => r / (n + 1);
  if (m === "hazen")     return (r, n) => (r - 0.5) / n;
  if (m === "blom")      return (r, n) => (r - 0.375) / (n + 0.25);
  if (m === "cunnane")   return (r, n) => (r - 0.4) / (n + 0.2);

  // Gringorten (default)
  return (r, n) => (r - 0.44) / (n + 0.12);
}

/** Ajuste por mínimos cuadrados en papel normal.
 *  opts: { seDiv: "n-2"|"n-1"|"n", ppos: "..." }
 */
export function fitNormalLS(values, opts = {}) {
  const xs = (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b);
  const n = xs.length;
  if (n < 3) return null;

  const ppos = pposFactory(opts.ppos);
  const ps   = xs.map((_, i) => ppos(i + 1, n));

  // Evita p=0 o p=1 para normInv
  const eps = 1e-12;
  const zs  = ps.map(p => normInv(Math.min(1 - eps, Math.max(eps, p))));

  const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
  const mx = mean(xs), mz = mean(zs);

  const cov = xs.reduce((s, x, i) => s + (x - mx) * (zs[i] - mz), 0);
  const vzz = zs.reduce((s, z) => s + (z - mz) * (z - mz), 0);

  const sigma = vzz > 0 ? cov / vzz : 0;
  const mu = mx - sigma * mz;

  const sse = xs.reduce((s, x, i) => {
    const yhat = mu + sigma * zs[i];
    const r = x - yhat;
    return s + r * r;
  }, 0);

  const rule = (opts.seDiv || "n-2").toLowerCase();
  let denom = n - 2;
  if (rule === "n-1") denom = Math.max(1, n - 1);
  if (rule === "n")   denom = Math.max(1, n);

  const se = Math.sqrt(sse / Math.max(1, denom));
  return { n, mu, sigma, se };
}
