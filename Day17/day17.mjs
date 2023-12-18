import { PriorityQueue } from "./PriorityQueue.mjs";
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Input takes a long time to run - uncomment line to run
// const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

console.log(`Demo Solution: `);
run(demo);
console.log('');

// Input takes a long time to run - uncomment line to run
// console.log(`Puzzle Solution: `);
// run(input);
// console.log('');


function run(input) {
    let input2DArray = input.replaceAll('\r', '').split('\n').map(line => line.split('').map(Number));

    let part1Min = calculateShortestPath(input2DArray, 0, 3);
    let part2Min = calculateShortestPath(input2DArray, 4, 10);

    console.log("Part1: ")
    console.log(part1Min);

    console.log("Part2: ")
    console.log(part2Min);
}


function calculateShortestPath(input2DArray, minStepsInArow, maxStepsInARow) {
    let seen = new Set();

    let priorityQueue = new PriorityQueue();
    priorityQueue.push(createNode(0, 0, 0, 0, 0, 0));

    let directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    while (!priorityQueue.isEmpty()) {
        let currentNode = priorityQueue.pop();

        let { weight, row, column, rowDir, columnDir, steps } = currentNode;
    
        if (row === input2DArray.length - 1 && column == input2DArray[0].length - 1 && steps >= minStepsInArow) {
            return weight;
        }
    
        if (isInSet(seen, createSeenNode(row, column, rowDir, columnDir, steps))) {
            continue;
        }
    
        seen.add(createSeenNode(row, column, rowDir, columnDir, steps));
    
        // Go straight with limit
        if (steps < maxStepsInARow && !standingStill(rowDir, columnDir))
        {
            let nextRow = row + rowDir;
            let nextColumn = column + columnDir;
    
            if (validGridIndexes(input2DArray, nextRow, nextColumn)) {
                let foundWeight = input2DArray[nextRow][nextColumn];
                priorityQueue.push(createNode(weight + foundWeight, nextRow, nextColumn, rowDir, columnDir, steps + 1));
    
            }
        }
    
        // Turn
        if (steps >= minStepsInArow || standingStill(rowDir, columnDir)) {
            for (let direction of directions) {
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
                    let foundWeight = input2DArray[nextRow][nextColumn];
                    priorityQueue.push(createNode(weight + foundWeight, nextRow, nextColumn, nextRowDirection, nextColumnDirection, 1));
                }
            }
        }
    }
}


function standingStill(rowDir, columnDir) {
    if (rowDir === 0 && columnDir === 0) {
        return true;
    }

    return false;
}


function validGridIndexes(input2DArray, rowIndex, columnIndex) {
    if (rowIndex < 0 || rowIndex >= input2DArray.length || columnIndex < 0 || columnIndex >= input2DArray[0].length) {
        return false;
    }

    return true;
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
            node1.row === node2.row &&
            node1.column === node2.column &&
            node1.rowDir === node2.rowDir &&
            node1.columnDir === node2.columnDir &&
            node1.steps === node2.steps
        ) {
            return true;
        }

    return false;
}


function createNode(weight, row, column, rowDir, columnDir, steps) {
    return { weight: weight, row: row, column: column, rowDir: rowDir, columnDir: columnDir, steps: steps };
}


function createSeenNode(row, column, rowDir, columnDir, steps) {
    return { row: row, column: column, rowDir: rowDir, columnDir: columnDir, steps: steps };
}
