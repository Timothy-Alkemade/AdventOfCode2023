import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

console.log(`Demo Solution: `);
run(demo, true);
console.log('');

console.log(`Puzzle Solution: `);
run(input, false);


// GraphViz used as a visualizer to identify some wirenames which split the group to reduce combinations of triples-possibilities
function run(input, bUseDemoWires) {
    let wires = parseInput(input);

    let wireCombinations = getAllWireCombos(wires);

    // let wireTriples = getAllTriples(wireCombinations);

    for (let index = 0; index < wireCombinations.length; index++) {
        const wireCombo = wireCombinations[index];

        let wire1;
        let wire2;
        let wire3 = wireCombo;

        if (bUseDemoWires) {
            // DEMO Wires to disconnect
            wire1 = ["hfx", "pzl"];
            wire2 = ["bvb", "cmg"];
            wire3 = ["nvd", "jqt"];
        }
        else {
            // Puzzle Wires
            wire1 = ["mrd", "rjs"];
            wire2 = ["gsk", "ncg"];
            // let wire3 = ["gmr", "ntx"];
        }
        
        let copyOfWires = disconnectWires(wires, wire1, wire2, wire3);

        let count = countGroups(copyOfWires);

        if (count > 0) {
            console.log(`Solution: ${count}`)

            if (!bUseDemoWires) {
                console.log(`Found wire: ${wire3}`);
            }

            break;
        }
    }
}


function getAllTriples(wireCombinations) {
    let triples = [];

    for (let index = 0; index < wireCombinations.length; index++) {
        const wire1 = wireCombinations[index];

        for (let j = index + 1; j < wireCombinations.length; j++) {
            const wire2 = wireCombinations[j];

            for (let k = index + 2; k < wireCombinations.length; k++) {
                const wire3 = wireCombinations[k];

                let triple = [];
                triple.push(wire1);
                triple.push(wire2);
                triple.push(wire3);
                
                triples.push(triple);
            }
        }
    }

    return triples;
}


function getAllWireCombos(wires) {
    let combos = [];

    let allWireNames = Object.keys(wires);

    // Get all possibilities between wireNames
    for (let index = 0; index < allWireNames.length; index++) {
        const wire1 = allWireNames[index];

        for (let j = index + 1; j < allWireNames.length; j++) {
            const wire2 = allWireNames[j];

            let pair = [];
            pair.push(wire1);
            pair.push(wire2);
            combos.push(pair);
        }
    }

    // Remove invalid combinations which do not exist as connections
    for (let index = combos.length - 1; index >= 0; index--) {
        const pair = combos[index];
        let wire1 = pair[0];
        let wire2 = pair[1];

        if ((wires[wire1] !== undefined && wires[wire1].includes(wire2)) && (wires[wire2] !== undefined && wires[wire2].includes(wire1))) {
            continue;
        }

        combos.splice(index, 1);
    }

    return combos;
}


function countGroups(wires) {
    let setA = new Set();
    let setB = new Set();

    addWires(setA, "jqt", wires);

    let objectKeys = Object.keys(wires);

    for (let index = 0; index < objectKeys.length; index++) {
        let wireName = objectKeys[index];

        if (!setA.has(wireName)) {
            addWires(setB, wireName, wires);
            break;
        }
        
    }

    if (setB.size === 0) {
        return 0;
    }

    for (let index = 0; index < objectKeys.length; index++) {
        let wireName = objectKeys[index];

        if (!setA.has(wireName) && !setB.has(wireName)) {
            return 0;
        }
        
    }

    return setA.size * setB.size;
}


function addWires(set, wireName, wires) {

    set.add(wireName);

    let wireSet = wires[wireName];

    for (let index = 0; index < wireSet.length; index++) {
        let wireElement = wireSet[index];

        if (!set.has(wireElement)) {
            set.add(wireElement);
            addWires(set, wireElement, wires);
        }
    }
}


function disconnectWires(wiresOriginal, wire1, wire2, wire3) {
    let wires = JSON.parse(JSON.stringify(wiresOriginal));

    let index11 = wires[wire1[0]].indexOf(wire1[1]);
    wires[wire1[0]].splice(index11, 1);

    let index12 = wires[wire1[1]].indexOf(wire1[0]);
    wires[wire1[1]].splice(index12, 1);


    let index21 = wires[wire2[0]].indexOf(wire2[1]);
    wires[wire2[0]].splice(index21, 1);

    let index22 = wires[wire2[1]].indexOf(wire2[0]);
    wires[wire2[1]].splice(index22, 1);


    let index31 = wires[wire3[0]].indexOf(wire3[1]);
    wires[wire3[0]].splice(index31, 1);

    let index32 = wires[wire3[1]].indexOf(wire3[0]);
    wires[wire3[1]].splice(index32, 1);

    return wires;
}


function parseInput(input) {
    input = input.replaceAll('\r', '').split('\n');

    let wires = {};
    
    for (let index = 0; index < input.length; index++) {
        let line = input[index];
        line = line.replaceAll(':', '');
        line = line.split(' ');

        if (wires[line[0]] === undefined) {
            wires[line[0]] = [];
        }

        wires[line[0]] = wires[line[0]].concat(line.slice(1));

        for (let j = 1; j < line.length; j++) {
            const wire2 = line[j];

            if (wires[wire2] === undefined) {
                wires[wire2] = [];
            }
            wires[wire2].push(line[0]);
        }
    }
    
    return wires;
}
