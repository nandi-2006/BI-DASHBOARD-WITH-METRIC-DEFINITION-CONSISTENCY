package com.bi.semanticlayer.repository;

import com.bi.semanticlayer.entity.Metric;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetricRepository extends JpaRepository<Metric, Integer> {
}