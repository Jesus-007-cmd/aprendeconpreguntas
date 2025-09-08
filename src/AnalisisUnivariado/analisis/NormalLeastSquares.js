// src/AnalisisUnivariado/analisis/NormalLeastSquares.js
import { normInv } from "./utils.js";

/* ---------------- Utilidades ---------------- */
const rfix = (x, d) => (Number.isFinite(x) ? Number(x.toFixed(d)) : NaN);

function pposFactory(method = "Gringorten") {
  const m = (method || "").toLowerCase().trim();
  if (["afa", "afa (m/n)", "m/n", "mn", "n/m", "nm"].includes(m)) return (r, n) => (r - 1) / n;
  if (m === "weibull")   return (r, n) => r / (n + 1);
  if (m === "hazen")     return (r, n) => (r - 0.5) / n;
  if (m === "blom")      return (r, n) => (r - 0.375) / (n + 0.25);
  if (m === "cunnane")   return (r, n) => (r - 0.4) / (n + 0.2);
  return (r, n) => (r - 0.44) / (n + 0.12); // Gringorten (default)
}

// Denominador del EEA según opciones:
// - seDiv: "n", "n-1", "n-2", o "auto" (por defecto) -> usa n - np
// - np: número de parámetros de la distribución (si "auto")
function eeaDenominator(n, opts = {}, npDefault = 2) {
  const rule = (opts.seDiv || "auto").toLowerCase();
  if (rule === "n")   return Math.max(1, n);
  if (rule === "n-1") return Math.max(1, n - 1);
  if (rule === "n-2") return Math.max(1, n - 2);
  // "auto" => n - np
  const np = Number.isFinite(opts.np) ? opts.np : npDefault;
  return Math.max(1, n - np);
}

/** Ajuste LS en papel normal (para reportes detallados) */
export function fitNormalLS(values, opts = {}) {
  const xs = (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b);
  const n = xs.length;
  if (n < 3) return null;

  const ppos = pposFactory(opts.ppos);
  const ps   = xs.map((_, i) => ppos(i + 1, n));

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

  const denom = eeaDenominator(n, opts, /*npDefault*/ 2);
  const se = Math.sqrt(sse / denom);
  return { n, mu, sigma, se };
}

/** EEA con μ y σ dados (modo Excel: μ/σ redondeados a 4; x y ŷ a 3) */
export function eeaWithParams(values, opts = {}, mu, sigma, yDigits = 3) {
  const xs = (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b);
  const n = xs.length;
  if (n < 3 || !Number.isFinite(mu) || !Number.isFinite(sigma)) return NaN;

  const ppos = pposFactory(opts.ppos);
  const ps   = xs.map((_, i) => ppos(i + 1, n));
  const eps  = 1e-12;
  const zs   = ps.map(p => normInv(Math.min(1 - eps, Math.max(eps, p))));

  let sse = 0;
  for (let i = 0; i < n; i++) {
    const yhat = mu + sigma * zs[i];
    const yR   = rfix(yhat, yDigits);  // redondeo por fila como en Excel
    const xR   = rfix(xs[i], yDigits);
    const e    = xR - yR;
    sse += e * e;
  }

  const denom = eeaDenominator(n, opts, /*npDefault*/ 2);
  return Math.sqrt(sse / denom);
}
