// src/AnalisisUnivariado/analisis/DistribucionLogPearsonIII.js
import { mean, varianceUnbiased, varianceMLE, normInv, row, rmseQuantileFit } from "./utils.js";

// --- Helpers Gamma (como en Gamma2P/Gamma3P) ---
function digamma(x){ let r=0; while(x<5){r-=1/x; x+=1;} const f=1/(x*x); return r+Math.log(x)-0.5/x-f*(1/12 - f*(1/120 - f*(1/252))); }
function trigamma(x){ let r=0; while(x<5){r+=1/(x*x); x+=1;} const f=1/(x*x); return r + 1/x + 0.5*f + (1/6)*f/x - (1/30)*f*f; }
function invGammaApprox(k, theta){ return (p)=>{ const z=normInv(p); const t=1-1/(9*k)+z/(3*Math.sqrt(k)); const q=k*t*t*t; return Math.max(0, theta*q); }; }
function mleShapeNewton(arr){
  const m=mean(arr); const y=arr.map(Math.log); const A=Math.log(m)-mean(y);
  let k=(3-A+Math.sqrt((A-3)*(A-3)+24*A))/(12*A);
  if(!Number.isFinite(k) || k<=0) k=(m*m)/(varianceUnbiased(arr)||1e-9);
  for(let it=0; it<15; it++){
    const g=Math.log(k)-digamma(k)-A, h=1/k - trigamma(k), step=g/h; k-=step;
    if(!Number.isFinite(k) || k<=1e-8){ k=1e-6; break; }
    if(Math.abs(step)<1e-10) break;
  }
  return k;
}

// Asimetría simple (suficiente)
function skewness(y){
  const n=y.length; if(n<3) return Infinity;
  const m=mean(y); const s=Math.sqrt(varianceUnbiased(y)); if(!(s>0)) return Infinity;
  let t3=0; for(let i=0;i<n;i++){ const z=(y[i]-m)/s; t3 += z*z*z; }
  return t3 / n;
}

// invCDF Log-Pearson III en X
const invLP3 = (delta, k, theta) => (p) => Math.exp(delta + invGammaApprox(k, theta)(p));

export function compute(xs) {
  // Requiere X>0
  const pos = xs.filter(v => v > 0);
  const n = pos.length;
  if (n < 3) return row("—", NaN, "—", NaN);

  // Trabajamos en Y = ln(X)
  const y = pos.map(Math.log);
  const yMin = Math.min(...y), yMax = Math.max(...y), R = yMax - yMin;
  if (!(R > 0)) return row("—", NaN, "—", NaN);

  // ---------- MOMENTOS ----------
  const muY = mean(y);
  const sY  = Math.sqrt(varianceUnbiased(y));
  const g1  = skewness(y);           // asimetría de Y
  let momParam = "—", rmse_m = NaN;

  if (Number.isFinite(g1) && g1 > 0 && sY > 0) {
    const k_m = 4 / (g1 * g1);
    const th_m = sY / Math.sqrt(k_m);
    const de_m = muY - k_m * th_m;  // δ (shift en Y)

    rmse_m = rmseQuantileFit(pos, invLP3(de_m, k_m, th_m));
    momParam = `δ=${de_m.toFixed(4)}, k=${k_m.toFixed(4)}, θ=${th_m.toFixed(4)}`;
  }

  // ---------- MLE (búsqueda de δ) ----------
  const eps = 1e-6;
  const dLow  = yMin - Math.max(0.2 * R, 1e-6);
  const dHigh = yMin - eps;
  const K = 50;

  let bestD = NaN, bestK = NaN, bestT = NaN, bestErr = Infinity;
  for (let k = 0; k < K; k++) {
    const d = dLow + (dHigh - dLow) * (k / (K - 1));
    const z = [];
    let ok = true;
    for (let i = 0; i < n; i++) {
      const t = y[i] - d;
      if (!(t > 0)) { ok = false; break; }
      z.push(t);
    }
    if (!ok) continue;

    const k_mle = mleShapeNewton(z);
    const th_mle = mean(z) / k_mle;

    const inv = invLP3(d, k_mle, th_mle);
    const err = rmseQuantileFit(pos, inv);

    if (err < bestErr) {
      bestErr = err; bestD = d; bestK = k_mle; bestT = th_mle;
    }
  }

  const mleParam = (bestErr < Infinity)
    ? `δ=${bestD.toFixed(4)}, k=${bestK.toFixed(4)}, θ=${bestT.toFixed(4)}`
    : "—";

  return row(momParam, rmse_m, mleParam, bestErr < Infinity ? bestErr : NaN);
}
