// Gumbel(μ, β). MoM + MLE (optimización 1D sobre β; μ(β) tiene forma cerrada).
import { mean, varianceUnbiased, row, rmseQuantileFit } from "./utils.js";

const EULER_GAMMA = 0.5772156649015329;
const SQ6_OVER_PI = Math.sqrt(6) / Math.PI;

// invCDF exacta: F^{-1}(p) = μ - β ln(-ln p)
const invGumbel = (mu, beta) => (p) => mu - beta * Math.log(-Math.log(p));

// μ(β) que satisface ∑e^{-(x-μ)/β} = n  → μ = β ln( n / ∑e^{-x/β} )
function muGivenBeta(xs, beta) {
  const n = xs.length;
  let s = 0;
  for (let i = 0; i < n; i++) s += Math.exp(-xs[i] / beta);
  return beta * Math.log(n / s);
}

// log-verosimilitud profiled L(β) con μ(β)
function profiledLogLik(xs, beta) {
  const n = xs.length;
  if (!(beta > 0)) return -Infinity;
  const mu = muGivenBeta(xs, beta);
  let sumT = 0;
  for (let i = 0; i < n; i++) sumT += (xs[i] - mu) / beta;
  // Con la condición de μ(β), Σ e^{-t_i} = n ⇒ el término Σ e^{-t_i} = n es constante.
  return -n * Math.log(beta) - sumT - n;
}

// Maximiza L(β) por búsqueda de oro (1D, robusto)
function mleBeta(xs) {
  // Inicializamos en MoM
  const s = Math.sqrt(varianceUnbiased(xs));
  const beta0 = s * SQ6_OVER_PI;
  let a = beta0 / 10, b = beta0 * 10;
  for (let i = 0; i < 60; i++) {
    const c = b - (b - a) / 1.61803398875;
    const d = a + (b - a) / 1.61803398875;
    if (profiledLogLik(xs, c) < profiledLogLik(xs, d)) a = c; else b = d;
  }
  return (a + b) / 2;
}

export function compute(xs) {
  if (!xs || xs.length < 2) return row("—", NaN, "—", NaN);

  // --- Momentos
  const m = mean(xs);
  const s = Math.sqrt(varianceUnbiased(xs));
  const beta_m = s * SQ6_OVER_PI;
  const mu_m = m - EULER_GAMMA * beta_m;
  const rmse_m = rmseQuantileFit(xs, invGumbel(mu_m, beta_m));
  const momParam = `μ=${mu_m.toFixed(4)}, β=${beta_m.toFixed(4)}`;

  // --- MLE (1D en β con μ(β) cerrado)
  const beta_l = mleBeta(xs);
  const mu_l = muGivenBeta(xs, beta_l);
  const rmse_l = rmseQuantileFit(xs, invGumbel(mu_l, beta_l));
  const mleParam = `μ=${mu_l.toFixed(4)}, β=${beta_l.toFixed(4)}`;

  return row(momParam, rmse_m, mleParam, rmse_l);
}
