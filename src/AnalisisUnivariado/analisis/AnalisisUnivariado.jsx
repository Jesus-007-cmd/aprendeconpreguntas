// src/components/AnalisisUnivariado.jsx
import React, { useMemo, useState } from "react";

/** --------- util: leer TXT y extraer números --------- **/
function parseTextToNumbers(text) {
  const normalized = text.replace(/,/g, ".");
  const matches = normalized.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number).filter(Number.isFinite) : [];
}

/** --------- estadísticos básicos --------- **/
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const varianceUnbiased = (xs) => {
  const n = xs.length; if (n < 2) return NaN;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / (n - 1);
};
const varianceMLE = (xs) => {
  const n = xs.length; if (n < 1) return NaN;
  const m = mean(xs);
  return xs.reduce((s, x) => s + (x - m) ** 2, 0) / n;
};

/** --------- inversa Normal estándar (Acklam, forma compacta) --------- **/
function normInv(p) {
  if (!(p > 0 && p < 1) || Number.isNaN(p)) {
    throw new Error("p must be in (0,1)");
  }

  const A = [
    -39.6968302866538, 220.946098424521, -275.928510446969,
    138.357751867269, -30.6647980661472, 2.50662827745924
  ];
  const B = [
    -54.4760987982241, 161.585836858041, -155.698979859887,
    66.8013118877197, -13.2806815528857
  ];
  const C = [
    -0.00778489400243029, -0.3223964580411365, -2.40075827716184,
    -2.54973253934373, 4.37466414146497, 2.93816398269878
  ];
  const D = [
    0.00778469570904146, 0.32246712907004, 2.44513413714299, 3.75440866190742
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;

  let q, r;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
      (((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q) + 1)
    );
  }

  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(
      (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
      (((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q) + 1)
    );
  }

  q = p - 0.5;
  r = q * q;

  return (
    (((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q /
    (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1)
  );
}

/** --------- RMSE de ajuste por cuantiles --------- **/
function rmseQuantileFitNormal(xs, mu, sigma){
  if (!xs || xs.length === 0 || !(sigma > 0)) return NaN;

  const sorted=[...xs].sort((a,b)=>a-b); const n=sorted.length;
  let sse=0;
  for(let i=0;i<n;i++){
    const p=(i+0.5)/n; const z=normInv(p);
    const q=mu + sigma*z;
    const e=sorted[i]-q; sse+=e*e;
  }
  return Math.sqrt(sse/n);
}

/** --------- definiciones de filas --------- **/
const DISTROS = [
  { key:"normal", label:"Distribución Normal" },
  { key:"logn2", label:"Distribución LogNormal 2P" },
  { key:"logn3", label:"Distribución LogNormal 3P" },
  { key:"exp1",  label:"Distribución exponencial 1P" },
  { key:"exp2",  label:"Distribución exponencial 2P" },
  { key:"gam2",  label:"Distribución Gamma 2P" },
  { key:"gam3",  label:"Distribución Gamma 3P" },
  { key:"lp3",   label:"Distribución LogPearson III" },
  { key:"gev",   label:"Distribución General de Valores Extremos" },
  { key:"gumbel",label:"Distribución Gumbel" },
  { key:"gumbel2",label:"Distribución Gumbel Doble" },
];

export default function AnalisisUnivariado() {
  const [datos, setDatos] = useState([]);
  const [msg, setMsg] = useState("");

  const onLoadTxt = async (e) => {
    setMsg("");
    const f = (e.target.files && e.target.files[0]) || null; // compatible con parsers viejos
    if(!f) return;
    const text = await f.text();
    const xs = parseTextToNumbers(text);
    if (!xs.length) { setMsg("No se detectaron números en el TXT."); return; }
    setDatos(xs);
  };

  const rows = useMemo(() => {
    if (!datos.length) return [];
    // Normal (Momentos)
    const mu_mom  = mean(datos);
    const sd_mom  = Math.sqrt(varianceUnbiased(datos));
    const rmse_mom = rmseQuantileFitNormal(datos, mu_mom, sd_mom);
    // Normal (MLE)
    const mu_mle  = mean(datos);
    const sd_mle  = Math.sqrt(varianceMLE(datos));
    const rmse_mle = rmseQuantileFitNormal(datos, mu_mle, sd_mle);

    return DISTROS.map(d => d.key === "normal" ? ({
      key:d.key, nombre:d.label,
      mom:{ param:`μ=${mu_mom.toFixed(4)}, σ=${sd_mom.toFixed(4)}`, error:isFinite(rmse_mom)?rmse_mom.toFixed(4):"—" },
      mle:{ param:`μ=${mu_mle.toFixed(4)}, σ=${sd_mle.toFixed(4)}`, error:isFinite(rmse_mle)?rmse_mle.toFixed(4):"—" },
    }) : ({
      key:d.key, nombre:d.label,
      mom:{ param:"—", error:"—" },
      mle:{ param:"—", error:"—" },
    }));
  }, [datos]);

  return (
    <div className="font-sans max-w-[1100px] mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Análisis Univariado — Grid tipo Excel
      </h2>

      <div className="flex gap-3 items-center mb-3">
        <label className="font-semibold text-gray-800 dark:text-gray-100">
          Cargar TXT de datos:&nbsp;
          <input
            type="file"
            accept=".txt"
            onChange={onLoadTxt}
            className="block text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300"
          />
        </label>
        {datos.length>0 && (
          <span className="text-gray-500">
            Leídos: <b className="text-gray-800 dark:text-gray-200">{datos.length}</b> valores
          </span>
        )}
      </div>

      {msg && <div className="text-red-600 mb-2">{msg}</div>}

      <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60">
              <th className="px-3 py-2 border-b border-gray-300 text-center font-bold w-[320px] dark:border-gray-700 text-gray-800 dark:text-gray-100" rowSpan={2}>
                Función de Distribución de probabilidad
              </th>
              <th className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100" colSpan={2}>Momentos</th>
              <th className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100" colSpan={2}>Máxima Verosimilitud</th>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-800/60">
              <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Parámetros</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Error estándar</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Parámetros</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Error estándar</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((r, i) => (
              <tr key={r.key} className={i % 2 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/40"}>
                <td className="px-3 py-2 text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">{r.nombre}</td>
                <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">{r.mom.param}</td>
                <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">{r.mom.error}</td>
                <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">{r.mle.param}</td>
                <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">{r.mle.error}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        * Implementada por ahora: <b className="font-semibold text-gray-700 dark:text-gray-200">Normal</b> (Momentos & MLE) con RMSE de cuantiles.
        Iremos completando Gamma, Gumbel, Lognormal, etc., y luego añadimos exportar a Excel.
      </p>
    </div>
  );
}
