// src/AnalisisUnivariado/components/NormalLSReporte.jsx
import React, { useMemo } from "react";
import { fitNormalLS } from "../analisis/NormalLeastSquares.js";
import { normInv, mean, varianceUnbiased, varianceMLE } from "../analisis/utils.js";

const fmt  = (x, d = 3) => (Number.isFinite(x) ? x.toFixed(d) : "—");
const fmt4 = (x)        => (Number.isFinite(x) ? x.toFixed(4) : "—");

// F y Tr con soporte de orden + método
function fxAndTr(method, n, rank, order, rAsc) {
  const m = (method || "").toLowerCase().trim();
  const pp = (meth, r, N) => {
    if (meth === "weibull")    return r / (N + 1);
    if (meth === "hazen")      return (r - 0.5) / N;
    if (meth === "blom")       return (r - 0.375) / (N + 0.25);
    if (meth === "cunnane")    return (r - 0.4) / (N + 0.2);
    if (["afa", "afa (m/n)", "m/n", "mn", "n/m", "nm"].includes(meth)) {
      // AFA: p = (r-1)/n (no lo usamos por default)
      return (r - 1) / N;
    }
    // Gringorten por defecto
    return (r - 0.44) / (N + 0.12);
  };
  const key = m.split(" ")[0]; // "weibull", "gringorten", etc.
  const p = pp(key, rAsc, n);
  return { F: p, Tr: 1 / (1 - p) };
}

export default function NormalLSReporte({
  values = [],
  rawYears = [],        // años por fila (si existen)
  rawValues = [],       // valores crudos por fila (en orden de entrada)
  seDiv = "n-2",
  ppos  = "Weibull",
  order = "desc",       // "desc" | "asc"
  show  = "both",       // "fx" | "tr" | "both"
  fileTag = "2036",     // sufijo para el CSV
}) {
  // Orden natural ascendente para el ajuste
  const dataAsc = useMemo(
    () => (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b),
    [values]
  );
  const n = dataAsc.length;
  if (n < 3) {
    return <div className="text-sm text-gray-500">Carga un TXT con al menos 3 valores para ver el reporte.</div>;
  }

  // Ajuste LS con la posición elegida (coherente con el Excel si usas Weibull)
  const { mu: muLS, sigma: sigmaLS, se: seLS } = fitNormalLS(dataAsc, { seDiv, ppos }) || {};

  // Estadísticos básicos (idénticos a tu versión)
  const m     = mean(dataAsc);
  const varU  = varianceUnbiased(dataAsc);
  const varB  = varianceMLE(dataAsc);
  const sd    = Math.sqrt(varU);
  const sdMLE = Math.sqrt(varB);

  // Tabla “Excel”: armamos vector organizado y ŷ (LS) con el mismo orden
  const dataDesc = values.slice().filter(Number.isFinite).sort((a, b) => b - a);
  const showFx = show === "fx" || show === "both";
  const showTr = show === "tr" || show === "both";

  const rowsExcel = [];
  let sse = 0;
  const eps = 1e-12;

  for (let rank = 1; rank <= n; rank++) {
    // Índice ascendente sobre dataAsc para la posición p (rAsc = 1..n)
    const rAsc = order === "desc" ? (n - rank + 1) : rank;

    // F y Tr según método
    const { F, Tr } = fxAndTr(ppos, n, rank, order, rAsc);
    const pForInv = Math.min(1 - eps, Math.max(eps, F));
    const z  = normInv(pForInv);
    const yhat = muLS + sigmaLS * z;

    // Pmax24hrs Organizada: en orden descendente/ascendente según selección
    const xorg = order === "desc"
      ? dataDesc[rank - 1]
      : values.slice().filter(Number.isFinite).sort((a, b) => a - b)[rank - 1];

    // Año y “Pmax24hrs” crudos por fila (si venían en el TXT)
    const year = rawYears.length === n ? rawYears[rank - 1] : "";
    const xraw = rawValues.length === n ? rawValues[rank - 1] : values[rank - 1];

    const resid2 = Number.isFinite(xorg) && Number.isFinite(yhat) ? (xorg - yhat) ** 2 : NaN;
    if (Number.isFinite(resid2)) sse += resid2;

    rowsExcel.push({
      rank,
      year,
      xraw,
      xorg,
      F,
      Tr,
      yhat,
      resid2,
    });
  }

  // EEA “tipo Excel”: coincide con tu seLS si usas el mismo divisor
  const denom = seDiv === "n" ? Math.max(1, n) : seDiv === "n-1" ? Math.max(1, n - 1) : Math.max(1, n - 2);
  const eea = Math.sqrt(sse / denom);

  // Exportar CSV
  const exportCSV = () => {
    const header = [
      "Posición",
      "Año",
      "Pmax24hrs",
      "Pmax24hrs Organizada",
      "Tr (Weibull)",
      "Distribución Normal",
      "(xi - x)^2",
      "F(x)"
    ];
    const lines = [header.join(",")];

    for (const r of rowsExcel) {
      lines.push([
        r.rank,
        r.year ?? "",
        Number.isFinite(r.xraw) ? r.xraw : "",
        Number.isFinite(r.xorg) ? r.xorg : "",
        Number.isFinite(r.Tr) ? fmt(r.Tr, 3) : "",
        Number.isFinite(r.yhat) ? fmt(r.yhat, 3) : "",
        Number.isFinite(r.resid2) ? fmt(r.resid2, 3) : "",
        Number.isFinite(r.F) ? fmt4(r.F) : ""
      ].join(","));
    }

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    // Cambia aquí si NECESITAS el nombre con “nomral” en vez de “normal”
    a.download = `distribucionnormal_${fileTag}.csv`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Estilos tabla
  const th = "px-2 py-1 text-center font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-700";
  const td = "px-2 py-1 text-center font-mono tabular-nums text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          FUNCIÓN DE DISTRIBUCIÓN DE PROBABILIDAD: NORMAL
        </h3>
        <button
          onClick={exportCSV}
          className="text-xs rounded-md px-3 py-1 border border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
          title="Exportar tabla estilo Excel"
        >
          Descargar CSV
        </button>
      </div>

      {/* Datos estadísticos */}
      <div className="border rounded-lg p-3 dark:border-gray-700">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">DATOS ESTADÍSTICOS</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-1 text-sm">
          <div>NÚMERO DE DATOS = <b>{n}</b></div>
          <div>MEDIA = <b>{fmt(m, 3)}</b></div>
          <div>VARIANZA NO SESGADA = <b>{fmt(varU, 3)}</b></div>
          <div>VARIANZA SESGADA = <b>{fmt(varB, 3)}</b></div>
          <div>DESVIACIÓN ESTÁNDAR = <b>{fmt(sd, 3)}</b></div>
          <div>EEA (LS) = <b>{fmt(eea, 3)}</b> (divisor {seDiv})</div>
        </div>
      </div>

      {/* Parámetros */}
      <div className="border rounded-lg p-3 dark:border-gray-700">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">PARÁMETROS (MoM / MLE) y AJUSTE LS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="border rounded p-2 dark:border-gray-700">
            <div className="font-semibold">Momentos</div>
            <div>μ = <b>{fmt(m, 3)}</b></div>
            <div>σ = <b>{fmt(Math.sqrt(varU), 3)}</b></div>
          </div>
          <div className="border rounded p-2 dark:border-gray-700">
            <div className="font-semibold">Máxima verosimilitud</div>
            <div>μ̂ = <b>{fmt(m, 3)}</b></div>
            <div>σ̂ = <b>{fmt(sdMLE, 3)}</b></div>
          </div>
          <div className="border rounded p-2 dark:border-gray-700">
            <div className="font-semibold">Ajuste por mínimos cuadrados</div>
            <div>μ<sub>LS</sub> = <b>{fmt(muLS, 3)}</b></div>
            <div>σ<sub>LS</sub> = <b>{fmt(sigmaLS, 3)}</b></div>
            <div>Error estándar de ajuste = <b>{fmt(seLS, 3)}</b> (divisor {seDiv})</div>
          </div>
        </div>
      </div>

      {/* Tabla estilo Excel */}
      <div className="border rounded-lg p-3 dark:border-gray-700">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
          TABLA (ESTILO EXCEL AFA)
        </h4>
        <div className="overflow-auto max-h-[480px]">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800/80 sticky top-0">
              <tr>
                <th className={th}>Posición</th>
                <th className={th}>Año</th>
                <th className={th}>Pmax24hrs</th>
                <th className={th}>Pmax24hrs Organizada</th>
                {showTr && <th className={th}>Tr (Weibull)</th>}
                <th className={th}>Distribución Normal</th>
                <th className={th}>(xi − x)²</th>
                {showFx && <th className={th}>F(x)</th>}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {rowsExcel.map((r, i) => (
                <tr key={r.rank} className={i % 2 ? "bg-gray-50 dark:bg-gray-800/40" : "bg-white dark:bg-gray-900/30"}>
                  <td className={td}>{r.rank}</td>
                  <td className={td}>{r.year ?? ""}</td>
                  <td className={td}>{Number.isFinite(r.xraw) ? fmt(r.xraw, 3) : "—"}</td>
                  <td className={td}>{Number.isFinite(r.xorg) ? fmt(r.xorg, 3) : "—"}</td>
                  {showTr && <td className={td}>{fmt(r.Tr, 3)}</td>}
                  <td className={td}>{fmt(r.yhat, 3)}</td>
                  <td className={td}>{fmt(r.resid2, 3)}</td>
                  {showFx && <td className={td}>{fmt4(r.F)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[11px] mt-2 text-gray-600 dark:text-gray-400">
          Posición de trazado: {ppos}. Orden: {order === "desc" ? "descendente (mayor primero)" : "ascendente"}.
          &nbsp;Para Weibull en descendente: <i>T = (n + 1) / posición</i>.
        </div>
      </div>

      {/* Valores por Tr (extrapolación LS) */}
      <div className="border rounded-lg p-3 dark:border-gray-700">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
          VALORES CALCULADOS PARA CADA PERIODO DE RETORNO (LS)
        </h4>
        <div className="overflow-auto">
          <table className="min-w-[420px] text-xs">
            <thead className="bg-gray-100 dark:bg-gray-800/80">
              <tr>
                <th className={th}>Tr (años)</th>
                <th className={th}>Valor extrapolado</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900">
              {[1.2, 2, 5, 10, 20, 50, 75, 100, 200, 300, 400, 500, 600, 800, 1000, 2000, 3000, 5000, 7500, 10000].map((T) => {
                const p = Math.min(1 - 1e-12, Math.max(1e-12, 1 - 1 / T));
                const z = normInv(p);
                const q = muLS + sigmaLS * z;
                return (
                  <tr key={T} className="odd:bg-gray-50 dark:odd:bg-gray-800/40">
                    <td className={td}>{T}</td>
                    <td className={td}>{fmt(q, 3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-[11px] mt-2 text-gray-600 dark:text-gray-400">
          Nota: p = 1 − 1/Tr (clampado fuera de &#123;0,1&#125;) y cuantiles con normInv(p).
        </div>
      </div>
    </div>
  );
}
