package com.bi.semanticlayer.repository;

import com.bi.semanticlayer.entity.MetricVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetricVersionRepository extends JpaRepository<MetricVersion, Integer> {
}