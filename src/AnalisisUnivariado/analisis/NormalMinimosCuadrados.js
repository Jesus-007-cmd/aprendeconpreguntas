// src/AnalisisUnivariado/analisis/NormalMinimosCuadrados.js
import { fitNormalLS } from "./NormalLeastSquares.js";

// Esta fila llena la columna "Momentos"; la columna "Máxima verosimilitud" va vacía.
export function compute(xs, opts = {}) {
  const r = fitNormalLS(xs, opts?.ls || {}); // usa seDiv si viene
  if (!r) return { mom: { param: "—", error: "—" }, mle: { param: "—", error: "—" } };

  const param = `μ=${r.mu.toFixed(4)},  σ=${r.sigma.toFixed(4)}`;
  const se = Number.isFinite(r.se) ? r.se.toFixed(4) : "—";

  return {
    mom: { param, error: se },   // LS en papel normal (Gringorten; SE configurable)
    mle: { param: "—", error: "—" },
  };
}
