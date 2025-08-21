// src/AnalisisUnivariado/analisis/NormalMinimosCuadrados.js
import { fitNormalLS, eeaWithParams } from "./NormalLeastSquares.js";

// Esta fila llena la columna "Momentos" (LS en papel normal).
// Para igualar el tablero del Excel, el EEA se calcula con μ y σ
// redondeados a 4 decimales.
export function compute(xs, opts = {}) {
  const r = fitNormalLS(xs, opts?.ls || {}); // usa seDiv/ppos si vienen
  if (!r) return { mom: { param: "—", error: "—" }, mle: { param: "—", error: "—" } };

  // μ y σ redondeados como muestra el Excel/resumen
  const mu4    = Number.isFinite(r.mu)    ? Number(r.mu.toFixed(4))    : NaN;
  const sigma4 = Number.isFinite(r.sigma) ? Number(r.sigma.toFixed(4)) : NaN;

  // EEA recomputado con los parámetros redondeados
  const seRound = eeaWithParams(xs, opts?.ls || {}, mu4, sigma4);

  const param = (Number.isFinite(mu4) && Number.isFinite(sigma4))
    ? `μ=${mu4.toFixed(4)},  σ=${sigma4.toFixed(4)}`
    : "—";

  const se = Number.isFinite(seRound) ? seRound.toFixed(4) : "—";

  return {
    mom: { param, error: se },   // EEA con μ/σ redondeados (match Excel)
    mle: { param: "—", error: "—" },
  };
}
