package com.deeka.sudden.models;

import com.deeka.sudden.utils.SuddenUtils;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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

    private Instant entryDate;
    private Instant exitDate;

    private List<BuyReasonLog> buyReasonLogs;
    private List<ExitPlanLog> exitPlanLogs;
    private List<MistakeLog> mistakeLogs;
    private List<TakeAwayLog> takeAwayLogs;

    @Override
    public String toString() {
        return SuddenUtils.toJson(this);
    }
}
