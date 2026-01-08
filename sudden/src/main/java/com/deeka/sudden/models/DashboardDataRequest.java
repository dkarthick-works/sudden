package com.deeka.sudden.models;

import com.deeka.sudden.validators.ValidDateRange;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ValidDateRange
public class DashboardDataRequest {

    private static final String DATE_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$";
    private static final String DATE_FORMAT_MESSAGE = "must be in yyyy-MM-dd format";

    @NotBlank(message = "fromDate is required")
    @Pattern(regexp = DATE_PATTERN, message = "fromDate " + DATE_FORMAT_MESSAGE)
    private String fromDate;

    @NotBlank(message = "toDate is required")
    @Pattern(regexp = DATE_PATTERN, message = "toDate " + DATE_FORMAT_MESSAGE)
    private String toDate;
}
