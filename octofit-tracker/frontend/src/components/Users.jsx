import { useState, useEffect } from 'react';

// Build API base URL with Codespaces support
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fitnessLevel: 'beginner',
    goals: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      // Handle both array and paginated responses
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goals = formData.goals.split(',').map(g => g.trim()).filter(Boolean);
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, goals })
      });
      if (!response.ok) throw new Error('Failed to create user');
      setShowForm(false);
      setFormData({ username: '', email: '', password: '', fitnessLevel: 'beginner', goals: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New User</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fitness Level</label>
                <select
                  className="form-select"
                  value={formData.fitnessLevel}
                  onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Goals (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., lose weight, build muscle"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary">Create User</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {users.map((user) => (
          <div key={user._id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{user.username}</h5>
                <p className="card-text">
                  <strong>Email:</strong> {user.email}<br />
                  <strong>Level:</strong> <span className="badge bg-info">{user.fitnessLevel}</span><br />
                  {user.goals && user.goals.length > 0 && (
                    <>
                      <strong>Goals:</strong> {user.goals.join(', ')}<br />
                    </>
                  )}
                  {user.teamId && (
                    <>
                      <strong>Team:</strong> {user.teamId.name || user.teamId}
                    </>
                  )}
                </p>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="alert alert-info">No users found. Create one to get started!</div>
      )}
    </div>
  );
}

export default Users;
