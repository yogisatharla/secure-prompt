const fs = require('fs');
const buffer = fs.readFileSync('public/assets/lanyard/card.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonString = buffer.toString('utf8', 20, 20 + chunkLength);
const json = JSON.parse(jsonString);

let outOfBounds = false;
for (let i = 0; i < json.accessors.length; i++) {
    const acc = json.accessors[i];
    const bv = json.bufferViews[acc.bufferView];
    if (!bv) continue;
    // accessor size depends on componentType and type
    const COMPONENT_TYPES = { 5120: 1, 5121: 1, 5122: 2, 5123: 2, 5125: 4, 5126: 4 };
    const TYPES = { "SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4, "MAT2": 4, "MAT3": 9, "MAT4": 16 };
    const byteSize = (COMPONENT_TYPES[acc.componentType] || 1) * (TYPES[acc.type] || 1);
    const totalSize = acc.count * byteSize;
    const offset = acc.byteOffset || 0;
    
    if (offset + totalSize > bv.byteLength) {
        console.log(`Accessor ${i} out of bounds! offset: ${offset}, totalSize: ${totalSize}, bv.byteLength: ${bv.byteLength}`);
        outOfBounds = true;
    }
}
if (!outOfBounds) console.log("All accessors are within bounds!");
