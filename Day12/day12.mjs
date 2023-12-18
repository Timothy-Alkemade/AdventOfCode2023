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
    let inputLines = input.split('\n').map(e => e.split(' '));

    let part1 = solve(inputLines);

    let unfolded = unfoldInput(inputLines);
    let part2 = solve(unfolded);

    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function unfoldInput(inputLines) {
    for (let index = 0; index < inputLines.length; index++) {
        let line = inputLines[index];

        line[0] = Array(5).fill(line[0]).join('?'); 
        line[1] = Array(5).fill(line[1]).join(',');
    }

    return inputLines;
}


function solve(input) {
    let cache = {};

    let counter = 0;
    for (let index = 0; index < input.length; index++) {
        const line = input[index];
        const springsLine = line[0];
        const groupNumbers = line[1].split(',').map(Number);

        let sum = countSprings(springsLine, groupNumbers, cache);
        counter += sum;

        // EMPTY CACHE - Cache will get corrupt with seemingly too many keys
        cache = {}
    }

    return counter;
}


function countSprings(springsString, groupNumbers, cache) {
    if (springsString.length === 0) {
        if (groupNumbers.length === 0) {
            return 1;
        }
        else {
            return 0;
        }
    }

    if (groupNumbers.length === 0) {
        if (springsString.includes('#')) {
            return 0;
        }
        else {
            return 1;
        }
    }

    let key = springsString + groupNumbers.join('');

    if (key in cache) {
        return cache[key];
    }

    let result = 0;

    if (['.', '?'].includes(springsString[0])) {
        let springsArray = springsString.split('');
        springsArray.shift();
        let newString = springsArray.join('');

        result += countSprings(newString, groupNumbers.slice(), cache);
    }

    if (['#', '?'].includes(springsString[0])) {
        if (groupNumbers[0] <= springsString.length && !hasXStartingDots(springsString, groupNumbers[0]) &&
            (groupNumbers[0] === springsString.length || springsString[groupNumbers[0]] !== '#')  ) {
                let sliced = sliceString(springsString, groupNumbers[0] + 1);

                let copyNums = groupNumbers.slice();
                copyNums.shift();

                result += countSprings(sliced, copyNums, cache);
            }

    }

    cache[key] = result;

    return result;
}


function hasXStartingDots(springsString, amountOfStartingChars) {
    for (let index = 0; index < amountOfStartingChars; index++) {
        const char = springsString[index];

        if (char === '.') {
            return true;
        }
        
    }

    return false;
}


function sliceString(springsString, numToBeSliced) {
    let springArray = springsString.split('');

    for (let index = 0; index < numToBeSliced; index++) {
        springArray.shift();        
    }

    return springArray.join('');
}

