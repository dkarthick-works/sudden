package com.deeka.sudden.handlers;

import com.deeka.sudden.models.APIError;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIError> handleAllExceptions(Exception ex) {
        return new ResponseEntity<>(new APIError(ex.getMessage()), INTERNAL_SERVER_ERROR);
    }
}
