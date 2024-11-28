// socket/socketHandler.js

const ACTIONS = require('../utils/actions');  // Import action constants
const { findOrCreateUser, createTab, getUsersInRoom, updateTabPermissions } = require('../controllers/UserController');

const socketHandler = (socket, io) => {
  socket.on(ACTIONS.JOIN, async ({ roomId, userName, email }) => {
    try {
      const user = await findOrCreateUser(email, userName, roomId, socket.id);
      
      // Create a new tab for the user
      const tabId = `${user.email}-${Date.now()}`;
      await createTab(user._id, tabId);
      
      socket.join(roomId);
      
      // Emit user info and current tabs
      socket.emit(ACTIONS.JOINED, { userName, socketId: socket.id, tabId });
      
      // Get users in the room and emit to everyone
      const usersInRoom = await getUsersInRoom(roomId);
      io.to(roomId).emit(ACTIONS.USERS_LIST, usersInRoom);
      
    } catch (error) {
      console.error('Error in JOIN socket event:', error.message);
    }
  });

  socket.on(ACTIONS.REQUEST_TAB_PERMISSION, async ({ targetUserId, tabId, permissionType }) => {
    try {
      // Fetch the user and their tab
      const targetUser = await User.findById(targetUserId);
      const tab = targetUser.tabs.find(t => t.tabId === tabId);

      // Check if permission exists and send back
      if (tab) {
        const permissions = tab.permissions;
        if (permissionType === 'read') {
          socket.emit(ACTIONS.TAB_PERMISSION_STATUS, permissions.canRead);
        } else if (permissionType === 'write') {
          socket.emit(ACTIONS.TAB_PERMISSION_STATUS, permissions.canWrite);
        }
      }
    } catch (error) {
      console.error('Error in REQUEST_TAB_PERMISSION socket event:', error.message);
    }
  });

  socket.on(ACTIONS.GRANT_TAB_PERMISSION, async ({ targetUserId, tabId, permissions }) => {
    try {
      await updateTabPermissions(targetUserId, tabId, permissions);
      io.emit(ACTIONS.PERMISSION_UPDATED, { tabId, permissions });
    } catch (error) {
      console.error('Error in GRANT_TAB_PERMISSION socket event:', error.message);
    }
  });

  socket.on(ACTIONS.LEAVE, async ({ roomId, email }) => {
    try {
      await User.findOneAndDelete({ email, roomId });
      io.to(roomId).emit(ACTIONS.USERS_LIST, await getUsersInRoom(roomId));
    } catch (error) {
      console.error('Error in LEAVE socket event:', error.message);
    }
  });
};

module.exports = socketHandler;
