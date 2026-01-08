package com.deeka.sudden.controllers;

import com.deeka.sudden.helpers.JournalHelper;
import com.deeka.sudden.models.DashboardData;
import com.deeka.sudden.models.DashboardDataRequest;
import com.deeka.sudden.models.DashboardDataRequestContext;
import com.deeka.sudden.models.GenericResponse;
import com.deeka.sudden.models.TradeEntry;
import com.deeka.sudden.services.JournalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/journal")
public class JournalController {

    private final JournalService journalService;
    private final JournalHelper journalHelper;

    JournalController (JournalService journalService, JournalHelper journalHelper) {
        this.journalService = journalService;
        this.journalHelper = journalHelper;
    }

    @PostMapping
    ResponseEntity<GenericResponse<TradeEntry>> saveJournalEntry(@RequestBody TradeEntry tradeEntry) throws Exception {
        TradeEntry result = journalService.saveJournalEntry(tradeEntry);
        return ResponseEntity.ok(new GenericResponse<>(result, "Journal entry created successfully", null));
    }

    @GetMapping
    ResponseEntity<GenericResponse<List<TradeEntry>>> getAllTrades() {
        List<TradeEntry> allTrades = journalService.getAllTrades();
        return ResponseEntity.ok(new GenericResponse<>(allTrades, "All trades fetched successfully", null));
    }

    @GetMapping("/{id}")
    ResponseEntity<GenericResponse<TradeEntry>> getTradeById(@PathVariable String id) throws Exception {
        TradeEntry tradeEntry = journalService.getTradeById(id);
        return ResponseEntity.ok(new GenericResponse<>(tradeEntry, "Trade fetched successfully", null));
    }

    @PutMapping("/{id}")
    ResponseEntity<GenericResponse<TradeEntry>> updateTradeById(@PathVariable String id, @RequestBody TradeEntry tradeEntry) throws Exception {
        TradeEntry updatedTrade = journalService.updateTradeEntry(id, tradeEntry);
        return ResponseEntity.ok(new GenericResponse<>(updatedTrade, "Trade updated successfully", null));
    }

    @GetMapping("/dashboard")
    ResponseEntity<GenericResponse<DashboardData>> getDashboardData(@Valid @ModelAttribute DashboardDataRequest request) {
        DashboardDataRequestContext requestContext = journalHelper.getDashboardRequestContext(request.getFromDate(), request.getToDate());
        DashboardData dashboardData = journalService.getDashboardData(requestContext);
        return ResponseEntity.ok(new GenericResponse<>(dashboardData, "Dashboard data fetched successfully", null));
    }
}
