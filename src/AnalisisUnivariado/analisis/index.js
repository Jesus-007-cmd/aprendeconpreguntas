// src/AnalisisUnivariado/analisis/index.js
import * as normal  from "./DistribucionNormal.js";
import * as logn2   from "./DistribucionLogNormal2P.js";
import * as logn3   from "./DistribucionLogNormal3P.js";
import * as exp1    from "./DistribucionExponencial1P.js";
import * as exp2    from "./DistribucionExponencial2P.js";
import * as gam2    from "./DistribucionGamma2P.js";
import * as gam3    from "./DistribucionGamma3P.js";
import * as lp3     from "./DistribucionLogPearsonIII.js";
import * as gev     from "./DistribucionGEV.js";
import * as gumbel  from "./DistribucionGumbel.js";
import * as gumbel2 from "./DistribucionGumbelDoble.js";

export const DISTRO_REGISTRY = [
  { key:"normal",  label:"Distribución Normal",                        mod: normal  },
  { key:"logn2",   label:"Distribución LogNormal 2P",                  mod: logn2   },
  { key:"logn3",   label:"Distribución LogNormal 3P",                  mod: logn3   },
  { key:"exp1",    label:"Distribución exponencial 1P",                mod: exp1    },
  { key:"exp2",    label:"Distribución exponencial 2P",                mod: exp2    },
  { key:"gam2",    label:"Distribución Gamma 2P",                      mod: gam2    },
  { key:"gam3",    label:"Distribución Gamma 3P",                      mod: gam3    },
  { key:"lp3",     label:"Distribución LogPearson III",                mod: lp3     },
  { key:"gev",     label:"Distribución General de Valores Extremos",   mod: gev     },
  { key:"gumbel",  label:"Distribución Gumbel",                        mod: gumbel  },
  { key:"gumbel2", label:"Distribución Gumbel Doble",                  mod: gumbel2 },
];

const DEFAULT_ROW = { mom:{param:"—",error:"—"}, mle:{param:"—",error:"—"} };

// Marca para verificar que estás importando este archivo (verás esto en consola)
export const REGISTRY_TAG = "REGISTRY::AnalisisUnivariado/analisis/index.js";
console.log("[INDEX] cargado:", REGISTRY_TAG);

export function computeRowFor(key, xs){
  const item = DISTRO_REGISTRY.find(d => d.key === key);
  console.log("[INDEX] try:", key, "| mod keys:", item?.mod && Object.keys(item.mod));

  if (!item || !item.mod) {
    console.warn("[INDEX] key no encontrada o módulo vacío:", key);
    return DEFAULT_ROW;
  }

  const fn = item.mod.compute;
  if (typeof fn !== "function") {
    console.warn("[INDEX] módulo sin compute():", key, item.mod);
    return DEFAULT_ROW;
  }

  try {
    const out = fn(xs);
    // imprime un resumen legible
    console.log("[INDEX] done:", key, {
      mom: out?.mom?.param ?? "—",
      mle: out?.mle?.param ?? "—"
    });
    return out;
  } catch (err) {
    console.error("[INDEX] error en compute(", key, "):", err);
    return DEFAULT_ROW;
  }
}
