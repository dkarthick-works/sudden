package com.deeka.sudden.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class DashboardDataRequestContext {
    private String fromDate;
    private String toDate;
}
