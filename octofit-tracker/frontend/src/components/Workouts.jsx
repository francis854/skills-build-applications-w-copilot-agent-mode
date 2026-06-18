import { useState, useEffect } from 'react';

function Workouts() {
  // Build API base URL with Codespaces support
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const [workouts, setWorkouts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [filter, setFilter] = useState({ difficulty: '', activityType: '' });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filter.difficulty) params.difficulty = filter.difficulty;
      if (filter.activityType) params.activityType = filter.activityType;
      
      const queryString = new URLSearchParams(params).toString();
      const workoutsUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/workouts${queryString ? `?${queryString}` : ''}`
        : `http://localhost:8000/api/workouts${queryString ? `?${queryString}` : ''}`;
      const usersUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/users`
        : `http://localhost:8000/api/users`;
      const [workoutsData, usersData] = await Promise.all([
        fetch(workoutsUrl).then(r => r.json()),
        fetch(usersUrl).then(r => r.json())
      ]);
      // Handle both array and paginated responses
      setWorkouts(Array.isArray(workoutsData) ? workoutsData : workoutsData.workouts || []);
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (userId) => {
    try {
      setError(null);
      const url = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/workouts/suggestions/${userId}?limit=5`
        : `http://localhost:8000/api/workouts/suggestions/${userId}?limit=5`;
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGetSuggestions = () => {
    if (selectedUser) {
      fetchSuggestions(selectedUser);
    }
  };

  const activityTypes = ['running', 'cycling', 'swimming', 'walking', 'gym', 'yoga', 'sports', 'other'];

  if (loading) return <div className="container mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Workouts</h2>

      {/* Personalized Suggestions */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Get Personalized Suggestions</h5>
          <div className="row align-items-end">
            <div className="col-md-8">
              <label className="form-label">Select User</label>
              <select
                className="form-select"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username} - {user.fitnessLevel}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-primary w-100"
                onClick={handleGetSuggestions}
                disabled={!selectedUser}
              >
                Get Suggestions
              </button>
            </div>
          </div>

          {suggestions && (
            <div className="mt-3">
              <h6>Suggested Workouts for {suggestions.fitnessLevel} level:</h6>
              <div className="row">
                {suggestions.suggestions && suggestions.suggestions.map((workout) => (
                  <div key={workout._id} className="col-md-6 mb-3">
                    <div className="card border-primary">
                      <div className="card-body">
                        <h6 className="card-title">{workout.name}</h6>
                        <p className="card-text small">
                          <span className="badge bg-info me-2">{workout.difficulty}</span>
                          <span className="badge bg-secondary me-2">{workout.activityType}</span>
                          <span className="badge bg-success">{workout.pointsEstimate} pts</span>
                        </p>
                        <p className="card-text small mb-0">
                          {workout.duration} min | ~{workout.caloriesEstimate} kcal
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Browse All Workouts</h5>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Difficulty</label>
              <select
                className="form-select"
                value={filter.difficulty}
                onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Activity Type</label>
              <select
                className="form-select"
                value={filter.activityType}
                onChange={(e) => setFilter({ ...filter, activityType: e.target.value })}
              >
                <option value="">All Types</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Workout Cards */}
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{workout.name}</h5>
                <p className="card-text">{workout.description}</p>
                <div className="mb-3">
                  <span className="badge bg-info me-2">{workout.difficulty}</span>
                  <span className="badge bg-secondary me-2">{workout.activityType}</span>
                  <span className="badge bg-warning text-dark me-2">{workout.duration} min</span>
                  <span className="badge bg-success">{workout.pointsEstimate} pts</span>
                </div>
                <p className="card-text">
                  <small className="text-muted">
                    <strong>Calories:</strong> ~{workout.caloriesEstimate} kcal
                  </small>
                </p>
                {workout.equipment && workout.equipment.length > 0 && (
                  <p className="card-text">
                    <small className="text-muted">
                      <strong>Equipment:</strong> {workout.equipment.join(', ')}
                    </small>
                  </p>
                )}
                {workout.instructions && workout.instructions.length > 0 && (
                  <details>
                    <summary className="text-primary" style={{ cursor: 'pointer' }}>
                      View Instructions
                    </summary>
                    <ol className="mt-2 mb-0">
                      {workout.instructions.map((instruction, idx) => (
                        <li key={idx}><small>{instruction}</small></li>
                      ))}
                    </ol>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="alert alert-info">
          No workouts found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}

export default Workouts;
