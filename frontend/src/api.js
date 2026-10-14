import axios from 'axios';
import fallbackData from './fallbackData.json';

const API_BASE = 'http://localhost:9400/api';
const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

export const getApiData = async (endpoint, fallbackKey) => {
  // Browsers block http:// calls from https:// origins (Mixed Content Blocking)
  if (isHttps) {
    return fallbackData[fallbackKey];
  }
  try {
    const res = await axios.get(`${API_BASE}${endpoint}`, { timeout: 2500 });
    return res.data;
  } catch (err) {
    console.warn(`API call ${endpoint} unavailable, falling back to embedded dataset:`, err.message);
    return fallbackData[fallbackKey];
  }
};

export const api = {
  getMetrics: () => getApiData('/metrics', 'metrics'),
  getMetricVersions: () => getApiData('/metric-versions', 'metricVersions'),
  getDashboards: () => getApiData('/dashboards', 'dashboards'),
  getDashboardDefinitions: () => getApiData('/dashboard-definitions', 'dashboardDefinitions'),
  getComparisons: () => getApiData('/comparisons', 'comparisons'),
  getMismatchReports: () => getApiData('/mismatch-reports', 'mismatchReports'),
  getSalesTrend: () => getApiData('/data/sales-trend', 'salesTrend'),
  getCategorySales: () => getApiData('/data/category-sales', 'categorySales'),
  getOrderStatus: () => getApiData('/data/order-status', 'orderStatus'),
  getDeliveryPerformance: () => getApiData('/data/delivery-performance', 'deliveryPerf'),
  getTopSellers: () => getApiData('/data/top-sellers', 'topSellers'),
  getTopProducts: () => getApiData('/data/top-products', 'topProducts'),
  getSalesKpis: () => getApiData('/data/sales-kpis', 'salesKpis')
};

export default api;
