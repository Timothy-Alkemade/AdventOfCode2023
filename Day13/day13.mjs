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
    let inputLines = input.replaceAll('\r', '').split('\n');

    let part1 = getSolution(inputLines, true);
    let part2 = getSolution(inputLines, false);

    console.log(`Part1: ${part1}`);
    console.log(`Part2: ${part2}`);
}


function getSolution(inputLines, smudgeUsed) {
    let nextPattern = [];
    let sum = 0;

    for (let index = 0; index < inputLines.length; index++) {
        const line = inputLines[index];

        if (line.length !== 0 && index === inputLines.length - 1) {
            nextPattern.push(line);

            let score = solve(nextPattern, smudgeUsed);
            sum += score;

        }
        else if (line.length !== 0) {
            nextPattern.push(line);
        }
        else {
            let score = solve(nextPattern, smudgeUsed);
            sum += score;

            nextPattern = [];
        }
    }

    return sum;
}


function solve(patternLines, smudgeUsed) {
    let sumHorizontal = solveMirror(patternLines,smudgeUsed);
    if (sumHorizontal > 0) {
        return sumHorizontal * 100;
    }

    // flip array
    let vertLines = flipLines(patternLines);

    let sumVertical = solveMirror(vertLines, smudgeUsed);
    if (sumVertical > 0) {
        return sumVertical;
    }

    console.log("SHOULD NOT REACH");
    return 0;
}


function flipLines(patternLines) {
    let newArray = [];
    for (let index = 0; index < patternLines[0].length; index++) {
        newArray.push([]);
    }

    let patternArray = patternLines.map(e => e.split(''));

    for (let index = 0; index < patternArray.length; index++) {
        const line = patternArray[index];

        for (let j = 0; j < line.length; j++) {
            const char = line[j];

            newArray[j].push(char);
        }
    }

    return newArray.map(e => e.join(''));
}


function solveMirror(patternLines, smudgeUsed) {
    let previousLine = Array(patternLines.length).fill('x').join('');

    for (let index = 0; index < patternLines.length; index++) {
        const line = patternLines[index];

        // TODO: check smudge here, note that smudge already been used

        let lineObject = compareLines(line, previousLine, smudgeUsed);

        if (lineObject.equal) {
            // check other lines
            let patternLinesCopy = patternLines.slice();
            if (lineObject.smudgeUsed) {
                patternLinesCopy[index] = patternLinesCopy[index - 1];
            }

            let mirrorObject = checkMirror(patternLinesCopy, index, lineObject.smudgeUsed);
            if (mirrorObject.index > 0 && mirrorObject.smudgeUsed) {
                return mirrorObject.index;
            }
        }

        previousLine = line;
    }

    return -1;
}


function checkMirror(patterLines, index, smudgeUsed) {
    let index1 = index - 1;
    let index2 = index;

    while(index1 >= 0 && index2 < patterLines.length) {
        let line1 = patterLines[index1];
        let line2 = patterLines[index2];

        let lineObject= compareLines(line1, line2, smudgeUsed);
        smudgeUsed = lineObject.smudgeUsed;

        if (!lineObject.equal) {
            return -1;
        }

        index1--;
        index2++;
    }

    return { index: index, smudgeUsed: smudgeUsed };
}


function compareLines(line1, line2, smudgeUsed) {
    let og_smudge = smudgeUsed;

    for (let index = 0; index < line1.length; index++) {
        const char1 = line1[index];
        const char2 = line2[index];

        if (char1 === char2) {
            continue;
        }
        else if (smudgeUsed) {
            return { equal: false, smudgeUsed: og_smudge };
        }
        else {
            smudgeUsed = true;
        } 
    }

    return { equal: true, smudgeUsed: smudgeUsed };
}
