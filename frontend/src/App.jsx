import React from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Database, Activity, FileWarning } from 'lucide-react'
import Overview from './pages/Overview'
import Dashboards from './pages/Dashboards'
import MetricRegistry from './pages/MetricRegistry'
import ConsistencyReports from './pages/ConsistencyReports'

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2>BI Semantic Layer</h2>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
                <Activity size={20} /> Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="/metrics" className={({isActive}) => isActive ? 'active' : ''}>
                <Database size={20} /> Metric Registry
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboards" className={({isActive}) => isActive ? 'active' : ''}>
                <LayoutDashboard size={20} /> Dashboards
              </NavLink>
            </li>
            <li>
              <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>
                <FileWarning size={20} /> Consistency Reports
              </NavLink>
            </li>
          </ul>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/metrics" element={<MetricRegistry />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/reports" element={<ConsistencyReports />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
