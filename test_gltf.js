import fs from 'fs';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

const buffer = fs.readFileSync('public/assets/lanyard/card.glb');
const arrayBuffer = toArrayBuffer(buffer);

const loader = new GLTFLoader();
loader.parse(arrayBuffer, '', (gltf) => {
    console.log("Successfully parsed GLTF");
}, (err) => {
    console.error("Error parsing:", err);
});
