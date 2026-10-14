package com.bi.semanticlayer.repository;

import com.bi.semanticlayer.entity.MismatchReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MismatchReportRepository
        extends JpaRepository<MismatchReport, Integer> {
}