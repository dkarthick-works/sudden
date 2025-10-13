package com.deeka.sudden.repositories;

import com.deeka.sudden.models.TradeEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TradeEntryRepository extends MongoRepository<TradeEntry, String> {
}
