import net from 'net';
import readline from 'readline/promises';

const PORT = 3008;
const HOST = '51.20.2.216';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let id;
const socket = net.createConnection({ port: PORT, host: HOST }, async () => {
  console.log('Connected to server');

  const ask = async () => {
    const message = await rl.question('Enter your message > ');
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };

  ask();

  socket.on('data', async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);

    const formattedData = data.toString('utf8');

    if (formattedData.substring(0, 2) === 'id') {
      id = formattedData.substring(3);
      console.log(`Your id is ${id}`);
    } else {
      console.log(data.toString('utf-8'));
    }
    ask();
  });
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

socket.on('end', () => {
  console.log('Connection end');
});
