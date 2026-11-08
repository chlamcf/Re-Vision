/* Pricing enhancement for the original Re-vision prototype. No backend/API key. */
let pricingData = null;
let pricingError = null;
let activePricingTicket = null;
let activeRecommendation = null;

async function loadPricingData() {
  const read = async name => {
    const response = await fetch(`data/${name}.json`);
    if (!response.ok) throw new Error(`Cannot load ${name}: HTTP ${response.status}`);
    return response.json();
  };
  const [model, listings, comparables] = await Promise.all([
    read('model'), read('listings'), read('comparables')
  ]);
  if (!model.trees?.length || !Array.isArray(comparables)) throw new Error('Invalid model data');
  pricingData = {model, listings, comparables};
  return pricingData;
}
const pricingReady = loadPricingData().then(data => {
  const m = data.model.metrics;
  document.getElementById('pricingMetrics').textContent =
    `${m.train_rows.toLocaleString()} training rows · ${m.test_rows} held-out test rows · ` +
    `Synthetic test MAE: HK$${m.mae_hkd.toFixed(2)} · Median-ratio baseline MAE: HK$${m.baseline_mae_hkd.toFixed(2)}`;
  return data;
}).catch(error => {
  pricingError = error;
  document.getElementById('pricingMetrics').textContent = 'Pricing data unavailable. Existing resale controls still work.';
  return null;
});

const originalOpenPrefModal = openPrefModal;
openPrefModal = function(ticketId) {
  originalOpenPrefModal(ticketId);
  const content = document.getElementById('prefModalContent');
  if (!state.userWallet.some(t => t.ticketId === ticketId)) return;
  activePricingTicket = ticketId;
  activeRecommendation = null;
  const panel = document.createElement('section');
  panel.id = 'aiPricingPanel';
  panel.className = 'ai-price-panel ai-fade';
  panel.setAttribute('aria-live', 'polite');
  panel.innerHTML = '<p class="text-sm text-sky-800">Loading the trained pricing model…</p>';
  content.insertBefore(panel, content.children[1]);
  showPricingRecommendation(ticketId);
};

function money(value) { return `HK$${Math.round(value).toLocaleString('en-HK')}`; }
function profileFor(id) {
  return pricingData.listings.profiles[id] || pricingData.listings.default_profile;
}
function nearestSales(profile, face) {
  return pricingData.comparables.map(row => ({row, distance:
    Math.abs(row.days_to_event-profile.days_to_event)/43 +
    Math.abs(row.demand_index-profile.demand_index)/.9 +
    Math.abs(row.available_listings-profile.available_listings)/96 +
    Math.abs(row.seat_quality-profile.seat_quality)/2 +
    Math.abs(Math.log(row.face_value/face))
  })).sort((a,b) => a.distance-b.distance).slice(0,5).map(x => x.row);
}
async function showPricingRecommendation(ticketId) {
  await pricingReady;
  if (activePricingTicket !== ticketId) return;
  const panel = document.getElementById('aiPricingPanel');
  if (!panel) return;
  if (pricingError || !pricingData) {
    panel.innerHTML = `<h4 class="font-bold text-sky-900">Price recommendation unavailable</h4>
      <p class="text-xs text-slate-600 mt-2">Serve this project over HTTP and check the data files. You can still choose a price manually.</p>`;
    return;
  }
  const ticket = state.userWallet.find(t => t.ticketId === ticketId);
  if (!ticket) return;
  const profile = profileFor(ticketId);
  let rec;
  try {
    rec = PricingEngine.recommend(pricingData.model, profile,
      ticket.faceValue, ticket.minPrice, ticket.maxPrice);
  } catch (error) {
    panel.innerHTML = '<p class="text-sm text-slate-600">This ticket is outside the supported demo data. Set your price manually.</p>';
    return;
  }
  activeRecommendation = {ticketId, ...rec};
  const nearby = nearestSales(profile, ticket.faceValue);
  const comparableRows = nearby.map(row => `<tr><td>${row.transaction_id}</td>
    <td>${row.days_to_event}d</td><td>${row.seat_quality}</td><td>${money(row.face_value)}</td>
    <td class="font-bold text-teal-800">${money(row.sold_price)}</td></tr>`).join('');
  const ratios = pricingData.comparables.map(row => row.sold_price/row.face_value);
  const counts = Array.from({length:8}, (_,i) => ratios.filter(v => v >= .85+i*.1 &&
    (v < .95+i*.1 || (i === 7 && v <= 1.65))).length);
  const max = Math.max(...counts, 1);
  panel.innerHTML = `
    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="text-xs font-bold uppercase tracking-wider text-teal-700"><i class="fa-solid fa-chart-line mr-1"></i> AI price recommendation</span>
      <span class="text-[10px] bg-white border border-sky-200 text-sky-700 px-2 py-1 rounded-full">Trained model · Synthetic data</span>
    </div>
    <div class="text-3xl font-extrabold tracking-tight text-slate-900">${money(rec.suggested)}</div>
    <p class="text-xs text-slate-600 mt-1">Suggested asking price · your allowed band: ${money(ticket.minPrice)}–${money(ticket.maxPrice)}</p>
    <p class="text-xs text-teal-800 mt-2">Residual-based guide: ${money(rec.low)}–${money(rec.high)}</p>
    ${rec.constrained ? '<p class="text-xs text-amber-800 mt-2">The raw model estimate was adjusted to the platform’s allowed price band.</p>' : ''}
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs">
      <div class="ai-stat"><div class="text-slate-500">Days to event</div><div class="font-bold mt-1">${profile.days_to_event}</div></div>
      <div class="ai-stat"><div class="text-slate-500">Demand index</div><div class="font-bold mt-1">${profile.demand_index.toFixed(2)} / 1</div></div>
      <div class="ai-stat"><div class="text-slate-500">Available listings</div><div class="font-bold mt-1">${profile.available_listings}</div></div>
      <div class="ai-stat"><div class="text-slate-500">Seat quality</div><div class="font-bold mt-1">${profile.seat_quality} / 3</div></div>
    </div>
    <p class="text-[10px] text-slate-500 mt-2">Fixed fictional market snapshot; independent of the original prototype’s displayed dates. Seat quality: 1 standard, 2 preferred, 3 premium. Inputs shown are not causal model explanations.</p>
    <button type="button" onclick="useAIPrice()" class="w-full mt-4 py-3 rounded-xl text-white text-xs font-bold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700">Use ${money(rec.suggested)} <i class="fa-solid fa-arrow-right ml-1"></i></button>
    <p id="aiApplyStatus" class="text-xs text-teal-800 mt-2" role="status"></p>
    <details class="mt-3"><summary class="cursor-pointer text-xs font-semibold text-sky-800">Inspect comparable synthetic sales</summary>
      <p class="text-[10px] text-slate-500 mt-2">Five nearby records selected by normalized feature distance and face value. They provide context; the model uses 24 trained regression trees.</p>
      <div class="overflow-x-auto"><table class="ai-comparables"><thead><tr><th>Record</th><th>Days</th><th>Seat</th><th>Face</th><th>Sold</th></tr></thead><tbody>${comparableRows}</tbody></table></div>
    </details>
    <details class="mt-3"><summary class="cursor-pointer text-xs font-semibold text-sky-800">How the model works</summary>
      <p class="text-xs text-slate-600 mt-2 leading-relaxed">A random forest predicts sold-price / face-value from four numerical features. The app scales that prediction by face value, rounds to HK$1, and enforces this ticket’s price limits. It does not predict selling speed.</p>
      <div class="ai-histogram" role="img" aria-label="Distribution of synthetic sale price ratios from 0.85 to 1.65 times face value">${counts.map((n,i) => `<span style="height:${Math.max(3,n/max*100)}%" title="${(.85+i*.1).toFixed(2)}–${(.95+i*.1).toFixed(2)}×: ${n} sales"></span>`).join('')}</div>
      <div class="flex justify-between text-[10px] text-slate-500 mt-1"><span>0.85× face</span><span>All synthetic sales</span><span>1.65× face</span></div>
    </details>
    <p class="text-[10px] text-slate-500 mt-4 leading-relaxed">Demo estimate, not real market advice. The guide uses the held-out test set’s 80th-percentile absolute ratio error; it is not a calibrated confidence interval. Synthetic test performance does not establish real-world accuracy.</p>`;
}
function useAIPrice() {
  const rec = activeRecommendation;
  if (!rec || rec.ticketId !== activePricingTicket) return;
  const slider = document.getElementById('resellPriceRange');
  if (!slider) return;
  setTicketPrefState(true);
  slider.value = String(rec.suggested);
  updateSliderDisplay(slider.value);
  document.getElementById('aiApplyStatus').textContent = 'Applied to the resale form. Select “Save & Sync Ledger” to publish.';
}

// Correct overclaims from the original classroom prototype, including translated text.
Object.assign(i18n.en, {
  userName: 'Chris Wong (Demo account)', heroBadge: 'Student exchange prototype',
  heroNoChat: 'No chat • No haggling • Simulated transfers',
  heroTitle: 'A clearer way to resell your ticket',
  heroDesc: 'Explore a ticket resale concept with AI-assisted seller pricing. Listings, identities, payments, ownership records, and passes are simulated; no official issuer is connected.',
  f1: 'Demo accounts', f4: 'Shareable demo listings',
  movementDesc: 'Simulated ownership and listing records for this browser session. Not an immutable or official registry.',
  walletDesc: 'Explore AI price recommendations, resale settings, and simulated buy-back actions.',
  footerText: 'Re-vision • Student prototype • Synthetic data • No real ticketing or payments'
});
Object.assign(i18n.zh, {
  userName: '黃家豪（示範帳戶）', heroBadge: '學生交易平台原型',
  heroNoChat: '無私聊 • 無議價 • 模擬轉讓',
  heroTitle: '更清晰的門票轉售體驗',
  heroDesc: '探索 AI 輔助定價的門票轉售原型。掛牌、身份、付款、所有權紀錄及通行證均屬模擬，並未連接官方發行商。',
  f1: '示範帳戶', f4: '可分享的示範掛牌',
  movementDesc: '本次瀏覽工作階段的模擬所有權及掛牌紀錄，並非不可篡改的官方登記冊。',
  walletDesc: '探索 AI 價格建議、轉售設定及模擬回購。',
  footerText: 'Re-vision • 學生原型 • 合成資料 • 不提供真實票務或付款'
});
document.querySelectorAll('[data-i18n]').forEach(el => {
  const text = i18n[currentLang][el.dataset.i18n];
  if (text) el.textContent = text;
});
