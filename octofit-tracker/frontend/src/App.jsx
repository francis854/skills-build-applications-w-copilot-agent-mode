import { Link, Routes, Route } from 'react-router-dom';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import './App.css';

// Build API base URL with Codespaces support
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            🏃 OctoFit Tracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">Teams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">Activities</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">Leaderboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">Workouts</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-light py-3 mt-5">
        <div className="container text-center">
          <small className="text-muted">
            API: <code>{API_BASE_URL}</code>
          </small>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 mx-auto text-center">
          <h1 className="display-4 mb-4">Welcome to OctoFit Tracker</h1>
          <p className="lead mb-4">
            Your multi-tier fitness tracking application for logging activities,
            managing teams, and competing on the leaderboard.
          </p>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">👥 Users</h5>
                  <p className="card-text">Manage user profiles and fitness goals</p>
                  <Link to="/users" className="btn btn-primary btn-sm">View Users</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">🏆 Teams</h5>
                  <p className="card-text">Create and manage fitness teams</p>
                  <Link to="/teams" className="btn btn-primary btn-sm">View Teams</Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">📊 Activities</h5>
                  <p className="card-text">Log and track fitness activities</p>
                  <Link to="/activities" className="btn btn-primary btn-sm">View Activities</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">📈 Leaderboard</h5>
                  <p className="card-text">See top users and teams</p>
                  <Link to="/leaderboard" className="btn btn-primary btn-sm">View Leaderboard</Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">💪 Workouts</h5>
                  <p className="card-text">Browse and get workout suggestions</p>
                  <Link to="/workouts" className="btn btn-primary btn-sm">View Workouts</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
