// src/AnalisisUnivariado/analisis/NormalMLE.js
import { mean, varianceMLE, row, rmseQuantileFit, normInv } from "./utils.js";

const invNormal = (mu, sigma) => (p) => mu + sigma * normInv(p);

/**
 * Normal (solo MLE)
 * - μ̂ = mean(x)
 * - σ̂ = sqrt( varianceMLE(x) )  // divide por n
 * - Error estándar del ajuste: RMSE de cuantiles (como el resto de la app)
 * Devuelve "—" en Momentos (porque ya no usamos MoM para Normal).
 */
export function compute(xs) {
  const n = xs?.length || 0;
  if (n < 2) return row("—", NaN, "—", NaN);

  const mu = mean(xs);
  const sigma = Math.sqrt(varianceMLE(xs));

  const rmse_mle = rmseQuantileFit(xs, invNormal(mu, sigma));
  const mleParam = `μ=${mu.toFixed(4)},  σ=${sigma.toFixed(4)}`;

  // <- MoM vacío; MLE con parámetros y error
  return row("—", NaN, mleParam, rmse_mle);
}
