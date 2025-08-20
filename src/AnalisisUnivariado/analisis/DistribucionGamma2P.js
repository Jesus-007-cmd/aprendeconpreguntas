// src/AnalisisUnivariado/analisis/DistribucionGamma2P.js
import { mean, varianceUnbiased, row, rmseQuantileFit, normInv } from "./utils.js";

// ---- Helpers: digamma, trigamma (aprox), invCDF gamma (Wilson–Hilferty), Newton para k ----
function digamma(x) {
  let r = 0;
  while (x < 5) { r -= 1 / x; x += 1; }
  const f = 1 / (x * x);
  return r + Math.log(x) - 0.5 / x - f * (1/12 - f * (1/120) - f * f * (1/252));
}

function trigamma(x) {
  let r = 0;
  while (x < 5) { r += 1 / (x * x); x += 1; }
  const f = 1 / (x * x);
  return r + 1 / x + 0.5 * f + (1/6) * f / x - (1/30) * f * f;
}

function invGammaApprox(k, theta) {
  return (p) => {
    const z = normInv(p);
    const t = 1 - 1 / (9 * k) + z / (3 * Math.sqrt(k));
    const q = k * t * t * t;
    return Math.max(0, theta * q);
  };
}

function mleShapeNewton(xs) {
  const m = mean(xs);
  const y = xs.map(Math.log);
  const A = Math.log(m) - mean(y);
  // init (Minka)
  let k = (3 - A + Math.sqrt((A - 3) * (A - 3) + 24 * A)) / (12 * A);
  if (!Number.isFinite(k) || k <= 0) {
    const s2 = varianceUnbiased(xs) || 1e-9;
    k = (m * m) / s2;
  }
  for (let it = 0; it < 15; it++) {
    const g = Math.log(k) - digamma(k) - A;
    const h = (1 / k) - trigamma(k);
    const step = g / h;
    k -= step;
    if (!Number.isFinite(k) || k <= 1e-8) { k = 1e-6; break; }
    if (Math.abs(step) < 1e-10) break;
  }
  return k;
}

// ---- Compute fila ----
export function compute(xs) {
  if (!xs || xs.length < 2 || xs.some(v => v <= 0)) {
    return row("—", NaN, "—", NaN);
  }

  // Momentos
  const m = mean(xs);
  const s2 = varianceUnbiased(xs);
  if (!(s2 > 0)) return row("—", NaN, "—", NaN);
  const k_mom = (m * m) / s2;
  const th_mom = s2 / m;
  const rmse_mom = rmseQuantileFit(xs, invGammaApprox(k_mom, th_mom));
  const momParam = `k=${k_mom.toFixed(4)}, θ=${th_mom.toFixed(4)}`;

  // MLE
  const k_mle = mleShapeNewton(xs);
  const th_mle = m / k_mle;
  const rmse_mle = rmseQuantileFit(xs, invGammaApprox(k_mle, th_mle));
  const mleParam = `k=${k_mle.toFixed(4)}, θ=${th_mle.toFixed(4)}`;

  return row(momParam, rmse_mom, mleParam, rmse_mle);
}
