function normalCDF(x) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;
  
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return 0.5 * (1.0 + sign * y);
}

export function calculateDPrime(hits, misses, falseAlarms, correctRejections) {
  if (hits + misses === 0 || falseAlarms + correctRejections === 0) {
    return 0;
  }
  
  let hitRate = hits / (hits + misses);
  let faRate = falseAlarms / (falseAlarms + correctRejections);
  
  hitRate = Math.max(0.001, Math.min(0.999, hitRate));
  faRate = Math.max(0.001, Math.min(0.999, faRate));
  
  return normalCDF(hitRate) - normalCDF(faRate);
}

export function clampDPrime(d) {
  return Math.max(-4, Math.min(4, d));
}
