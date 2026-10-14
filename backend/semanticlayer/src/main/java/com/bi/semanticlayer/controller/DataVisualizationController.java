package com.bi.semanticlayer.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/data")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DataVisualizationController {

    private final JdbcTemplate jdbcTemplate;

    public DataVisualizationController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/sales-trend")
    public List<Map<String, Object>> getSalesTrend() {
        return jdbcTemplate.queryForList(
            "SELECT order_date, total_sales, order_count FROM gold_sales_summary ORDER BY order_date ASC LIMIT 50"
        );
    }

    @GetMapping("/category-sales")
    public List<Map<String, Object>> getCategorySales() {
        return jdbcTemplate.queryForList(
            "SELECT product_category AS category, total_revenue as total_sales, order_count FROM gold_category_sales_summary ORDER BY total_revenue DESC LIMIT 10"
        );
    }
    
    @GetMapping("/order-status")
    public List<Map<String, Object>> getOrderStatus() {
        return jdbcTemplate.queryForList(
            "SELECT order_status, order_count FROM gold_order_status_summary"
        );
    }

    @GetMapping("/delivery-performance")
    public List<Map<String, Object>> getDeliveryPerformance() {
        return jdbcTemplate.queryForList(
            "SELECT delivery_performance, COUNT(*) as count FROM gold_delivery_summary GROUP BY delivery_performance"
        );
    }

    @GetMapping("/sales-kpis")
    public Map<String, Object> getSalesKpis() {
        return jdbcTemplate.queryForMap(
            "SELECT SUM(total_sales) as total_sales, SUM(order_count) as total_orders, (SUM(total_sales) / SUM(order_count)) as aov FROM gold_sales_summary"
        );
    }

    @GetMapping("/top-sellers")
    public List<Map<String, Object>> getTopSellers() {
        return jdbcTemplate.queryForList(
            "SELECT CONCAT('Seller ', SUBSTRING(seller_id, 1, 6)) as seller_label, total_revenue, order_count FROM gold_seller_sales_summary ORDER BY total_revenue DESC LIMIT 8"
        );
    }

    @GetMapping("/top-products")
    public List<Map<String, Object>> getTopProducts() {
        return jdbcTemplate.queryForList(
            "SELECT CONCAT('Prod ', SUBSTRING(product_id, 1, 6)) as product_label, total_revenue, order_count FROM gold_product_sales_summary ORDER BY total_revenue DESC LIMIT 8"
        );
    }
}
