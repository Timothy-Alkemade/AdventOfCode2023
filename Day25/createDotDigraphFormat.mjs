import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

// run(demo);
run(input);

function run(input) {
    const wires = parseInput(input);

    makeDotFormat(wires);
}

function makeDotFormat(wires) {
    let dot = "digraph G {\n";

    for (const wireName in wires) {
        const connections = wires[wireName];

        dot += `  ${wireName}`;
        dot += ` -> ${connections.join(",")}`
        dot += "\n"        
    }

    dot += "}"

    console.log(dot);
}



function parseInput(input) {
  input = input.replaceAll('\r', '').split('\n');

  let wires = {};
  
  for (let index = 0; index < input.length; index++) {
      let line = input[index];
      line = line.replaceAll(':', '');
      line = line.split(' ');

      wires[line[0]] = line.slice(1);
  }
  
  return wires;
}
