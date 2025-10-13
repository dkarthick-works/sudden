package com.deeka.sudden.models;

public record GenericResponse<T> (T data, String message, APIError error) {}
