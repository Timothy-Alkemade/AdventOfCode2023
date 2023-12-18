import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = 'input.txt';
const demoFilePath = 'demo_input.txt'

console.log("Demo Solution:")
run(demoFilePath);
console.log();

console.log("Puzzle Solution:")
run(filePath);


function run(filePath) {
    let lightArray = createLightArray(createInput2DArrayCopy(filePath));
    let startPoints = [createPoint(0, 0, 'right')];
    let count = getCount(lightArray, startPoints);

    console.log(`Part1: ${count}`);

    let initialPoints = createInitialPoints(filePath);
    let max = getMax(initialPoints, filePath);
    
    console.log(`Part2: ${max}`);
}


function getMax(initialPoints, filePath) {
    let max = 0;

    for (let index = 0; index < initialPoints.length; index++) {
        const points = initialPoints[index];
        
        let lightArray = createLightArray(createInput2DArrayCopy(filePath));
    
        let count = getCount(lightArray, points);

        if (count > max) {
            max = count;
        }
    }

    return max;
}


function getCount(lightArray, initialPoints) {
    for (let index = 0; index < initialPoints.length; index++) {
        const point = initialPoints[index];
        energize(lightArray, point.row, point.column, point.direction);
    }

    return countenergize(lightArray);
}


function createInitialPoints(filePath) {
    let initialArray = createLightArray(createInput2DArrayCopy(filePath));

    let initialPoints = [];

    for (let rowIndex = 0; rowIndex < initialArray.length; rowIndex++) {
        const line = initialArray[rowIndex];

        for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
            if (rowIndex === 0) {
                initialPoints.push([createPoint(rowIndex, columnIndex, 'down')]);
            }
            else if (rowIndex === initialArray.length - 1) {
                initialPoints.push([createPoint(rowIndex, columnIndex, 'up')]);
            }
            else if (columnIndex === 0) {
                initialPoints.push([createPoint(rowIndex, columnIndex, 'right')]);
            }
            else if (columnIndex === line.length - 1) {
                initialPoints.push([createPoint(rowIndex, columnIndex, 'left')]);
            }
        }
    }

    return initialPoints;
}


function createInput2DArrayCopy(filePath) {
    let input = readFileSync(resolve(__dirname, filePath)).toString();
    input = input.replaceAll('\r', '');

    return input.split('\n').map(e => e.split(''));
}


function createPoint(rowIndex, columnIndex, direction) {
    return { row: rowIndex, column: columnIndex, direction: direction };
}


function countenergize(lightArray) {
    let sum = 0;

    for (let index = 0; index < lightArray.length; index++) {
        const line = lightArray[index];

        for (let j = 0; j < line.length; j++) {
            const square = line[j];
            
            if (square.energized) {
                sum++;
            }
        }
    }

    return sum;
}


function energize(lightArray, rowIndex, columnIndex, direction) {
    let square = lightArray[rowIndex][columnIndex];

    if (square.directions.includes(direction)) {
        return;
    }

    square.energized = true;
    square.directions.push(direction);

    let token = square.token;

    if (token === '.') {
        if (direction === 'right') {
            goRight(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'left') {
            goLeft(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'up') {
            goUp(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'down') {
            goDown(lightArray, rowIndex, columnIndex);
        }
        return;
    }
    else if(token === '\\') {
        if (direction === 'right') {
            goDown(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'left') {
            goUp(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'down') {
            goRight(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'up') {
            goLeft(lightArray, rowIndex, columnIndex);
        }
        return;
    }
    else if(token === '/') {
        if (direction === 'right') {
            goUp(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'left') {
            goDown(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'down') {
            goLeft(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'up') {
            goRight(lightArray, rowIndex, columnIndex);
        }
        return;
    }
    else if(token === '|') {
        if (direction === 'right') {
            goUp(lightArray, rowIndex, columnIndex);
            goDown(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'left') {
            goUp(lightArray, rowIndex, columnIndex);
            goDown(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'down') {
            goDown(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'up') {
            goUp(lightArray, rowIndex, columnIndex);
        }
        return;
    }
    else if(token === '-') {
        if (direction === 'right') {
            goRight(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'left') {
            goLeft(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'down') {
            goRight(lightArray, rowIndex, columnIndex);
            goLeft(lightArray, rowIndex, columnIndex);
        }
        else if (direction === 'up') {
            goRight(lightArray, rowIndex, columnIndex);
            goLeft(lightArray, rowIndex, columnIndex);
        }
        return;
    }

}


function goRight(lightArray, rowIndex, columnIndex) {
    if (columnIndex + 1 < lightArray[0].length) {
        energize(lightArray, rowIndex, columnIndex + 1, 'right');
    }
}

function goLeft(lightArray, rowIndex, columnIndex) {
    if (columnIndex > 0) {
        energize(lightArray, rowIndex, columnIndex - 1, 'left');
    }
}

function goUp(lightArray, rowIndex, columnIndex) {
    if (rowIndex > 0) {
        energize(lightArray, rowIndex - 1, columnIndex, 'up');
    }
}

function goDown(lightArray, rowIndex, columnIndex) {
    if(rowIndex + 1 < lightArray.length) {
        energize(lightArray, rowIndex + 1, columnIndex, 'down');
    }
}


function createNode(token, energized) {
    return { token: token, energized: energized, directions: [] };
}


function createLightArray(input2DArray) {
    let lightArray = [];

    for (let index = 0; index < input2DArray.length; index++) {
        const line = input2DArray[index];

        lightArray.push([]);
        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            lightArray[index].push(createNode(char, false));    
        }
    }

    return lightArray;
}


function getVisualisedLightArray(lightArray) {
    let map = [];

    for (let index = 0; index < lightArray.length; index++) {
        const line = lightArray[index];

        let lineArray = [];

        for (let j = 0; j < line.length; j++) {
            const square = line[j];

            if(square.energized) {
                lineArray.push('#');
            }
            else {
                lineArray.push('.');
            }
            
        }
        map.push(lineArray.join(''));
        
    }

    return map.join('\n');
}
