// src/AnalisisUnivariado/AnalisisUnivariado.jsx
import React, { useMemo, useState } from "react";
import { DISTRO_REGISTRY, computeRowFor } from "./analisis/index.js";
import DistroTabs from "./components/DistroTabs.jsx";
import LMomentsPanel from "./components/LMomentsPanel.jsx";
import NormalLSReporte from "./components/NormalLSReporte.jsx";

/** --------- parser robusto ---------
 * Acepta líneas con: "AÑO VALOR" o sólo "VALOR".
 * Ignora texto, usa punto/decimal (convierte coma->punto).
 * Toma el segundo número si la primera columna parece año (1800..2100),
 * en otro caso toma el último número de la línea.
 */
function parseAFA(text) {
  const norm = text.replace(/,/g, ".");
  const values = [];

  for (const rawLine of norm.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || /[A-Za-z]/.test(line)) continue;

    const toks = line
      .split(/[,\s\t;]+/)
      .filter(Boolean)
      .filter((t) => /^[-+]?(\d+(\.\d+)?|\.\d+)$/.test(t))
      .map(Number);

    if (!toks.length) continue;

    if (toks.length >= 2 && toks[0] >= 1800 && toks[0] <= 2100) {
      values.push(toks[1]); // año, valor
    } else {
      values.push(toks[toks.length - 1]); // sólo valor (o varios: toma el último)
    }
  }
  return values;
}

export default function AnalisisUnivariado() {
  const [datos, setDatos] = useState([]);
  const [msg, setMsg] = useState("");

  // Opciones de visualización/cálculo
  const [ppos, setPpos]   = useState("AFA (m/n)"); // No dejamos Weibull por defecto
  const [seDiv, setSeDiv] = useState("n-2");       // OLS clásico (coincide con tu TXT)
  const [orden, setOrden] = useState("desc");      // mayor primero

  const onLoadTxt = async (e) => {
    setMsg("");
    const f = (e.target.files && e.target.files[0]) || null;
    if (!f) return;
    const text = await f.text();
    const xs = parseAFA(text);
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
      // EEA a 2 decimales para calcar el tablero AFA
      const baseOpts = { ls: { seDiv, ppos, np: d.np ?? 2, eeaDigits: 2 } };
      const r = computeRowFor(d.key, datos, baseOpts) || {};
  
      const isNormal = (d.key || "").toLowerCase().includes("normal");
      if (isNormal && r?.mom?.error && r.mom.error !== "—") {
        r.mle = { ...(r.mle || {}), error: r.mom.error };
      }
  
      return {
        key: d.key,
        nombre: d.label,
        mom: { param: r.mom?.param ?? "—", error: r.mom?.error ?? "—" },
        mle: { param: r.mle?.param ?? "—", error: r.mle?.error ?? "—" },
      };
    });
  }, [datos, seDiv, ppos]);
  
  

  // ----- tabla Resumen -----
  const ResumenGrid = () => (
    <>
      {/* Barra de controles */}
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

        <div className="ml-auto flex flex-wrap items-center gap-3">
          {/* Posición */}
          <label className="text-sm text-gray-700 dark:text-white">Posición:</label>
          <div className="relative inline-block">
            <select
              value={ppos}
              onChange={(e) => setPpos(e.target.value)}
              className="text-sm rounded-md px-2 py-1 pr-8
                         bg-gray-800/20 dark:bg-gray-800
                         text-gray-800 dark:text-white
                         border border-gray-300 dark:border-gray-700
                         appearance-none
                         dark:[&>option]:text-white dark:[&>option]:bg-gray-800
                         focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option>AFA (m/n)</option>
              <option>Gringorten</option>
              <option>Blom</option>
              <option>Hazen</option>
              <option>Weibull</option>
              <option>Cunnane</option>
            </select>
            <svg
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 dark:text-white"
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
            >
              <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* SE */}
          <label className="text-sm text-gray-700 dark:text-white">SE:</label>
          <div className="relative inline-block">
            <select
              value={seDiv}
              onChange={(e) => setSeDiv(e.target.value)}
              className="text-sm rounded-md px-2 py-1 pr-8
                         bg-gray-800/20 dark:bg-gray-800
                         text-gray-800 dark:text-white
                         border border-gray-300 dark:border-gray-700
                         appearance-none
                         dark:[&>option]:text-white dark:[&>option]:bg-gray-800
                         focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="n-2">n−2 (OLS)</option>
              <option value="n-1">n−1</option>
              <option value="n">n</option>
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-700 dark:text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Orden */}
          <label className="text-sm text-white dark:text-white">Orden:</label>
          <div className="relative inline-block">
            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
              className="text-sm rounded-md px-2 py-1 pr-8
                         bg-gray-800/20 dark:bg-gray-800
                         text-gray-800 dark:text-white
                         border border-gray-300 dark:border-gray-700
                         appearance-none
                         dark:[&>option]:text-white dark:[&>option]:bg-gray-800
                         focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="desc">Descendente (mayor primero)</option>
              <option value="asc">Ascendente (menor primero)</option>
            </select>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white dark:text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {msg && <div className="text-red-600 mb-2">{msg}</div>}

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
              <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Parámetros</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Error estándar</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[240px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Parámetros</th>
              <th className="px-3 py-2 border-b border-gray-300 w-[160px] dark:border-gray-700 text-gray-700 dark:text-gray-200">Error estándar</th>
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

        <div className="mt-2 px-2 pb-3 text-xs text-gray-600 dark:text-gray-400">
          <b>Nota:</b> En la fila <b>Normal</b>, la columna <i>Momentos</i> usa mínimos cuadrados en papel normal
          (posiciones: <i>{ppos}</i>; SE: <i>{seDiv}</i>). La columna de <i>Verosimilitud</i> usa MLE.
        </div>
      </div>
    </>
  );

  // ----- pestañas -----
  const tabs = [
    { key: "resumen", label: "Resumen", render: () => <ResumenGrid /> },
    {
      key: "reporteNormal",
      label: "Normal",
      render: () => (
        <NormalLSReporte
          values={datos}
          seDiv={seDiv}
          ppos={ppos}
          order={orden}
          fileTag="2036"
        />
      ),
    },
    { key: "lmom", label: "L-MOM", render: () => <LMomentsPanel values={datos} /> },
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
      <DistroTabs tabs={tabs} defaultKey="resumen" />
    </div>
  );
}
