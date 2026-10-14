package com.bi.semanticlayer.repository;

import com.bi.semanticlayer.entity.DashboardDefinition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardDefinitionRepository
        extends JpaRepository<DashboardDefinition, Integer> {
}