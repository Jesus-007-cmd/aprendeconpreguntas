// src/AnalisisUnivariado/AnalisisUnivariado.jsx
import React, { useMemo, useState } from "react";
import { DISTRO_REGISTRY, computeRowFor } from "./analisis/index.js";
import DistroTabs from "./components/DistroTabs.jsx";
import NormalKSTable from "./components/NormalKSTable.jsx";
import LMomentsPanel from "./components/LMomentsPanel.jsx";
import { fitNormalLS_AFA } from "./analisis/NormalLeastSquaresAFA.js";

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

  // Controles para replicar AFA
  const [pposMethod, setPposMethod] = useState("Gringorten");
  const [seDf, setSeDf] = useState("n-1"); // n−1 reproduce mejor el SE del AFA

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
    const base = DISTRO_REGISTRY.map((d) => {
      const r = computeRowFor(d.key, datos);
      return {
        key: d.key,
        nombre: d.label,
        mom: { param: r.mom?.param ?? "—", error: r.mom?.error ?? "—" },
        mle: { param: r.mle?.param ?? "—", error: r.mle?.error ?? "—" },
      };
    });

    // localizar exactamente la fila de la Normal (evita confundir con LogNormal)
    const idx = base.findIndex(
      (r) => r.key === "normal" || /^Distribución Normal$/i.test(r.nombre)
    );

    if (idx !== -1) {
      // inserta encabezado de grupo antes de Normal
      base.splice(idx, 0, {
        key: "group_normal",
        _isHeader: true,
        title: "Normal — comparativa (MoM/MLE vs AFA)",
      });

      // calcula la fila AFA (mínimos cuadrados en papel normal)
      const afa = fitNormalLS_AFA(datos, pposMethod, seDf);
      if (afa) {
        const paramTxt = `μ=${afa.mu.toFixed(4)},  σ=${afa.sigma.toFixed(4)}`;
        const seTxt = afa.se.toFixed(4);

        // Inserta la fila AFA justo después de la fila Normal (desplazada por el header)
        base.splice(idx + 2, 0, {
          key: "normal_afa",
          nombre: "Normal (AFA: mínimos cuadrados)",
          mom: { param: paramTxt, error: seTxt },
          // ahora también se muestran a la derecha para comparación visual
          mle: { param: paramTxt, error: seTxt },
          _variant: "afa",
        });
      }
    }

    return base;
  }, [datos, pposMethod, seDf]);

  // ----- componente “Resumen” (tabla) -----
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
            <th
              className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100"
              colSpan={2}
            >
              Momentos
            </th>
            <th
              className="px-3 py-2 border-b border-gray-300 text-center font-bold dark:border-gray-700 text-gray-800 dark:text-gray-100"
              colSpan={2}
            >
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
          {rows.map((r, i) => {
            if (r._isHeader) {
              return (
                <tr key={r.key}>
                  <td
                    colSpan={5}
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 font-semibold px-3 py-2"
                  >
                    {r.title}
                  </td>
                </tr>
              );
            }

            const rowClass =
              r._variant === "afa"
                ? "bg-amber-50 dark:bg-yellow-900/20 border-l-4 border-amber-400"
                : i % 2
                ? "bg-white dark:bg-gray-900"
                : "bg-gray-50 dark:bg-gray-800/40";

            return (
              <tr key={r.key} className={rowClass}>
                <td className="px-3 py-2 text-gray-800 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700">
                  {r.nombre}
                  {r._variant === "afa" && (
                    <span className="ml-2 inline-block text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-yellow-800 dark:text-yellow-100">
                      AFA
                    </span>
                  )}
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
            );
          })}
        </tbody>
      </table>

      <p className="mt-2 px-2 text-xs text-gray-600 dark:text-gray-400">
        <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 mr-1">
          Normal (AFA)
        </span>
        = ajuste por mínimos cuadrados en papel normal; posiciones: {pposMethod}. El “Error estándar” mostrado
        usa divisor <b>{seDf}</b>.
      </p>
    </div>
  );

  // ----- pestañas -----
  const tabs = [
    { key: "resumen", label: "Resumen", render: () => <ResumenGrid /> },
    { key: "normal", label: "Normal", render: () => <NormalKSTable values={datos} /> },
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
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Análisis Univariado — Grid tipo Excel
      </h2>

      <div className="flex flex-wrap items-center gap-3 mb-2">
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

      {/* Controles AFA (solo si hay datos) */}
      {datos.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span>Posición:</span>
            <select
              value={pposMethod}
              onChange={(e) => setPposMethod(e.target.value)}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <option>Gringorten</option>
              <option>Blom</option>
              <option>Cunnane</option>
              <option>Hazen</option>
              <option>Weibull</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span>Error est. ÷</span>
            <select
              value={seDf}
              onChange={(e) => setSeDf(e.target.value)}
              className="border rounded px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <option value="n-1">n−1 (AFA)</option>
              <option value="n-2">n−2 (OLS 2p)</option>
              <option value="n">n</option>
            </select>
          </div>
        </div>
      )}

      {msg && <div className="text-red-600 mb-2">{msg}</div>}

      <DistroTabs tabs={tabs} defaultKey="resumen" />

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        * En “Resumen” verás la tabla comparativa. En cada pestaña iremos agregando pruebas específicas
        (KS, QQ/PP, percentiles, periodos de retorno, etc.).
      </p>
    </div>
  );
}
