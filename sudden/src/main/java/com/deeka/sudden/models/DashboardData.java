package com.deeka.sudden.models;

import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
public class DashboardData {
    int totalTrades;
    int positiveTradesCount;
    int negativeTradesCount;

    float netRealisedProfitAndLoss;
    Set<String> entitiesTraded = new LinkedHashSet<>();
}
