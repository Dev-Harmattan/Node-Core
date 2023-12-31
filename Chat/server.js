const net = require('net');

const PORT = 3008;
const HOST = '172.31.41.34';

// connected client
const clients = [];

const server = net.createServer();

let clientId;

server.on('connection', (socket) => {
  console.log('New client connected.');

  clientId = clients.length + 1;

  //broadcast user joined
  clients.map((s) => {
    s.write(`User ${clientId} joined.`);
  });

  socket.write(`id-${clientId}`);
  socket.on('data', (data) => {
    const formattedData = data.toString('utf-8');
    const id = formattedData.substring(0, formattedData.indexOf('-'));
    const message = formattedData.substring(
      formattedData.indexOf('-message-') + 9
    );

    clients.map((s) => {
      s.write(`User ${id}: ${message}`);
    });
  });

  clients.push(socket);

  socket.on('end', () => {
    clients.map((s) => {
      s.write(`User ${clientId} left.`);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${server.address().port}`);
});
