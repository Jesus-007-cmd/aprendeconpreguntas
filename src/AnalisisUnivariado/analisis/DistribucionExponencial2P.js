// src/AnalisisUnivariado/analisis/DistribucionExponencial2P.js
import { mean, varianceUnbiased, row, rmseQuantileFit } from "./utils.js";

// invCDF Exp2P: q(p) = gamma - ln(1-p)/lambda
const invExp2P = (lambda, gamma) => (p) => gamma - Math.log(1 - p) / lambda;

export function compute(xs) {
  if (!xs || xs.length < 2) return row("—", NaN, "—", NaN);

  // ---------- Momentos ----------
  const m = mean(xs);
  const s2 = varianceUnbiased(xs);
  const xmin = Math.min(...xs);

  if (!(s2 > 0)) return row("—", NaN, "—", NaN);

  let lambda_m = 1 / Math.sqrt(s2);
  let gamma_m  = m - 1 / lambda_m;

  // Garantizar soporte: gamma < min(x)
  if (!(gamma_m < xmin)) {
    gamma_m = xmin - 1e-6;
    lambda_m = 1 / (m - gamma_m);
  }

  const rmse_m = rmseQuantileFit(xs, invExp2P(lambda_m, gamma_m));
  const momParam = `γ=${gamma_m.toFixed(4)}, λ=${lambda_m.toFixed(4)}`;

  // ---------- MLE ----------
  const gamma_l = xmin; // MLE cerrada
  const lambda_l = 1 / (m - gamma_l);
  const rmse_l = rmseQuantileFit(xs, invExp2P(lambda_l, gamma_l));
  const mleParam = `γ=${gamma_l.toFixed(4)}, λ=${lambda_l.toFixed(4)}`;

  return row(momParam, rmse_m, mleParam, rmse_l);
}
