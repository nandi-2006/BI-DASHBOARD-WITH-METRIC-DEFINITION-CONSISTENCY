package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.DashboardDefinition;
import com.bi.semanticlayer.repository.DashboardDefinitionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard-definitions")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardDefinitionController {

    private final DashboardDefinitionRepository dashboardDefinitionRepository;

    public DashboardDefinitionController(
            DashboardDefinitionRepository dashboardDefinitionRepository) {
        this.dashboardDefinitionRepository = dashboardDefinitionRepository;
    }

    @GetMapping
    public List<DashboardDefinition> getAllDashboardDefinitions() {
        return dashboardDefinitionRepository.findAll();
    }

    @GetMapping("/{id}")
    public DashboardDefinition getDashboardDefinition(
            @PathVariable Integer id) {

        return dashboardDefinitionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Dashboard definition not found"));
    }
}