import fs from 'fs/promises';

(async () => {
  try {
    //command
    const CREATE_FILE = 'create a file';
    const RENAME_FILE = 'rename a file';
    const DELETE_FILE = 'delete a file';
    const ADD_TO_FILE = 'add to a file';

    let existingFileHandler;
    const createFileFn = async (path) => {
      try {
        existingFileHandler = await fs.open(path, 'r');
        existingFileHandler.close();
        console.log(`File with this path ${path} already exists`);
      } catch (error) {
        console.log(`New file created`);
        const newFileHandler = await fs.open(path, 'w');
        newFileHandler.close();
      }
    };

    const deleteFileFn = async (path) => {
      try {
        await fs.unlink(path);
        console.log(`The file with path ${path} was deleted`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return console.log('No file at this path to remove');
        }
        console.error('there was an error:', error.message);
      }
    };

    const renameFileFn = async (oldPath, newPath) => {
      try {
        await fs.rename(oldPath, newPath);
        console.log(`The file renamed from ${oldPath} to ${newPath}`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          return console.log('No file at this path to rename');
        }
        console.error('there was an error:', error.message);
      }
    };

    let addedContent;
    const addToFileFn = async (path, data) => {
      try {
        if (addedContent === data) return;
        await fs.appendFile(path, data);
        addedContent = data;
        console.log(`Added data to this file: ${path} successfully`);
      } catch (error) {
        console.error('there was an error:', error.message);
      }
    };

    const commandFileHandler = await fs.open('./command.txt', 'r');

    // watching for file changes
    const watcher = fs.watch('./command.txt');

    // listening for the file changes
    commandFileHandler.on('change', async () => {
      const fileSize = (await commandFileHandler.stat()).size;

      // offset = start point on buffer, length = fileSize position,
      // position =  the position at which we start to copy in the file
      const offset = 0;
      const length = fileSize;
      const position = 0;

      const buffer = Buffer.alloc(fileSize);

      await commandFileHandler.read(buffer, offset, length, position);
      const command = buffer.toString('utf-8');

      //create a file
      //create a file <path>

      if (command.includes(CREATE_FILE)) {
        const path = command.substring(CREATE_FILE.length + 1);
        console.log(path);
        createFileFn(path);
      }

      //delete a file
      //delete a file <path>
      if (command.includes(DELETE_FILE)) {
        const path = command.substring(DELETE_FILE.length + 1);
        deleteFileFn(path);
      }

      //rename a file
      //rename a file <oldPath> <newPath>
      if (command.includes(RENAME_FILE)) {
        const combinedPath = command.substring(RENAME_FILE.length + 1);
        const oldPath = combinedPath.split(' ')[0];
        const newPath = combinedPath.split(' ')[1];
        renameFileFn(oldPath, newPath);
      }

      //add to a file
      // add to a file <path> content: <content>
      if (command.includes(ADD_TO_FILE)) {
        const _splitIndex = command.indexOf(' content: ');
        const content = command.substring(_splitIndex + 10);
        const path = command.substring(ADD_TO_FILE.length + 1, _splitIndex);
        addToFileFn(path, content);
      }
    });

    for await (const event of watcher) {
      if (event.eventType === 'change') {
        commandFileHandler.emit('change');
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
