# IsotopeFlow — Full System Architecture
### Intelligent Closed-Loop Medical Isotope Production, Supply Chain & End-of-Life Intelligence Platform

**B.E. Major Project | Version 1.0 | August 2026**

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Technology Stack](#3-technology-stack)
4. [Project Directory Structure](#4-project-directory-structure)
5. [Layer-by-Layer Design](#5-layer-by-layer-design)
6. [Four Intelligence Engines](#6-four-intelligence-engines)
7. [Closed-Loop Feedback Architecture](#7-closed-loop-feedback-architecture)
8. [XAI Decision Support Engine](#8-xai-decision-support-engine)
9. [Frontend Dashboard Architecture](#9-frontend-dashboard-architecture)
10. [API Design Reference](#10-api-design-reference)
11. [Core Data Models](#11-core-data-models)
12. [Security Architecture](#12-security-architecture)
13. [DevOps & Deployment Pipeline](#13-devops--deployment-pipeline)
14. [Phased Implementation Roadmap](#14-phased-implementation-roadmap)
15. [Key Physics Equations Embedded in System](#15-key-physics-equations-embedded-in-system)

---

## 1. System Overview

**IsotopeFlow** is a full-stack, microservices-based intelligent platform that digitizes and optimizes every stage of the medical radioisotope lifecycle:

```
Production → QC Release → Logistics → Clinical Use → End-of-Life → ↺ Feedback Loop
```

### Core Problem It Solves

| Problem | Traditional Approach | IsotopeFlow Solution |
|---|---|---|
| Demand forecasting | Manual hospital estimates | XGBoost-LSTM decay-corrected ML forecasting |
| Production scheduling | Manual reactor/cyclotron batching | Physics-MILP optimizer with target thermal limits |
| Logistics routing | Fixed courier routes | Live GPS + decay-aware VRP routing engine |
| QC compliance | Paper-based hot cell logs | Digital GMP release gates via API |
| Waste management | Manual decay logbooks | Automated 3-pathway waste intelligence engine |
| Decision transparency | Black-box AI | TreeSHAP explainability on every decision |
| Lifecycle data flow | Open-loop, linear | Closed-loop: waste data retrains forecasting models |

### Stakeholders Served

| Role | Dashboard | Core Benefit |
|---|---|---|
| Hospital / Nuclear Medicine Dept | Hospital Queue Console | Real-time isotope availability & appointment sync |
| Radiopharmacy | Radiopharmacy Console | Elution timing, order aggregation, QC status |
| Production Hub (Reactor/Cyclotron) | Production Console | ML-driven batch & beam scheduling |
| Logistics / Courier | Courier Console | Decay-aware live routing with GPS alerts |
| Waste & Recovery Agency | Waste Intelligence Console | Automated clearance certs & recovery scoring |
| Regulatory / Admin | Audit & Compliance Console | AERB/GMP digital audit trail |

---

## 2. High-Level Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         EXTERNAL DATA SOURCES                                  ║
║  [Hospital HIS/EHR]  [Radiopharmacy BioDose]  [GPS Courier Telemetry]          ║
║  [Reactor/Cyclotron SCADA]  [Waste Vault IoT Sensors]  [Google Maps API]       ║
╚══════════════════════════════╤═════════════════════════════════════════════════╝
                               │  HTTPS / REST / WebSocket / MQTT
                               ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║                         API GATEWAY & AUTH LAYER                               ║
║  [Kong/Nginx API Gateway]  [OAuth2 + JWT RBAC]  [Rate Limiter]                 ║
║  [FHIR R4 Adapter]  [HL7/DICOM Transformer]  [mTLS for inter-service comms]    ║
╚══════════════════════════════╤═════════════════════════════════════════════════╝
                               │
                               ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║                      EVENT BUS & DATA PIPELINE LAYER                           ║
║  [Apache Kafka — Topic-per-Isotope Streams]  [Kafka Connect Debezium CDC]      ║
║  [Apache Flink / Spark Streaming — Real-time ETL]  [Schema Registry — Avro]   ║
╚══════╤═══════════════════════╤═══════════════════════════╤════════════════════╝
       │                       │                           │
       ▼                       ▼                           ▼
╔══════════════╗  ╔════════════════════════╗  ╔════════════════════════════════╗
║  PostgreSQL  ║  ║  TimescaleDB           ║  ║  Redis Cluster                 ║
║  (Relational)║  ║  (Decay Telemetry TS)  ║  ║  (Real-time cache + Pub/Sub)   ║
║  Orders, QC  ║  ║  GPS logs, sensor data ║  ║  Live activity cursors          ║
╚══════════════╝  ╚════════════════════════╝  ╚════════════════════════════════╝
                               │
                               ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║                   FOUR INTELLIGENCE ENGINES (Python Microservices)             ║
║                                                                                ║
║  ENGINE 1 — DEMAND INTELLIGENCE                                                ║
║    XGBoost · LightGBM · PyTorch LSTM · No-Show Predictor (Random Forest)      ║
║    → Output: per-isotope A₀ demand forecast (24h / 48h / 72h windows)         ║
║                                                                                ║
║  ENGINE 2 — SUPPLY & LOGISTICS INTELLIGENCE                                    ║
║    PuLP MILP Scheduler · OR-Tools VRP · Google Maps API · WebSocket Router     ║
║    → Output: beam run timestamps + live decay-adjusted turn-by-turn routes     ║
║                                                                                ║
║  ENGINE 3 — DECAY & UTILIZATION INTELLIGENCE                                   ║
║    Decay Curve Tracker (λ-math) · Generator Elution Optimizer · Redis Live     ║
║    → Output: A_usable per vial + elution schedule + inventory expiry alerts    ║
║                                                                                ║
║  ENGINE 4 — WASTE & RECOVERY INTELLIGENCE  [Novel Extension]                  ║
║    Rules Engine · MCDA Pathway Classifier · Decay Clearance Calculator         ║
║    → Output: Clearance certificates + Vault maps + Recovery feasibility        ║
╚══════════════════════════════╤═════════════════════════════════════════════════╝
                               │              ▲
                               │   Closed-Loop Feedback (Engine 4 → Engine 1)
                               ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║                  XAI DECISION SUPPORT & COMPLIANCE ENGINE                      ║
║  [TreeSHAP Force Plots]  [AERB/GMP Audit Log]  [Alert / Notification Hub]     ║
╚══════════════════════════════╤═════════════════════════════════════════════════╝
                               │
                               ▼
╔══════════════════════════════════════════════════════════════════════════════════╗
║                          FRONTEND — NEXT.JS DASHBOARDS                         ║
║  Hospital Console · Radiopharmacy Console · Production Console                 ║
║  Courier Console · Waste Intelligence Console · Admin/Compliance Console       ║
╚══════════════════════════════════════════════════════════════════════════════════╝
```

---

## 3. Technology Stack

### Backend

| Layer | Technology | Purpose |
|---|---|---|
| API Framework | **FastAPI** (Python 3.11+) | High-performance REST + WebSocket endpoints |
| Microservice Orchestration | **Docker + Docker Compose** | Container isolation per engine |
| Production Orchestration | **Kubernetes (K8s)** | Service discovery, auto-scaling |
| API Gateway | **Kong OSS / Nginx** | Rate limiting, auth delegation, routing |
| Authentication | **Keycloak + OAuth2 + JWT** | RBAC per stakeholder role |
| Event Bus | **Apache Kafka** | Async isotope event streaming |
| Stream Processing | **Apache Flink** | Real-time ETL + decay calculations on stream |
| Task Queue | **Celery + Redis** | Background ML training & scheduled jobs |

### ML / AI

| Component | Technology | Purpose |
|---|---|---|
| Gradient Boosting | **XGBoost / LightGBM** | Demand forecasting, no-show prediction |
| Time-Series | **PyTorch (LSTM)** | Sequential scan demand patterns |
| Optimization (MILP) | **PuLP + CBC / GLPK** | Production schedule optimization |
| Routing | **Google OR-Tools** | Multi-Vehicle Decay-Aware VRP |
| Explainability | **SHAP (TreeSHAP)** | Feature attribution for all model decisions |
| Rules Engine | **Python Rules Engine** | Waste pathway classification |
| MCDA | **Custom Python MCDA** | Recovery feasibility scoring |

### Databases

| Database | Role |
|---|---|
| **PostgreSQL 16** | Relational data: orders, QC logs, stakeholders, audit trail |
| **TimescaleDB** | Time-series: GPS telemetry, decay sensor readings, isotope activity logs |
| **Redis 7 (Cluster)** | Real-time cache: live decay cursors, WebSocket pub/sub, Celery broker |
| **MinIO (S3-compatible)** | Object storage: QC certificates (PDF), SHAP plots, model artifacts |

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | Role-based dashboard SPA + SSR |
| **TypeScript** | Type safety across all components |
| **Recharts / D3.js** | Decay curves, SHAP force plots, supply chain flow charts |
| **Leaflet.js / Google Maps JS** | Live courier GPS + decay-route visualization |
| **TailwindCSS** | Utility-first responsive design |
| **Socket.IO** | Real-time push: decay alerts, route changes |

### DevOps & Infra

| Tool | Purpose |
|---|---|
| **Docker + Docker Compose** | Local development orchestration |
| **GitHub Actions** | CI/CD: lint → test → build → deploy |
| **Prometheus + Grafana** | Platform metrics, engine latency, Kafka lag |
| **Loki** | Centralized log aggregation |
| **Pytest + Locust** | Unit, integration, and load testing |

---

## 4. Project Directory Structure

```
isotope-flow/
│
├── backend/
│   ├── gateway/                    # Kong / Nginx config + FHIR adapter
│   │   ├── kong.yml
│   │   └── fhir_adapter.py
│   │
│   ├── auth/                       # Keycloak config + JWT validation middleware
│   │   ├── keycloak_config.json
│   │   └── jwt_middleware.py
│   │
│   ├── api/                        # FastAPI main application
│   │   ├── main.py
│   │   ├── routers/
│   │   │   ├── orders.py
│   │   │   ├── inventory.py
│   │   │   ├── production.py
│   │   │   ├── logistics.py
│   │   │   ├── waste.py
│   │   │   └── compliance.py
│   │   ├── schemas/
│   │   │   ├── isotope.py
│   │   │   ├── order.py
│   │   │   ├── waste.py
│   │   │   └── forecast.py
│   │   ├── dependencies.py
│   │   └── config.py
│   │
│   ├── engines/
│   │   ├── demand/                 # ENGINE 1
│   │   │   ├── forecaster.py
│   │   │   ├── no_show_predictor.py
│   │   │   ├── decay_corrector.py
│   │   │   ├── trainer.py
│   │   │   └── data_prep.py
│   │   │
│   │   ├── supply_logistics/       # ENGINE 2
│   │   │   ├── production_scheduler.py
│   │   │   ├── decay_vrp_router.py
│   │   │   ├── qc_gate.py
│   │   │   └── live_router.py
│   │   │
│   │   ├── decay_utilization/      # ENGINE 3
│   │   │   ├── decay_tracker.py
│   │   │   ├── elution_optimizer.py
│   │   │   ├── inventory_cursor.py
│   │   │   └── expiry_alert.py
│   │   │
│   │   └── waste_recovery/         # ENGINE 4 (Novel)
│   │       ├── waste_characterizer.py
│   │       ├── clearance_calculator.py
│   │       ├── pathway_classifier.py
│   │       ├── recovery_scorer.py
│   │       ├── vault_mapper.py
│   │       └── certificate_gen.py
│   │
│   ├── xai/
│   │   ├── shap_explainer.py
│   │   ├── audit_logger.py
│   │   └── alert_hub.py
│   │
│   ├── data/
│   │   ├── migrations/             # Alembic DB migrations
│   │   ├── seeds/                  # Synthetic multi-hospital dataset
│   │   │   ├── isotope_params.json
│   │   │   └── simulated_orders.csv
│   │   └── models/                 # MLflow model registry artifacts
│   │
│   ├── tasks/                      # Celery background tasks
│   │   ├── celery_app.py
│   │   ├── retrain_demand_model.py
│   │   ├── scheduled_decay_sweep.py
│   │   └── waste_clearance_checker.py
│   │
│   ├── tests/
│   │   ├── test_decay_physics.py
│   │   ├── test_engines.py
│   │   └── test_api_endpoints.py
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                       # Next.js 14 App
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (dashboard)/
│   │       ├── hospital/page.tsx
│   │       ├── radiopharmacy/page.tsx
│   │       ├── production/page.tsx
│   │       ├── courier/page.tsx
│   │       ├── waste/page.tsx
│   │       └── admin/page.tsx
│   ├── components/
│   │   ├── DecayCurveChart.tsx
│   │   ├── LiveMapView.tsx
│   │   ├── SHAPForceplot.tsx
│   │   ├── VaultHeatmap.tsx
│   │   ├── InventoryTicker.tsx
│   │   └── AlertBanner.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── socket.ts
│   └── Dockerfile
│
├── infra/
│   ├── docker-compose.yml
│   ├── k8s/
│   │   ├── api-deployment.yaml
│   │   ├── engine-deployments.yaml
│   │   ├── kafka-statefulset.yaml
│   │   ├── postgres-pvc.yaml
│   │   └── redis-deployment.yaml
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana-dashboards/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
└── docker-compose.yml
```

---

## 5. Layer-by-Layer Design

### 5.1 Data Sources & External Integrations

| Source | Protocol | Data Emitted | Kafka Topic |
|---|---|---|---|
| Hospital HIS / EHR | HL7 FHIR R4 REST | Scan orders, appointments, no-shows | `hospital.orders` |
| Radiopharmacy BioDose | REST (custom) | QC results, elution logs, dose calibrator | `radiopharmacy.qc` |
| Reactor/Cyclotron SCADA | Modbus-TCP → MQTT | Beam current, target temp, batch yields | `production.scada` |
| GPS Courier Device | MQTT / REST | Location, timestamp, package temp | `logistics.gps` |
| Waste Vault IoT | MQTT | Activity sensor readings (MBq) | `waste.sensors` |
| Google Maps Platform | REST | Traffic, routing, ETA | Direct (Engine 2) |

### 5.2 API Gateway & Auth Layer

**JWT Role Claims:**

```json
{
  "sub": "user_id",
  "role": "RADIOPHARMACY_OPERATOR",
  "facility_id": "AIIMS_DELHI_001",
  "exp": 1720000000
}
```

**Roles:** `HOSPITAL_ADMIN`, `NUCLEAR_MED_TECH`, `RADIOPHARMACY_OPERATOR`, `PRODUCTION_ENGINEER`, `COURIER_DRIVER`, `WASTE_MANAGER`, `REGULATORY_AUDITOR`

### 5.3 Kafka Topic Architecture

```
hospital.orders          (partitioned by facility_id)
radiopharmacy.qc         (partitioned by isotope_id)
production.scada         (partitioned by production_hub_id)
logistics.gps            (partitioned by courier_id)
waste.sensors            (partitioned by vault_id)
engine.demand.forecasts  (output of Engine 1)
engine.supply.schedules  (output of Engine 2)
engine.decay.cursors     (output of Engine 3)
engine.waste.decisions   (output of Engine 4)
feedback.closedloop      (Engine 4 → Engine 1 retraining trigger)
```

### 5.4 PostgreSQL Schema (Key Tables)

```sql
CREATE TABLE isotopes (
    id                    UUID PRIMARY KEY,
    symbol                VARCHAR(20) NOT NULL,
    half_life_hours       FLOAT NOT NULL,
    lambda                FLOAT GENERATED ALWAYS AS (LN(2) / half_life_hours) STORED,
    decay_mode            VARCHAR(50),
    clearance_level_mbq   FLOAT,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
    id                    UUID PRIMARY KEY,
    hospital_id           UUID REFERENCES facilities(id),
    isotope_id            UUID REFERENCES isotopes(id),
    required_activity_mbq FLOAT,
    required_by           TIMESTAMPTZ,
    status                VARCHAR(30),   -- PENDING, QC_PASS, IN_TRANSIT, DELIVERED
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE qc_certificates (
    id                    UUID PRIMARY KEY,
    batch_id              UUID REFERENCES production_batches(id),
    isotope_id            UUID REFERENCES isotopes(id),
    radionuclidic_purity  FLOAT,
    radiochemical_purity  FLOAT,
    endotoxin_units       FLOAT,
    passed                BOOLEAN,
    signed_at             TIMESTAMPTZ
);

CREATE TABLE waste_items (
    id                    UUID PRIMARY KEY,
    isotope_id            UUID REFERENCES isotopes(id),
    origin_order_id       UUID REFERENCES orders(id),
    initial_activity_mbq  FLOAT,
    logged_at             TIMESTAMPTZ,
    estimated_clearance_date TIMESTAMPTZ,
    pathway               VARCHAR(20),   -- DISPOSE, REUSE, RECOVER
    vault_id              UUID REFERENCES waste_vaults(id)
);

-- TimescaleDB hypertable
CREATE TABLE decay_telemetry (
    time          TIMESTAMPTZ NOT NULL,
    isotope_id    UUID,
    batch_id      UUID,
    location      VARCHAR(100),
    activity_mbq  FLOAT,
    source        VARCHAR(50)   -- SENSOR | CALCULATED | COURIER_GPS
);
SELECT create_hypertable('decay_telemetry', 'time');
```

---

## 6. Four Intelligence Engines

### 6.1 Engine 1 — Demand Intelligence Engine

**Objective:** Predict per-isotope, per-region required initial dispatched activity (A₀) 24–72 hours ahead, factoring in radioactive decay during supply chain transit.

**Model Pipeline:**

```
Raw Orders + Calendar Data
         ↓
Feature Engineering
├── Rolling 7d/14d/30d order averages
├── Day-of-week one-hot encoding
├── Holiday/event flags
├── Historical no-show rate per hospital
└── Isotope type embedding
         ↓
XGBoost / LightGBM (Tabular) + PyTorch LSTM (Sequential)
         ↓
Ensemble via Stacking (Ridge Meta-Learner)
         ↓
Raw Demand Forecast (D_predicted_doses)
         ↓
Decay Corrector: A₀ = D × admin_dose_mbq × e^(+λ × t_transit)
         ↓
Output: {isotope, region, A₀_required_mbq, forecast_window, confidence_interval}
```

**No-Show Predictor:**
- Random Forest Classifier per hospital
- Features: Lead time, patient age group, past attendance, day-of-week
- Output: P(no-show) per appointment slot → reduces decay waste from cancellations

**Target Metrics:**
- MAE < 4.2% on demand prediction
- >35% reduction in over-ordering vs. static baselines

---

### 6.2 Engine 2 — Supply & Logistics Intelligence Engine

#### 2A: Physics-Informed Production Scheduler (PuLP MILP)

**Objective Function:** Minimize total decay waste
```
Minimize Σ [ A₀_produced(i,t) - A_required(i, t + t_transit) × e^(λᵢ × t_transit) ]
```

**Constraints:**
1. Target thermal limit: `target_temp ≤ T_max_celsius`
2. Hot cell capacity: simultaneous processing ≤ N_hotcell
3. GMP QC gate dispatch hold time
4. Batch expiry window: `A(t_dispatch) ≥ A_minimum_clinical`
5. Reactor maintenance windows: zero production during downtime

#### 2B: Real-Time Decay-Aware VRP Router (OR-Tools + Google Maps)

**DA-VRP Formulation:**
```
Minimize total transit decay loss:
Σ [ A_dispatch(k) × (1 - e^(-λ × t_route(k))) ]

Subject to:
  t_route(k) ≤ t_expiry(k)             -- must arrive before clinical cutoff
  A_arrival(k) ≥ A_minimum_clinical(k) -- sufficient activity on arrival
  vehicle_capacity(v) ≥ Σ package_size(k)
```

**Live Adaptation:** Re-runs VRP every 5 minutes on traffic updates. If `A_arrival_predicted < A_clinical_minimum`, triggers emergency rerouting alert via WebSocket.

---

### 6.3 Engine 3 — Decay & Utilization Intelligence Engine

**Core Physics (executed per batch via Celery Beat):**
```python
def compute_activity(A0: float, lambda_: float, t_elapsed_hours: float) -> float:
    """A(t) = A₀ · e^(−λt)"""
    import math
    return A0 * math.exp(-lambda_ * t_elapsed_hours)
```

**Generator Elution Optimizer (Mo-99/Tc-99m):**
```
A_Tc99m(t) = A_Mo99_0 × (λ_Tc / (λ_Tc - λ_Mo)) × (e^(-λ_Mo×t) - e^(-λ_Tc×t))
Optimal elution: dA_Tc99m/dt = 0 → t_optimal
```

**Redis Inventory Cursors:**
```
Key: isotope_cursor:{batch_id}
Value: {A_current_mbq, t_last_computed, lambda, A_clinical_min, A_clearance}
TTL: auto-expires when A < A_clearance → triggers Engine 4
```

**Alert Triggers:**

| Condition | Action |
|---|---|
| `A < 1.2 × A_clinical_min` | WebSocket warning to hospital/radiopharmacy |
| `A < A_clinical_min` | Auto-cancel linked patient appointment |
| `A < A_clearance` | Trigger Engine 4 waste characterization |

---

### 6.4 Engine 4 — Waste & Recovery Intelligence Engine (Novel)

**Objective:** Classify post-clinical radioactive waste into IAEA-compliant end-of-life pathways and predict clearance timelines.

**Decay Clearance Prediction:**
```python
def time_to_clearance(A_now: float, A_clearance: float, lambda_: float) -> float:
    """Returns hours until A drops below regulatory clearance level"""
    import math
    return math.log(A_now / A_clearance) / lambda_
```

**Pathway Classifier — MCDA Scoring:**

| Decision Criteria | Weight | Pathway Influence |
|---|---|---|
| Activity level at current time | 30% | DISPOSE score |
| Isotope economic recovery value | 25% | RECOVER score |
| Impurity presence (e.g., Lu-177m) | 20% | Extended storage flag |
| Physical waste form | 15% | REUSE eligibility |
| BARC/AERB regional acceptance | 10% | RECOVER regulatory gate |

**Decision Rules:**
```
IF waste_form == 'GENERATOR_CORE' AND isotope == 'Mo-99':
    → REUSE (generator housing refurbishment)

IF A_now < 10 × A_clearance AND no long-lived impurities:
    → DISPOSE (authorized biomedical disposal)

IF isotope IN ['Ge-68', 'Yb-176'] AND BARC proximity < 500km:
    → RECOVER (initiate radiochemical separation recommendation)

IF 'Lu-177m' impurity concentration > threshold:
    → DISPOSE + LONG_TERM_STORAGE (extended segregated vault)
```

**Output:**
- Automated AERB-format clearance certificate (PDF → MinIO)
- Vault mapping update (physical bay assignment)
- Recovery feasibility score (0–100) → Waste Console dashboard
- Closed-loop trigger → `feedback.closedloop` Kafka topic

---

## 7. Closed-Loop Feedback Architecture

The core novel contribution that makes IsotopeFlow self-optimizing:

```
Engine 4 Output:
├─ Actual dose administered per patient
├─ No-show events (cancelled appointments)
├─ Residual waste activity per batch
└─ Over-order volume per hospital per isotope
         ↓   Kafka Topic: feedback.closedloop
         ↓
Feedback Processor (Celery Task):
├─ Computes regional over/under-order ratio per isotope per month
├─ Updates hospital-level demand correction coefficients
└─ Triggers Engine 1 incremental retraining (MLflow + XGBoost warm start)
         ↓
Engine 1 retrained → improved A₀ forecasts
→ less over-ordering → less decay waste
→ tighter production schedules (Engine 2)
```

**Result:** A self-optimizing closed-loop ecosystem where every observed dose outcome automatically improves future predictions — moving toward a zero-waste radioisotope supply chain.

---

## 8. XAI Decision Support Engine

Every automated recommendation is explained using **TreeSHAP**.

**Example SHAP Force Plot Output:**
```
DEMAND FORECAST EXPLANATION
Predicted A₀ Required: 8,450 MBq (Tc-99m, AIIMS Delhi, Tomorrow 8AM)

Feature Contributions:
  [+2,100 MBq] ← Monday scan surge (historical pattern)
  [+1,200 MBq] ← 3 cardiac SPECT bookings confirmed
  [-800  MBq]  % 12% no-show probability applied
  [+950  MBq]  ← 4.2h transit decay correction (λ = 0.1155/h)
  [+600  MBq]  ← Regional festival: 15% attendance boost

Base forecast:   4,400 MBq
Final A₀ output: 8,450 MBq
```

**Audit Trail:**
- Every decision logged: timestamp, model version, input features, SHAP values, user acknowledgement
- Immutable PostgreSQL append-only audit table (no UPDATE/DELETE)
- AERB-compliant audit export (JSON + PDF) for regulatory submission

---

## 9. Frontend Dashboard Architecture

### Role-Based Dashboard Map

| Dashboard | Route | Key Features |
|---|---|---|
| **Hospital Queue Console** | `/hospital` | Live isotope ticker, appointment decay status, order placement with A₀ suggestion |
| **Radiopharmacy Console** | `/radiopharmacy` | Generator elution timer, aggregated order queue, QC gate status, waste intake |
| **Production Hub Console** | `/production` | Irradiation Gantt chart (MILP output), SCADA feed, batch yield vs. forecast |
| **Courier Routing Console** | `/courier` | Leaflet live map with decay % overlay, turn-by-turn route, reroute alerts |
| **Waste Intelligence Console** | `/waste` | Vault heatmap, pathway decisions + SHAP, clearance certificate download, recovery scores |
| **Admin/Compliance Console** | `/admin` | Full audit log browser, GMP compliance rate, AERB report generator, model performance |

### Key Frontend Components

| Component | Library | Description |
|---|---|---|
| `DecayCurveChart` | Recharts / D3 | Real-time A(t) decay visualization per batch |
| `LiveMapView` | Leaflet.js | Courier GPS + decay-heat overlay |
| `SHAPForceplot` | Custom SVG | TreeSHAP feature attribution waterfall chart |
| `VaultHeatmap` | D3 heatmap | Color-coded radioactive waste storage bay map |
| `InventoryTicker` | React + Socket.IO | Live MBq countdown ticker per vial |
| `GanttScheduler` | Recharts | Production irradiation Gantt chart |
| `AlertBanner` | Socket.IO | Real-time alerts: decay warnings, reroutes |

---

## 10. API Design Reference

**Base URL:** `https://api.isotopeflow.io/v1`

```
AUTH
  POST   /auth/token                    JWT token (Keycloak)

ORDERS
  GET    /orders                        List orders (RBAC filtered)
  POST   /orders                        Place new isotope order
  GET    /orders/{id}                   Order detail + QC status
  PATCH  /orders/{id}/status            Update status

INVENTORY
  GET    /inventory                     Live activity per batch (Engine 3)
  GET    /inventory/{batch_id}/decay    A(t) trace for a batch

FORECASTS
  GET    /forecasts/demand              Engine 1 output
  POST   /forecasts/demand/recalculate  Trigger on-demand forecast run

PRODUCTION
  GET    /production/schedule           MILP schedule (Engine 2A)
  POST   /production/schedule/optimize  Trigger new PuLP run
  GET    /production/batches            All batches + QC status

LOGISTICS
  GET    /logistics/routes              Active courier routes (Engine 2B)
  GET    /logistics/couriers/{id}/live  Live GPS + decay projection
  POST   /logistics/routes/reoptimize  Force rerouting

WASTE
  POST   /waste/intake                  Log new waste item (Engine 4)
  GET    /waste/{id}/pathway            Pathway decision + SHAP
  GET    /waste/{id}/certificate        Download clearance PDF
  GET    /waste/vaults                  Vault capacity map

XAI & AUDIT
  GET    /xai/explain/{decision_id}     SHAP explanation for any decision
  GET    /xai/audit-log                 Full immutable audit log

WEBSOCKETS
  WS     /ws/inventory-ticker           Real-time activity updates
  WS     /ws/courier-map               Live GPS + reroute events
  WS     /ws/alerts                    Platform-wide alert stream
```

---

## 11. Core Data Models

### IsotopeConfig — Physics Source of Truth

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class IsotopeConfig:
    symbol: str
    half_life_hours: float
    lambda_per_hour: float          # ln(2) / t½
    decay_mode: str                 # gamma | beta+ | beta- | alpha
    clinical_min_mbq: float         # minimum usable activity at administration
    clearance_mbq: float            # IAEA/AERB clearance threshold
    production_method: str          # GENERATOR_ELUTION | CYCLOTRON | REACTOR

ISOTOPE_REGISTRY = {
    "Tc-99m": IsotopeConfig("Tc-99m", 6.01,  0.11535, "gamma",  37.0,  0.37,  "GENERATOR_ELUTION"),
    "F-18":   IsotopeConfig("F-18",   1.829, 0.37910, "beta+",  370.0, 3.70,  "CYCLOTRON"),
    "Lu-177": IsotopeConfig("Lu-177", 159.4, 0.00435, "beta-",  100.0, 1.00,  "REACTOR"),
    "I-131":  IsotopeConfig("I-131",  192.5, 0.00360, "beta-",  50.0,  0.50,  "REACTOR"),
    "Ga-68":  IsotopeConfig("Ga-68",  1.129, 0.61410, "beta+",  185.0, 1.85,  "GENERATOR_ELUTION"),
    "Ac-225": IsotopeConfig("Ac-225", 237.6, 0.00292, "alpha",  10.0,  0.10,  "CYCLOTRON"),
}
```

---

## 12. Security Architecture

| Layer | Mechanism |
|---|---|
| **Transport** | TLS 1.3 on all external endpoints; mTLS between internal microservices |
| **Authentication** | Keycloak OAuth2 Authorization Code Flow; JWT RS256, 15-min expiry |
| **Authorization** | RBAC role claims in JWT; FastAPI dependency injection per endpoint |
| **Data at Rest** | PostgreSQL column-level encryption for patient PII; MinIO object encryption |
| **Regulatory** | Immutable append-only audit table; AERB-format digital audit trail |
| **Radiation Safety** | All waste decisions are advisory — final clearance requires authorized human sign-off |
| **API Hardening** | Rate limiting (Kong), OWASP input validation, CORS whitelist |
| **Secrets** | HashiCorp Vault for DB credentials, API keys, Kafka SASL passwords |

---

## 13. DevOps & Deployment Pipeline

```
Developer Pushes Code
         ↓
GitHub Actions — CI (ci.yml)
  1. Lint: flake8 (Python) + ESLint (TypeScript)
  2. Type check: mypy + tsc
  3. Unit Tests: pytest (engines, physics equations, API)
  4. Integration Tests: Docker Compose test environment
  5. Load Test: Locust (50 concurrent orders)
         ↓ all green
GitHub Actions — CD (deploy.yml)
  1. Docker build + push to GitHub Container Registry
  2. Helm upgrade → K8s staging cluster
  3. Smoke test (API health checks)
  4. Manual approval gate
  5. Helm upgrade → K8s production cluster
```

**Local Development:**
```bash
# Start full stack
docker compose up -d

# Services started:
# postgres:5432, redis:6379, timescaledb:5433
# kafka:9092, zookeeper:2181
# backend-api:8000, frontend:3000
# celery-worker (all 4 engines)
# prometheus:9090, grafana:3001
```

---

## 14. Phased Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–4)
- [ ] Setup repo, Docker Compose environment
- [ ] PostgreSQL + TimescaleDB schema design + Alembic migrations
- [ ] FastAPI skeleton with Keycloak JWT auth
- [ ] Kafka setup: all topics, producer/consumer test
- [ ] Seed IAEA isotope constants (`ISOTOPE_REGISTRY`)
- [ ] Synthetic multi-hospital dataset generation (6 months simulated)

### Phase 2 — Engine 3: Decay Core (Weeks 5–7)
- [ ] `decay_tracker.py` — A(t) = A₀·e^−λt continuous monitor
- [ ] Redis inventory cursor (live MBq per batch)
- [ ] Generator elution optimizer (Mo-99 ingrowth equations)
- [ ] WebSocket: live `InventoryTicker` frontend component
- [ ] Unit tests: verify physics equations vs. IAEA reference tables

### Phase 3 — Engine 1: Demand Forecasting (Weeks 8–10)
- [ ] Feature engineering pipeline from synthetic orders
- [ ] XGBoost + LightGBM training (MLflow tracking)
- [ ] LSTM time-series model (PyTorch Lightning)
- [ ] No-Show predictor (Random Forest)
- [ ] Decay corrector (A₀ back-calculation)
- [ ] Forecast REST endpoint + SHAP explanation

### Phase 4 — Engine 2: Supply & Logistics (Weeks 11–13)
- [ ] PuLP MILP production scheduler (GMP-constrained)
- [ ] OR-Tools VRP base implementation
- [ ] Google Maps Directions API integration
- [ ] Live DA-VRP re-optimization on traffic updates
- [ ] Courier console live map (Leaflet.js + WebSocket)

### Phase 5 — Engine 4: Waste & Recovery (Weeks 14–16)
- [ ] Waste intake API + characterizer
- [ ] Decay clearance calculator
- [ ] MCDA pathway classifier
- [ ] Recovery feasibility scorer
- [ ] AERB-format PDF certificate generator
- [ ] Vault heatmap frontend
- [ ] Closed-loop feedback publisher → `feedback.closedloop`

### Phase 6 — XAI, Polish & Integration (Weeks 17–19)
- [ ] TreeSHAP integration across all engines
- [ ] Full audit log with AERB export
- [ ] All 6 role-based dashboards complete
- [ ] Alert hub (WebSocket + email for critical decay warnings)
- [ ] End-to-end integration test (order → routing → delivery → waste clearance)
- [ ] Performance benchmarking (MAE, VRP efficiency, waste reduction %)

### Phase 7 — Documentation & Presentation (Weeks 20–22)
- [ ] Auto-generated FastAPI OpenAPI spec
- [ ] System design report
- [ ] Demo dataset walkthrough
- [ ] Live demo dashboard presentation

---

## 15. Key Physics Equations Embedded in System

| Equation | Location | Purpose |
|---|---|---|
| `A(t) = A₀ · e^(−λt)` | Engine 3 `decay_tracker.py` | Universal decay activity calculator |
| `λ = ln(2) / t½` | `ISOTOPE_REGISTRY` | Decay constant from half-life |
| `A₀ = A_required · e^(+λ · t_transit)` | Engine 1 `decay_corrector.py` | Back-calculate dispatch activity |
| `A_Tc = A_Mo · (λ_Tc/(λ_Tc−λ_Mo)) · (e^(−λ_Mo·t) − e^(−λ_Tc·t))` | Engine 3 `elution_optimizer.py` | Mo-99/Tc-99m generator ingrowth |
| `t_clear = ln(A_now / A_clear) / λ` | Engine 4 `clearance_calculator.py` | Time until regulatory clearance |
| `A_receive = A_dispatch · e^(−λ · t_transit)` | Engine 2 DA-VRP objective | Transit decay loss (UN Class 7) |

---

*Document maintained by: IsotopeFlow B.E. Major Project Team | August 2026*
