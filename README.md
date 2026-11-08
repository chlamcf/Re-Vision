# Re-Vision — AI-Assisted Ticket Resale

A student ticket-resale prototype with machine-learning-powered seller price recommendations.

The application combines a marketplace, digital wallet, simulated ownership ledger, and demo ticket scanner. Its pricing feature helps sellers choose an asking price using a trained model and comparable synthetic transactions.

## Features

- Ticket marketplace with search and sorting.
- Digital wallet with resale settings.
- AI-generated asking-price recommendations.
- Comparable synthetic sales for pricing context.
- One-click application of a suggested price to the resale form.
- Simulated marketplace and ownership-record updates.
- Demo ticket-pass and scanner interactions.
- Existing English and Traditional Chinese interface toggle. The pricing panel is currently in English.

## Quick Start

The pretrained model and dataset are included. No API key, backend, or machine-learning package installation is required to view the demo.

### Requirements

- Python 3
- A modern web browser
- Internet access for Tailwind CSS, Font Awesome, and Google Fonts

### Run Locally

Open a terminal in the project folder containing `index.html` and run:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

If your system uses `python3`, run:

```bash
python3 -m http.server 8000
```

> Do not open `index.html` directly. The application loads its model and data using `fetch`, which requires serving the files over HTTP.

## Try the Pricing Feature

1. Open **Wallet**.
2. Select **One-Click Resell** on a ticket.
3. Inspect the suggested asking price and model inputs.
4. Expand **Inspect comparable synthetic sales** to view similar records.
5. Select **Use HK$…** to apply the recommendation.
6. Select **Save & Sync Ledger** to publish the simulated listing.
7. Open **Marketplace** to inspect the updated asking price.

Applying a recommendation fills the resale form. It does not publish the listing until the user saves.

Changes are stored only in the current browser session. Refreshing the page resets the demo.

## How the AI Works

The application uses a `RandomForestRegressor` trained on 1,800 synthetic completed transactions.

The model contains 24 regression trees with a maximum depth of 6. It predicts the ratio of sale price to face value using four numerical inputs:

| Input | Meaning |
| --- | --- |
| Days to event | Time remaining in the fictional market snapshot |
| Demand index | Synthetic demand signal between 0.1 and 1 |
| Available listings | Number of competing listings |
| Seat quality | Seat category: 1 standard, 2 preferred, 3 premium |

The application calculates the suggested asking price as follows:

```text
Market inputs
    |
    v
Trained random forest
    |
    v
Predicted sale-price / face-value ratio
    |
    v
Multiply by the ticket's face value
    |
    v
Round to the nearest HK$1
    |
    v
Enforce the ticket's minimum and maximum prices
    |
    v
Suggested asking price
```

The exported model runs directly in the browser. Recommendations are calculated from trained trees rather than a hard-coded price table.

Price rounding and enforcement of the allowed resale band are application rules, not machine learning.

### Comparable Sales

The pricing panel displays five nearby synthetic transactions.

Records are selected using normalized feature distance and face-value distance. They provide pricing context, but they are not exact explanations of the random forest's prediction.

### Price Guide

The displayed price guide uses the held-out test set's 80th-percentile absolute ratio error, scaled by the ticket's face value and restricted to its allowed price band.

It is an illustrative residual-based guide, not a calibrated confidence interval or a guarantee of the eventual sale price.

The model does not predict selling speed.

## Dataset and Evaluation

The synthetic dataset is generated with a fixed random seed for reproducibility.

| Dataset split | Transactions |
| --- | ---: |
| Training | 1,440 |
| Testing | 360 |
| Total | 1,800 |

The bundled model produced the following results on the synthetic test set:

| Method | Mean absolute error |
| --- | ---: |
| Random forest | HK$14.37 |
| Training-median-ratio baseline | HK$38.33 |

Mean absolute error measures the average absolute difference between predicted prices and recorded synthetic sale prices.

The baseline applies the training set's median sale-price-to-face-value ratio to every ticket. Evaluation uses unrounded, unclipped predictions; displayed recommendations are rounded and restricted to the allowed price band separately.

> The generator deliberately creates relationships between market features and sale prices. These results demonstrate the machine-learning pipeline, not real-world pricing accuracy. The same test set also supplies the illustrative residual guide.

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── requirements.txt
├── README.md
├── .gitignore
├── .nojekyll
├── assets/
│   ├── logo.png
│   ├── tailwind-config.js
│   ├── pricing-engine.js
│   └── ai-pricing.js
├── data/
│   ├── listings.json
│   ├── synthetic_sales.csv
│   ├── comparables.json
│   ├── model.json
│   └── metrics.json
├── ml/
│   ├── generate_data.py
│   ├── train_model.py
│   └── export_model.py
└── tests/
    ├── check_export.js
    └── test_export.py
```

### Main Files

| File | Purpose |
| --- | --- |
| `index.html` | Page layout and existing application screens |
| `styles.css` | Additional pricing-panel and responsive styles |
| `app.js` | Marketplace, wallet, ledger, and simulated transaction logic |
| `assets/tailwind-config.js` | Brand colors and font configuration |
| `assets/pricing-engine.js` | Browser model inference and price-band enforcement |
| `assets/ai-pricing.js` | Pricing interface, data loading, and recommendation application |
| `data/model.json` | Exported trained forest and evaluation metadata |
| `data/listings.json` | Fixed pricing-input snapshots for demo tickets |
