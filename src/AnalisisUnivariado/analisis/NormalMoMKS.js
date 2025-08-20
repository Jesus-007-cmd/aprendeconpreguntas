// src/AnalisisUnivariado/analisis/NormalMoMKS.js

// CDF Normal (aprox. erf Abramowitz–Stegun)
function normalCdf(x, mu, sigma) {
    const z = (x - mu) / (sigma || 1e-12);
    const sign = z < 0 ? -1 : 1;
    const t = 1 / (1 + 0.3275911 * Math.abs(z));
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429;
    const erf = 1 - (((((a5*t + a4)*t + a3)*t + a2)*t + a1)*t) * Math.exp(-z*z);
    return 0.5 * (1 + sign * erf);
  }
  
  export function fitNormalAndKS(rawQ) {
    const xs = (rawQ || []).filter(v => Number.isFinite(v));
    const n = xs.length;
    if (n < 3) return null;
  
    // MoM
    const mean = xs.reduce((a,b)=>a+b,0) / n;
    const s2 = xs.reduce((a,b)=> a + (b-mean)*(b-mean), 0) / Math.max(1, (n-1));
    const sd = Math.sqrt(Math.max(s2, 1e-12));
  
    // Ordenados + posiciones empíricas Hazen: m/(n+1)
    const ord = xs.slice().sort((a,b)=>a-b);
    const rows = ord.map((Qord, i) => {
      const m = i + 1;
      const Pemp = m / (n + 1);
      const Ffit = normalCdf(Qord, mean, sd);
      const Delta = Math.abs(Ffit - Pemp);
      return { m, Qord, Pemp, Ffit, Delta };
    });
  
    // KS D
    const Dmax = rows.reduce((mx, r) => Math.max(mx, r.Delta), 0);
  
    // Umbrales KS (one-sample). Nota: si quieres ser estricto con mu/sigma estimados, usa Lilliefors.
    const crit = {
      alpha10: 1.22/Math.sqrt(n),
      alpha05: 1.36/Math.sqrt(n),
      alpha01: 1.63/Math.sqrt(n),
    };
  
    return { n, mean, sd, Dmax, crit, rows };
  }
  
  export function ksVerdict(Dmax, crit, alpha = 0.05) {
    if (!Number.isFinite(Dmax) || !crit) return null;
    const thr = alpha === 0.1 ? crit.alpha10
             : alpha === 0.01 ? crit.alpha01
             : crit.alpha05;
    const pass = Dmax < thr;
    return { pass, threshold: thr };
  }
  