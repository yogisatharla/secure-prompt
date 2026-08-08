const fs = require('fs');
const buffer = fs.readFileSync('public/assets/lanyard/card.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
const json = JSON.parse(jsonString);
console.log(JSON.stringify(json.bufferViews, null, 2));
console.log('Total BIN size:', 2452976);
