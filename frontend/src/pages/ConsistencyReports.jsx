import React, { useEffect, useState } from 'react';
import api from '../api';

function ConsistencyReports() {
  const [reports, setReports] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [dashDefs, setDashDefs] = useState([]);

  const getMetricName = (id) => (metrics || []).find(m => m.metricId === id)?.metricName || id;
  const getWidgetName = (id) => (dashDefs || []).find(d => d.dashboardDefinitionId === id)?.widgetName || id;

  const [metricVersions, setMetricVersions] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [compData, metricData, dashDefData, mvData] = await Promise.all([
          api.getComparisons(),
          api.getMetrics(),
          api.getDashboardDefinitions(),
          api.getMetricVersions()
        ]);
        setReports(compData || []);
        setMetrics(metricData || []);
        setDashDefs(dashDefData || []);
        setMetricVersions(mvData || []);
      } catch (err) {
        console.error("Error fetching reports", err);
      }
    };
    fetchReports();
  }, []);

  const getMetric = (metricVersionId) => {
    const mv = metricVersions.find(v => v.metricVersionId === metricVersionId);
    if (!mv) return null;
    const base = metrics.find(m => m.metricId === mv.metricId);
    return { ...base, ...mv };
  };
  const getDashDef = (id) => dashDefs.find(d => d.dashboardDefinitionId === id);

  return (
    <div>
      <h1 className="page-title">Consistency Reports</h1>
      
      <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
        {reports.map(report => {
          const isMismatch = report.status === 'MISMATCH';
          const official = getMetric(report.metricVersionId);
          const dashDef = getDashDef(report.dashboardDefinitionId);
          
          if (!official || !dashDef) return null;

          return (
            <div key={report.comparisonId} className="card" style={{ borderLeft: isMismatch ? '4px solid #ef4444' : '4px solid #22c55e' }}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                <h3>{official.metricName || 'Metric'} vs {dashDef.widgetName}</h3>
                <span className={`status-badge ${isMismatch ? 'status-mismatch' : 'status-match'}`}>
                  {report.status}
                </span>
              </div>
              
              {isMismatch && (
                <div style={{marginBottom: '1rem', padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '4px', color: '#991b1b'}}>
                  <strong>Why exactly did this fail?</strong><br/>
                  {report.reason}
                </div>
              )}

              <table style={{width: '100%', tableLayout: 'fixed'}}>
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Official Semantic Definition</th>
                    <th>Dashboard Implementation</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Formula</td>
                    <td><code>{official.formula}</code></td>
                    <td><code style={{color: !report.formulaMatch ? '#dc2626' : 'inherit'}}>{dashDef.formula}</code></td>
                    <td>{report.formulaMatch ? '✅' : '❌'}</td>
                  </tr>
                  <tr>
                    <td>Source Tables</td>
                    <td>{official.sourceTables}</td>
                    <td style={{color: !report.sourceMatch ? '#dc2626' : 'inherit'}}>{dashDef.sourceTables}</td>
                    <td>{report.sourceMatch ? '✅' : '❌'}</td>
                  </tr>
                  <tr>
                    <td>Filters</td>
                    <td>{official.filters || 'None'}</td>
                    <td style={{color: !report.filterMatch ? '#dc2626' : 'inherit'}}>{dashDef.filters || 'None'}</td>
                    <td>{report.filterMatch ? '✅' : '❌'}</td>
                  </tr>
                  <tr>
                    <td>Time Window</td>
                    <td>{official.timeWindow}</td>
                    <td style={{color: !report.timeWindowMatch ? '#dc2626' : 'inherit'}}>{dashDef.timeWindow}</td>
                    <td>{report.timeWindowMatch ? '✅' : '❌'}</td>
                  </tr>
                  <tr>
                    <td>Dimensions</td>
                    <td>{official.dimensions}</td>
                    <td style={{color: !report.dimensionMatch ? '#dc2626' : 'inherit'}}>{dashDef.dimensions}</td>
                    <td>{report.dimensionMatch ? '✅' : '❌'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default ConsistencyReports;
