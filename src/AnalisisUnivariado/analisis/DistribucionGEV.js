// GEV(ξ, μ, σ). Implementación práctica inicial: usa ξ≈0 (Gumbel) como aproximación.
// Deja el invCDF general para cuando quieras estimar ξ ≠ 0 (p.ej. por L-momentos).
import { mean, varianceUnbiased, row, rmseQuantileFit, normInv } from "./utils.js";

const EULER_GAMMA = 0.5772156649015329;
const SQ6_OVER_PI = Math.sqrt(6) / Math.PI;

// invCDF general (si ξ≈0, usar límite Gumbel)
function invGEV(xi, mu, sigma) {
  if (Math.abs(xi) < 1e-6) {
    return (p) => mu - sigma * Math.log(-Math.log(p)); // Gumbel
  }
  return (p) => {
    const t = -Math.log(p);
    return mu + (sigma / xi) * (Math.pow(t, -xi) - 1);
  };
}

export function compute(xs) {
  if (!xs || xs.length < 2) return row("—", NaN, "—", NaN);

  // Aproximación inicial: ξ=0 → ajusta Gumbel por momentos
  const m = mean(xs);
  const s = Math.sqrt(varianceUnbiased(xs));
  const sigma0 = s * SQ6_OVER_PI;
  const mu0 = m - EULER_GAMMA * sigma0;
  const xi0 = 0; // placeholder

  const rmse_m = rmseQuantileFit(xs, invGEV(xi0, mu0, sigma0));
  const momParam = `ξ≈0, μ=${mu0.toFixed(4)}, σ=${sigma0.toFixed(4)}`;

  // MLE placeholder (igual a MoM por ahora). Cuando estimes ξ, cambia aquí.
  const rmse_l = rmse_m;
  const mleParam = momParam;

  return row(momParam, rmse_m, mleParam, rmse_l);
}
