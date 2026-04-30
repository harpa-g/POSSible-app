package com.wad.ecommerce.controller;

import com.wad.ecommerce.model.Tab;
import com.wad.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final TabRepository tabRepository;
    private final FeedbackRepository feedbackRepository;

    // Daily report for a specific date (default today)
    @GetMapping("/report")
    public Map<String, Object> getReport(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) date = LocalDate.now();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay();

        List<Tab> tabs = tabRepository.findAll().stream()
                .filter(t -> t.getCreatedAt().isAfter(start) && t.getCreatedAt().isBefore(end))
                .toList();

        long totalOrders = tabs.size();
        double totalPaid = tabs.stream().mapToDouble(Tab::getPaidAmount).sum();
        double totalBill = tabs.stream().mapToDouble(Tab::getTotalBill).sum();
        double totalTips = totalPaid - totalBill;

        // Removals for the day
        List<Feedback> feedbacks = feedbackRepository.findByCreatedAtAfter(start);

        Map<String, Object> report = new HashMap<>();
        report.put("date", date.toString());
        report.put("totalOrders", totalOrders);
        report.put("totalRevenue", totalPaid);
        report.put("totalTips", totalTips);
        report.put("totalRemovals", feedbacks.size());
        report.put("feedbacks", feedbacks);

        return report;
    }
}