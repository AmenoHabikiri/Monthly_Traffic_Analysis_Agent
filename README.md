# Rakuten Analytics Dashboard

## Setup for Real Data

### 1. Database Setup
```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your database URL
DATABASE_URL=postgresql://username:password@localhost:5432/rakuten_analytics
```

### 2. CSV Data Setup
Place your CSV files in the `attached_assets/` directory:
- `traffic_growth.csv`
- `application_ranking.csv` 
- `device_ranking.csv`
- `network_metrics.csv`

### 3. Database Migration
```bash
npm run db:push
```

### 4. Start Application
```bash
npm run dev
```

## Mock Data Mode
If no `DATABASE_URL` is provided, the application will use mock data from memory storage.