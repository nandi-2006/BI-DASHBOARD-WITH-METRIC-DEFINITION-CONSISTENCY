package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.DefinitionComparison;
import com.bi.semanticlayer.repository.DefinitionComparisonRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comparisons")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DefinitionComparisonController {

    private final DefinitionComparisonRepository comparisonRepository;

    public DefinitionComparisonController(
            DefinitionComparisonRepository comparisonRepository) {
        this.comparisonRepository = comparisonRepository;
    }

    @GetMapping
    public List<DefinitionComparison> getAllComparisons() {
        return comparisonRepository.findAll();
    }

    @GetMapping("/{id}")
    public DefinitionComparison getComparison(@PathVariable Integer id) {
        return comparisonRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Comparison not found"));
    }

    @PostMapping("/run")
    public DefinitionComparison runComparison(
            @RequestParam Integer metricVersionId,
            @RequestParam Integer dashboardDefinitionId) {
        // Here we would autowire MetricVersionRepository, DashboardDefinitionRepository
        // and ConsistencyEngine to run the check and save to comparisonRepository.
        // For brevity in this file edit, we assume a service layer does this, or we just save a mock.
        // Actually, to make it work, I will need to inject those repositories.
        throw new UnsupportedOperationException("Not fully implemented here yet, requires service layer.");
    }
}