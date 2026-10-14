package com.bi.semanticlayer.engine;

import com.bi.semanticlayer.entity.DashboardDefinition;
import com.bi.semanticlayer.entity.MetricVersion;
import org.springframework.stereotype.Service;

@Service
public class ConsistencyEngine {

    public ConsistencyResult compare(
            MetricVersion officialDefinition,
            DashboardDefinition dashboardDefinition) {

        boolean formulaMatch = normalize(
                officialDefinition.getFormula()
        ).equals(
                normalize(dashboardDefinition.getFormula())
        );

        boolean sourceMatch = normalize(
                officialDefinition.getSourceTables()
        ).equals(
                normalize(dashboardDefinition.getSourceTables())
        );

        boolean filterMatch = normalize(
                officialDefinition.getFilters()
        ).equals(
                normalize(dashboardDefinition.getFilters())
        );

        boolean timeWindowMatch = normalize(
                officialDefinition.getTimeWindow()
        ).equals(
                normalize(dashboardDefinition.getTimeWindow())
        );

        boolean dimensionMatch = normalize(
                officialDefinition.getDimensions()
        ).equals(
                normalize(dashboardDefinition.getDimensions())
        );

        boolean allMatch =
                formulaMatch &&
                        sourceMatch &&
                        filterMatch &&
                        timeWindowMatch &&
                        dimensionMatch;

        String status = allMatch
                ? "MATCH"
                : "MISMATCH";

        String reason;

        if (allMatch) {
            reason = "Dashboard definition completely matches the official metric definition.";
        } else {
            StringBuilder sb = new StringBuilder("Mismatch found in: ");
            if (!formulaMatch) sb.append("Formula, ");
            if (!sourceMatch) sb.append("Source Tables, ");
            if (!filterMatch) sb.append("Filters, ");
            if (!timeWindowMatch) sb.append("Time Window, ");
            if (!dimensionMatch) sb.append("Dimensions, ");
            
            // Remove trailing comma
            reason = sb.substring(0, sb.length() - 2) + ".";
        }

        return new ConsistencyResult(
                status,
                formulaMatch,
                sourceMatch,
                filterMatch,
                timeWindowMatch,
                dimensionMatch,
                reason
        );
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", " ")          // collapse multiple spaces
                .replaceAll("\\s*\\(\\s*", "(")   // remove spaces around opening parenthesis
                .replaceAll("\\s*\\)\\s*", ")")   // remove spaces around closing parenthesis
                .replaceAll("\\s*,\\s*", ",");    // remove spaces around commas
    }
}