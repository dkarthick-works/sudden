# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trade Journal application for tracking stock trades, reflections, and performance metrics. Helps traders document their decision-making process and learn from past trades.

## Core Features (Based on Reference Designs)

### Trade Management
- **Add Trade**: Capture stock ticker, capital deployed, buy/sell prices, buy reason, exit plan, mistakes, and takeaways
- **Edit Trade**: Update existing trades with new thoughts/reflections while preserving entry history
- **Trade History**: View all trades with calculated metrics (% change, P/L)
- **Search & Filter**: Search by ticker, filter by trade status (all/open/closed)

### Key Fields per Trade
- Stock Ticker (immutable after creation)
- Capital Deployed
- Buy Price (required)
- Sell Price (optional, for open positions)
- Buy Reason (appendable history)
- Exit Plan (appendable history)
- Mistakes (appendable)
- Takeaways (appendable)

### Calculated Metrics
- **% Change**: `((Sell Price - Buy Price) / Buy Price) * 100`
- **P/L (Profit/Loss)**: `(Sell Price - Buy Price) * (Capital Deployed / Buy Price)`

### Data Persistence
The application needs to maintain historical entries for Buy Reason and Exit Plan fields, showing how thinking evolved over time. Each update should be timestamped and labeled (Entry #1, Entry #2, etc.).

## Reference Images
Located in `/reference-images/`:
- `01-landing-page.png` - Empty state and main layout
- `02-add-trade.png` - New trade form
- `03-edit-trade-log.png` - Edit interface with history tracking
- `04-dashboard-view.png` - Trade list/table view
