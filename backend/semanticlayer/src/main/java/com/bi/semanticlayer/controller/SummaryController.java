package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.dto.SummaryResponse;
import com.bi.semanticlayer.repository.DefinitionComparisonRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class SummaryController {

    private final DefinitionComparisonRepository comparisonRepository;

    public SummaryController(
            DefinitionComparisonRepository comparisonRepository) {
        this.comparisonRepository = comparisonRepository;
    }

    @GetMapping
    public SummaryResponse getSummary() {

        long total = comparisonRepository.count();

        long matching = comparisonRepository.findAll()
                .stream()
                .filter(c -> "MATCH".equalsIgnoreCase(c.getStatus()))
                .count();

        long mismatching = comparisonRepository.findAll()
                .stream()
                .filter(c -> "MISMATCH".equalsIgnoreCase(c.getStatus()))
                .count();

        double consistencyPercentage = total == 0
                ? 0
                : (matching * 100.0) / total;

        return new SummaryResponse(
                total,
                matching,
                mismatching,
                Math.round(consistencyPercentage * 100.0) / 100.0
        );
    }
}