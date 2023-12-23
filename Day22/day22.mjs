
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
    let bricks = getBricks(input);
    orderBricks(bricks);

    dropBricks(bricks);
    orderBricks(bricks);

    let criticalBricks = getCriticalBricks(bricks);

    let part1 = bricks.length - criticalBricks.size;
    let part2 = getPart2(bricks);

    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function dropBricks(bricks) {
    let numberOfDroppedBricks = 0;

    for (let index = 0; index < bricks.length; index++) {
        const brick = bricks[index];

        let maxZ = 1;

        let slicedCopy = bricks.slice(0, index);

        for (let j = 0; j < slicedCopy.length; j++) {
            const check = slicedCopy[j];

            if (overlaps(brick, check)) {
                maxZ = Math.max(maxZ,  check.zEnd + 1);
            }
        }
        let fallingDistance = brick.zStart - maxZ;

        brick.zEnd -= fallingDistance;
        brick.zStart = maxZ;
        
        if (fallingDistance > 0) {
            numberOfDroppedBricks++;
        }
    }

    return numberOfDroppedBricks;
}

function overlaps(brick1, brick2) {
    return (Math.max(brick1.xStart, brick2.xStart) <= Math.min(brick1.xEnd, brick2.xEnd)) &&
    (Math.max(brick1.yStart, brick2.yStart) <= Math.min(brick1.yEnd, brick2.yEnd));
}


function createBrick(id, xStart, xEnd, yStart, yEnd, zStart, zEnd) {
    return { id: id, xStart: xStart, yStart: yStart, zStart: zStart, xEnd: xEnd, yEnd: yEnd, zEnd: zEnd };
}


function getBricks(input) {
    input = input.replaceAll('\r','').split('\n');
    
    let bricks = [];
    
    for (let index = 0; index < input.length; index++) {
        let  line = input[index];
    
        line = line.split('~');
        line = line.map(e => e.split(','));
        line = line.map(e => e.map(Number));
    
        let brick = createBrick(index, line[0][0], line[1][0], line[0][1], line[1][1], line[0][2], line[1][2]);
        bricks.push(brick)
    }
    
    return bricks;
}

function orderBricks(bricks) {
    return bricks.sort(compareBrick);
}


function compareBrick(a, b) {
    if (a.zStart < b.zStart) {
      return -1;
    } else if (a.zStart > b.zStart) {
      return 1;
    }
    return 0;
}


function getCriticalBricks(bricks) {

    // init connection maps
    let isOnTopMap = {};
    let supportAboveMap = {};
    for (let index = 0; index < bricks.length; index++) {
        supportAboveMap[index] = new Set();
        isOnTopMap[index] = new Set();
    }

    // fill connection maps
    for (let index = 0; index < bricks.length; index++) {
        const brick1 = bricks[index];
    
        for (let j = 0; j < index; j++) {
            const brick2 = bricks[j];
    
            if ( brick1.zStart - 1 === brick2.zEnd &&  overlaps(brick1, brick2)) {
                isOnTopMap[index].add(brick2);
                supportAboveMap[j].add(brick1);
            }
        }
    }
    

    // Determine critical bricks
    let criticalBricks = new Set();
    
    for (const [brickId, bricksBelow] of Object.entries(isOnTopMap)) {
        if (bricksBelow.size === 1) {
            for (const brickBelow of bricksBelow.values()) {
                criticalBricks.add(brickBelow);
            }
        }
    }

    return criticalBricks;
}

function getPart2(bricks) {
    let part2 = 0;
    for (let index = 0; index < bricks.length; index++) {
        let copy = bricks.slice();
        copy.splice(index, 1);
    
        let adjusted = dropBricks(copy);
        
        part2 += adjusted;
    }

    return part2;
}
