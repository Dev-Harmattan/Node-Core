import EventEmitter from 'events';

class WithTime extends EventEmitter {
  execute(asyncFunc, ...args) {
    this.emit('begin');
    console.time('execute');
    this.on('data', (data) => console.log('Got data ', data));
    asyncFunc(...args, (err, data) => {
      if (err) {
        return this.emit('error');
      }
      this.emit('data', data);
      console.time('execute');
      this.emit('end');
    });
  }
}

const readFile = (url, callback) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      callback(null, data);
    })
    .catch((err) => {
      callback(err, null);
    });
};

const withTime = new WithTime();

withTime.on('begin', () => console.log('Begin the execution'));
withTime.on('end', () => console.log('End the execution'));
withTime.on('error', () => console.log('An error occurred'));





withTime.execute(
  readFile,
  'https://jsonplaceholder.typicode.com/todos/1'
);
