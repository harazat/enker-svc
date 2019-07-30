var socketIO = require('socket.io');
var db = require('./db');

function connect(server) {
  const io = socketIO(server);
  userNamespace(io);
}

// TODO: List namespace will provide list of logged in users
function userNamespace(io) {
  const users = io.of('/users');
  users.on('connection', socket => {

    socket.on('start-chat', (toUser, fromUser) => {
      if (toUser) {
        users.in(toUser.email).emit('start-chat', fromUser);
      }
    });

    socket.on('chat-message', (toUser, fromUser, message) => {
      if (toUser) {
        users.in(toUser.email).emit('chat-message', fromUser, message);
      }
    });

    socket.on('editor-message', (toUser, fromUser, message) => {
      if (toUser) {
        users.in(toUser.email).emit('editor-message', fromUser, message);
      }
    });


    socket.on('drawing-message', (toUser, fromUser, message) => {
      if (toUser) {
        users.in(toUser.email).emit('drawing-message', fromUser, message);
      }
    });

    // When a user logs in 
    socket.on('login', user => {
      // Join room of user's email
      socket.join(user.email);

      db.getClient().collection("students").findOneAndUpdate(
        {email:  user.email},
        {$set: {'loggedIn': true}},
        {returnOriginal: false},
        function(err, results) {
          if (err) {
            socket.emit('list error', err);
          } else if(results.value == null) {
            socket.emit('list error', {error: "Student with email " + user.email  + " does not exist."});
          } else {
            users.emit('logged in', results.value);
          }
        });
    });

    socket.on('disconnect', user => {
      db.getClient().collection("students").findOneAndUpdate(
        {email:  user.email},
        {$set: {'loggedIn': false}},
        {returnOriginal: false},
        function(err, results) {
          if (err) {
            socket.emit('list error', err);
          } else if(results.value == null) {
            socket.emit('list error', {error: "Socket ID " + socket.id  + " does not exist."});
          } else {
            users.emit('logged out', results.value);
          }
        });
    });

    socket.on('logout', user => {
      socket.leave(user.email);

      db.getClient().collection("students").findOneAndUpdate(
        {email:  user.email},
        {$set: {'loggedIn': false}},
        {returnOriginal: false},
        function(err, results) {
          if (err) {
            socket.emit('list error', err);
          } else if(results.value == null) {
            socket.emit('list error', {error: "Socket ID " + socket.id  + " does not exist."});
          } else {
            users.emit('logged out', results.value);
          }
        });
    });

    socket.on('query', (params, fn) => {
      // For a given search params, return student list
      console.log('query', params);
      let criteria = {};
      if (params.search) {
        const textCriteria = { $text: { $search: params.search } };
        const learningTargetCriteria = { learningTargets: params.search };
        criteria = {$or: [textCriteria, learningTargetCriteria]};
      };
      db.getClient().collection("students").find(criteria).sort({loggedIn: -1}).toArray(function(err, results) {
        if (err) {
          console.log('err', err);
          socket.emit('list error', err);
        } else {
          console.log('results', results);
          fn(results);
        }
      });
    });
  });
}

module.exports = {
  connect,
}
