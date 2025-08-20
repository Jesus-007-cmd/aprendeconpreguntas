// src/AnalisisUnivariado/analisis/DistribucionLogNormal3P.js
import {
  mean,
  varianceUnbiased,
  varianceMLE,
  normInv,
  row,
  rmseQuantileFit
} from "./utils.js";

// invCDF de LogNormal 3P: F^{-1}(p) = γ + exp( μ + σ Φ^{-1}(p) )
function invLogNorm3P(mu, sigma, gamma) {
  return function (p) {
    return gamma + Math.exp(mu + sigma * normInv(p));
  };
}

// asimetría muestral de y
function skewness(y) {
  const n = y.length;
  if (n < 3) return Infinity;
  const m = mean(y);
  const s = Math.sqrt(varianceUnbiased(y));
  if (!(s > 0)) return Infinity;
  let t3 = 0;
  for (let i = 0; i < n; i++) {
    const z = (y[i] - m) / s;
    t3 += z * z * z;
  }
  return t3 / n;
}

export function compute(xs) {
  const n = xs?.length || 0;
  if (n < 3) return row("—", NaN, "—", NaN);

  // Rango para γ: por debajo de min(x), con un margen razonable
  let xmin = xs[0], xmax = xs[0];
  for (let i = 1; i < n; i++) {
    if (xs[i] < xmin) xmin = xs[i];
    if (xs[i] > xmax) xmax = xs[i];
  }
  const R = xmax - xmin;
  if (!(R > 0)) return row("—", NaN, "—", NaN);

  const eps = 1e-6;
  const gLow  = xmin - Math.max(0.2 * R, 1e-6); // busca un poco a la izquierda
  const gHigh = xmin - eps;                      // siempre < min(x)
  const K = 60;                                  // resolución del grid

  // ---------- MOMENTOS: γ que minimiza |asimetría( ln(x-γ) )| ----------
  let bestG_m = NaN, bestSkewAbs = Infinity, mu_m = NaN, sd_m = NaN;
  for (let k = 0; k < K; k++) {
    const g = gLow + (gHigh - gLow) * (k / (K - 1));
    // ln(x - g) válido sólo si x_i > g
    let valid = true;
    const y = new Array(n);
    for (let i = 0; i < n; i++) {
      const d = xs[i] - g;
      if (!(d > 0)) { valid = false; break; }
      y[i] = Math.log(d);
    }
    if (!valid) continue;

    const sk = Math.abs(skewness(y));
    if (sk < bestSkewAbs) {
      bestSkewAbs = sk;
      bestG_m = g;
      mu_m = mean(y);
      sd_m = Math.sqrt(varianceUnbiased(y));
    }
  }

  let rmse_mom = NaN, momParam = "—";
  if (!Number.isNaN(bestG_m) && sd_m > 0) { // chequeo de NaN
    const qMom = invLogNorm3P(mu_m, sd_m, bestG_m);
    rmse_mom = rmseQuantileFit(xs, qMom);
    momParam = `γ=${bestG_m.toFixed(4)}, μ=${mu_m.toFixed(4)}, σ=${sd_m.toFixed(4)}`;
  }

  // ---------- MLE: γ que minimiza n·ln(σ̂) + Σ ln(x-γ) ----------
  let bestG_l = NaN, mu_l = NaN, sd_l = NaN, bestObj = Infinity;
  for (let k = 0; k < K; k++) {
    const g = gLow + (gHigh - gLow) * (k / (K - 1));
    let valid = true;
    const y = new Array(n);
    let sumLogXg = 0;
    for (let i = 0; i < n; i++) {
      const d = xs[i] - g;
      if (!(d > 0)) { valid = false; break; }
      const lg = Math.log(d);
      sumLogXg += lg;
      y[i] = lg;
    }
    if (!valid) continue;

    const mu = mean(y);
    const sd = Math.sqrt(varianceMLE(y)); // MLE: divide por n
    if (!(sd > 0)) continue;

    const obj = n * Math.log(sd) + sumLogXg; // constante ignorada
    if (obj < bestObj) {
      bestObj = obj;
      bestG_l = g;
      mu_l = mu;
      sd_l = sd;
    }
  }

  let rmse_mle = NaN, mleParam = "—";
  if (!Number.isNaN(bestG_l) && sd_l > 0) {
    const qMle = invLogNorm3P(mu_l, sd_l, bestG_l);
    rmse_mle = rmseQuantileFit(xs, qMle);
    mleParam = `γ=${bestG_l.toFixed(4)}, μ=${mu_l.toFixed(4)}, σ=${sd_l.toFixed(4)}`;
  }

  return row(momParam, rmse_mom, mleParam, rmse_mle);
}
