// GEV(ξ, μ, σ) – versión con búsqueda 1D de ξ para minimizar RMSE de cuantiles
import { mean, varianceUnbiased, row, rmseQuantileFit } from "./utils.js";

// --- constantes ---
const EULER_GAMMA = 0.5772156649015329;
const SQ6_OVER_PI = Math.sqrt(6) / Math.PI;
const EPS = 1e-12;

// --- Gamma de Lanczos (suficiente para este ajuste) ---
function gamma(z) {
  // Lanczos, g=7, coeficientes de Numerical Recipes
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    // reflexión
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
  const t = z + 7 + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

// --- invCDF general con salvaguardas ---
function invGEV(xi, mu, sigma) {
  return (pp) => {
    const p = Math.min(1 - EPS, Math.max(EPS, pp));
    if (Math.abs(xi) < 1e-6) {
      // Gumbel
      return mu - sigma * Math.log(-Math.log(p));
    }
    const t = -Math.log(p);
    return mu + (sigma / xi) * (Math.pow(t, -xi) - 1);
  };
}

// Cierra (μ,σ) a partir de (m,s,ξ) usando las fórmulas del GEV
function closeMuSigmaFromMoments(m, s, xi) {
  // var existe si xi < 0.5
  if (xi >= 0.5 - 1e-6 || xi <= -10) return null;
  const G1 = gamma(1 - xi);
  const G2 = gamma(1 - 2 * xi);
  const denomVar = G2 - G1 * G1;
  if (!(denomVar > 0)) return null;
  const sigma = s * Math.abs(xi) / Math.sqrt(denomVar);
  const mu = m - (sigma / xi) * (G1 - 1);
  if (!Number.isFinite(mu) || !Number.isFinite(sigma) || sigma <= 0) return null;
  return { mu, sigma };
}

export function compute(xs) {
  if (!xs || xs.length < 2) return row("—", NaN, "—", NaN);

  // Estadísticos muestrales
  const m = mean(xs);
  const s = Math.sqrt(varianceUnbiased(xs));

  // ---- Aproximación Gumbel (ξ=0, por momentos) ----
  const sigma0 = s * SQ6_OVER_PI;             // s ≈ (π/√6)σ  =>  σ = s·√6/π
  const mu0 = m - EULER_GAMMA * sigma0;       // m ≈ μ + γσ
  const rmse_gumbel = rmseQuantileFit(xs, invGEV(0, mu0, sigma0));
  const gumbelParam = `ξ≈0, μ=${mu0.toFixed(6)}, σ=${sigma0.toFixed(6)}`;

  // ---- Búsqueda 1D de ξ para minimizar RMSE de cuantiles ----
  // Rango típico conservador (media y varianza existen si ξ<0.5)
  let best = { xi: 0, mu: mu0, sigma: sigma0, rmse: rmse_gumbel };
  for (let xi = -0.4; xi <= 0.4 + 1e-9; xi += 0.01) {
    if (Math.abs(xi) < 1e-6) continue; // ya evaluado
    const closed = closeMuSigmaFromMoments(m, s, xi);
    if (!closed) continue;
    const { mu, sigma } = closed;
    const rmse = rmseQuantileFit(xs, invGEV(xi, mu, sigma));
    if (rmse < best.rmse) best = { xi, mu, sigma, rmse };
  }

  const mleParam =
    Math.abs(best.xi) < 1e-6
      ? gumbelParam
      : `ξ=${best.xi.toFixed(4)}, μ=${best.mu.toFixed(6)}, σ=${best.sigma.toFixed(6)}`;

  return row(gumbelParam, rmse_gumbel, mleParam, best.rmse);
}
