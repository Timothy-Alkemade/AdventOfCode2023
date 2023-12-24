import { MaxHeap } from "./MaxHeap.mjs"; 
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


function run (input) {
    let input2DArray = create2DArray(input);
    
    let longestPaths = calculateLongestPath(input2DArray);

    console.log(`Part1: ${longestPaths.remove().weight}`);
}


function createNode(weight, row, column, rowDir, columnDir) {
    return { weight: weight, row: row, column: column, rowDir: rowDir, columnDir: columnDir};
}


function createSeenNode(weight, row, column, rowDir, columnDir) {
    return { weight: weight, row: row, column: column, rowDir: rowDir, columnDir: columnDir};
}


function calculateLongestPath(input2DArray) {
    let seen = new Set();

    let priorityQueue = new MaxHeap();

    priorityQueue.add(createNode(0, 0, 1, 0, 1));
    priorityQueue.add(createNode(0, 0, 1, 0, 1));

    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    let posPaths = new MaxHeap();

    while (!priorityQueue.isEmpty()) {
        let currentNode = priorityQueue.remove();

        let { weight, row, column, rowDir, columnDir } = currentNode;

        let allowedDirections = directions;
    
        // endpoint
        if (row === input2DArray.length - 1 && column == input2DArray[0].length - 2) {
            posPaths.add(currentNode);
            continue;
        }
    
        if (isInSet(seen, createSeenNode(weight, row, column, rowDir, columnDir))) {
            continue;
        }
    
        seen.add(createSeenNode(weight, row, column, rowDir, columnDir));

        let token = input2DArray[row][column];
        if (token === '.') {
            allowedDirections = directions;
        }
        else if (token === '>') {
            allowedDirections = [[0, 1]];
        }
        else if (token === 'v') {
            allowedDirections = [[1, 0]];
        }
        else if (token === '<') {
            allowedDirections = [[0, -1]];
        }
        else if (token === '^') {
            allowedDirections = [[-1, 0]];
        }
    
        // Go straight if allowed
        if (allowedDirections.length > 1 || (allowedDirections[0][0] === rowDir && allowedDirections[0][1] === columnDir)) {
            let nextRow = row + rowDir;
            let nextColumn = column + columnDir;
    
            if (validGridIndexes(input2DArray, nextRow, nextColumn)) {
                priorityQueue.add(createNode(weight + 1, nextRow, nextColumn, rowDir, columnDir));
            }
        }

        // Turn if allowed
        for (let direction of allowedDirections) {
            let nextRowDirection = direction[0];
            let nextColumnDirection = direction[1];
    
            // Skip same direction (already done above) and reverse direction (cannot reverse)
            if (
                (nextRowDirection === rowDir && nextColumnDirection === columnDir) ||
                (nextRowDirection === -rowDir && nextColumnDirection === -columnDir)
            ) {
                continue;
            }
    
            let nextRow = row + nextRowDirection;
            let nextColumn = column + nextColumnDirection;
    
            if (validGridIndexes(input2DArray, nextRow, nextColumn)) {
                priorityQueue.add(createNode(weight + 1, nextRow, nextColumn, nextRowDirection, nextColumnDirection));
            }
        }
        
    }

    return posPaths;
}


function validGridIndexes(input2DArray, rowIndex, columnIndex) {
    if (rowIndex < 0 || rowIndex >= input2DArray.length || columnIndex < 0 || columnIndex >= input2DArray[0].length) {
        return false;
    }

    if (input2DArray[rowIndex][columnIndex] === '#') {
        return false;
    }

    return true;
}


function create2DArray(input) {
    return input.replaceAll('\r', '').split('\n').map(e => e.split(''));
}


function isInSet(set, unseen) {
    const values = [...set.values()];

    for (let index = 0; index < values.length; index++) {
        const value = values[index];

        if (isEqual(value, unseen)) {
            return true;
        }
    }

    return false;
}


function isEqual(node1, node2) {
    if (
            node1.weight === node2.weight &&
            node1.row === node2.row &&
            node1.column === node2.column &&
            node1.rowDir === node2.rowDir &&
            node1.columnDir === node2.columnDir
        ) {
            return true;
        }

    return false;
}
