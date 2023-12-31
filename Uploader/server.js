import net from 'net';
import fs from 'fs/promises';

const server = net.createServer(() => {});

server.on('connection', (socket) => {
  let fileWriteStream, fileHandler;

  console.log('Connection is established to this server');

  socket.on('data', async (data) => {
    if (!fileHandler) {
      socket.pause();

      const indexOfDivider = data.indexOf('-------');
      const fileName = data.subarray(10, indexOfDivider).toString('utf-8');

      fileHandler = await fs.open(`./storage/${fileName}`, 'w');
      socket.resume();
      fileWriteStream = fileHandler.createWriteStream();

      fileWriteStream.write(data.subarray(indexOfDivider + 7));

      fileWriteStream.on('drain', () => {
        socket.resume();
      });
    } else {
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
    }

    socket.on('end', () => {
      if (fileHandler) {
        fileHandler.close();
      }
      fileHandler = undefined;
      fileWriteStream = undefined;
      console.log('Connection ended');
    });
  });
});

server.listen(3050, '::1', () => {
  console.log('Sever listening on', server.address());
});
