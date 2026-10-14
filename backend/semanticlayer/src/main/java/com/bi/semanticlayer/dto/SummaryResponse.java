package com.bi.semanticlayer.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SummaryResponse {

    private long totalDefinitions;
    private long matchingDefinitions;
    private long mismatchingDefinitions;
    private double consistencyPercentage;
}