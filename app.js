let currentLang = 'en';
let showResellOnly = false;
let gateTimerInterval = null;
let gateSecondsLeft = 30;

const i18n = {
    en: {
        navSubtitle: "EMIA2020 • Cross-disciplinary Design Thinking",
        userTagLabel: "Persona:",
        userName: "Chris Wong (HKID Verified)",
        tabMarketplace: "Marketplace",
        tabMovement: "Ticket Ledger",
        tabLedger: "Wallet",
        tabGate: "Gate Scanner",
        heroBadge: "Official Central Exchange",
        heroNoChat: "No Chat • No Haggling • Guaranteed Real",
        heroTitle: "Kai Tak & Premier League Ticket Resale Hub",
        heroDesc: "Every ticket is verified on-record by the central primary box office. Buyers click to buy instantly with no DMs. Old QR codes are revoked immediately upon transfer and replaced with encrypted dynamic PiCodes.",
        f1: "Real HKID Linked",
        f2: "Price Capped (1.0x - 1.5x)",
        f3: "T-24h Auto Cutoff",
        f4: "Social Verification Badges",
        searchPlaceholder: "Search by match, stadium, or seat section...",
        sortPrice: "Price: Low to High",
        sortTrust: "Trust Score: Highest",
        movementTitle: "Central Ticket Movement Ledger (Public Audit Log)",
        movementDesc: "Immutable central registry recording ownership history, HKID links, and current resale status. Buyers can verify sellers before paying.",
        filterResellOnly: "Show Resale Listed Only",
        thTicketId: "Ticket ID",
        thMatch: "Match Event",
        thOrig: "Original Purchaser",
        thCurr: "Current Owner (Masked ID)",
        thPreference: "Resale Status",
        thPriceRange: "Audit Price Band",
        walletTitle: "Chris Wong's Digital Wallet",
        walletDesc: "One-click resale toggle, instant platform buy-back option, and live dynamic PiCodes for gate entry.",
        myTicketsHeader: "My Active Passes & Tickets",
        gateTitle: "Kai Tak Sports Park Gate Turnstile",
        gateDesc: "Test gate scanning to verify how centralized ownership revokes old/fake QR codes immediately while approving legitimate tickets.",
        gateSelectMode: "Select Scenario to Test Scanner:",
        gateBtnScan: "Scan Ticket Code at Turnstile",
        footerText: "Re-vision EMIA2020 Cross-disciplinary Design Thinking • Official Ticket Resale Solution"
    },
    zh: {
        navSubtitle: "EMIA2020 • 跨界設計思維專案",
        userTagLabel: "代表人物:",
        userName: "黃家豪 (實名認證)",
        tabMarketplace: "官方二手交易",
        tabMovement: "門票審計帳本",
        tabLedger: "我的錢包",
        tabGate: "球場過闸模擬",
        heroBadge: "官方集中交易平台",
        heroNoChat: "無私聊 • 無議價 • 100% 正版保證",
        heroTitle: "啟德體育園及香港超級聯賽門票轉售中心",
        heroDesc: "所有門票均由官方數據庫實名驗證。買家一鍵即時購買，無須私訊溝通。成功轉讓後舊 QR 碼即時失效並發放全新動態 PiCode。",
        f1: "實名 HKID 綁定",
        f2: "官方限價 (1.0x - 1.5x)",
        f3: "開賽前 24 小時自動截止",
        f4: "社交媒體驗證標籤",
        searchPlaceholder: "按賽事、球場或座位搜尋...",
        sortPrice: "價格：由低至高",
        sortTrust: "信譽評分：最高",
        movementTitle: "中央門票流動帳本 (公開審計紀錄)",
        movementDesc: "不可篡改的官方審計紀錄，透明記載所有權變更及轉售狀態，徹底消除離線詐騙。",
        filterResellOnly: "只顯示掛牌轉售門票",
        thTicketId: "門票編號",
        thMatch: "賽事項目",
        thOrig: "原始購買人",
        thCurr: "現持有人 (遮罩身份)",
        thPreference: "轉售狀態",
        thPriceRange: "價格區間審計",
        walletTitle: "黃家豪的數碼錢包",
        walletDesc: "一鍵切換轉售狀態、平台保底回購，以及進場用動態 PiCode 門票。",
        myTicketsHeader: "我的有效門票",
        gateTitle: "啟德體育園閘口過閘機",
        gateDesc: "模擬過閘掃描，驗證官方中央帳本如何即時阻擋已轉讓/假冒門票並放行正版門票。",
        gateSelectMode: "選擇模擬測試情境：",
        gateBtnScan: "在閘口掃描門票 PiCode",
        footerText: "Re-vision EMIA2020 跨界設計思維 • 官方體育門票詐騙解決方案"
    }
};

// Application State
let state = {
    listings: [
        {
            id: 'LIST-201',
            ticketId: 'REV-KT-9912',
            match: 'Hong Kong Premier League: Kitchee vs Eastern',
            date: 'Oct 15, 2026 • 20:00',
            venue: 'Kai Tak Youth Sports Ground 啟德青年運動場',
            seat: 'Sec 104, Row 5, Seat 12',
            faceValue: 200,
            price: 240, // Within 1.0x - 1.5x band
            minPrice: 200,
            maxPrice: 300,
            sellerAlias: 'Alex_K',
            maskedId: 'A****19(2)',
            trustScore: '99.8%',
            cutoffHoursLeft: 18,
            status: 'Active'
        },
        {
            id: 'LIST-202',
            ticketId: 'REV-KT-8840',
            match: 'Senior Shield Final: South China vs Lee Man',
            date: 'Oct 22, 2026 • 19:30',
            venue: 'Mong Kok Stadium 旺角大球場',
            seat: 'Sec B, Row 2, Seat 8',
            faceValue: 300,
            price: 380,
            minPrice: 300,
            maxPrice: 450,
            sellerAlias: 'Jordan_T',
            maskedId: 'J****88(8)',
            trustScore: '100%',
            cutoffHoursLeft: 14,
            status: 'Active'
        },
        {
            id: 'LIST-203',
            ticketId: 'REV-KT-7119',
            match: 'International Challenge: HK Representative XI vs Asian XI',
            date: 'Nov 05, 2026 • 18:00',
            venue: 'Kai Tak Main Stadium 啟德主場館',
            seat: 'Sec 210, Row 14, Seat 4',
            faceValue: 400,
            price: 480,
            minPrice: 400,
            maxPrice: 600,
            sellerAlias: 'Chris W.',
            maskedId: 'C****49(2)',
            trustScore: '100%',
            cutoffHoursLeft: 22,
            status: 'Active'
        }
    ],
    userWallet: [
        {
            ticketId: 'REV-KT-7119',
            match: 'International Challenge: HK Representative XI vs Asian XI',
            date: 'Nov 05, 2026 • 18:00',
            venue: 'Kai Tak Main Stadium 啟德主場館',
            seat: 'Sec 210, Row 14, Seat 4',
            faceValue: 400,
            price: 480,
            minPrice: 400,
            maxPrice: 600, // 1.5x max cap
            floorBuybackPrice: 320, // 80% Buy-Back Floor
            status: 'Valid (Active)',
            piCode: 'REV-PI-8849-DYNAMIC-QR',
            wantResell: true
        },
        {
            ticketId: 'REV-KT-3341',
            match: 'HK Premier League Final',
            date: 'Nov 12, 2026 • 16:00',
            venue: 'Kai Tak Youth Sports Ground',
            seat: 'Sec 102, Row 3, Seat 18',
            faceValue: 250,
            price: 280,
            minPrice: 250,
            maxPrice: 375,
            floorBuybackPrice: 200,
            status: 'Valid (Active)',
            piCode: 'REV-PI-1102-DYNAMIC-QR',
            wantResell: false
        }
    ],
    ticketMovements: [
        { ticketId: 'REV-KT-9912', match: 'Kitchee vs Eastern', orig: 'Alex Wong (A****19)', curr: 'Alex Wong (A****19)', preference: 'Listed for Resale', wantResell: true, band: '$200 - $300 (1.0x - 1.5x)' },
        { ticketId: 'REV-KT-8840', match: 'Senior Shield Final', orig: 'Sam Chan (S****11)', curr: 'Jordan Tsang (J****88)', preference: 'Listed for Resale', wantResell: true, band: '$300 - $450 (1.0x - 1.5x)' },
        { ticketId: 'REV-KT-7119', match: 'HK XI vs Asian XI', orig: 'Chris Wong (C****49)', curr: 'Chris Wong (C****49)', preference: 'Listed for Resale', wantResell: true, band: '$400 - $600 (1.0x - 1.5x)' },
        { ticketId: 'REV-KT-3341', match: 'HK Premier League Final', orig: 'Chris Wong (C****49)', curr: 'Chris Wong (C****49)', preference: 'Keep & Attend', wantResell: false, band: '$250 - $375 (1.0x - 1.5x)' }
    ]
};

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    document.getElementById('langLabel').innerText = currentLang === 'en' ? '繁體中文' : 'English';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18n[currentLang][key]) {
            el.innerText = i18n[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang][key]) {
            el.setAttribute('placeholder', i18n[currentLang][key]);
        }
    });

    renderListings();
    if(!document.getElementById('tab-movement').classList.contains('hidden')) renderMovements();
    if(!document.getElementById('tab-ledger').classList.contains('hidden')) renderLedger();
}

function switchTab(tabId) {
    ['marketplace', 'movement', 'ledger', 'gate'].forEach(id => {
        document.getElementById('tab-' + id).classList.add('hidden');
        document.getElementById('nav-' + id).className = "px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition text-sky-100 hover:bg-white/10";
    });

    document.getElementById('tab-' + tabId).classList.remove('hidden');
    document.getElementById('nav-' + tabId).className = "px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition bg-white text-sky-800 shadow-sm";

    if (tabId === 'movement') renderMovements();
    if (tabId === 'ledger') renderLedger();
    if (tabId === 'gate') renderGateDropdown();
}

// Render Marketplace
function renderListings() {
    const grid = document.getElementById('listingsGrid');
    const query = document.getElementById('searchInput').value.toLowerCase();
    const sort = document.getElementById('sortSelect').value;

    let filtered = state.listings.filter(l => 
        l.match.toLowerCase().includes(query) || 
        l.seat.toLowerCase().includes(query) || 
        l.venue.toLowerCase().includes(query)
    );

    if (sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'trust-desc') filtered.sort((a,b) => parseFloat(b.trustScore) - parseFloat(a.trustScore));

    grid.innerHTML = filtered.map(item => `
        <div class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition">
            <div>
                <div class="flex items-center justify-between mb-3">
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center">
                        <i class="fa-solid fa-check-circle mr-1"></i> Demo Seller
                    </span>
                    <span class="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">${item.ticketId}</span>
                </div>
                <h3 class="text-base font-bold text-slate-900 mb-1 leading-snug">${item.match}</h3>
                <p class="text-xs text-slate-500 mb-4"><i class="fa-regular fa-calendar mr-1"></i> ${item.date}</p>

                <!-- Listing Info Box -->
                <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-4">
                    <div class="flex justify-between"><span class="text-slate-500">Seat:</span> <span class="font-semibold text-slate-800">${item.seat}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Seller Identity:</span> <span class="font-medium text-slate-700">${item.sellerAlias} (${item.maskedId})</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Trust Score:</span> <span class="text-emerald-700 font-bold">${item.trustScore}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Official Face Value:</span> <span class="font-mono">$${item.faceValue} HKD</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Max Allowed Band:</span> <span class="text-sky-700 font-mono font-semibold">$${item.minPrice} - $${item.maxPrice} (1.5x Cap)</span></div>
                </div>

                <!-- T-24h Cutoff Banner -->
                <div class="flex items-center justify-between bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-lg text-xs font-semibold mb-4">
                    <span><i class="fa-solid fa-clock text-amber-600 mr-1"></i> Cutoff Timer:</span>
                    <span class="font-mono text-amber-800 font-bold">${item.cutoffHoursLeft}h 24m remaining</span>
                </div>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                    <span class="text-[10px] text-slate-400 block uppercase font-bold">Resale Price</span>
                    <span class="text-xl font-extrabold text-slate-900">$${item.price} <span class="text-xs font-normal text-slate-500">HKD</span></span>
                </div>

                <div class="flex items-center space-x-2">
                    <!-- Social Badge Button -->
                    <button onclick="openSocialModal('${item.id}')" title="Share Verified Social Badge to IG/Discord" class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition text-xs">
                        <i class="fa-solid fa-share-nodes text-sky-600"></i>
                    </button>
                    <!-- Direct No-Chat Buy Button -->
                    <button onclick="openPurchaseModal('${item.id}')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs transition shadow-sm flex items-center space-x-1">
                        <i class="fa-solid fa-bolt"></i>
                        <span>No-Chat Buy</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterListings() {
    renderListings();
}

// Purchase Modal (No-Chat Instant Buy)
function openPurchaseModal(listingId) {
    const item = state.listings.find(l => l.id === listingId);
    if (!item) return;

    const modalContent = document.getElementById('purchaseModalContent');
    modalContent.innerHTML = `
        <div class="text-center mb-5">
            <div class="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">
                <i class="fa-solid fa-bolt"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900">Instant No-Chat Purchase</h3>
            <p class="text-xs text-slate-500 mt-0.5">Direct central ledger transfer. No DMs or haggling.</p>
        </div>

        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-5">
            <div class="flex justify-between"><span class="text-slate-500">Match Event:</span> <span class="font-bold text-slate-900">${item.match}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Seat Section:</span> <span class="font-medium text-slate-800">${item.seat}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Verified Seller:</span> <span class="text-sky-700 font-semibold">${item.sellerAlias} (${item.maskedId})</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Buyer Account:</span> <span class="text-slate-800 font-semibold">Chris Wong (HKID #Z849***)</span></div>
            <div class="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold">
                <span class="text-slate-700">Total Price:</span> <span class="text-emerald-600">$${item.price} HKD</span>
            </div>
        </div>

        <div class="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 mb-5 flex items-start space-x-2">
            <i class="fa-solid fa-shield-check text-emerald-600 mt-0.5"></i>
            <div>
                <strong>Re-issued Dynamic QR Guarantee:</strong> The seller's previous QR code will be revoked immediately. You will receive a brand-new encrypted dynamic PiCode pass.
            </div>
        </div>

        <button onclick="executePurchase('${item.id}')" class="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-xl text-sm transition shadow-md">
            Confirm & Instant Re-Issue Pass
        </button>
    `;
    document.getElementById('purchaseModal').classList.remove('hidden');
}

function closePurchaseModal() {
    document.getElementById('purchaseModal').classList.add('hidden');
}

function executePurchase(listingId) {
    const index = state.listings.findIndex(l => l.id === listingId);
    if (index === -1) return;
    const purchased = state.listings[index];

    state.listings.splice(index, 1);

    state.userWallet.push({
        ticketId: purchased.ticketId,
        match: purchased.match,
        date: purchased.date,
        venue: purchased.venue,
        seat: purchased.seat,
        faceValue: purchased.faceValue,
        price: purchased.price,
        minPrice: purchased.minPrice,
        maxPrice: purchased.maxPrice,
        floorBuybackPrice: Math.floor(purchased.faceValue * 0.8),
        status: 'Valid (Active)',
        piCode: 'REV-PI-' + Math.floor(1000 + Math.random() * 9000) + '-REISSUED',
        wantResell: false
    });

    // Update ledger record
    const mov = state.ticketMovements.find(m => m.ticketId === purchased.ticketId);
    if (mov) {
        mov.curr = 'Chris Wong (C****49)';
        mov.preference = 'Keep & Attend';
        mov.wantResell = false;
    }

    closePurchaseModal();
    renderListings();
    showToast('Ownership Transferred!', 'New dynamic QR code re-issued and delivered to your wallet.');
}

// Social Verification Badge Modal
function openSocialModal(listingId) {
    const item = state.listings.find(l => l.id === listingId);
    if (!item) return;

    const modalContent = document.getElementById('socialModalContent');
    modalContent.innerHTML = `
        <div class="text-center mb-4">
            <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 text-lg">
                <i class="fa-solid fa-share-nodes"></i>
            </div>
            <h3 class="text-base font-bold text-slate-900">Social Verification Badge</h3>
            <p class="text-xs text-slate-500">Share on Instagram / Discord without exposing scams.</p>
        </div>

        <!-- Preview of Social Card -->
        <div class="bg-gradient-to-tr from-slate-900 to-sky-950 text-white p-4 rounded-xl shadow-inner mb-4 text-xs font-mono border border-slate-700">
            <div class="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
                <span class="text-emerald-400 font-bold flex items-center"><i class="fa-solid fa-shield-check mr-1"></i> VERIFIED RE-VISION TICKET</span>
                <span class="text-slate-400">${item.ticketId}</span>
            </div>
            <div class="font-sans font-bold text-sm text-white mb-1">${item.match}</div>
            <div class="text-slate-300 font-sans text-[11px] mb-2">${item.seat} • $${item.price} HKD</div>
            <div class="bg-white/10 p-2 rounded text-[10px] text-sky-200">
                🔗 Safe Direct Link: https://re-vision.hk/verify/${item.ticketId}
            </div>
        </div>

        <div class="text-xs text-slate-600 mb-4 leading-relaxed">
            Sellers can post this verified badge in their Instagram bio or Discord servers. Potential buyers clicking the link bypass unverified DMs and are routed directly to this official purchase ledger.
        </div>

        <button onclick="copySocialLink('${item.ticketId}')" class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2">
            <i class="fa-regular fa-copy"></i>
            <span>Copy Verified Social Link</span>
        </button>
    `;
    document.getElementById('socialModal').classList.remove('hidden');
}

function closeSocialModal() {
    document.getElementById('socialModal').classList.add('hidden');
}

function copySocialLink(ticketId) {
    showToast('Link Copied!', `Verified ledger link for ${ticketId} copied to clipboard.`);
    closeSocialModal();
}

// Render Ticket Movements
function renderMovements() {
    const tableBody = document.getElementById('movementTableBody');
    let rows = state.ticketMovements;

    if (showResellOnly) {
        rows = rows.filter(r => r.wantResell);
    }

    tableBody.innerHTML = rows.map(row => `
        <tr class="hover:bg-slate-50 transition">
            <td class="p-4 font-mono font-bold text-sky-700">${row.ticketId}</td>
            <td class="p-4 font-medium text-slate-900">${row.match}</td>
            <td class="p-4 text-slate-600">${row.orig}</td>
            <td class="p-4 font-semibold text-slate-800">${row.curr}</td>
            <td class="p-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${row.wantResell ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">
                    ${row.wantResell ? '🔄 Listed for Resale' : '✅ Keep & Attend'}
                </span>
            </td>
            <td class="p-4 text-center">
                <button onclick="inspectPriceBand('${row.ticketId}', '${row.match}', '${row.band}')" class="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-semibold text-xs transition">
                    Inspect Band
                </button>
            </td>
        </tr>
    `).join('');
}

function toggleResellOnlyFilter() {
    showResellOnly = !showResellOnly;
    const btn = document.getElementById('filterResellBtn');
    btn.className = showResellOnly 
        ? "px-4 py-2 rounded-xl bg-sky-600 text-white font-semibold text-xs shadow-sm transition flex items-center space-x-2 shrink-0"
        : "px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold transition flex items-center space-x-2 shrink-0";
    renderMovements();
}

function inspectPriceBand(ticketId, match, band) {
    const content = document.getElementById('priceModalContent');
    content.innerHTML = `
        <div class="text-center mb-4">
            <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-lg">
                <i class="fa-solid fa-scale-balanced"></i>
            </div>
            <h3 class="text-base font-bold text-slate-900">Official Price Band Inspection</h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5">${ticketId}</p>
        </div>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs mb-4">
            <div><span class="text-slate-500 block">Match Event:</span> <span class="font-bold text-slate-900">${match}</span></div>
            <div><span class="text-slate-500 block">Official Allowed Resale Cap (1.0x - 1.5x):</span> <span class="text-emerald-700 font-mono font-bold text-sm">${band}</span></div>
        </div>
        <div class="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs leading-relaxed mb-4">
            <i class="fa-solid fa-info-circle text-sky-600 mr-1"></i> Scalping protection active: Sellers cannot list tickets above 1.5x face value.
        </div>
        <button onclick="closePriceModal()" class="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition">Close Audit</button>
    `;
    document.getElementById('priceModal').classList.remove('hidden');
}

function closePriceModal() {
    document.getElementById('priceModal').classList.add('hidden');
}

// Render User Wallet Cards
function renderLedger() {
    const container = document.getElementById('userWalletTickets');
    container.innerHTML = state.userWallet.map(t => `
        <div class="bg-white border ${t.wantResell ? 'border-sky-300 bg-sky-50/30' : 'border-slate-200'} rounded-2xl p-5 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">${t.ticketId}</span>
                <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${t.wantResell ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-emerald-100 text-emerald-800'}">
                    ${t.wantResell ? 'Resale Listed' : 'Active Pass (Keep)'}
                </span>
            </div>

            <div>
                <h4 class="font-bold text-slate-900 text-base mb-1">${t.match}</h4>
                <p class="text-xs text-slate-500"><i class="fa-regular fa-calendar mr-1"></i> ${t.date} • ${t.seat}</p>
            </div>

            <div class="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 font-mono">
                <div class="flex justify-between"><span class="text-slate-500">Dynamic PiCode:</span> <span class="text-slate-800 font-bold">${t.piCode}</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Current Value:</span> <span class="text-emerald-700 font-bold">$${t.price} HKD</span></div>
                <div class="flex justify-between"><span class="text-slate-500">Buy-Back Floor Price:</span> <span class="text-amber-700 font-bold">$${t.floorBuybackPrice} HKD</span></div>
            </div>

            <!-- Action Controls inside Wallet Card -->
            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <!-- One-Click Resell Toggle -->
                <button onclick="openPrefModal('${t.ticketId}')" class="py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1">
                    <i class="fa-solid fa-sliders"></i>
                    <span>One-Click Resell</span>
                </button>
                <!-- Buy-Back Floor Action -->
                <button onclick="executePlatformBuyback('${t.ticketId}')" class="py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs transition flex items-center justify-center space-x-1">
                    <i class="fa-solid fa-coins"></i>
                    <span>Instant Buy-Back</span>
                </button>
            </div>
        </div>
    `).join('');
}

// Preference Configurator
function openPrefModal(ticketId) {
    const t = state.userWallet.find(item => item.ticketId === ticketId);
    if (!t) return;

    tempResellState = t.wantResell;
    const content = document.getElementById('prefModalContent');
    content.innerHTML = `
        <div class="text-center mb-4">
            <h3 class="text-base font-bold text-slate-900">Configure Ticket Resale Preference</h3>
            <p class="text-xs text-slate-500 font-mono mt-0.5">${t.ticketId}</p>
        </div>

        <div class="space-y-4 mb-5">
            <div class="grid grid-cols-2 gap-3">
                <button onclick="setTicketPrefState(false)" id="btnKeep" class="p-3 rounded-xl border text-left transition ${!t.wantResell ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}">
                    <div class="text-xs font-bold mb-1">Keep & Attend</div>
                    <div class="text-[10px] text-slate-500">Use dynamic pass at gate</div>
                </button>
                <button onclick="setTicketPrefState(true)" id="btnResell" class="p-3 rounded-xl border text-left transition ${t.wantResell ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'}">
                    <div class="text-xs font-bold mb-1">List for Resale</div>
                    <div class="text-[10px] text-slate-500">Publish to central hub</div>
                </button>
            </div>

            <div id="priceSliderBox" class="${t.wantResell ? '' : 'hidden'} space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div class="flex justify-between text-xs">
                    <span class="text-slate-600 font-medium">Set Price (1.0x - 1.5x Cap):</span>
                    <span id="sliderValDisplay" class="font-bold text-sky-700 font-mono">$${t.price} HKD</span>
                </div>
                <input type="range" id="resellPriceRange" min="${t.minPrice}" max="${t.maxPrice}" value="${t.price}" oninput="updateSliderDisplay(this.value)" class="w-full accent-sky-600">
                <div class="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Face: $${t.minPrice}</span>
                    <span>Max 1.5x: $${t.maxPrice}</span>
                </div>
            </div>
        </div>

        <button onclick="savePreference('${t.ticketId}')" class="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition">Save & Sync Ledger</button>
    `;
    document.getElementById('prefModal').classList.remove('hidden');
}

let tempResellState = false;
function setTicketPrefState(val) {
    tempResellState = val;
    const priceBox = document.getElementById('priceSliderBox');
    const btnKeep = document.getElementById('btnKeep');
    const btnResell = document.getElementById('btnResell');

    if(val) {
        priceBox.classList.remove('hidden');
        btnResell.className = "p-3 rounded-xl border text-left transition bg-sky-50 border-sky-500 text-sky-900 font-bold";
        btnKeep.className = "p-3 rounded-xl border text-left transition bg-slate-50 border-slate-200 text-slate-600";
    } else {
        priceBox.classList.add('hidden');
        btnKeep.className = "p-3 rounded-xl border text-left transition bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
        btnResell.className = "p-3 rounded-xl border text-left transition bg-slate-50 border-slate-200 text-slate-600";
    }
}

function updateSliderDisplay(val) {
    document.getElementById('sliderValDisplay').innerText = '$' + val + ' HKD';
}

function savePreference(ticketId) {
    const t = state.userWallet.find(item => item.ticketId === ticketId);
    const slider = document.getElementById('resellPriceRange');

    t.wantResell = tempResellState;
    if(slider) t.price = parseInt(slider.value);

    // Update ledger
    const mov = state.ticketMovements.find(m => m.ticketId === ticketId);
    if(mov) {
        mov.wantResell = t.wantResell;
        mov.preference = t.wantResell ? 'Listed for Resale' : 'Keep & Attend';
    }

    // Update marketplace
    const listIdx = state.listings.findIndex(l => l.ticketId === ticketId);
    if(t.wantResell) {
        if(listIdx === -1) {
            state.listings.push({
                id: 'LIST-' + Math.floor(300 + Math.random() * 500),
                ticketId: t.ticketId,
                match: t.match,
                date: t.date,
                venue: t.venue,
                seat: t.seat,
                faceValue: t.faceValue,
                price: t.price,
                minPrice: t.minPrice,
                maxPrice: t.maxPrice,
                sellerAlias: 'Chris W.',
                maskedId: 'C****49(2)',
                trustScore: '100%',
                cutoffHoursLeft: 20,
                status: 'Active'
            });
        } else {
            state.listings[listIdx].price = t.price;
        }
    } else {
        if(listIdx !== -1) state.listings.splice(listIdx, 1);
    }

    closePrefModal();
    renderLedger();
    renderListings();
    renderMovements();
    showToast('Preference Saved!', 'Resale status and price cap synchronized on-record.');
}

function closePrefModal() {
    document.getElementById('prefModal').classList.add('hidden');
}

// Buy-Back Floor Action
function executePlatformBuyback(ticketId) {
    const index = state.userWallet.findIndex(t => t.ticketId === ticketId);
    if(index === -1) return;

    const ticket = state.userWallet[index];
    const payout = ticket.floorBuybackPrice;

    state.userWallet.splice(index, 1);

    // Remove from marketplace if listed
    const listIdx = state.listings.findIndex(l => l.ticketId === ticketId);
    if(listIdx !== -1) state.listings.splice(listIdx, 1);

    // Update ledger
    const mov = state.ticketMovements.find(m => m.ticketId === ticketId);
    if(mov) {
        mov.curr = 'Re-vision Platform Buy-Back Floor';
        mov.preference = 'Platform Held';
        mov.wantResell = false;
    }

    renderLedger();
    renderListings();
    renderMovements();
    showToast('Instant Buy-Back Complete!', `$${payout} HKD deposited into Chris Wong's account immediately.`);
}

// Gate Simulation & 30-Second Dynamic QR Code Engine
function generateDynamicQRCode() {
    const canvas = document.getElementById('qrCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 140, 140);

    // White Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 140, 140);

    const gridCount = 17;
    const cellSize = 140 / gridCount;
    ctx.fillStyle = "#0f172a";

    // Draw QR corner finders (Top-Left, Top-Right, Bottom-Left)
    const drawFinder = (startX, startY) => {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (r === 0 || r === 4 || c === 0 || c === 4 || (r >= 1 && r <= 3 && c >= 1 && c <= 3 && (r === 2 || c === 2))) {
                    ctx.fillRect((startX + c) * cellSize, (startY + r) * cellSize, cellSize, cellSize);
                }
            }
        }
    };

    drawFinder(1, 1);
    drawFinder(11, 1);
    drawFinder(1, 11);

    // Randomize internal data matrix on every cycle
    for (let r = 0; r < gridCount; r++) {
        for (let c = 0; c < gridCount; c++) {
            if ((r < 6 && c < 6) || (r < 6 && c > 10) || (r > 10 && c < 6)) continue;
            if (Math.random() > 0.45) {
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
    }
}

function startGateTimer() {
    if (gateTimerInterval) clearInterval(gateTimerInterval);
    gateSecondsLeft = 30;

    gateTimerInterval = setInterval(() => {
        gateSecondsLeft--;
        const secEl = document.getElementById('gateTimerSeconds');
        const barEl = document.getElementById('gateTimerBar');

        if (secEl) secEl.innerText = gateSecondsLeft + 's';
        if (barEl) barEl.style.width = (gateSecondsLeft / 30) * 100 + '%';

        if (gateSecondsLeft <= 0) {
            forceQRRefresh();
        }
    }, 1000);
}

function forceQRRefresh() {
    gateSecondsLeft = 30;
    const secEl = document.getElementById('gateTimerSeconds');
    const barEl = document.getElementById('gateTimerBar');

    if (secEl) secEl.innerText = '30s';
    if (barEl) barEl.style.width = '100%';

    generateDynamicQRCode();
    showToast('PiCode Refreshed', 'New cryptographic dynamic token generated.');
}

function onGateTicketChange() {
    forceQRRefresh();
}

function renderGateDropdown() {
    const select = document.getElementById('gateTicketSelect');
    select.innerHTML = `
        <option value="VALID_1">Valid Ticket: Chris Wong's Dynamic PiCode (REV-KT-3341)</option>
        <option value="REVOKED_1">Revoked Ticket: Currently Resale Listed Pass (REV-KT-7119)</option>
        <option value="SCAM_IG">Scammed Fake Ticket: Unofficial Telegram / IG Screenshot PDF</option>
    `;
    generateDynamicQRCode();
    startGateTimer();
}

function simulateScan() {
    const val = document.getElementById('gateTicketSelect').value;
    const box = document.getElementById('scanResultBox');
    box.classList.remove('hidden');

    if(val === 'VALID_1') {
        box.className = "mt-6 p-5 rounded-2xl border border-emerald-300 bg-emerald-50 text-left";
        box.innerHTML = `
            <div class="flex items-center space-x-3 mb-2">
                <div class="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-emerald-900">ACCESS GRANTED • VALID Dynamic PiCode</h4>
                    <p class="text-xs text-emerald-700">Hong Kong Stadium Gate 4 Turnstile</p>
                </div>
            </div>
            <p class="text-xs text-slate-700 mt-2">
                Owner: <strong>Chris Wong (HKID Verified)</strong><br>
                Seat: Sec 102, Row 3, Seat 18<br>
                Ledger Status: Confirmed Owner • Original Dynamic Encryption Matched.
            </p>
        `;
    } else if(val === 'REVOKED_1') {
        box.className = "mt-6 p-5 rounded-2xl border border-rose-300 bg-rose-50 text-left";
        box.innerHTML = `
            <div class="flex items-center space-x-3 mb-2">
                <div class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                    <i class="fa-solid fa-xmark"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-rose-900">ACCESS DENIED • Ticket Currently Listed for Resale</h4>
                    <p class="text-xs text-rose-700">Central Ledger Revocation Active</p>
                </div>
            </div>
            <p class="text-xs text-slate-700 mt-2">
                Reason: This ticket is currently listed on the resale exchange. Previous dynamic QR code was automatically revoked to prevent double entry.
            </p>
        `;
    } else {
        box.className = "mt-6 p-5 rounded-2xl border border-rose-300 bg-rose-50 text-left";
        box.innerHTML = `
            <div class="flex items-center space-x-3 mb-2">
                <div class="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
                    <i class="fa-solid fa-shield-xmark"></i>
                </div>
                <div>
                    <h4 class="text-sm font-bold text-rose-900">ACCESS DENIED • Fake / Unverified Ticket</h4>
                    <p class="text-xs text-rose-700">Unrecognized Off-Record QR Code</p>
                </div>
            </div>
            <p class="text-xs text-slate-700 mt-2">
                Reason: This screenshot / PDF has no matching entry on the Re-vision central ledger. Purchased on unofficial IG/Telegram channel.
            </p>
        `;
    }
}


function showToast(title, msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMsg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}

window.onload = function() {
    renderListings();
};
