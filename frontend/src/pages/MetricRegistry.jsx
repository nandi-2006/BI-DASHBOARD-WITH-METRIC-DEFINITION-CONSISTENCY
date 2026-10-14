import React, { useEffect, useState } from 'react';
import api from '../api';

function MetricRegistry() {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [metricsData, versionsData] = await Promise.all([
          api.getMetrics(),
          api.getMetricVersions()
        ]);
        
        const metricsList = metricsData || [];
        const versionsList = versionsData || [];
        const merged = metricsList.map(m => {
          const version = versionsList.find(v => v.metricId === m.metricId && v.isCurrent);
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
