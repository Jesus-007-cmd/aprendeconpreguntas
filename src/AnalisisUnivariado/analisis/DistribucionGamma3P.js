// Gamma 3P: shift γ + Gamma(k, θ) sobre (x-γ). γ por búsqueda de grilla.
// MoM y MLE (Newton) en el espacio desplazado.
import { mean, varianceUnbiased, row, rmseQuantileFit, normInv } from "./utils.js";

// Reutilizamos los helpers de Gamma 2P (copiados aquí para evitar dependencias cruzadas)
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

export function compute(xs) {
  const n = xs?.length || 0; if (n < 3) return row("—", NaN, "—", NaN);
  let xmin=xs[0], xmax=xs[0]; for (let i=1;i<n;i++){ if(xs[i]<xmin) xmin=xs[i]; if(xs[i]>xmax) xmax=xs[i]; }
  const R = xmax - xmin; if(!(R>0)) return row("—", NaN, "—", NaN);
  const eps = 1e-6, gLow = xmin - Math.max(0.2*R, 1e-6), gHigh = xmin - eps, K = 50;

  // --- MOMENTOS: elige γ que minimiza RMSE usando parámetros MoM
  let g_m = NaN, k_m = NaN, th_m = NaN, rmse_m = Infinity;
  for (let k=0;k<K;k++){
    const g = gLow + (gHigh-gLow)*(k/(K-1));
    const y = []; let ok=true;
    for (let i=0;i<n;i++){ const d = xs[i]-g; if(!(d>0)){ ok=false; break; } y.push(d); }
    if(!ok) continue;
    const m = mean(y), s2 = varianceUnbiased(y); if(!(s2>0)) continue;
    const kk = (m*m)/s2, th = s2/m;
    const q = invGammaApprox(kk, th);
    const err = rmseQuantileFit(xs, (p)=> g + q(p));
    if (err < rmse_m){ rmse_m = err; g_m = g; k_m = kk; th_m = th; }
  }
  const momParam = Number.isNaN(g_m) ? "—" : `γ=${g_m.toFixed(4)}, k=${k_m.toFixed(4)}, θ=${th_m.toFixed(4)}`;

  // --- MLE: γ que minimiza RMSE usando MLE(k,θ) sobre y=x-γ
  let g_l = NaN, k_l = NaN, th_l = NaN, rmse_l = Infinity;
  for (let k=0;k<K;k++){
    const g = gLow + (gHigh-gLow)*(k/(K-1));
    const y = []; let ok=true;
    for (let i=0;i<n;i++){ const d=xs[i]-g; if(!(d>0)){ok=false;break;} y.push(d); }
    if(!ok) continue;
    const kk = mleShapeNewton(y); const th = mean(y)/kk;
    const q = invGammaApprox(kk, th);
    const err = rmseQuantileFit(xs, (p)=> g + q(p));
    if (err < rmse_l){ rmse_l = err; g_l = g; k_l = kk; th_l = th; }
  }
  const mleParam = Number.isNaN(g_l) ? "—" : `γ=${g_l.toFixed(4)}, k=${k_l.toFixed(4)}, θ=${th_l.toFixed(4)}`;

  return row(momParam, Number.isNaN(g_m) ? NaN : rmse_m, mleParam, Number.isNaN(g_l) ? NaN : rmse_l);
}
