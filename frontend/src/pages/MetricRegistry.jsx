import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:9400/api';

function MetricRegistry() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsRes = await axios.get(`${API_BASE}/metrics`);
        const versionsRes = await axios.get(`${API_BASE}/metric-versions`);
        
        const merged = metricsRes.data.map(m => {
          const version = versionsRes.data.find(v => v.metricId === m.metricId && v.isCurrent);
          return { ...m, ...version };
        });
        
        setMetrics(merged);
      } catch (err) {
        console.error("Error fetching metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div>
      <h1 className="page-title">Official Metric Registry</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Formula</th>
            <th>Source Tables</th>
            <th>Filters</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map(m => (
            <tr key={m.metricId}>
              <td style={{fontWeight: 600}}>{m.metricName}</td>
              <td>{m.description}</td>
              <td><code>{m.formula}</code></td>
              <td>{m.sourceTables}</td>
              <td>{m.filters || '-'}</td>
              <td>{m.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MetricRegistry;
