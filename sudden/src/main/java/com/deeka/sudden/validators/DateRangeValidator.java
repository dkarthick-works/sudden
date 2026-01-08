package com.deeka.sudden.validators;

import com.deeka.sudden.models.DashboardDataRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;

public class DateRangeValidator implements ConstraintValidator<ValidDateRange, DashboardDataRequest> {

    @Override
    public boolean isValid(DashboardDataRequest request, ConstraintValidatorContext context) {
        if (request.getFromDate() == null || request.getToDate() == null) {
            return true;
        }

        try {
            LocalDate fromDate = LocalDate.parse(request.getFromDate());
            LocalDate toDate = LocalDate.parse(request.getToDate());
            return !fromDate.isAfter(toDate);
        } catch (DateTimeParseException e) {
            return true;
        }
    }
}
