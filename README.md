# BI Dashboard with Metric Definition Consistency

An enterprise Business Intelligence platform designed to enforce semantic layer metric consistency, reconcile divergent dashboard implementations, and visualize discrepancy reports across analytics workloads.

## 🚀 Architecture Overview

- **Frontend**: Modern React 19 Single Page Application built with Vite, Recharts, and Lucide React.
- **Backend (Semantic Layer)**: Spring Boot 4 REST API running on Java 21 with Spring Data JPA and Hibernate.
- **Database**: MySQL 8 storing metrics metadata, dashboard definitions, and consistency comparison logs.
- **Data Pipeline**: Automated scripts for data generation, consistency evaluations, and dashboard seeding.

---

## 🛠️ Tech Stack

- **UI & Visualization**: React, Vite, Recharts, Lucide Icons
- **Backend Services**: Java 21, Spring Boot, Spring Data JPA, Hibernate, Maven
- **Database**: MySQL 8.0
- **Data Ingestion**: Python (Pandas / SQLAlchemy)

---

## ⚙️ Getting Started

### 1. Prerequisites
- Java 21+
- Node.js 20+ & npm
- MySQL 8.0+

### 2. Database Setup
Create database `bi_semantic_layer` in MySQL:
```sql
CREATE DATABASE bi_semantic_layer;
```

### 3. Backend (Semantic Layer)
```bash
cd backend/semanticlayer
./mvnw spring-boot:run
```
The backend API server will start on port `9400`:
- Health / Metrics API: `http://localhost:9400/api/metrics`
- Dashboards API: `http://localhost:9400/api/dashboards`
- Comparisons API: `http://localhost:9400/api/comparisons`

### 4. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:3000`.

---

## 🌐 Live GitHub Pages Deployment
- Live Demo: [https://nandi-2006.github.io/BI-DASHBOARD-WITH-METRIC-DEFINITION-CONSISTENCY/](https://nandi-2006.github.io/BI-DASHBOARD-WITH-METRIC-DEFINITION-CONSISTENCY/)
