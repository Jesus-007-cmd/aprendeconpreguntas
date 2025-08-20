import { mean, varianceUnbiased, varianceMLE, normInv, row, rmseQuantileFit } from "./utils.js";

// F^{-1}(p)= exp(μ + σ Φ^{-1}(p))
const invLogNorm = (mu, sigma) => (p) => Math.exp(mu + sigma * normInv(p));

export function compute(xs) {
  const pos = xs.filter(v => v > 0);
  if (pos.length === 0) return row("—", NaN, "—", NaN);

  const ys = pos.map(Math.log);
  const mu_m = mean(ys);
  const sd_m = Math.sqrt(varianceUnbiased(ys));
  const mu_l = mean(ys);
  const sd_l = Math.sqrt(varianceMLE(ys));

  const rmse_mom = rmseQuantileFit(pos, invLogNorm(mu_m, sd_m));
  const rmse_mle = rmseQuantileFit(pos, invLogNorm(mu_l, sd_l));

  const momParam = `μ=${mu_m.toFixed(4)}, σ=${sd_m.toFixed(4)}`;
  const mleParam = `μ=${mu_l.toFixed(4)}, σ=${sd_l.toFixed(4)}`;

  return row(momParam, rmse_mom, mleParam, rmse_mle);
}
