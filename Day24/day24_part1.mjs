import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();

console.log(`Demo Solution: `);
run(demo, 7, 27);
console.log('');

console.log(`Puzzle Solution: `);
run(input, 200000000000000, 400000000000000);


function run (input, areaMin, areaMax) {
    let hailArray = parseHail(input);

    let hailPairs = createPairs(hailArray);

    let points = getIntersectionPoints(hailPairs);

    let part1 = 0;
    for (let index = 0; index < points.length; index++) {
        const point = points[index];

        if (point.x >= areaMin && point.x <= areaMax && point.y >= areaMin && point.y <= areaMax && point.future) {
            part1++;
        }
        
    }

    console.log(`Part1: ${part1}`);
}



function getIntersectionPoints(hailPairs) {
    let points = [];
    
    for (let index = 0; index < hailPairs.length; index++) {
        const hailPair = hailPairs[index];

        let hail1 = hailPair[0];
        let hail2 = hailPair[1];

        let point = findIntersection(hail1.px, hail1.py, hail1.vx, hail1.vy, hail2.px, hail2.py, hail2.vx, hail2.vy)
        points.push(point);
    }

    return points;
}


function findIntersection(x1, y1, vx1, vy1, x2, y2, vx2, vy2) {

    let slope1 = vy1 / vx1;
    let yIntercept1 = (slope1 * x1) - y1;

    let slope2 = vy2 / vx2;
    let yIntercept2 = (slope2 * x2) - y2;


    let xPoint = (yIntercept2 - yIntercept1) / (slope1 - slope2);
    let yPoint = (slope1 * xPoint) + yIntercept1;

    let xPointReal = xPoint * -1;
    let yPointReal = yPoint * -1;

    let xReachable;
    let yReachable;

    if (x1 < xPointReal) {
        xReachable = true;
    }
    else {
        xReachable = false;
    }
    if (vx1 < 0){
        xReachable = !xReachable;
    }

    if (y1 < yPointReal) {
        yReachable = true;
    }
    else {
        yReachable = false;
    }
    if (vy1 < 0){
        yReachable = !yReachable;
    }


    let xReachable2;
    let yReachable2;

    if (x2 < xPointReal) {
        xReachable2 = true;
    }
    else {
        xReachable2 = false;
    }
    if (vx2 < 0){
        xReachable2 = !xReachable2;
    }

    if (y2 < yPointReal) {
        yReachable2 = true;
    }
    else {
        yReachable2 = false;
    }
    if (vy2 < 0){
        yReachable2 = !yReachable2;
    }


    return createPoint(xPointReal, yPointReal, xReachable && yReachable && xReachable2 && yReachable2);
}


function createPoint(x, y, bFuture) {
    return { x: x, y: y, future: bFuture};
}


function parseHail(input) {
    input = input.replaceAll('\r', '').split('\n');

    let hailArray = [];
    
    
    for (let index = 0; index < input.length; index++) {
        let line = input[index];

        line = line.split('@');
        line[0] = line[0].split(',').map(e => e.trim());
        line[0] = line[0].map(Number);
        line[1] = line[1].split(',').map(e => e.trim());
        line[1] = line[1].map(Number);

        let hail = createHail(line[0][0], line[0][1], line[0][2], line[1][0], line[1][1], line[1][2]);

        hailArray.push(hail);
    }

    return hailArray;
}


function createPairs(hailArray) {
    
    let hailPairs = [];

    for (let index = 0; index < hailArray.length; index++) {
        const hail1 = hailArray[index];

        for (let j = index + 1; j < hailArray.length; j++) {
            const hail2 = hailArray[j];

            let pair = [];
            pair.push(hail1);
            pair.push(hail2);

            hailPairs.push(pair);
        }
        
    }

    return hailPairs;
}


function createHail(px, py, pz, vx, vy, vz) {
    return { px: px, py: py, pz:pz, vx: vx, vy: vy, vz: vz }
}
