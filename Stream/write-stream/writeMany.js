import fs from 'fs/promises';

(async () => {
  try {
    console.time('TotalTime');
    const fileHandle = await fs.open('gigantic.txt', 'w');
    const writeStream = fileHandle.createWriteStream();

    let i = 0;
    let fileLength = 100000000;
    const writeCall = () => {
      while (i < fileLength) {
        const buff = Buffer.from(` ${i} `, 'utf-8');
        i++;
        if (i === fileLength - 1) {
          writeStream.end(buff);
          return;
        }
        if (!writeStream.write(buff)) break;
      }
    };
    writeCall();
    writeStream.on('drain', () => {
      writeCall();
    });

    writeStream.on('finish', () => {
      console.timeEnd('TotalTime');
      fileHandle.close();
    });
  } catch (error) {
    console.error(error.message);
  }
})();
