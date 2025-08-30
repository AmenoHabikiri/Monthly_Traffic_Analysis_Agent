import express from 'express';
import postgres from 'postgres';
import 'dotenv/config';

const app = express();
const sql = postgres(process.env.DATABASE_URL);

// Simple traffic data endpoint
app.get('/api/traffic', async (req, res) => {
  try {
    const data = await sql`
      SELECT 
        u.agg_year as year,
        u.agg_month as month,
        u.total_traffic,
        m.total_normalized_traffic as normalized_traffic,
        m.delta_percentage
      FROM ul_dl_traffic_data u
      JOIN monthly_traffic_data m ON u.agg_year = m.year AND u.agg_month = m.month
      ORDER BY u.agg_year ASC, u.agg_month ASC
    `;
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Simple summary endpoint
app.get('/api/summary', async (req, res) => {
  try {
    const data = await sql`
      SELECT 
        SUM(CASE WHEN m.month = 7 THEN u.total_traffic ELSE 0 END) as july_traffic,
        SUM(CASE WHEN m.month = 6 THEN u.total_traffic ELSE 0 END) as june_traffic
      FROM ul_dl_traffic_data u
      JOIN monthly_traffic_data m ON u.agg_year = m.year AND u.agg_month = m.month
      WHERE m.month IN (6, 7)
    `;
    
    const row = data[0];
    const july = parseFloat(row.july_traffic || 0);
    const june = parseFloat(row.june_traffic || 0);
    const growth = june > 0 ? ((july - june) / june) * 100 : 0;
    
    res.json({
      julyTraffic: july,
      juneTraffic: june,
      growthRate: growth
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});