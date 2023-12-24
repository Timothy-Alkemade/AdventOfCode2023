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

    let startingPoint = createPoint(0, 1);
    let endPoint = createPoint(input2DArray.length - 1, input2DArray[0].length - 2);

    let intersectionPoints = getIntersectionPointsInGrid(input2DArray);
    intersectionPoints.unshift(endPoint);
    intersectionPoints.unshift(startingPoint);

    let graphPart1 = getGraph(input2DArray, intersectionPoints, true);
    let graphPart2 = getGraph(input2DArray, intersectionPoints, false);

    let seen = new Set();
    let part1 = depthFirstSearch(startingPoint, graphPart1, seen, endPoint);

    seen = new Set();
    let part2 = depthFirstSearch(startingPoint, graphPart2, seen, endPoint);

    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function depthFirstSearch(point, graph, seen, endPoint) {
    if (pointIsEqual(point, endPoint)) {
        return 0;
    }

    let pathLength = -Infinity;

    seen.add(point.key);
    for (const nextPointkey in graph[point.key]) {
        if (!seen.has(nextPointkey)) {
            let nextPoint = makePointOfKey(nextPointkey);
            pathLength = Math.max(pathLength, depthFirstSearch(nextPoint, graph, seen, endPoint) + graph[point.key][nextPointkey]);
        }
    }
    seen.delete(point.key);

    return pathLength;
}


function getGraph(input2DArray, intersectionPoints, bPart1) {
    let graph = {};
    for (let index = 0; index < intersectionPoints.length; index++) {
        let key = intersectionPoints[index].key;
        graph[key] = {};
    }

    let directions = { 
        '^': [[-1, 0]],
        '>': [[0, 1]],
        '<': [[0, -1]],
        'v': [[1, 0]],
        '.': [[0, 1], [1, 0], [0, -1], [-1, 0]]
    };

    for (let index = 0; index < intersectionPoints.length; index++) {
        let currentPoint = intersectionPoints[index];

        let stack = [createNode(0, currentPoint.row, currentPoint.column)];
        let seen = new Set();
        seen.add(currentPoint.key);

        while (stack.length !== 0 ){
            let currentNode = stack.shift();

            if (currentNode.weight !== 0 && isAnIntersectionPoint(intersectionPoints, currentNode.row, currentNode.column)) {
                graph[currentPoint.key][currentNode.key] = currentNode.weight;
                continue;
            }

            let token = '.';
            if (bPart1) {
                token = input2DArray[currentNode.row][currentNode.column];
            }
            let allowedDirections = directions[token];
            for (let direction of allowedDirections) {
                let nextRow = currentNode.row + direction[0];
                let nextColumn = currentNode.column + direction[1];
                if (validPathIndexes(input2DArray, nextRow, nextColumn) && !seen.has(createPoint(nextRow, nextColumn).key)) {
                    stack.push(createNode(currentNode.weight + 1, nextRow, nextColumn));
                    seen.add(createPoint(nextRow, nextColumn).key);
                }
            }
        }
    }

    return graph;
}


function isAnIntersectionPoint(intersectionPoints, row, column) {
    for (let index = 0; index < intersectionPoints.length; index++) {
        let intersectionPoint = intersectionPoints[index];

        if (intersectionPoint.row === row && intersectionPoint.column === column) {
            return true;
        }
    }

    return false;
}


function getIntersectionPointsInGrid(input2DArray) {
    let intersectionPoints = [];

    for (let rowNr = 0; rowNr < input2DArray.length; rowNr++) {
        const line = input2DArray[rowNr];

        for (let columnNr = 0; columnNr < line.length; columnNr++) {
            const char = line[columnNr];

            if (char === '#') {
                continue;
            }

            let neighbours = 0;
            let neighboursArray = [[rowNr - 1, columnNr], [rowNr + 1, columnNr], [rowNr, columnNr - 1], [rowNr, columnNr + 1]];

            for (let n = 0; n < neighboursArray.length; n++) {
                let neighbourRow = neighboursArray[n][0];
                let neighbourColumn = neighboursArray[n][1];

                if (validPathIndexes(input2DArray, neighbourRow, neighbourColumn)) {
                    neighbours++;
                }
            }

            // valid intersection
            if (neighbours >= 3) {
                intersectionPoints.push(createPoint(rowNr, columnNr))
            }
        }
    }

    return intersectionPoints;
}


function validPathIndexes(input2DArray, rowIndex, columnIndex) {
    if (rowIndex < 0 || rowIndex >= input2DArray.length || columnIndex < 0 || columnIndex >= input2DArray[0].length) {
        return false;
    }

    if (input2DArray[rowIndex][columnIndex] === '#') {
        return false;
    }

    return true;
}


function createNode(weight, row, column) {
    let key = row + "-" + column;
    return { weight: weight, row: row, column: column, key: key};
}


function createPoint(row, column) {
    let key = row + "-" + column;
    return { row: row, column: column, key: key};
}


function pointIsEqual(point1, point2) {
    return point1.row === point2.row && point1.column === point2.column;
}


function makePointOfKey(key) {
    let keyParts = key.split('-');
    return createPoint(Number(keyParts[0]), Number(keyParts[1]));
}


function create2DArray(input) {
    return input.replaceAll('\r', '').split('\n').map(e => e.split(''));
}
