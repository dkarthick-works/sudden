package com.deeka.sudden.repositories;

import com.deeka.sudden.models.TradeEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TradeEntryRepository extends MongoRepository<TradeEntry, String> {
    List<TradeEntry> findBySellPriceNotNullAndExitDateBetween(LocalDate fromDate, LocalDate toDate);
}
