import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

console.log(`Demo Solution: `);
run(demo);
console.log('');

console.log(`Puzzle Solution: `);
run(input);


function run(input) {
    const sequenceArray = createSequenceArray(input);

    const part1 = getPart1(sequenceArray);
    
    let boxArray = createBoxArray();
    boxArray = setupLenses(boxArray, sequenceArray);
    
    const part2 = getSum(boxArray);

    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function createSequenceArray(input) {
    return input.replaceAll('\r', '').replaceAll('\n', '').split(',');
}

function createBoxArray() {
    let boxArray = []
    for (let index = 0; index < 256; index++) {
        boxArray.push([]);
    }

    return boxArray;
}


function setupLenses(boxArray, sequenceArray) {
    for (let index = 0; index < sequenceArray.length; index++) {
        const sequence = sequenceArray[index];
    
        const { boxCode, label, operator, focal } = getSequenceInformation(sequence);
    
        if (operator === '-'){
            removeLens(boxArray, boxCode, label);
        }
        else {
            placeLens(boxArray, boxCode, label, focal);
        }    
    }

    return boxArray;
}


function getSum(boxArray) {
    let sum = 0;

    for (let boxIndex = 0; boxIndex < boxArray.length; boxIndex++) {
        const lenses = boxArray[boxIndex];

        for (let lensIndex = 0; lensIndex < lenses.length; lensIndex++) {
            const lens = lenses[lensIndex];

            let score = (boxIndex + 1) * (lensIndex + 1) * lens.focal;

            sum += score;
        }
    }

    return sum;
}


function removeLens(boxArray, boxCode, label) {
    let boxes = boxArray[boxCode];

    let newArray = [];

    for (let index = 0; index < boxes.length; index++) {
        const lens = boxes[index];

        if (lens.label !== label) {
            newArray.push(lens);
        }
    }

    boxArray[boxCode] = newArray;
}


function placeLens(boxArray, boxCode, label, focal) {
    let boxes = boxArray[boxCode];

    let alreadyIncludesLabel = false;

    for (let index = 0; index < boxes.length; index++) {
        const lens = boxes[index];

        if (lens.label == label) {
            lens.focal = focal;
            alreadyIncludesLabel = true;

            break;
        }
    }

    if (!alreadyIncludesLabel) {
        boxArray[boxCode].push(createLens(label, focal));
    }
}


function createLens(labelString, focalLength) {
    return { label: labelString, focal: focalLength };
}


function getSequenceInformation(string) {
    let label;
    let operator;
    let focal = undefined;

    if (string.includes('=')) {
        let x = string.split('=');

        label = x[0];

        operator = '=';
        focal = x[1];
    }
    else {
        let x = string.split('-');
        label = x[0];

        operator = '-';
    }

    let hashCode = getHashCode(label);

    return { boxCode: hashCode, label: label, operator: operator, focal: focal };
}


function getHashCode(string) {
    let currentValue = 0;

    for (let index = 0; index < string.length; index++) {
        const char = string[index];
        let code = char.charCodeAt(0);

        currentValue += code;
        currentValue *= 17;
        currentValue %= 256;
        
    }

    return currentValue;
}

function getPart1(sequenceArray) {
    let sum = 0;

    for (let index = 0; index < sequenceArray.length; index++) {
        const sequence = sequenceArray[index];
        
        sum += getHashCode(sequence);
    }

    return sum;
}
