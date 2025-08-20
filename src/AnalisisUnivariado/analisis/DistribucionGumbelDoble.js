// src/AnalisisUnivariado/analisis/DistribucionGumbelDoble.js
import { mean, varianceUnbiased, row, rmseQuantileFit } from "./utils.js";

// Quantiles
const qGumbelMax = (mu, beta) => (p) => mu - beta * Math.log(-Math.log(p));        // máximos
const qGumbelMin = (mu, beta) => (p) => mu + beta * Math.log(-Math.log(1 - p));     // mínimos

// ---------- MoM (Gumbel máximos) ----------
function momGumbelMax(arr) {
  const m = mean(arr);
  const s = Math.sqrt(varianceUnbiased(arr));
  if (!(s > 0)) return null;
  const gammaE = 0.5772156649015329;
  const beta = (Math.sqrt(6) / Math.PI) * s;
  const mu = m - gammaE * beta;
  if (!(beta > 0) || !Number.isFinite(mu)) return null;
  return { mu, beta };
}

// ---------- MLE (Gumbel máximos) ----------
// Ecuación fija en β: β = x̄ - (Σ x_i e^{-x_i/β}) / (Σ e^{-x_i/β})
// y luego μ = β * ln(n / Σ e^{-x_i/β})
function mleGumbelMax(arr) {
  const n = arr?.length || 0;
  if (n < 3) return null;

  const xbar = mean(arr);
  const s = Math.sqrt(varianceUnbiased(arr));
  let beta = Math.max((Math.sqrt(6) / Math.PI) * (s || 1e-6), 1e-6); // semilla MoM, >0

  const maxIt = 200;
  const tol = 1e-10;
  for (let it = 0; it < maxIt; it++) {
    let A = 0; // Σ e^{-x_i/β}
    let B = 0; // Σ x_i e^{-x_i/β}
    for (let i = 0; i < n; i++) {
      const w = Math.exp(-arr[i] / beta);
      A += w;
      B += arr[i] * w;
    }
    let betaNew = xbar - B / A;                // ecuación fija
    if (!Number.isFinite(betaNew) || betaNew <= 0) {
      betaNew = Math.max(beta * 0.5, 1e-6);    // amortiguación si se descarrila
    }
    const delta = Math.abs(betaNew - beta);
    beta = 0.5 * beta + 0.5 * betaNew;         // damping
    if (delta < tol) break;
  }

  // μ con β final
  let A = 0;
  for (let i = 0; i < n; i++) A += Math.exp(-arr[i] / beta);
  const mu = beta * Math.log(n / A);

  if (!(beta > 0) || !Number.isFinite(mu)) return null;
  return { mu, beta };
}

// ---------- Conversión Mínimos ↔ Máximos ----------
// MLE mín: aplicar MLE máximos a -X y reflejar parámetros
function mleGumbelMin(arr) {
  const ys = arr.map((x) => -x);
  const fit = mleGumbelMax(ys);
  if (!fit) return null;
  return { mu: -fit.mu, beta: fit.beta };
}

// MoM mín: idem, usar MoM máximos sobre -X y reflejar
function momGumbelMin(arr) {
  const ys = arr.map((x) => -x);
  const fit = momGumbelMax(ys);
  if (!fit) return null;
  return { mu: -fit.mu, beta: fit.beta };
}

export function compute(xs) {
  const n = xs?.length || 0;
  if (n < 3) return row("—", NaN, "—", NaN);

  // ---------- MOMENTOS: mejor de (máximos, mínimos) ----------
  const momMax = momGumbelMax(xs);
  const momMin = momGumbelMin(xs);

  const candMom = [];
  if (momMax) candMom.push({
    label: "(máximos)",
    paramsStr: `μ=${momMax.mu.toFixed(4)}, β=${momMax.beta.toFixed(4)} (máximos)`,
    rmse: rmseQuantileFit(xs, qGumbelMax(momMax.mu, momMax.beta))
  });
  if (momMin) candMom.push({
    label: "(mínimos)",
    paramsStr: `μ=${momMin.mu.toFixed(4)}, β=${momMin.beta.toFixed(4)} (mínimos)`,
    rmse: rmseQuantileFit(xs, qGumbelMin(momMin.mu, momMin.beta))
  });

  candMom.sort((a, b) => a.rmse - b.rmse);
  const bestMom = candMom[0];
  const momParam = bestMom ? bestMom.paramsStr : "—";
  const rmse_mom = bestMom ? bestMom.rmse : NaN;

  // ---------- MLE: mejor de (máximos, mínimos) ----------
  const mleMax = mleGumbelMax(xs);
  const mleMin = mleGumbelMin(xs);

  const candMLE = [];
  if (mleMax) candMLE.push({
    label: "(máximos)",
    paramsStr: `μ=${mleMax.mu.toFixed(4)}, β=${mleMax.beta.toFixed(4)} (máximos)`,
    rmse: rmseQuantileFit(xs, qGumbelMax(mleMax.mu, mleMax.beta))
  });
  if (mleMin) candMLE.push({
    label: "(mínimos)",
    paramsStr: `μ=${mleMin.mu.toFixed(4)}, β=${mleMin.beta.toFixed(4)} (mínimos)`,
    rmse: rmseQuantileFit(xs, qGumbelMin(mleMin.mu, mleMin.beta))
  });

  candMLE.sort((a, b) => a.rmse - b.rmse);
  const bestMLE = candMLE[0];
  const mleParam = bestMLE ? bestMLE.paramsStr : "—";
  const rmse_mle = bestMLE ? bestMLE.rmse : NaN;

  return row(momParam, rmse_mom, mleParam, rmse_mle);
}
