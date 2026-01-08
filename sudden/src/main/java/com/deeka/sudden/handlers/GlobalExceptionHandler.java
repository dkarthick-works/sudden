package com.deeka.sudden.handlers;

import com.deeka.sudden.models.APIError;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BindException.class)
    public ResponseEntity<APIError> handleValidationException(BindException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return new ResponseEntity<>(new APIError(errorMessage), BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIError> handleAllExceptions(Exception ex) {
        return new ResponseEntity<>(new APIError(ex.getMessage()), INTERNAL_SERVER_ERROR);
    }
}
