package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.Dashboard;
import com.bi.semanticlayer.repository.DashboardRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboards")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    private final DashboardRepository dashboardRepository;

    public DashboardController(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @GetMapping
    public List<Dashboard> getAllDashboards() {
        return dashboardRepository.findAll();
    }

    @GetMapping("/{id}")
    public Dashboard getDashboard(@PathVariable Integer id) {
        return dashboardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dashboard not found"));
    }
}