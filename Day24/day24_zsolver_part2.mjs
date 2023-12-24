import {init } from 'z3-solver'
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const input = readFileSync(resolve(__dirname, 'input.txt')).toString();
const demo = readFileSync(resolve(__dirname, 'demo_input.txt')).toString();


run(demo, input);


async function run(demo, input) {
    console.log(`Demo Solution: `);
    let demoHailArray = parseHail(demo);
    await solveSystem(demoHailArray.slice(0, 3));
    console.log('');

    console.log(`Puzzle Solution: `);
    let hailArray = parseHail(input);
    await solveSystem(hailArray.slice(0, 3));

    process.exit();
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


function createHail(px, py, pz, vx, vy, vz) {
    return { px: px, py: py, pz:pz, vx: vx, vy: vy, vz: vz }
}


async function solveSystem(data) {
    const { Context } = await init();
    const { Solver, Int } = new Context('main');
    const solver = new Solver();
    const pxRock = Int.const('pxRock');
    const pyRock = Int.const('pyRock');
    const pzRock = Int.const('pzRock');
    const vxRock = Int.const('vxRock');
    const vyRock = Int.const('vyRock');
    const vzRock = Int.const('vzRock');
    const time = data.map((_, i) => Int.const(`t${i}`))

    data.forEach((hail, index) => {
        solver.add(time[index].mul(hail.vx).add(hail.px).sub(pxRock).sub(time[index].mul(vxRock)).eq(0))
        solver.add(time[index].mul(hail.vy).add(hail.py).sub(pyRock).sub(time[index].mul(vyRock)).eq(0))
        solver.add(time[index].mul(hail.vz).add(hail.pz).sub(pzRock).sub(time[index].mul(vzRock)).eq(0))
    })
    await solver.check()
    console.log('Part 2', Number(solver.model().eval(pxRock.add(pyRock).add(pzRock)).value()))
}
