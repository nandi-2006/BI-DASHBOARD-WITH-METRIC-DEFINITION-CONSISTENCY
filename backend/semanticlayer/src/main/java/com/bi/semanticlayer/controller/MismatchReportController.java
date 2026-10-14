package com.bi.semanticlayer.controller;

import com.bi.semanticlayer.entity.MismatchReport;
import com.bi.semanticlayer.repository.MismatchReportRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mismatch-reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class MismatchReportController {

    private final MismatchReportRepository mismatchReportRepository;

    public MismatchReportController(
            MismatchReportRepository mismatchReportRepository) {
        this.mismatchReportRepository = mismatchReportRepository;
    }

    @GetMapping
    public List<MismatchReport> getAllMismatchReports() {
        return mismatchReportRepository.findAll();
    }

    @GetMapping("/{id}")
    public MismatchReport getMismatchReport(@PathVariable Integer id) {
        return mismatchReportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Mismatch report not found"));
    }
}