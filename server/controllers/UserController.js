// controllers/userController.js

const User = require('../models/user');

// Find or create user
const findOrCreateUser = async (email, name, roomId, socketId) => {
  try {
    let user = await User.findOne({ email, roomId });
    
    if (!user) {
      user = new User({ email, name, roomId, socketId });
      await user.save();
    } else {
      user.socketId = socketId;
      await user.save();
    }
    
    return user;
  } catch (error) {
    throw new Error('Error finding or creating user: ' + error.message);
  }
};

// Create a new tab for the user
const createTab = async (userId, tabId) => {
  try {
    const user = await User.findById(userId);
    const newTab = { tabId, permissions: {} };
    user.tabs.push(newTab);
    await user.save();
    return newTab;
  } catch (error) {
    throw new Error('Error creating tab: ' + error.message);
  }
};

// Get all users in a room
const getUsersInRoom = async (roomId) => {
  try {
    return await User.find({ roomId });
  } catch (error) {
    throw new Error('Error fetching users in room: ' + error.message);
  }
};

// Find user by email and roomId
const findUserByEmailAndRoom = async (email, roomId) => {
  try {
    return await User.findOne({ email, roomId });
  } catch (error) {
    throw new Error('Error finding user: ' + error.message);
  }
};

// Update permissions for tabs
const updateTabPermissions = async (userId, tabId, permissions) => {
  try {
    const user = await User.findById(userId);
    const tab = user.tabs.find(t => t.tabId === tabId);
    tab.permissions = permissions; // Set the permissions
    await user.save();
  } catch (error) {
    throw new Error('Error updating tab permissions: ' + error.message);
  }
};

module.exports = {
  findOrCreateUser,
  createTab,
  getUsersInRoom,
  findUserByEmailAndRoom,
  updateTabPermissions,
};
