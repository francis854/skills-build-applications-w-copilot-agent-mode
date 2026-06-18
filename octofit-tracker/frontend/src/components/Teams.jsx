import { useState, useEffect } from 'react';

function Teams() {
  // Build API base URL with Codespaces support
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    captain: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const teamsUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/teams`
        : `http://localhost:8000/api/teams`;
      const usersUrl = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/users`
        : `http://localhost:8000/api/users`;
      const [teamsData, usersData] = await Promise.all([
        fetch(teamsUrl).then(r => r.json()),
        fetch(usersUrl).then(r => r.json())
      ]);
      // Handle both array and paginated responses
      setTeams(Array.isArray(teamsData) ? teamsData : teamsData.teams || []);
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
      const url = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/teams`
        : `http://localhost:8000/api/teams`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create team');
      setShowForm(false);
      setFormData({ name: '', description: '', captain: '' });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const url = codespaceName
        ? `https://${codespaceName}-8000.app.github.dev/api/teams/${id}`
        : `http://localhost:8000/api/teams/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete team');
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border"></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Team'}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Create New Team</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Captain</label>
                <select
                  className="form-select"
                  value={formData.captain}
                  onChange={(e) => setFormData({ ...formData, captain: e.target.value })}
                  required
                >
                  <option value="">Select a captain...</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Create Team</button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {teams.map((team) => (
          <div key={team._id} className="col-md-6 col-lg-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{team.name}</h5>
                <p className="card-text">
                  {team.description && (
                    <>
                      <strong>Description:</strong> {team.description}<br />
                    </>
                  )}
                  <strong>Captain:</strong> {team.captain?.username || 'N/A'}<br />
                  <strong>Members:</strong> {team.members?.length || 0}<br />
                  <strong>Points:</strong> <span className="badge bg-success">{team.totalPoints || 0}</span>
                </p>
                {team.members && team.members.length > 0 && (
                  <div className="mb-2">
                    <small className="text-muted">Team Members:</small>
                    <ul className="list-unstyled mb-0">
                      {team.members.slice(0, 5).map((member) => (
                        <li key={member._id || member}>
                          <small>{member.username || member}</small>
                        </li>
                      ))}
                      {team.members.length > 5 && (
                        <li><small>...and {team.members.length - 5} more</small></li>
                      )}
                    </ul>
                  </div>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(team._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="alert alert-info">No teams found. Create one to get started!</div>
      )}
    </div>
  );
}

export default Teams;
