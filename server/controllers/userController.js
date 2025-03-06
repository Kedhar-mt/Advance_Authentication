// Controller: userController.js

const User = require('../models/User'); // Assuming you have a User model
const Action = require('../models/Action'); // Assuming you have an Action model
const Role = require('../models/Role'); // Assuming you have a Role model
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (req, res) => {
  try {
    // Extract token from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId; // Extract user ID from token

    // Fetch user data
    const user = await User.findById(userId).select('email name'); // Customize fields to return

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user); // Send back user data
  } catch (err) {
    console.error('Error fetching user profile:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ msg: 'Invalid token' });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.submitAction = async (req, res) => {
  try {
    const { action } = req.body;
    
    if (!action) {
      return res.status(400).json({ msg: 'Action content is required' });
    }

    // Create new action with random ID
    const newAction = new Action({ action });

    await newAction.save();
    res.status(201).json({ msg: 'Action saved successfully', action: newAction });
  } catch (err) {
    console.error('Error saving action:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.getActions = async (req, res) => {
  try {
    const actions = await Action.find().sort({ createdAt: -1 }); // Get all actions sorted by latest
    res.json(actions);
  } catch (err) {
    console.error('Error fetching actions:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.createRole = async (req, res) => {
  const { roleName, actions } = req.body;

  if (!roleName || !actions) {
    return res.status(400).json({ msg: 'Role name and actions are required' });
  }

  try {
    // Check if the role already exists
    const existingRole = await Role.findOne({ roleName });
    if (existingRole) {
      return res.status(400).json({ msg: 'Role already exists' });
    }

    // Create and save the new role
    const newRole = new Role({ roleName, actions });
    await newRole.save();

    res.status(201).json({ msg: 'Role created successfully', role: newRole });
  } catch (err) {
    console.error('Error saving role:', err);
    res.status(500).json({ msg: 'Failed to create role' });
  }
};
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.updateRole = async (req, res) => {
  const { roleName, actions } = req.body;

  if (!roleName || !actions) {
    return res.status(400).json({ msg: 'Role name and actions are required' });
  }

  try {
    const role = await Role.findOne({ roleName });

    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }

    role.actions = actions;
    await role.save();

    res.json({ msg: 'Role updated successfully', role });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ msg: 'Failed to update role' });
  }
}
// Delete Role
exports.deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({ msg: 'Role not found' });
    }

    res.json({ msg: 'Role deleted successfully' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ msg: 'Failed to delete role' });
  }
};

// Delete Action
exports.deleteAction = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Attempting to delete action with ID: ${id}`);  // Add logging
    const action = await Action.findOneAndDelete({ actionId: id });

    if (!action) {
      return res.status(404).json({ msg: 'Action not found' });
    }

    res.json({ msg: 'Action deleted successfully' });
  } catch (err) {
    console.error('Error deleting action:', err);
    res.status(500).json({ msg: 'Failed to delete action' });
  }
};