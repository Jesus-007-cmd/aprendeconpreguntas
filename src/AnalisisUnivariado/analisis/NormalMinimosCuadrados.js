// src/AnalisisUnivariado/analisis/NormalMinimosCuadrados.js
import { eeaWithParams } from "./NormalLeastSquares.js";

export function compute(xs, opts = {}) {
  const arr = (xs || []).filter(Number.isFinite);
  const n = arr.length;
  if (n < 3) return { mom: { param: "—", error: "—" }, mle: { param: "—", error: "—" } };

  // Media y varianzas
  const mu = arr.reduce((s, v) => s + v, 0) / n;
  let s2num = 0; for (const x of arr) { const d = x - mu; s2num += d * d; }
  const varU = s2num / Math.max(1, n - 1);
  const varB = s2num / Math.max(1, n);

  const sigmaMoM = Math.sqrt(varU);
  const sigmaMLE = Math.sqrt(varB);

  // Redondeo "tablero" (4 decimales)
  const mu4 = Number(mu.toFixed(4));
  const sigma4 = Number(sigmaMoM.toFixed(4));

  // EEA estilo Excel con divisor n−np (np=2 para Normal)
  const lsOpts = { ...(opts?.ls || {}), seDiv: "auto", np: 2 };
  const se = eeaWithParams(arr, lsOpts, mu4, sigma4, 3);

  // <<< NUEVO: decimales configurables para mostrar EEA >>>
  const eeaDigits = Number.isFinite(opts?.ls?.eeaDigits) ? opts.ls.eeaDigits : 4;
  const seStr = Number.isFinite(se) ? se.toFixed(eeaDigits) : "—";

  const momParam = `μ=${mu4.toFixed(4)},  σ=${sigma4.toFixed(4)}`;
  const mleParam = `μ=${mu4.toFixed(4)},  σ=${Number(sigmaMLE.toFixed(4)).toFixed(4)}`;

  // Mismo EEA en MLE (como AFA)
  return {
    mom: { param: momParam, error: seStr },
    mle: { param: mleParam, error: seStr },
  };
}
