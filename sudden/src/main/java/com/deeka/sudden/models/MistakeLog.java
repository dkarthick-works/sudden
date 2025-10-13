package com.deeka.sudden.models;

import java.time.Instant;

public record MistakeLog(Instant timestamp, String log) {}
