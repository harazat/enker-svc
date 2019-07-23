var socketIO = require('socket.io');
var db = require('./db');

function connect(server) {
  const io = socketIO(server);
  
  // TODO: Create namespaces
  usersNamespace(io);
}

// TODO: List namespace will provide list of logged in users
function usersNamespace(io) {
  const users = io.of('/users');
  users.on('connection', socket => {


    socket.on('textSearch',(textSearch, fn)=> {
      const textQuery={$text: {$search:textSearch}}

      const arrQuery = {learningTargets: textSearch}  

      const finalQuery = textSearch ?  {$or: [textQuery, arrQuery]} : {}
            db.getClient().collection("students").find(finalQuery).sort().toArray((error, results)  => {
        if(error){
          console.log(error);

        }
        else{
          fn(results)
        }
      } )
    })
    // TODO: add listener for starting chat
    
    // TODO: add listener to chat message

    // TODO: add listener for editor message WYSIWIG

    // TODO: add listener for drawing

    // TODO: add listener for logging in, update flag loggedIn in Database, join room

    // TODO: add listener on 'disconnect' to log out user, and emit

    // TODO: add listener for logout message, update db, emit
    
    // TODO: add listener to search query
    socket.on('login', user => {
      socket.join(user.email);
      db.getClient().collection("students").findOneAndUpdate(
        {email: user.email},
        {$set: {'loggedIn':true}},
        {returnOriginal: false},
        function(err, results){
          if(err){
            socket.emit('list.error', err);
          }
          else if(results.value == null){
            socket.emit('list.error', {error: "Student with email"})
          }
          else {
            users.emit('logged in', results.value)
          }
        }
        
      )
    }
    )
socket.on('disconnect', user =>{
  socket.leave(user.email);
  db.getClient().collection("students").findOneAndUpdate(
    {email: user.email},
    {$set: {'loggedIn': false}},
    {returnOriginal: false},
    function(err, results){
      if(err){
        socket.emit('list.error', err);
      }
      else if(results.value == null){
        socket.emit('list.error', {error: "Socket ID" +socket.id + "does not exist"})
      }
      else {
        users.emit('logged out', results.value)
      }
    }
    
  )

}
)
socket.on('log out', user =>{
  socket.leave(user.email);
  db.getClient().collection("students").findOneAndUpdate(
    {email: user.email},
    {$set: {'loggedIn': false}},
    {returnOriginal: false},
    function(err, results){
      if(err){
        socket.emit('list.error', err);
      }
      else if(results.value == null){
        socket.emit('list.error', {error: "Socket ID" +socket.id + "does not exist"})
      }
      else {
        users.emit('logged out', results.value)
      }
    }
    
  )

}
)
  });
}

module.exports = {
  connect,
}
