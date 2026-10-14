package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.MetricVersion;
import com.bi.semanticlayer.repository.MetricVersionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metric-versions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MetricVersionController {

    private final MetricVersionRepository metricVersionRepository;

    public MetricVersionController(MetricVersionRepository metricVersionRepository) {
        this.metricVersionRepository = metricVersionRepository;
    }

    @GetMapping
    public List<MetricVersion> getAllMetricVersions() {
        return metricVersionRepository.findAll();
    }

    @GetMapping("/{id}")
    public MetricVersion getMetricVersion(@PathVariable Integer id) {
        return metricVersionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric version not found"));
    }

    @PostMapping
    public MetricVersion createMetricVersion(@RequestBody MetricVersion metricVersion) {
        return metricVersionRepository.save(metricVersion);
    }
}