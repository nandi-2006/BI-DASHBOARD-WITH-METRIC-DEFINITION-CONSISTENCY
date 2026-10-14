package com.bi.semanticlayer.engine;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ConsistencyResult {

    private String status;

    private boolean formulaMatch;
    private boolean sourceMatch;
    private boolean filterMatch;
    private boolean timeWindowMatch;
    private boolean dimensionMatch;

    private String reason;
}