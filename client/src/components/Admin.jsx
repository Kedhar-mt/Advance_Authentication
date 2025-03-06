import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Axios instance

const Admin = () => {
  const navigate = useNavigate();

  // User States
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionInput, setActionInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Admin States
  const [actions, setActions] = useState([]);
  const [selectedActions, setSelectedActions] = useState([]);
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  
  useEffect(() => {
    fetchActions();
    fetchRoles();
  }, []);

  // Fetch user data
  const handleFetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/api/user/profile');
      setUserData(response.data);
    } catch (err) {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Store action in database
  const handleSaveAction = async () => {
    if (!actionInput.trim()) {
      setError('Action cannot be empty');
      return;
    }
    try {
      await api.post('/api/user/action', { action: actionInput });
      setSuccessMessage('Action saved successfully!');
      setActionInput('');
      fetchActions();
    } catch (err) {
      setError('Failed to save action');
    }
  };

  // Logout function
  const handleLogout =  async() => {
    try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          // Call the backend to delete the token document
          await api.post('/api/auth/logout', { userId });
        }
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Always clear local storage and redirect, even if the API call fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      }
  };

  // Admin Functions
  const fetchActions = async () => {
    try {
      const response = await api.get('/api/user/actions');
      setActions(response.data);
    } catch (err) {
      setError('Failed to fetch actions');
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/user/roles');
      setRoles(response.data);
    } catch (err) {
      setError('Failed to fetch roles');
    }
  };

  const handleRoleSubmit = async () => {
    if (!role) {
      alert('Please enter a role!');
      return;
    }
    const roleData = { roleName: role, actions: selectedActions };
    try {
      await api.post('/api/user/role', roleData);
      alert(`Role "${role}" created successfully!`);
      fetchRoles();
      resetForm();
    } catch (err) {
      alert('Failed to save role');
    }
  };
  const handleRoleUpdate = async () => {
    if (!selectedRoleId) {
      alert('Please select a role to update');
      return;
    }

    const roleData = { roleName: role, actions: selectedActions };

    try {
      await api.put(`/api/user/role/${selectedRoleId}`, roleData);
      alert(`Role "${role}" updated successfully!`);
      fetchRoles();
      resetForm();
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Failed to update role');
    }
  };
  const handleDeleteRole = async (roleId) => {
    try {
      await api.delete(`/api/user/role/${roleId}`);
      alert('Role deleted successfully');
      fetchRoles();
    } catch (err) {
      alert('Failed to delete role');
    }
  };

  const handleDeleteAction = async (actionId) => {
    try {
      await api.delete(`/api/user/action/${actionId}`);
      alert('Action deleted successfully');
      fetchActions();
    } catch (err) {
      alert('Failed to delete action');
    }
  };
  const handleEditRole = (selectedRole) => {
    setRole(selectedRole.roleName);
    setSelectedActions(selectedRole.actions);
    setSelectedRoleId(selectedRole._id);
  };

  const resetForm = () => {
    setRole('');
    setSelectedActions([]);
    setSelectedRoleId(null);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <button onClick={handleFetchData} disabled={loading}>{loading ? 'Loading...' : 'Fetch User Data'}</button>
      {userData && <p>Email: {userData.email}</p>}
      <input type="text" placeholder="Enter action" value={actionInput} onChange={(e) => setActionInput(e.target.value)} />
      <button onClick={handleSaveAction}>Save Action</button>
      <button onClick={handleLogout}>Logout</button>
      
      <h2>Admin Dashboard</h2>
      <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Enter Role Name" />
      <ul>
        {actions.map((action) => (
          <li key={action.actionId}>
            <input type="checkbox" checked={selectedActions.includes(action.actionId)} onChange={() => setSelectedActions((prev) => prev.includes(action.actionId) ? prev.filter(id => id !== action.actionId) : [...prev, action.actionId])} />
            {action.action}
            <button onClick={() => handleDeleteAction(action.actionId)}>Delete Action</button>
          </li>
        ))}
      </ul>
      <button onClick={selectedRoleId ? handleRoleUpdate : handleRoleSubmit}>
        {selectedRoleId ? 'Update Role' : 'Create Role'}
      </button>
      <button onClick={handleRoleSubmit}>Create Role</button>
      <h2>Stored Roles</h2>
      <ul>
        {roles.map((role) => (
          <li key={role._id}>
            <strong>{role.roleName}</strong>
            <ul>
              {role.actions.map((actionId) => {
                const action = actions.find(a => a.actionId === actionId);
                return <li key={actionId}>{action?.action || actionId}</li>;
              })}
            </ul>
            <button onClick={() => handleEditRole(role)}>Edit</button>
            <button onClick={() => handleDeleteRole(role._id)}>Delete Role</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admin;
