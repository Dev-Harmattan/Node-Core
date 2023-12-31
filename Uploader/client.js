import net from 'net';
import fs from 'fs/promises';
import path from 'path';

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
const socket = net.createConnection({ port: 3050, host: '::1' }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(filePath, 'r');
  const fileReadStream = fileHandle.createReadStream();
  const dataSize = (await fileHandle.stat()).size;
  let uploadedBytes = 0;
  let uploadedPercentage = 0;

  socket.write(`fileName: ${fileName}-------`);

  console.log();
  fileReadStream.on('data', async (data) => {
    if (!socket.write(data)) {
      fileReadStream.pause();
    }
    uploadedBytes += data.length;
    let newPercentage = Math.floor((uploadedBytes / dataSize) * 100);

    if (newPercentage !== uploadedPercentage && newPercentage <= 100) {
      uploadedPercentage = newPercentage;
      await moveCursor(0, -1);
      await clearLine(0);
      console.log(`Uploading...${uploadedPercentage}%`);
    }
  });

  socket.on('drain', () => {
    fileReadStream.resume();
  });

  fileReadStream.on('end', () => {
    socket.end();
  });
});
