package com.deeka.sudden.services;

import com.deeka.sudden.models.DashboardData;
import com.deeka.sudden.models.DashboardDataRequestContext;
import com.deeka.sudden.models.TradeEntry;
import com.deeka.sudden.repositories.TradeEntryRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class JournalService {
    private final TradeEntryRepository tradeEntryRepository;

    JournalService(TradeEntryRepository tradeEntryRepository) {
        this.tradeEntryRepository = tradeEntryRepository;
    }

    public TradeEntry saveJournalEntry(TradeEntry tradeEntry) throws Exception {
        validateTradeEntry(tradeEntry);
        log.info("Saving trade entry {}", tradeEntry);
        return tradeEntryRepository.save(tradeEntry);
    }

    private void validateTradeEntry(TradeEntry tradeEntry) throws Exception {
        if (tradeEntry.getSymbol() == null || tradeEntry.getSymbol().isEmpty()) {
            throw new Exception("Symbol is required");
        }
        if (tradeEntry.getEntryType() == null) {
            throw new Exception("Entry type is required");
        }
        if (tradeEntry.getCapital() == null || tradeEntry.getCapital().doubleValue() <= 0) {
            throw new Exception("Capital must be greater than zero");
        }
        if (tradeEntry.getBuyPrice() == null || tradeEntry.getBuyPrice().doubleValue() <= 0) {
            throw new Exception("Buy price must be greater than zero");
        }
    }

    public List<TradeEntry> getAllTrades() {
        return tradeEntryRepository.findAll();
    }

    public TradeEntry getTradeById(String id) {
        return tradeEntryRepository.findById(id).orElse(null);
    }

    public TradeEntry updateTradeEntry(String id, TradeEntry tradeEntry) {
        tradeEntry.setId(id);
        return tradeEntryRepository.save(tradeEntry);
    }

    public DashboardData getDashboardData(DashboardDataRequestContext requestContext) {
        LocalDate fromDate = LocalDate.parse(requestContext.getFromDate());
        LocalDate toDate = LocalDate.parse(requestContext.getToDate());

        List<TradeEntry> closedTrades = tradeEntryRepository
                .findBySellPriceNotNullAndExitDateBetween(fromDate, toDate);

        int positiveCount = 0;
        int negativeCount = 0;
        float netPL = 0f;
        Set<String> symbols = new HashSet<>();

        for (TradeEntry trade : closedTrades) {
            float pl = (trade.getSellPrice() - trade.getBuyPrice())
                    * (trade.getCapital().floatValue() / trade.getBuyPrice());
            netPL += pl;

            if (pl > 0) {
                positiveCount++;
            } else if (pl < 0) {
                negativeCount++;
            }

            symbols.add(trade.getSymbol());
        }

        DashboardData dashboardData = new DashboardData();
        dashboardData.setTotalTrades(closedTrades.size());
        dashboardData.setPositiveTradesCount(positiveCount);
        dashboardData.setNegativeTradesCount(negativeCount);
        dashboardData.setNetRealisedProfitAndLoss(netPL);
        dashboardData.setEntitiesTraded(symbols);

        return dashboardData;
    }
}
