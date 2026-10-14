package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.Metric;
import com.bi.semanticlayer.repository.MetricRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metrics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MetricController {

    private final MetricRepository metricRepository;

    public MetricController(MetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    @GetMapping
    public List<Metric> getAllMetrics() {
        return metricRepository.findAll();
    }

    @GetMapping("/{id}")
    public Metric getMetric(@PathVariable Integer id) {
        return metricRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metric not found"));
    }

    @PostMapping
    public Metric createMetric(@RequestBody Metric metric) {
        return metricRepository.save(metric);
    }
}