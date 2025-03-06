const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,  // Ensure roles are unique
  },
  actions: [{
    type: String,  // You can store action names or IDs depending on your structure
    required: true,
  }]
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
