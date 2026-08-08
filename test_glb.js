const fs = require('fs');
const buffer = fs.readFileSync('public/assets/lanyard/card.glb');
const magic = buffer.toString('utf8', 0, 4);
const version = buffer.readUInt32LE(4);
const length = buffer.readUInt32LE(8);
console.log({ magic, version, length, fileSize: buffer.length });
