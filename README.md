# Re-vision — AI Seller Pricing Demo

A student ticket-resale prototype enhanced with a trained price-recommendation model. It preserves the original sky-blue/teal gradient, Inter typography, rounded cards, and marketplace/wallet/ledger/pass layout.

## Run the included demo

Python 3 is sufficient to serve the included pretrained model; no packages or API key are required for viewing.

```bash
cd re-vision
python -m http.server 8000
```

Open http://localhost:8000 in a browser. On systems where Python is named `python3`, use that instead. Do not open index.html directly: the model loads through fetch and needs HTTP. Internet access is required for the original Tailwind CDN, Font Awesome, and Google Fonts. The model itself runs locally in your browser, without an external AI service.

### 45-second demonstration

1. Select **Try AI pricing**, or open **Wallet**.
2. On the first ticket, select **One-Click Resell**.
3. Inspect the suggested price, numerical inputs, and residual-based price guide.
4. Expand **Inspect comparable synthetic sales**.
5. Select **Use HK$…**, then **Save & Sync Ledger**.
6. Open Marketplace to see the updated asking price.
7. Repeat with the second wallet ticket to see a different recommendation.

The first bundled ticket receives a recommendation of HK$556. This is a model output on a fictional market snapshot, not a real market valuation.

## What is actually AI?

A scikit-learn RandomForestRegressor, with 24 trees and maximum depth 6, predicts the ratio of sold price to face value. Its inputs are days to event, demand index, available listing count, and seat-quality category. The exported trees are evaluated in JavaScript; no hard-coded price lookup or chatbot is used.

The application scales the predicted ratio by a ticket's face value, rounds to HK$1, then clips to that ticket's existing minimum and maximum resale prices. Clipping is ordinary business logic, not machine learning.

The comparable-sales table is a separate nearest-record lookup using normalized feature distance plus log face-value distance. It provides context, not an exact explanation of the forest's prediction.

The histogram describes all synthetic sale-price ratios. It is not a price forecast.

### Dataset and evaluation

The included dataset contains 1,800 fictional completed transactions generated with seed 42. A fixed random split uses 1,440 for training and 360 for testing. On that synthetic test set:

| Metric | Result |
|---|---:|
| Random forest MAE | HK$14.37 |
| Training-median-ratio baseline MAE | HK$38.33 |

MAE is the average absolute difference between predicted and synthetic recorded sale prices. The baseline predicts the training set's median sale-price/face-value ratio for every ticket. These are unrounded, unclipped predictions; the demo asking price is rounded and clipped separately.

The data generator intentionally embeds a relationship between the features and sale-price ratio. Good performance on its synthetic test set therefore demonstrates the pipeline, not real-world market usefulness. The displayed price guide uses the test residuals' 80th-percentile absolute ratio error scaled by face value, then clipped to the allowed band. It is not a calibrated confidence interval. The same test data is used for evaluation and this illustrative guide; do not treat it as an independently validated uncertainty model.

## Real versus simulated

| Component | Status |
|---|---|
| Trained random forest and browser inference | Real trained model, synthetic training data |
| Recommendations | Calculated in browser from the exported trees |
| Market signals, transactions, identities | Synthetic |
| Event dates | Original prototype fixtures, not a live event feed |
| Days-to-event inputs | Fixed fictional pricing snapshot, not computed from the displayed dates |
| Payment, buy-back, ownership ledger | Browser-session simulation |
| QR/pass display | Visual simulation, not a cryptographic or venue-valid pass |
| Existing seller trust percentages | Prototype placeholders, not validated model outputs |
| Persistence | Session only; refreshing resets demo transactions |
| Language support | Existing EN/Traditional Chinese toggle; pricing panel remains English |

Nothing in this app verifies ticket authenticity, ownership with an issuer, or a user's identity. Do not upload real HKID data or use it for real financial decisions. No selling-speed prediction or sale guarantee is provided.

## Rebuild the data and model

Python 3.10–3.12 is recommended for the pinned scikit-learn release.

```bash
python -m venv .venv
```

Activate the environment:

```bash
# macOS / Linux
source .venv/bin/activate

# Windows PowerShell (alternative)
.venv\Scripts\Activate.ps1
```

Then run from the project root:

```bash
python -m pip install -r requirements.txt
python ml/generate_data.py
python ml/train_model.py
python ml/export_model.py
```

The first script replaces synthetic_sales.csv, comparables.json, and listings.json. The second saves a local joblib artifact and metrics. The third exports data/model.json for the browser. Do not load untrusted joblib artifacts. The generated joblib file is deliberately excluded from the distribution; it is not needed for the browser demo.

## Verify the browser export

Install Node.js to run this optional test, then rebuild the model as above:

```bash
python tests/test_export.py
```

This checks 100 Python/JavaScript prediction pairs, price limits, invalid inputs, and guide bounds. Browser inference casts inputs to float32 to match scikit-learn tree traversal.

JavaScript syntax can also be checked with:

```bash
node --check app.js
node --check assets/ai-pricing.js
node --check assets/pricing-engine.js
```

The included implementation was also exercised in headless Chromium: open resale form, get estimate, apply, save, check wallet/marketplace, and list the previously unlisted second ticket. External style dependencies were mocked during that functional test; it was not a full visual or cross-browser audit.

## Files

```text
re-vision/
├── index.html                  Original page layout, enhanced entry points
├── styles.css                  Additional responsive/modal/pricing styles
├── app.js                      Original app logic, with resale-state initialization fix
├── requirements.txt
├── .gitignore
├── .nojekyll
├── README.md
├── assets/
│   ├── tailwind-config.js      Original brand palette and font configuration
│   ├── pricing-engine.js       Trained tree inference and price-band enforcement
│   └── ai-pricing.js           Model loading, price UI, comparable sales, apply action
├── data/
│   ├── listings.json           Ticket pricing feature snapshots
│   ├── synthetic_sales.csv     Reproducible fictional transactions
│   ├── comparables.json        Browser-readable transaction records
│   ├── model.json              Exported forest and evaluation metadata
│   └── metrics.json            Synthetic test metrics
├── ml/
│   ├── generate_data.py
│   ├── train_model.py
│   └── export_model.py
└── tests/
    ├── check_export.js
    └── test_export.py
```

## Static deployment

Upload the contents of this folder to a GitHub repository. Enable GitHub Pages from the repository's publishing settings using the branch/root that contains index.html. All local asset and data references are relative, so a repository subpath is supported. No server, secrets, or build step is required. Keep the data and assets folders beside index.html.

## Original design and credits

Based on the supplied Re-vision HTML prototype and EMIA2020 Re-Vision group slides, credited in those slides to Michelle Han, Caitlin Chan, Tony Lam, Bridget Sin, and Lala Tsui. Keep the original team's credit and describe your own AI implementation contribution separately in your portfolio. Confirm permission before publicly redistributing group work or assets. The original local-only logo reference was replaced by a portable text wordmark, since the source image was not provided.

## Deliberate scope limits

No backend, real payments, authentication, issuer integrations, live data, chatbot, or production fraud detection. This is a presentation-focused student prototype with a genuine, reproducible ML component.
