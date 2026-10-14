import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const API_BASE = 'http://localhost:9400/api';
const COLORS = ['#22c55e', '#ef4444'];

function Overview() {
  const [stats, setStats] = useState({
    metrics: 0,
    dashboards: 0,
    matches: 0,
    mismatches: 0
  });
  
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [metricsRes, dashRes, compRes] = await Promise.all([
          axios.get(`${API_BASE}/metrics`),
          axios.get(`${API_BASE}/dashboards`),
          axios.get(`${API_BASE}/comparisons`)
        ]);

        const comparisons = compRes.data;
        const matches = comparisons.filter(c => c.status === 'MATCH').length;
        const mismatches = comparisons.filter(c => c.status === 'MISMATCH').length;

        setStats({
          metrics: metricsRes.data.length,
          dashboards: dashRes.data.length,
          matches,
          mismatches
        });
        
        setPieData([
          { name: 'Matching', value: matches },
          { name: 'Mismatched', value: mismatches }
        ]);
        
        let failures = { Formula: 0, Filters: 0, Source: 0, Dimensions: 0, Time: 0 };
        comparisons.filter(c => c.status === 'MISMATCH').forEach(c => {
          if (!c.formulaMatch) failures.Formula++;
          if (!c.filterMatch) failures.Filters++;
          if (!c.sourceMatch) failures.Source++;
          if (!c.dimensionMatch) failures.Dimensions++;
          if (!c.timeWindowMatch) failures.Time++;
        });
        
        setBarData([
          { name: 'Formula', count: failures.Formula },
          { name: 'Filters', count: failures.Filters },
          { name: 'Sources', count: failures.Source },
          { name: 'Dimensions', count: failures.Dimensions },
          { name: 'Time Window', count: failures.Time }
        ]);
        
      } catch (err) {
        console.error("Error fetching overview data", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="page-title">Platform Overview</h1>
      <div className="grid">
        <div className="card">
          <div className="card-title">Total Official Metrics</div>
          <div className="card-value">{stats.metrics}</div>
        </div>
        <div className="card">
          <div className="card-title">Monitored Dashboards</div>
          <div className="card-value">{stats.dashboards}</div>
        </div>
        <div className="card">
          <div className="card-title" style={{color: '#166534'}}>Matching Implementations</div>
          <div className="card-value">{stats.matches}</div>
        </div>
        <div className="card">
          <div className="card-title" style={{color: '#991b1b'}}>Divergent Implementations</div>
          <div className="card-value">{stats.mismatches}</div>
        </div>
      </div>

      <div className="grid" style={{marginTop: '2rem'}}>
        <div className="card" style={{height: '350px'}}>
          <h3 style={{marginBottom: '1rem'}}>Consistency Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{height: '350px'}}>
          <h3 style={{marginBottom: '1rem'}}>Common Mismatch Sources</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{top: 20, right: 30, left: 0, bottom: 5}}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" name="Failed Widgets" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Overview;
