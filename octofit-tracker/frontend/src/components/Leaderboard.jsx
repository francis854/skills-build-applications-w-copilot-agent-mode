import { useState, useEffect } from 'react';

function Leaderboard() {
  // Build API base URL with Codespaces support
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const [leaderboard, setLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('alltime');
  const [view, setView] = useState('users'); // 'users' or 'teams'

  useEffect(() => {
    fetchLeaderboard();
  }, [period, view]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (view === 'users') {
        const queryString = new URLSearchParams({ period, limit: 20 }).toString();
        const url = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard?${queryString}`
          : `http://localhost:8000/api/leaderboard?${queryString}`;
        const response = await fetch(url);
        const data = await response.json();
        // Handle both array and paginated responses
        setLeaderboard(Array.isArray(data) ? data : data.leaderboard || []);
      } else {
        const queryString = new URLSearchParams({ limit: 20 }).toString();
        const url = codespaceName
          ? `https://${codespaceName}-8000.app.github.dev/api/leaderboard/teams?${queryString}`
          : `http://localhost:8000/api/leaderboard/teams?${queryString}`;
        const response = await fetch(url);
        const data = await response.json();
        // Handle both array and paginated responses
        setTeamLeaderboard(Array.isArray(data) ? data : data.leaderboard || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-warning text-dark';
    if (rank === 2) return 'bg-secondary';
    if (rank === 3) return 'bg-info';
    return 'bg-light text-dark';
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Leaderboard</h2>

      {/* View and Period Selector */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">View</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn btn-outline-primary ${view === 'users' ? 'active' : ''}`}
                  onClick={() => setView('users')}
                >
                  Users
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-primary ${view === 'teams' ? 'active' : ''}`}
                  onClick={() => setView('teams')}
                >
                  Teams
                </button>
              </div>
            </div>
            {view === 'users' && (
              <div className="col-md-6 mb-3">
                <label className="form-label">Period</label>
                <select
                  className="form-select"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="alltime">All Time</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Leaderboard */}
      {view === 'users' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              Top Users - {period.charAt(0).toUpperCase() + period.slice(1)}
            </h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>Team</th>
                    <th>Activities</th>
                    <th>Duration</th>
                    <th>Calories</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId}>
                      <td>
                        <span className={`badge ${getRankBadge(entry.rank)}`}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td>
                        <strong>{entry.username}</strong>
                        {entry.rank <= 3 && (
                          <span className="ms-2">
                            {entry.rank === 1 && '🥇'}
                            {entry.rank === 2 && '🥈'}
                            {entry.rank === 3 && '🥉'}
                          </span>
                        )}
                      </td>
                      <td>{entry.team?.name || 'No team'}</td>
                      <td>{entry.totalActivities}</td>
                      <td>{entry.totalDuration} min</td>
                      <td>{entry.totalCalories} kcal</td>
                      <td>
                        <span className="badge bg-success">{entry.totalPoints}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {leaderboard.length === 0 && (
              <div className="alert alert-info">
                No leaderboard data available for this period.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Leaderboard */}
      {view === 'teams' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Top Teams</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Captain</th>
                    <th>Members</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {teamLeaderboard.map((entry) => (
                    <tr key={entry.teamId}>
                      <td>
                        <span className={`badge ${getRankBadge(entry.rank)}`}>
                          #{entry.rank}
                        </span>
                      </td>
                      <td>
                        <strong>{entry.name}</strong>
                        {entry.rank <= 3 && (
                          <span className="ms-2">
                            {entry.rank === 1 && '🏆'}
                            {entry.rank === 2 && '🥈'}
                            {entry.rank === 3 && '🥉'}
                          </span>
                        )}
                      </td>
                      <td>{entry.captain?.username || 'N/A'}</td>
                      <td>{entry.memberCount}</td>
                      <td>
                        <span className="badge bg-success">{entry.totalPoints}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {teamLeaderboard.length === 0 && (
              <div className="alert alert-info">
                No team leaderboard data available.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
