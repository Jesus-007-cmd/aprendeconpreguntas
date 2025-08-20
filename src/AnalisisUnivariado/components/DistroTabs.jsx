// src/AnalisisUnivariado/components/DistroTabs.jsx
import React, { useState } from "react";

export default function DistroTabs({ tabs, defaultKey }) {
  const [active, setActive] = useState(defaultKey ?? (tabs[0]?.key));
  const current = tabs.find(t => t.key === active) ?? tabs[0];

  return (
    <div className="w-full">
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-300 dark:border-gray-700"
      >
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`px-3 py-1.5 rounded-t-md text-sm font-medium border-b-2 -mb-[1px] transition
              ${active === t.key
                ? "border-blue-500 text-blue-600 dark:text-blue-300"
                : "border-transparent hover:border-gray-400 text-gray-600 dark:text-gray-300"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="pt-4">
        {typeof current.render === "function" ? current.render() : current.content}
      </div>
    </div>
  );
}
