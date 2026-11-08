/* Shared with the browser and the Node.js parity test. */
(function (scope) {
  function predictRatio(model, profile) {
    const x = model.features.map(name => {
      const v = Number(profile[name]);
      const [lo, hi] = model.bounds[name];
      if (!Number.isFinite(v) || v < lo || v > hi) throw new Error(`Unsupported feature: ${name}`);
      return Math.fround(v);
    });
    return model.trees.reduce((sum, tree) => {
      let node = 0;
      while (tree.left[node] !== -1) {
        node = x[tree.feature[node]] <= tree.threshold[node] ? tree.left[node] : tree.right[node];
      }
      return sum + tree.value[node];
    }, 0) / model.trees.length;
  }
  function recommend(model, profile, faceValue, minPrice, maxPrice) {
    if (![faceValue, minPrice, maxPrice].every(Number.isFinite) || faceValue <= 0 || minPrice > maxPrice) {
      throw new Error('Invalid ticket prices');
    }
    const raw = predictRatio(model, profile) * faceValue;
    const clamp = n => Math.min(maxPrice, Math.max(minPrice, n));
    const suggested = clamp(Math.round(raw));
    const spread = model.metrics.residual_p80_ratio * faceValue;
    return {raw, suggested, low: Math.min(suggested, clamp(Math.floor(raw-spread))),
      high: Math.max(suggested, clamp(Math.ceil(raw+spread))),
      constrained: raw < minPrice || raw > maxPrice};
  }
  const api = {predictRatio, recommend};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else scope.PricingEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
