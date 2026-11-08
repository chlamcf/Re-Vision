const fs = require('fs');
const path = require('path');
const assert = require('assert');
const engine = require('../assets/pricing-engine.js');
const model = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/model.json'), 'utf8'));
const cases = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const test of cases) {
  assert(Math.abs(engine.predictRatio(model, test.profile) - test.expected) < 1e-10);
  const rec = engine.recommend(model, test.profile, 400, 400, 600);
  assert(rec.suggested >= 400 && rec.suggested <= 600);
  assert(rec.low <= rec.suggested && rec.high >= rec.suggested);
}
assert.throws(() => engine.predictRatio(model, {}));
assert.throws(() => engine.recommend(model, cases[0].profile, -1, 0, 10));
const floor = engine.recommend(model, cases[0].profile, 100, 200, 300);
const cap = engine.recommend(model, cases[0].profile, 100, 50, 60);
assert(floor.suggested === 200 && cap.suggested === 60);
console.log(`Passed ${cases.length} Python/JavaScript parity cases, bounds, and invalid-input checks.`);
