import { mean, row, rmseQuantileFit } from "./utils.js";

// F^{-1}(p)= -ln(1-p)/λ
const invExp = (lambda) => (p) => -Math.log(1 - p) / lambda;

export function compute(xs) {
  const m = mean(xs);
  if (!Number.isFinite(m) || m <= 0) return row("—", NaN, "—", NaN);

  const lambda = 1 / m;     // MLE = Momentos en 1P
  const rmse = rmseQuantileFit(xs, invExp(lambda));
  const param = `λ=${lambda.toFixed(4)}`;

  return row(param, rmse, param, rmse);
}
