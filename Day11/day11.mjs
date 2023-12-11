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


function run(inputText) {
    const expandSizePart1 = 2;
    const expandSizePart2 = 1000000;
    
    const { galaxies, emptyRowIndexes, emptyColumnIndexes} = findGalaxies(inputText);

    const part1 = getSolution(galaxies, emptyRowIndexes, emptyColumnIndexes, expandSizePart1);
    const part2 = getSolution(galaxies, emptyRowIndexes, emptyColumnIndexes, expandSizePart2);
    
    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function findGalaxies(inputText) {
    const inputLines = inputText.split('\n');
    const input2DArray = inputLines.map(line => line.split(''));

    const galaxyRegex = /#/g;

    const emptyRowIndexes = [];
    const emptyColumnIndexes = [];
    const galaxies = [];

    for (let index = 0; index < input2DArray.length; index++) {
        const line = inputLines[index];
        const foundGalaxies = [...line.matchAll(galaxyRegex)];
        foundGalaxies.forEach(galaxy => {
            galaxies.push(createGalaxy(index, galaxy.index));
        })
        
        if (foundGalaxies.length === 0) {
            emptyRowIndexes.push(index);
        }
    }

    for (let columnNumber = 0; columnNumber < input2DArray[0].length; columnNumber++) {
        const column = input2DArray.map((line) => line[columnNumber]);
        if (!containsGalaxy(column)) {
            emptyColumnIndexes.push(columnNumber);
        }
    }


    return { galaxies: galaxies, emptyRowIndexes: emptyRowIndexes, emptyColumnIndexes: emptyColumnIndexes};
}


function createGalaxy(line, position) {
    return { line: line, pos: position};
}


function containsGalaxy(array) {
    return array.includes("#");
}


function getSolution(galaxies, emptyRowIndexes, emptyColumnIndexes, expandSize) {
    const expandedGalaxies = expandUniverse(galaxies, emptyRowIndexes, emptyColumnIndexes, expandSize);
    const pairs= createPairs(expandedGalaxies);
    return calculateSumOfDistances(pairs);
}


function expandUniverse(galaxies, emptyRowIndexes, emptyColumnIndexes, expandSize) {
    const expandedGalaxies = [];

    for (let index = 0; index < galaxies.length; index++) {
        const galaxy = galaxies[index];
    
        const verShift = emptyRowIndexes.filter(el => el < galaxy.line).length;
        const horShift = emptyColumnIndexes.filter(el => el < galaxy.pos).length;
    
        const expandedLine = galaxy.line + verShift * (expandSize - 1);
    
        const expandedPos = galaxy.pos + horShift * (expandSize - 1);

        expandedGalaxies.push(createGalaxy(expandedLine, expandedPos));
    }

    return expandedGalaxies;
}


function createPairs(galaxies) {
    const pairs = [];

    for (let index = 0; index < galaxies.length - 1; index++) {
        const galaxy1 = galaxies[index];
    
        for (let j = index + 1; j < galaxies.length; j++) {
            const galaxy2 = galaxies[j];
    
            pairs.push([galaxy1, galaxy2]);
        }
    }

    return pairs;
}


function calculateSumOfDistances(pairs) {
    let sum = 0;

    pairs.forEach(pair => {
        const distance = calculateDistance(pair[0], pair[1]);
        sum += distance; 
    });

    return sum;
}


function calculateDistance(galaxy1, galaxy2) {
    let horizontalDistance = Math.abs(galaxy2.line - galaxy1.line);
    let verrticalDistance = Math.abs(galaxy2.pos - galaxy1.pos);

    return horizontalDistance + verrticalDistance;
}
