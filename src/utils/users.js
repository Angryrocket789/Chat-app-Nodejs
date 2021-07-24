const users = [];

// add user
const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //   Validate the data
  if (!username || !room) {
    return {
      error: "Please enter a username and a room",
    };
  }
  //   Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: "Username Taken",
    };
  }

  // Store User
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// remove user
const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });
  //   Findindex returns a index of the array
  //   It means index is a number , which is 0 or greater than 0 , if we find a match. It will be -1 if we didn't find a match
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get user

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

// getusers in room
const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => {
    return user.room === room;
  });
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
