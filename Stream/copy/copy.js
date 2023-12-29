import fs from 'fs/promises';

(async () => {
  try {
    const readFileHandle = await fs.open('src.txt', 'r');
    const writeFileHandle = await fs.open('text.txt', 'w');
    let byteRead = -1;

    while (byteRead !== 0) {
      const readResult = await readFileHandle.read();
      byteRead = readResult.bytesRead;

      if (byteRead !== 16384) {
        const indexNotFill = readResult.buffer.indexOf(0);
        const newBuffer = Buffer.alloc(indexNotFill);
        readResult.buffer.copy(newBuffer, 0, 0, indexNotFill);
        writeFileHandle.write(newBuffer);
      } else {
        writeFileHandle.write(readResult.buffer);
      }
    }
  } catch (error) {}
})();
