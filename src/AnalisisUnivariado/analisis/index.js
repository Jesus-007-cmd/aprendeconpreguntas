// src/AnalisisUnivariado/analisis/index.js
import * as normalMLE  from "./NormalMLE.js";
import * as normalMinimosCuadrados from "./NormalMinimosCuadrados.js";

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

/** Compositor: usa el módulo A para la columna izquierda (mom)
 *  y el módulo B para la derecha (mle) en una sola fila. */
function composeLeftRight(leftMod, rightMod) {
  return {
    compute(xs, opts = {}) {
      const L = typeof leftMod.compute  === "function" ? leftMod.compute(xs,  opts) : null;
      const R = typeof rightMod.compute === "function" ? rightMod.compute(xs, opts) : null;

      return {
        mom: {
          param: L?.mom?.param ?? "—",
          error: L?.mom?.error ?? "—",
        },
        mle: {
          param: R?.mle?.param ?? "—",
          error: R?.mle?.error ?? "—",
        },
      };
    },
  };
}

// Normal: izquierda = LS (AFA), derecha = MLE (una sola fila)
const normalComposed = composeLeftRight(normalMinimosCuadrados, normalMLE);

export const DISTRO_REGISTRY = [
  { key:"normal", label:"Distribución Normal", mod: normalComposed },

  // Las demás ya devuelven ambas columnas (MoM/MLE) en su compute()
  { key:"logn2",   label:"Distribución LogNormal 2P",                mod: logn2   },
  { key:"logn3",   label:"Distribución LogNormal 3P",                mod: logn3   },
  { key:"exp1",    label:"Distribución exponencial 1P",              mod: exp1    },
  { key:"exp2",    label:"Distribución exponencial 2P",              mod: exp2    },
  { key:"gam2",    label:"Distribución Gamma 2P",                    mod: gam2    },
  { key:"gam3",    label:"Distribución Gamma 3P",                    mod: gam3    },
  { key:"lp3",     label:"Distribución LogPearson III",              mod: lp3     },
  { key:"gev",     label:"Distribución General de Valores Extremos", mod: gev     },
  { key:"gumbel",  label:"Distribución Gumbel",                      mod: gumbel  },
  { key:"gumbel2", label:"Distribución Gumbel Doble",                mod: gumbel2 },
];

const DEFAULT_ROW = { mom:{param:"—",error:"—"}, mle:{param:"—",error:"—"} };

export const REGISTRY_TAG = "REGISTRY::AnalisisUnivariado/analisis/index.js";
console.log("[INDEX] cargado:", REGISTRY_TAG);

// >>> ahora acepta opts y las pasa a compute()
export function computeRowFor(key, xs, opts = {}) {
  const item = DISTRO_REGISTRY.find(d => d.key === key);
  if (!item || !item.mod || typeof item.mod.compute !== "function") return DEFAULT_ROW;
  try {
    return item.mod.compute(xs, opts) || DEFAULT_ROW;
  } catch (err) {
    console.error("[INDEX] error en compute(", key, "):", err);
    return DEFAULT_ROW;
  }
}
