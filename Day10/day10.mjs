import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo1 = readFileSync(resolve(__dirname, 'demo_input1.txt')).toString();
const demo2 = readFileSync(resolve(__dirname, 'demo_input2.txt')).toString();
const demo3 = readFileSync(resolve(__dirname, 'demo_input3.txt')).toString();
const demo4 = readFileSync(resolve(__dirname, 'demo_input4.txt')).toString();

console.log(`Demo1 Solution: `);
run(demo1);
console.log('');

console.log(`Demo2 Solution: `);
run(demo2);
console.log('');

console.log(`Demo3 Solution: `);
run(demo3);
console.log('');

console.log(`Demo4 Solution: `);
run(demo4);
console.log('');

console.log(`Puzzle Solution: `);
run(input);


function run(inputText) {
    const inputLines = inputText.split('\n');
    const input2DArray = inputLines.map(line => line.split(''));
    const numberOfRows = input2DArray.length;
    const numberOfColumns = input2DArray[0].length;
    
    const startNode = getStartNode(input2DArray);
    const startAndConnectedNodes = checkSurroundingNodes(input2DArray, startNode);
    const allNodes = getAllNodes(input2DArray, startAndConnectedNodes);
    
    const part1 = calculateFarthestPoint(allNodes);
    console.log(`Part1: ${part1}`)
    
    
    const horizontalPipeIndexes = getPipeIndexesForHorizontalCheck(allNodes, numberOfRows);
    const verticalPipeIndexes = getPipeIndexesForVerticalCheck(allNodes, numberOfColumns);
    
    const cleanedPipelineGrid = replaceJunkWithDots(numberOfRows, numberOfColumns, allNodes);
    
    // console.log(cleanedPipelineGrid);
    
    // Alternative: A horizontal or a vertical check
    // const tilesInside = countTilesInsidePipelineAreaHorizontalCheck(cleanedPipelineGrid, horizontalPipeIndexes);
    const tilesInside = countTilesInsidePipelineAreaVerticalCheck(cleanedPipelineGrid, verticalPipeIndexes);
    
    console.log(`Part2: ${tilesInside}`);
}


function getStartNode(input2DArray) {
    for (let index = 0; index < input2DArray.length; index++) {
        const line = input2DArray[index];
        const bFoundStart = line.includes('S');

        if (bFoundStart) {
            const row = index;
            const column = input2DArray[index].indexOf('S');

            return createNode(row, column);
        }
    }
}

function createNode(rowIndex, columnIndex, symbol, fromDirection) {
    const node = {}
    node.row = rowIndex;
    node.column = columnIndex;
    node.symbol = symbol;
    node.fromDirection = fromDirection;

    return node;
}


function checkSurroundingNodes(input2DArray, startNode) {
    const nodes = [startNode];

    const startSymbolPossibilities = [];

    const connectedNorthSymbols = ['|', '7', 'F'];
    const connectedSouthSymbols = ['|', 'L', 'J'];
    const connectedEastSymbols = ['-', '7', 'J'];
    const connectedWestSymbols = ['-', 'L', 'F'];


    // Check North Direction - coming from South
    const nodeN = getMatchingNode(input2DArray, startNode.row - 1, startNode.column, connectedNorthSymbols, 'south');
    if (nodeN)
    {
        nodes.push(nodeN);
        startSymbolPossibilities.push(connectedSouthSymbols);
    }

     // Check South Direction - coming from North
    const nodeS = getMatchingNode(input2DArray, startNode.row + 1, startNode.column, connectedSouthSymbols, 'north');
    if (nodeS) {
        nodes.push(nodeS);
        startSymbolPossibilities.push(connectedNorthSymbols);
    }

    // Check East Direction - coming from West
    const nodeE = getMatchingNode(input2DArray, startNode.row, startNode.column + 1, connectedEastSymbols, 'west');
    if (nodeE) {
        nodes.push(nodeE);
        startSymbolPossibilities.push(connectedWestSymbols);
    }

    // Check West Direction - coming from East
    const nodeW = getMatchingNode(input2DArray, startNode.row, startNode.column - 1, connectedWestSymbols, 'east');
    if (nodeW) {
        nodes.push(nodeW);
        startSymbolPossibilities.push(connectedEastSymbols);
    }

    startNode.symbol = getStartingSymbol(startSymbolPossibilities);

    return nodes;
}


function getSymbol(input2DArray, rowIndex, columnIndex) {
    return input2DArray[rowIndex][columnIndex];
}

function getStartingSymbol(startSymbolPossibilities) {
    return startSymbolPossibilities[0].filter(symbol => startSymbolPossibilities[1].includes(symbol))[0];
}

function areIndexesValid(input2DArray, rowIndex, columnIndex) {
    return isValidRowIndex(input2DArray, rowIndex) && isValidColumnIndex(input2DArray, columnIndex);
}

function isValidRowIndex(input2DArray, rowIndex) {
    return rowIndex >= 0 && rowIndex < input2DArray.length;
}

function isValidColumnIndex(input2DArray, columnIndex) {
    return columnIndex >= 0 && columnIndex < input2DArray[0].length;
}


function getMatchingNode(input2DArray, rowIndex, columnIndex, matchingSymbols, fromDirection) {
    if (!areIndexesValid(input2DArray, rowIndex, columnIndex)) {
        return undefined;
    }

    const symbol = getSymbol(input2DArray, rowIndex, columnIndex);

    if (matchingSymbols.includes(symbol)) {
        return createNode(rowIndex, columnIndex, symbol, fromDirection);
    }
    
    return undefined;
}


function getAllNodes(input2DArray, startAndConnectedNodes) {
    const directions = {
        'F': ['east', 'south'], 
        '|': ['north', 'south'], 
        '-': ['west', 'east'],
        'L': ['north', 'east'], 
        'J': ['north', 'west'], 
        '7': ['west', 'south']
    };

    let allNodes = [];
    allNodes.push(startAndConnectedNodes[0], startAndConnectedNodes[1], startAndConnectedNodes[2]);

    let nextNodes = [startAndConnectedNodes[1], startAndConnectedNodes[2]];
    
    while(checkEnd(nextNodes[0], nextNodes[1])) {
        nextNodes = getNextNodes(input2DArray, nextNodes, directions);
        allNodes.push(nextNodes[0], nextNodes[1]);
    }

    // Last node is a duplicate - remove last index
    allNodes.pop();
    return allNodes;
}

function checkEnd(nextNode1, nextNode2) {
    if (nextNode1.row == nextNode2.row && nextNode1.column == nextNode2.column) {
        return false;
    }
    return true;
}


function getNextNodes(input2DArray, nodes, directions) {
        const nextNode1 = getNode(input2DArray, nodes[0], directions);
        const nextNode2 = getNode(input2DArray, nodes[1], directions);

       return [nextNode1, nextNode2];
}


function getDirection(allowedDirections, excludedDir) {
    if (allowedDirections.indexOf(excludedDir) === 0)
    {
        return allowedDirections[1];
    }
    return allowedDirections[0];
}


function getNode(input, node, directions) {
    const allowedDirections = directions[node.symbol];
    const direction = getDirection(allowedDirections, node.fromDirection);

    if (direction == 'north') {
        let symbol = input[node.row - 1][node.column];
        return createNode(node.row - 1, node.column, symbol, 'south')
    }
    if (direction == 'south') {
        let symbol = input[node.row + 1][node.column];
        return createNode(node.row + 1, node.column, symbol, 'north')
    }

    if (direction == 'west') {
        let symbol = input[node.row][node.column - 1];
        return createNode(node.row, node.column - 1, symbol, 'east')
    }

    // direction == 'east'
    let symbol = input[node.row][node.column + 1];
    return createNode(node.row, node.column + 1, symbol, 'west')
}


function calculateFarthestPoint(allNodes) {
    return (allNodes.length) / 2;
}


function getPipeIndexesForHorizontalCheck(allNodes, numberOfRows) {
    const horizontalPipeIndexes = [];
    for (let index = 0; index < numberOfRows; index++) {
        horizontalPipeIndexes.push([]);
    }

    allNodes.forEach(node => {
        // Either only check for the parts [|,7,F] or [|,L,J]
        if (node.symbol == '|' || node.symbol == '7' || node.symbol == 'F' ) {
            horizontalPipeIndexes[node.row].push(node.column);
        }
    });

    return horizontalPipeIndexes;
}


function getPipeIndexesForVerticalCheck(allNodes, numberOfColumns) {
    const verticalPipeIndexes = [];
    for (let index = 0; index < numberOfColumns; index++) {
        verticalPipeIndexes.push([]);
    }

    allNodes.forEach(node => {
         // Either only check for the parts [-,L,F] or [-,J,7] 
        if (node.symbol == '-' ||  node.symbol == 'L' || node.symbol == 'F') {
            verticalPipeIndexes[node.column].push(node.row);
        }
    });

    return verticalPipeIndexes;
}


function fillArrayWithDots(numberOfRows, numberOfColumns) {
    const dotArray = [];

    for (let row = 0; row < numberOfRows; row++) {
        const dotRow = [];

        for (let column = 0; column < numberOfColumns; column++) {
            dotRow.push('.');
        }
        dotArray.push(dotRow);
    }

    return dotArray;
}


function replaceJunkWithDots(numberOfRows, numberOfColumns, allNodes) {
    const dotArray = fillArrayWithDots(numberOfRows, numberOfColumns);

    allNodes.forEach(node => {
        dotArray[node.row][node.column] = node.symbol;
    });

    return dotArray;
}


function countTilesInsidePipelineAreaHorizontalCheck(cleanedPipelineGrid, horizontalPipeIndexes) {
    let tilesInside = 0;

    for (let rowNumber = 0; rowNumber < cleanedPipelineGrid.length; rowNumber++) {
        const row = cleanedPipelineGrid[rowNumber];

        for (let columnNumber = 0; columnNumber < cleanedPipelineGrid[0].length; columnNumber++) {
            const symbol = row[columnNumber];

            if (symbol === '.') {
                // Check can be either > or < than columnNumber
                const parallelPipeParts = horizontalPipeIndexes[rowNumber].filter((pipeIndex) => pipeIndex > columnNumber).length;
                if (isOdd(parallelPipeParts)) {
                    tilesInside++;
                }
            }
        } 
    }

    return tilesInside;
}

function countTilesInsidePipelineAreaVerticalCheck(cleanedPipelineGrid, verticalPipeIndexes) {
    let tilesInside = 0;

    for (let rowNumber = 0; rowNumber < cleanedPipelineGrid.length; rowNumber++) {
        const row = cleanedPipelineGrid[rowNumber];

        for (let columnNumber = 0; columnNumber < cleanedPipelineGrid[0].length; columnNumber++) {
            const symbol = row[columnNumber];

            if (symbol === '.') {
                // Check can be either > or < than rowNumber
                const parallelPipeParts = verticalPipeIndexes[columnNumber].filter((pipeIndex) => pipeIndex > rowNumber).length;
                if (isOdd(parallelPipeParts)) {
                    tilesInside++;
                }
            }
        } 
    }

    return tilesInside;
}


function isEven(n) {
    return n % 2 == 0;
}


function isOdd(n) {
    return !isEven(n);
}
