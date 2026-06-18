import { useState, useEffect } from 'react';

function Activities() {
  // Build API base URL with Codespaces support
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const API_BASE_URL = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ userId: '', activityType: '' });
  const [formData, setFormData] = useState({
    userId: '',
    activityType: 'running',
    duration: '',
    distance: '',
    calories: '',
    points: '',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (filter.userId) params.userId = filter.userId;
      if (filter.activityType) params.activityType = filter.activityType;
      
      const queryString = new URLSearchParams(params).toString();
      const activitiesUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/activities${queryString ? `?${queryString}` : ''}`
        : `http://localhost:8000/api/activities${queryString ? `?${queryString}` : ''}`;
      const usersUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/users`
        : `http://localhost:8000/api/users`;
      const [activitiesData, usersData] = await Promise.all([
        fetch(activitiesUrl).then(r => r.json()),
        fetch(usersUrl).then(r => r.json())
      ]);
      // Handle both array and paginated responses
      setActivities(Array.isArray(activitiesData) ? activitiesData : activitiesData.activities || []);
      setUsers(Array.isArray(usersData) ? usersData : usersData.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activityData = {
        ...formData,
        duration: parseInt(formData.duration),
        distance: formData.distance ? parseFloat(formData.distance) : undefined,
        calories: parseInt(formData.calories),
        points: parseInt(formData.points),
      };
      const url = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/activities`
        : `http://localhost:8000/api/activities`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      if (!response.ok) throw new Error('Failed to create activity');
      setShowForm(false);
      setFormData({
        userId: '',
        activityType: 'running',
        duration: '',
        distance: '',
        calories: '',
        points: '',
        notes: ''
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      const url = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/activities/${id}`
        : `http://localhost:8000/api/activities/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete activity');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const activityTypes = ['running', 'cycling', 'swimming', 'walking', 'gym', 'yoga', 'sports', 'other'];

  if (loading) return <div className="container mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Activities</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Log Activity'}
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Filters</h5>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">User</label>
              <select
                className="form-select"
                value={filter.userId}
                onChange={(e) => setFilter({ ...filter, userId: e.target.value })}
              >
                <option value="">All Users</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>{user.username}</option>
                ))}
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
                  <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Log New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">User</label>
                  <select
                    className="form-select"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    required
                  >
                    <option value="">Select user...</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>{user.username}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Activity Type</label>
                  <select
                    className="form-select"
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                  >
                    {activityTypes.map((type) => (
                      <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Distance (optional)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Points</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.points}
                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Notes</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Log Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Distance</th>
              <th>Calories</th>
              <th>Points</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.userId?.username || 'N/A'}</td>
                <td><span className="badge bg-primary">{activity.activityType}</span></td>
                <td>{activity.duration} min</td>
                <td>{activity.distance ? `${activity.distance} km` : 'N/A'}</td>
                <td>{activity.calories} kcal</td>
                <td><span className="badge bg-success">{activity.points}</span></td>
                <td>{new Date(activity.date).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(activity._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activities.length === 0 && (
        <div className="alert alert-info">No activities found. Log one to get started!</div>
      )}
    </div>
  );
}

export default Activities;
