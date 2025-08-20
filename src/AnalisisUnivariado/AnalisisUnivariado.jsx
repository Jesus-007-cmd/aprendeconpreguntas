// src/AnalisisUnivariado/AnalisisUnivariado.jsx
import React, { useMemo, useState } from "react";
import { DISTRO_REGISTRY, computeRowFor } from "./analisis/index.js";
import DistroTabs from "./components/DistroTabs.jsx";
import NormalKSTable from "./components/NormalKSTable.jsx"; // <- del paso anterior

/** ---------- parser de TXT: línea por línea, ignora cabeceras ---------- **/
function parseTextToNumbers(text) {
  const norm = text.replace(/,/g, ".");
  return norm
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/[A-Za-z]/.test(l)) // descarta líneas con letras
    .flatMap((l) => l.split(/[,\s\t;]+/).filter(Boolean))
    .filter((tok) => /^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(tok))
    .map(Number)
    .filter(Number.isFinite);
}

export default function AnalisisUnivariado() {
  const [datos, setDatos] = useState([]);
  const [msg, setMsg] = useState("");

  const onLoadTxt = async (e) => {
    setMsg("");
    const f = (e.target.files && e.target.files[0]) || null;
    if (!f) return;
    const text = await f.text();
    const xs = parseTextToNumbers(text);
    if (!xs.length) {
      setMsg("No se detectaron números en el TXT.");
      setDatos([]);
      return;
    }
    setDatos(xs);
  };

  const rows = useMemo(() => {
    if (!datos.length) return [];
    return DISTRO_REGISTRY.map((d) => {
      const r = computeRowFor(d.key, datos);
      return {
        key: d.key,
        nombre: d.label,
        mom: { param: r.mom?.param ?? "—", error: r.mom?.error ?? "—" },
        mle: { param: r.mle?.param ?? "—", error: r.mle?.error ?? "—" },
      };
    });
  }, [datos]);

  // ----- componente “Resumen” (tu tabla) -----
  const ResumenGrid = () => (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm dark:border-gray-700">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800/60">
            <th
              className="px-3 py-2 border-b border-gray-300 text-center font-bold w-[320px] dark:border-gray-700 text-gray-800 dark:text-gray-100"
              rowSpan={2}
            >
              Función de Distribución de probabilidad
            </th>
            <th className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100" colSpan={2}>
              Momentos
            </th>
            <th className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100" colSpan={2}>
              Máxima Verosimilitud
            </th>
          </tr>
          <tr className="bg-gray-50 dark:bg-gray-800/60">
            <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">
              Parámetros
            </th>
            <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">
              Error estándar
            </th>
            <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">
              Parámetros
            </th>
            <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">
              Error estándar
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((r, i) => (
            <tr
              key={r.key}
              className={i % 2 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800/40"}
            >
              <td className="px-3 py-2 text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                {r.nombre}
              </td>
              <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                {r.mom.param}
              </td>
              <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                {r.mom.error}
              </td>
              <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                {r.mle.param}
              </td>
              <td className="px-3 py-2 font-mono text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                {r.mle.error}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ----- define pestañas -----
  const tabs = [
    { key: "resumen", label: "Resumen", render: () => <ResumenGrid /> },
    { key: "normal", label: "Normal", render: () => <NormalKSTable values={datos} /> },
    // placeholders para lo que viene:
    { key: "logn2p", label: "Lognormal 2P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "logn3p", label: "Lognormal 3P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "exp1p", label: "Exponencial 1P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "exp2p", label: "Exponencial 2P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "gamma2p", label: "Gamma 2P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "gamma3p", label: "Gamma 3P", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "lp3", label: "LogPearson III", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "gev", label: "GEV", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "gumbel", label: "Gumbel", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
    { key: "gumbel2", label: "Gumbel Doble", render: () => <div className="text-sm text-gray-400">Próximamente</div> },
  ];

  return (
    <div className="font-sans max-w-[1100px] mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Análisis Univariado — Grid tipo Excel
      </h2>

      <div className="flex flex-wrap items-center gap-3 mb-3">
        <label className="font-semibold text-gray-800 dark:text-gray-100">
          Cargar TXT de datos:&nbsp;
          <input
            type="file"
            accept=".txt"
            onChange={onLoadTxt}
            className="block text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300"
          />
        </label>

        {datos.length > 0 && (
          <span className="text-gray-500">
            Leídos: <b className="text-gray-800 dark:text-gray-200">{datos.length}</b> valores
          </span>
        )}
      </div>

      {msg && <div className="text-red-600 mb-2">{msg}</div>}

      <DistroTabs tabs={tabs} defaultKey="resumen" />

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        * En “Resumen” verás la tabla comparativa. En cada pestaña iremos agregando pruebas específicas (KS, QQ/PP, percentiles, retornos, etc.).
      </p>
    </div>
  );
}
