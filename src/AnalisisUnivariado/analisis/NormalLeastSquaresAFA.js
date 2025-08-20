// src/AnalisisUnivariado/analisis/NormalLeastSquaresAFA.js

// Posiciones de trazado
export function ppos(m, n, method = "Gringorten") {
    switch (method) {
      case "Weibull":    return m / (n + 1);
      case "Hazen":      return (m - 0.5) / n;
      case "Cunnane":    return (m - 0.4) / (n + 0.2);
      case "Blom":       return (m - 0.375) / (n + 0.25);
      case "Gringorten":
      default:           return (m - 0.44) / (n + 0.12);
    }
  }
  
  // Inversa normal (aprox. Acklam/AS241 simplificada)
  function normInv(p) {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
  
    const a = [
      -3.969683028665376e+01,  2.209460984245205e+02, -2.759285104469687e+02,
       1.383577518672690e+02, -3.066479806614716e+01,  2.506628277459239e+00
    ];
    const b = [
      -5.447609879822406e+01,  1.615858368580409e+02, -1.556989798598866e+02,
       6.680131188771972e+01, -1.328068155288572e+01
    ];
    const c = [
      -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
      -2.549732539343734e+00,  4.374664141464968e+00,  2.938163982698783e+00
    ];
    const d = [
       7.784695709041462e-03,  3.224671290700398e-01,  2.445134137142996e+00,
       3.754408661907416e+00
    ];
  
    let q, r;
  
    if (p < 0.02425) {
      q = Math.sqrt(-2 * Math.log(p));
      const num = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]);
      const den = (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q) + 1);
      return num / den;
    } else if (p > 1 - 0.02425) {
      q = Math.sqrt(-2 * Math.log(1 - p));
      const num = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]);
      const den = (((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q) + 1);
      return -num / den;
    } else {
      q = p - 0.5;
      r = q * q;
      const num = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q;
      const den = (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
      return num / den;
    }
  }
  
  /**
   * Ajuste por mínimos cuadrados en papel normal (modo AFA).
   * @param {number[]} values  Datos
   * @param {"Gringorten"|"Blom"|"Cunnane"|"Hazen"|"Weibull"} method  Posición de trazado
   * @param {"n"|"n-1"|"n-2"} seDf  Divisor para el error estándar
   */
  export function fitNormalLS_AFA(values, method = "Gringorten", seDf = "n-1") {
    const xs = (values || []).filter(Number.isFinite).slice().sort((a, b) => a - b);
    const n = xs.length;
    if (n < 3) return null;
  
    const ps = xs.map((_, i) => ppos(i + 1, n, method));
    const zs = ps.map(normInv);
  
    // OLS: x_i = mu + sigma * z_i
    const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;
    const mx = mean(xs);
    const mz = mean(zs);
    const cov = xs.reduce((s, x, i) => s + (x - mx) * (zs[i] - mz), 0);
    const vzz = zs.reduce((s, z) => s + (z - mz) * (z - mz), 0);
  
    const sigma = vzz > 0 ? cov / vzz : 0;
    const mu = mx - sigma * mz;
  
    const sse = xs.reduce((s, x, i) => {
      const yhat = mu + sigma * zs[i];
      const r = x - yhat;
      return s + r * r;
    }, 0);
  
    const df = seDf === "n" ? n : seDf === "n-1" ? n - 1 : n - 2;
    const denom = Math.max(1, df);
    const se = Math.sqrt(sse / denom);
  
    return { n, mu, sigma, se, method, seDf };
  }
  