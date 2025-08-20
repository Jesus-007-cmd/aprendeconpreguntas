// src/AnalisisUnivariado/analisis/DistribucionNormal.js
import { mean, varianceUnbiased, varianceMLE, rmseQuantileFitNormal, row } from "./utils.js";

export function compute(xs) {
  const mu_m = mean(xs);
  const sd_m = Math.sqrt(varianceUnbiased(xs));
  const err_m = rmseQuantileFitNormal(xs, mu_m, sd_m);   // ← debe ser número

  const mu_l = mean(xs);
  const sd_l = Math.sqrt(varianceMLE(xs));
  const err_l = rmseQuantileFitNormal(xs, mu_l, sd_l);   // ← debe ser número

  const momParam = `μ=${mu_m.toFixed(4)}, σ=${sd_m.toFixed(4)}`;
  const mleParam = `μ=${mu_l.toFixed(4)}, σ=${sd_l.toFixed(4)}`;
  console.log({ mu_m, sd_m, err_m, mu_l, sd_l, err_l });
  console.log("quepedo");

  return row(momParam, err_m, mleParam, err_l);

}
