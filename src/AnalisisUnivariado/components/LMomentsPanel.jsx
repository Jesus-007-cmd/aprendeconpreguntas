// src/AnalisisUnivariado/components/LMomentsPanel.jsx
import React, { useMemo, useState } from "react";
import { computeLMoments } from "../analisis/LMoments";

function StatCard({ label, value, mono=false }) {
  return (
    <div className="bg-[#121212] p-3 rounded shadow">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`mt-1 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

export default function LMomentsPanel({ values }) {
  const [showWeights, setShowWeights] = useState(false);
  const res = useMemo(() => computeLMoments(values, showWeights), [values, showWeights]);

  if (!res) {
    return <div className="bg-[#1e1e1e] text-white p-4 rounded">No hay datos suficientes.</div>;
  }

  const fmt = (v, d=6) => Number.isFinite(v) ? v.toFixed(d) : "—";

  return (
    <div className="text-white">
      <h2 className="text-lg font-bold mb-3">L-Momentos (1.L MOM)</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="n" value={res.n} />
        <StatCard label="Media (x̄)" value={fmt(res.mean, 4)} mono />
        <StatCard label="l₁" value={fmt(res.l1, 6)} mono />
        <StatCard label="l₂" value={fmt(res.l2, 6)} mono />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="l₃" value={fmt(res.l3, 6)} mono />
        <StatCard label="l₄" value={fmt(res.l4, 6)} mono />
        <StatCard label="τ₃ = l₃/l₂" value={fmt(res.tau3, 6)} mono />
        <StatCard label="τ₄ = l₄/l₂" value={fmt(res.tau4, 6)} mono />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="b₀" value={fmt(res.b0, 6)} mono />
        <StatCard label="b₁" value={fmt(res.b1, 6)} mono />
        <StatCard label="b₂" value={fmt(res.b2, 6)} mono />
        <StatCard label="b₃" value={fmt(res.b3, 6)} mono />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setShowWeights(v => !v)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
        >
          {showWeights ? "Ocultar pesos" : "Mostrar pesos de PWMs (b₁..b₃)"}
        </button>
        <span className="text-xs text-gray-400">
          b<sub>r</sub> = (1/n) · Σ<sub>k=r+1..n</sub> [ C(k−1,r) / C(n−1,r) ] · x<sub>k:n</sub>
        </span>
      </div>

      {showWeights && (
        <div className="space-y-6">
          {["r1","r2","r3"].map(key => {
            const title = key === "r1" ? "b₁ (r=1)"
                         : key === "r2" ? "b₂ (r=2)"
                         : "b₃ (r=3)";
            const rows = res.weights?.[key] || [];
            if (!rows.length) return null;
            const totalContrib = rows.reduce((a, r) => a + r.contribution, 0);

            return (
              <div key={key}>
                <h3 className="font-semibold mb-2">{title}: Σ contrib = {(totalContrib).toFixed(6)}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-[700px] w-full text-sm bg-[#121212] rounded overflow-hidden">
                    <thead className="bg-[#0f0f0f]">
                      <tr>
                        <th className="text-left p-2 border-b border-gray-800">k</th>
                        <th className="text-left p-2 border-b border-gray-800">x<sub>k:n</sub></th>
                        <th className="text-left p-2 border-b border-gray-800">peso C(k−1,r)/C(n−1,r)</th>
                        <th className="text-left p-2 border-b border-gray-800">contribución = peso·x / n</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.k} className="odd:bg-[#181818]">
                          <td className="p-2 border-b border-gray-900">{r.k}</td>
                          <td className="p-2 border-b border-gray-900">{r.x.toFixed(6)}</td>
                          <td className="p-2 border-b border-gray-900">{r.weight.toFixed(6)}</td>
                          <td className="p-2 border-b border-gray-900">{r.contribution.toFixed(6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
