import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

// console.log(`Demo Solution: `);
// run(demo);
// console.log('');

console.log(`Puzzle Solution: `);
run(input);

function run (input) {
    let input2DArray = get2DArray(input);

    let startNode = getStartingPosition(input2DArray);

    let gardenGrid = parseGardens(input2DArray);

    let positionsDic = getPositionDic(gardenGrid);

    let part1 = getGardens(gardenGrid, startNode, positionsDic, 64);
    console.log(`Part1: ${part1}`);

    let values1 = getGardens(gardenGrid, startNode, positionsDic, 65);
    let values2 = getGardens(gardenGrid, startNode, positionsDic, 65 + 131);
    let values3 = getGardens(gardenGrid, startNode, positionsDic, 65 + 131 * 2);


    // Solve x for: f(65) + f(65 + 131) + f(65 + 262)
    // Fill into wolframalpha: f(65) + f(65 + 131) x + f(65 + 262) x^2, x = 202300
    // Fill into wolframalpha: f(65) + f(196) x + f(327) x^2, x = 202300
    // wolframalpha: quadratic fit calculator
    // {{0,3691},{1,32975}, {2,91439}}
    // 3691 + 14694 x + 14590 x^2, x = 202300

    let simplifiedLagrange = (values) => {
        return {
            a: values[0] / 2 - values[1] + values[2] / 2,
            b: -3 * (values[0] / 2) + 2 * values[1] - values[2] / 2,
            c: values[0],
        };
    };

    let values = [values1, values2, values3];
    let poly = simplifiedLagrange(values);
    let target = (26501365 - 65) / 131;
    let part2 = poly.a * target * target + poly.b * target + poly.c;

    console.log(`Part2: ${part2}`);
}


function makeKey(node) {
    return "" + node.row + "," + node.column;
}


function getGardens(gardenGrid, startNode, positionsDic, steps) {
    let destinations = new Set();
    destinations.add(makeKey(startNode));

    let gardenLength = gardenGrid.length;

    let newDestinations = new Set();

    for (let n = 0; n < steps; n++) {

        for (const key of destinations.values()) {
            let node = key.split(',');
            let og_row = Number(node[0]);
            let og_column = Number(node[1]);

            let row = og_row % gardenLength;
            if (row < 0) {
                row = row + gardenLength;
            }

            let column = og_column % gardenLength;
            if (column < 0) {
                column = column + gardenLength;
            }

            let directions = positionsDic[row][column];

            for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
                const direction = directions[dirIndex];

                let newRow = og_row + direction[0];
                let newColumn = og_column + direction[1];

                addUniqueInSet(newDestinations, createNode(newRow, newColumn, true));
            }
        }

        destinations = newDestinations;
        newDestinations = new Set();
    }

    return destinations.size;
}


function printArray(array) {

    let str = "";

    for (let index = 0; index < array.length; index++) {
        const element = array[index];

        str = str + ',' + element;
        
    }

    console.log(str);

}


function addUniqueInSet(destinations, node) {
    destinations.add(makeKey(node));
}


function getPositionDic(gardenGrid) {
    let positions = {};

    let directions = { R: [0, 1], L: [0, -1], U: [1, 0], D: [-1, 0] };


    for (let index = 0; index < gardenGrid.length; index++) {
        const line = gardenGrid[index];

        for (let j = 0; j < line.length; j++) {
            const node = line[j];

            if (node.isGardenPlot) {

                for (const key in directions) {
                    const direction = directions[key];

                    let newRow = node.row + direction[0];
                    let newColumn = node.column + direction[1];

                    if (!isValidIndexes(gardenGrid, newRow, newColumn)) {
                        addDirection(positions, index, j, direction);
                    }
                    else {
                        if (gardenGrid[newRow][newColumn].isGardenPlot) {
                            addDirection(positions, index, j, direction);
                        }
                    }
                }
            }
        }
    }

    return positions;
}


function addUniqueDirection(array, direction) {
    for (let index = 0; index < array.length; index++) {
        const existingDirection = array[index];

        if (existingDirection[0] === direction[0] && existingDirection[1] === direction[1]) {
            return;
        }
    }

    array.push(direction);
}


function addDirection(positions, newRow, newColumn, direction) {

    if (positions[newRow] === undefined) {
        positions[newRow] = {};
    }

    if (positions[newRow][newColumn] === undefined) {
        positions[newRow][newColumn] = [];
    }

    addUniqueDirection(positions[newRow][newColumn], direction);
}


function isValidIndexes(gardenGrid, row, column) {
    if (row < 0 || row >= gardenGrid.length || column < 0 || column >= gardenGrid[0].length) {
        return false;
    }
    return true;
}


function get2DArray(input) {
    return input.replaceAll('\r', '').split('\n').map(e => e.split(''));
}


function getStartingPosition(input2DArray) {
    for (let index = 0; index < input2DArray.length; index++) {
        const line = input2DArray[index];

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === 'S') {
                return createNode(index, j, true);
            }
        }    
    }
}


function parseGardens(input2DArray) {
    let newArray = [];
    for (let index = 0; index < input2DArray.length; index++) {
        newArray.push([]);
    }

    for (let index = 0; index < input2DArray.length; index++) {
        const line = input2DArray[index];

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            if (char === '.' || char === 'S') {
                newArray[index].push(createNode(index, j, true));
            }
            else {
                newArray[index].push(createNode(index, j, false));
            }
        }
    }

    return newArray;
}


function createNode(row, column, bIsGardenPlot) {
    return { row: row, column: column, isGardenPlot: bIsGardenPlot };
}
