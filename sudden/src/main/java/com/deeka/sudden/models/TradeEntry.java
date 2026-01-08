package com.deeka.sudden.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.deeka.sudden.utils.SuddenUtils;

import lombok.Getter;
import lombok.Setter;

@Document(collection = "trade_entries")
@Getter
@Setter
public class TradeEntry {
    private String id;

    private String symbol;
    private EntryType entryType;
    private BigDecimal capital;
    private Float buyPrice;
    private Float sellPrice;

    private LocalDate entryDate;
    private LocalDate exitDate;
    private int daysHeld;

    private List<BuyReasonLog> buyReasonLogs;
    private List<ExitPlanLog> exitPlanLogs;
    private List<MistakeLog> mistakeLogs;
    private List<TakeAwayLog> takeAwayLogs;

    public int getDaysHeld() {
        try {
            if (entryDate == null || exitDate == null) {
                return 0;
            }
            return (int) ChronoUnit.DAYS.between(entryDate, exitDate);
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public String toString() {
        return SuddenUtils.toJson(this);
    }
}
