import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, AreaChart, Area 
} from 'recharts';
import { AlertTriangle, CheckCircle2, Info, LayoutDashboard } from 'lucide-react';

const API_BASE = 'http://localhost:9400/api';
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function Dashboards() {
  const [dashboards, setDashboards] = useState([]);
  const [dashboardDefs, setDashboardDefs] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [metricVersions, setMetricVersions] = useState([]);
  
  // Real dataset state
  const [salesTrend, setSalesTrend] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [deliveryPerf, setDeliveryPerf] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [kpis, setKpis] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          dashRes, defRes, compRes, metricRes, mvRes,
          trendRes, catRes, statRes, devRes, sellersRes, prodsRes, kpiRes
        ] = await Promise.all([
          axios.get(`${API_BASE}/dashboards`),
          axios.get(`${API_BASE}/dashboard-definitions`),
          axios.get(`${API_BASE}/comparisons`),
          axios.get(`${API_BASE}/metrics`),
          axios.get(`${API_BASE}/metric-versions`),
          axios.get(`${API_BASE}/data/sales-trend`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/category-sales`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/order-status`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/delivery-performance`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/top-sellers`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/top-products`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE}/data/sales-kpis`).catch(() => ({ data: {} }))
        ]);

        setDashboards(dashRes.data);
        setDashboardDefs(defRes.data);
        setComparisons(compRes.data);
        setMetrics(metricRes.data);
        setMetricVersions(mvRes.data);

        setSalesTrend(trendRes.data);
        setCategorySales(catRes.data);
        setOrderStatus(statRes.data);
        setDeliveryPerf(devRes.data);
        setTopSellers(sellersRes.data);
        setTopProducts(prodsRes.data);
        setKpis(kpiRes.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) => {
    if (!val && val !== 0) return '$0';
    return '$' + Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const getMetric = (metricId) => metrics.find(m => m.metricId === metricId) || {};
  const getOfficialVersion = (metricId) => metricVersions.find(v => v.metricId === metricId && v.isCurrent) || {};

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Monitored Business Dashboards</h1>
          <p style={{ color: '#64748b' }}>
            Enterprise catalog of 10 department dashboards with continuous semantic layer verification.
            Live charts highlight where dashboard calculations drift from certified definitions.
          </p>
        </div>
      </div>

      {/* Top Global KPI Summary Cards */}
      <div className="grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '5px solid #2563eb' }}>
          <div className="card-title">Certified Total Sales Revenue</div>
          <div className="card-value">{formatCurrency(kpis.total_sales)}</div>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem' }}>Official: SUM(total_sales) on gold_sales_summary</p>
        </div>
        <div className="card" style={{ borderLeft: '5px solid #10b981' }}>
          <div className="card-title">Certified Total Orders</div>
          <div className="card-value">{Number(kpis.total_orders || 0).toLocaleString()}</div>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem' }}>Official: SUM(order_count) on gold_sales_summary</p>
        </div>
        <div className="card" style={{ borderLeft: '5px solid #f59e0b' }}>
          <div className="card-title">Certified Average Order Value</div>
          <div className="card-value">{formatCurrency(kpis.aov)}</div>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem' }}>Official: SUM(total_sales) / SUM(order_count)</p>
        </div>
      </div>

      {/* 10 Dashboards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {dashboards.map((dash) => {
          const dashWidgets = dashboardDefs.filter((def) => def.dashboardId === dash.dashboardId);
          const dashComps = comparisons.filter((c) => c.dashboardId === dash.dashboardId);
          const hasMismatch = dashComps.some((c) => c.status === 'MISMATCH');

          return (
            <div key={dash.dashboardId} className="card" style={{ padding: '2rem', border: hasMismatch ? '1px solid #fed7aa' : '1px solid #bbf7d0' }}>
              {/* Dashboard Header Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <LayoutDashboard size={24} color="#2563eb" />
                    <h2 style={{ fontSize: '1.4rem', color: '#1e293b' }}>
                      #{dash.dashboardId}: {dash.dashboardName}
                    </h2>
                    <span style={{ fontSize: '0.8rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
                      {dash.owner}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{dash.description}</p>
                </div>
                <div>
                  {hasMismatch ? (
                    <span className="status-badge status-mismatch" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem' }}>
                      <AlertTriangle size={16} /> Divergence Detected
                    </span>
                  ) : (
                    <span className="status-badge status-match" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem' }}>
                      <CheckCircle2 size={16} /> Certified Consistent
                    </span>
                  )}
                </div>
              </div>

              {/* Metrics & Mismatch Diagnostics Panel */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.75rem' }}>
                  Registered Metric Implementations & Semantic Audit:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {dashWidgets.map((widget) => {
                    const comp = comparisons.find(c => c.dashboardDefinitionId === widget.dashboardDefinitionId);
                    const official = getOfficialVersion(widget.metricId);
                    const metricInfo = getMetric(widget.metricId);
                    const isMismatch = comp?.status === 'MISMATCH';

                    return (
                      <div 
                        key={widget.dashboardDefinitionId} 
                        style={{
                          borderRadius: '6px',
                          border: isMismatch ? '1px solid #f87171' : '1px solid #86efac',
                          backgroundColor: isMismatch ? '#fff1f2' : '#f0fdf4',
                          padding: '1rem 1.25rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isMismatch ? '#991b1b' : '#166534' }}>
                            Widget: "{widget.widgetName}" &rarr; Auditing Against Metric: {metricInfo.metricName || `#${widget.metricId}`}
                          </span>
                          <span className={`status-badge ${isMismatch ? 'status-mismatch' : 'status-match'}`}>
                            {isMismatch ? 'MISMATCH' : 'MATCH'}
                          </span>
                        </div>

                        {isMismatch ? (
                          <div>
                            <div style={{ backgroundColor: '#ffe4e6', padding: '0.5rem 0.75rem', borderRadius: '4px', marginBottom: '0.75rem', color: '#9f1239', fontSize: '0.88rem' }}>
                              <strong>Why is this a mismatch? </strong>
                              {comp?.reason || 'Calculations deviate from the official certified metric standard.'}
                            </div>
                            <table style={{ width: '100%', fontSize: '0.85rem', backgroundColor: '#ffffff', borderRadius: '4px' }}>
                              <thead>
                                <tr>
                                  <th style={{ width: '20%' }}>Comparison Property</th>
                                  <th style={{ width: '40%' }}>Official Semantic Definition (Certified)</th>
                                  <th style={{ width: '40%' }}>Dashboard Implementation</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td><strong>Formula</strong></td>
                                  <td><code>{official.formula || 'N/A'}</code></td>
                                  <td><code style={{ color: comp && !comp.formulaMatch ? '#e11d48' : '#1e293b', fontWeight: !comp?.formulaMatch ? 700 : 400 }}>{widget.formula}</code></td>
                                </tr>
                                <tr>
                                  <td><strong>Source Table</strong></td>
                                  <td><code>{official.sourceTables || 'N/A'}</code></td>
                                  <td><code style={{ color: comp && !comp.sourceMatch ? '#e11d48' : '#1e293b' }}>{widget.sourceTables}</code></td>
                                </tr>
                                <tr>
                                  <td><strong>Filters</strong></td>
                                  <td><code>{official.filters || 'None'}</code></td>
                                  <td><code style={{ color: comp && !comp.filterMatch ? '#e11d48' : '#1e293b' }}>{widget.filters || 'None'}</code></td>
                                </tr>
                                <tr>
                                  <td><strong>Dimensions / Grain</strong></td>
                                  <td><code>{official.dimensions || 'None'}</code></td>
                                  <td><code style={{ color: comp && !comp.dimensionMatch ? '#e11d48' : '#1e293b' }}>{widget.dimensions || 'None'}</code></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.88rem', color: '#166534' }}>
                            &check; <strong>100% Consistent:</strong> Uses certified formula <code>{official.formula}</code> querying <code>{official.sourceTables}</code>.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Visualizations For Each of the 10 Dashboards */}
              <h4 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.75rem' }}>
                Active Dashboard Visualizations:
              </h4>

              {/* Dashboard 1: Sales Executive */}
              {dash.dashboardId === 1 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Sales Revenue Trend (Time-Series)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart data={salesTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val/1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Line type="monotone" dataKey="total_sales" stroke="#2563eb" strokeWidth={2} name="Total Sales" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Top Product Categories by Revenue</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={categorySales} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(val) => `$${val/1000}k`} />
                        <YAxis dataKey="category" type="category" width={85} tick={{ fontSize: 10 }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="total_sales" fill="#10b981" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 2: Ops Daily Monitor */}
              {dash.dashboardId === 2 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Order Status Breakdown (Olist Data)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie data={orderStatus} dataKey="order_count" nameKey="order_status" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}>
                          {orderStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Delivery Performance (On-Time vs Late)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie data={deliveryPerf} dataKey="count" nameKey="delivery_performance" cx="50%" cy="50%" innerRadius={55} outerRadius={85} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                          {deliveryPerf.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#10b981', '#f59e0b', '#ef4444'][index % 3]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 3: Product Performance Dashboard */}
              {dash.dashboardId === 3 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Top 8 Products by Gross Revenue</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={topProducts} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="total_revenue" fill="#8b5cf6" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Product Volume vs AOV Divergence Impact</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={topProducts.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="order_count" fill="#06b6d4" name="Order Volume" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 4: Marketing ROI Dashboard */}
              {dash.dashboardId === 4 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#e11d48' }}>[Divergent Metric]</span> Acquired Orders vs Certified Total Volume
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={salesTrend.slice(0, 30)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="order_count" stroke="#2563eb" fill="#bfdbfe" name="Certified Total Orders" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Campaign Revenue Contribution</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={categorySales.slice(0, 5)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="total_sales" fill="#f59e0b" name="Campaign Sales" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 5: Regional Sales Dashboard */}
              {dash.dashboardId === 5 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Regional Order Concentration</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={[
                        { region: 'Southeast', orders: 58000, revenue: 7600000 },
                        { region: 'South', orders: 18000, revenue: 2400000 },
                        { region: 'Northeast', orders: 12000, revenue: 1800000 },
                        { region: 'Central-West', orders: 8000, revenue: 1100000 },
                        { region: 'North', orders: 3000, revenue: 500000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v/1000}k`} />
                        <Tooltip />
                        <Bar dataKey="orders" fill="#3b82f6" name="Total Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Regional Revenue Share ($)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Southeast', value: 7600000 },
                            { name: 'South', value: 2400000 },
                            { name: 'Northeast', value: 1800000 },
                            { name: 'Central-West', value: 1100000 },
                            { name: 'North', value: 500000 }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%" cy="50%" outerRadius={85}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {PIE_COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                        </Pie>
                        <Tooltip formatter={(val) => formatCurrency(val)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 6: Seller Analytics Dashboard */}
              {dash.dashboardId === 6 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Top 8 Marketplace Sellers by Sales Revenue</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={topSellers} margin={{ left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="seller_label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="total_revenue" fill="#ec4899" name="Seller Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Seller Fulfillment Volume (Orders)</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={topSellers}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="seller_label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="order_count" fill="#6366f1" name="Fulfilled Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 7: Customer Retention Dashboard */}
              {dash.dashboardId === 7 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#e11d48' }}>[Divergent Formula]</span> Repeat Orders Simulation (80% Proxy vs Actual)
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart data={salesTrend.slice(0, 30)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="order_count" stroke="#2563eb" name="Certified Total Orders" dot={false} />
                        <Line type="monotone" dataKey={(d) => Math.round(d.order_count * 0.8)} stroke="#ef4444" strokeDasharray="4 4" name="Divergent 80% Repeat Estimate" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Customer Cohort Frequency Distribution</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: '1-time Purchase', value: 92 },
                            { name: '2 purchases', value: 6 },
                            { name: '3+ purchases', value: 2 }
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%" cy="50%" outerRadius={85}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 8: Logistics & Freight Dashboard */}
              {dash.dashboardId === 8 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Carrier Delivery Timeliness</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={[
                        { carrier: 'Correios Expresso', on_time: 89, delayed: 11 },
                        { carrier: 'Jadlog Standard', on_time: 94, delayed: 6 },
                        { carrier: 'Total Express', on_time: 91, delayed: 9 },
                        { carrier: 'DirectLog', on_time: 86, delayed: 14 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="carrier" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="on_time" fill="#10b981" name="% On-Time" />
                        <Bar dataKey="delayed" fill="#ef4444" name="% Delayed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>Freight Cost by Category</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={categorySales.slice(0, 6)} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tick={{ fontSize: 10 }} />
                        <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="order_count" fill="#0284c7" name="Shipment Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 9: Executive Overview Dashboard */}
              {dash.dashboardId === 9 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#16a34a' }}>&check; Certified C-Suite Revenue Stream</span>
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart data={salesTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip formatter={(v) => formatCurrency(v)} />
                        <Line type="monotone" dataKey="total_sales" stroke="#16a34a" strokeWidth={3} name="Official Certified Revenue" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#16a34a' }}>&check; Certified Cumulative Order Trajectory</span>
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <AreaChart data={salesTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_date" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="order_count" stroke="#10b981" fill="#dcfce7" name="Certified Order Count" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Dashboard 10: Inventory Health Dashboard */}
              {dash.dashboardId === 10 && (
                <div className="grid">
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      <span style={{ color: '#e11d48' }}>[Divergent Filter]</span> Shipped vs Delivered Status Divergence
                    </h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={orderStatus.filter(s => ['delivered', 'shipped', 'invoiced', 'processing'].includes(s.order_status))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="order_status" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="order_count" fill="#e11d48" name="Orders in Pipeline" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card" style={{ height: '330px' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>SKU Velocity & Stock Turnover Rates</h4>
                    <ResponsiveContainer width="100%" height="85%">
                      <BarChart data={topProducts.slice(0, 6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_label" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="order_count" fill="#475569" name="Velocity (Units Sold)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboards;
