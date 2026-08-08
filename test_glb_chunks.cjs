const fs = require('fs');
const buffer = fs.readFileSync('public/assets/lanyard/card.glb');

let offset = 12; // after 12-byte header
let chunkIndex = 0;
while (offset < buffer.length) {
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.toString('utf8', offset + 4, offset + 8);
    console.log(`Chunk ${chunkIndex}: type=${chunkType}, length=${chunkLength}, offset=${offset}`);
    offset += chunkLength + 8;
    chunkIndex++;
}

console.log('Final offset:', offset, 'Buffer length:', buffer.length);
