package com.deeka.sudden.helpers;

import com.deeka.sudden.models.DashboardDataRequestContext;
import org.springframework.stereotype.Component;

@Component
public class JournalHelper {
    public DashboardDataRequestContext getDashboardRequestContext(String fromDate, String toDate) {
        DashboardDataRequestContext requestContext = DashboardDataRequestContext.builder()
                .fromDate(fromDate)
                .toDate(toDate)
                .build();
        return requestContext;
    }
}
