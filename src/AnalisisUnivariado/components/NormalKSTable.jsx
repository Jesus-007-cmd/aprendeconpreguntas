// src/AnalisisUnivariado/components/NormalKSTable.jsx
import React, { useMemo, useState } from "react";
import { fitNormalAndKS, ksVerdict } from "../analisis/NormalMoMKS";

export default function NormalKSTable({ values }) {
  const [alpha, setAlpha] = useState(0.05);
  const res = useMemo(() => fitNormalAndKS(values), [values]);

  if (!res) {
    return (
      <div className="bg-[#1e1e1e] text-white p-4 rounded">
        No hay suficientes datos para KS (n &lt; 3).
      </div>
    );
  }

  const verdict = ksVerdict(res.Dmax, res.crit, alpha);

  return (
    <div className="bg-[#1e1e1e] text-white p-4 rounded w-full overflow-x-auto">
      <h2 className="text-lg font-bold mb-3">Normal (MoM) + KS</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-[#121212] p-3 rounded">
          <div><span className="text-gray-300">n:</span> {res.n}</div>
          <div><span className="text-gray-300">X̄:</span> {res.mean.toFixed(4)}</div>
          <div><span className="text-gray-300">Sx:</span> {res.sd.toFixed(4)}</div>
        </div>
        <div className="bg-[#121212] p-3 rounded">
          <div><span className="text-gray-300">D<sub>max</sub>:</span> {res.Dmax.toFixed(6)}</div>
          <div><span className="text-gray-300">α =</span>{" "}
            <select
              value={alpha}
              onChange={(e)=>setAlpha(Number(e.target.value))}
              className="bg-[#1e1e1e] border border-gray-700 rounded px-2 py-1"
            >
              <option value={0.10}>0.10</option>
              <option value={0.05}>0.05</option>
              <option value={0.01}>0.01</option>
            </select>
          </div>
          <div>
            <span className="text-gray-300">Umbral KS:</span>{" "}
            { (alpha===0.1? res.crit.alpha10 : alpha===0.01? res.crit.alpha01 : res.crit.alpha05).toFixed(6) }
          </div>
        </div>
        <div className="bg-[#121212] p-3 rounded">
          <div className={`${verdict?.pass ? "text-green-400" : "text-red-400"} font-semibold`}>
            {verdict?.pass ? "PASA KS" : "NO PASA KS"}
          </div>
          <div className="text-xs text-gray-400">Nota: crítico KS estándar. Para mu/sigma estimados, lo estricto es Lilliefors.</div>
        </div>
      </div>

      <div className="text-sm font-semibold mb-2">Tabla (como el Excel):</div>
      <table className="min-w-[700px] w-full text-sm bg-[#121212] rounded overflow-hidden">
        <thead className="bg-[#0f0f0f]">
          <tr>
            <th className="text-left p-2 border-b border-gray-800">m</th>
            <th className="text-left p-2 border-b border-gray-800">Q ordenados</th>
            <th className="text-left p-2 border-b border-gray-800">P(x) = m/(n+1)</th>
            <th className="text-left p-2 border-b border-gray-800">F(x) Normal ajustada</th>
            <th className="text-left p-2 border-b border-gray-800">|F - P|</th>
          </tr>
        </thead>
        <tbody>
          {res.rows.map((r) => (
            <tr key={r.m} className="odd:bg-[#181818]">
              <td className="p-2 border-b border-gray-900">{r.m}</td>
              <td className="p-2 border-b border-gray-900">{r.Qord.toFixed(6)}</td>
              <td className="p-2 border-b border-gray-900">{r.Pemp.toFixed(6)}</td>
              <td className="p-2 border-b border-gray-900">{r.Ffit.toFixed(6)}</td>
              <td className="p-2 border-b border-gray-900">{r.Delta.toFixed(6)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
