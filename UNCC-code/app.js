import { Buffer } from 'buffer';

const allocateMemory = Buffer.alloc(4);

allocateMemory[0] = 0xff;
allocateMemory[1] = 0x34;
allocateMemory.writeInt8(-34, 2);
allocateMemory[3] = 0xf3;
// console.log(allocateMemory[0]);
// console.log(allocateMemory[1]);
// console.log(allocateMemory.readInt8(2));
// console.log(allocateMemory[3]);

// console.log(allocateMemory.toString('utf8'))

Buffer.allocUnsafe(100);
Buffer.allocUnsafeSlow(100);

// Buffer.from([]);
// Buffer.concat([]);

const buff = Buffer.from('6869', 'hex');
console.log(buff.toString('utf-8'));
