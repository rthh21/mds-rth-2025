const io = require('socket.io')(2013);

io.on('connection', function(socket) {
  console.log('Un utilizator s-a conectat');
  
  // Gestionarea intrării într-o cameră
  socket.on('join-room', function(roomId, userId) {
    console.log(`Utilizatorul ${userId} s-a alăturat camerei ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    
    // Gestionarea deconectării
    socket.on('disconnect', () => {
      console.log(`Utilizatorul ${userId} s-a deconectat`);
      socket.to(roomId).broadcast.emit('user-disconnected', userId);
    });
    
    // Gestionarea mesajelor de chat
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', message, userId);
    });
  });
});

console.log('Server de semnalizare pornit pe portul 2013');
