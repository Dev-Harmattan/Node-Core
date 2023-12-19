// import EventEmitter from 'events';
import EventEmitter from './events.js';

// class Emitter extends EventEmitter {}

const myEvent = new EventEmitter();

myEvent.on('message', (x) => {
  console.log('An event has been received from ', x);
});

myEvent.once('onMessage', (x) => {
  console.log('An event has been received from ', x);
});

myEvent.on('status', (status, message) => {
  console.log(`The status code ${status} and the ${message}`);
});

myEvent.emit('status', 200, 'Success');
