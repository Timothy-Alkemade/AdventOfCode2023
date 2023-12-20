// let input = `broadcaster -> a, b, c
// %a -> b
// %b -> c
// %c -> inv
// &inv -> a`

let input = `&jc -> vq, mf, bv, pk, nc, sv, rl
%bj -> zc
%km -> jc, fc
%vr -> xq, qq
&ft -> xm
&jz -> xm
&fj -> jz, bj, mr, tp, ql, kf
%pt -> qq, pf
%zc -> qv, fj
%sr -> vr
%tr -> qq
%lq -> fj, ql
%qv -> kf, fj
%sn -> nk
%jd -> jc, gm
%tp -> bj, fj
%mp -> vm, nn
broadcaster -> pt, tp, gv, bv
%qh -> fj, nm
%gv -> vm, kq
%xt -> qq, lh
%nm -> fj, js
%hj -> ch
%mb -> vm, qg
%gr -> fj, qh
%js -> fj
%rl -> nc
&qq -> sr, pt, ch, lh, hj, pf, ft
%bv -> jc, mf
%nv -> mb
&xm -> rx
%nc -> km
&sv -> xm
%ql -> gr
%vn -> jc
%hv -> qq, hj
&vm -> ng, hz, sn, gv, nv
%rr -> qq, tr
%vv -> jc, vn
&ng -> xm
%nn -> cv, vm
%ch -> xt
%mr -> lq
%cv -> vm
%fc -> vv, jc
%pf -> hv
%pk -> vq
%vq -> jd
%kf -> mr
%mf -> pk
%qg -> vm, sn
%nk -> vk, vm
%hz -> mp
%kq -> vm, nv
%lh -> sr
%gm -> jc, rl
%vk -> vm, hz
%xq -> qq, rr`


input = input.split('\n');
// let lines = input.split('\n').map(e => e.split('->'));


// const numRegex = /\d+/g;

// console.log(input)


let countLow = 0;
let countHigh = 0;

let countLowPulseRX = 0;
let buttonPresses = 0;


let countFT = 0;
let countJZ = 0;
let countSV = 0;
let countXM = 0;

let a = false;
let b = false;
let c = false;
let d = false;


let pulseQueue = [];

let modules = parseInput(input);

for (let index = 0; index < 10000; index++) {
    let startPulse = createPulse('low', 'button', 'broadcaster');
    addPulseToQueue(startPulse);

    pressButton(modules, pulseQueue);
    buttonPresses++;


    if(countFT > 0 && !a) {
        a= true;
        console.log("BUTTON - FT:")
        console.log(buttonPresses);
    }

    if(countJZ > 0 && !b) {
        console.log("BUTTON - JZ:")
        console.log(buttonPresses);
        b= true;
    }

    if(countSV > 0 && !c) {
        console.log("BUTTON - SV:")
        console.log(buttonPresses);
        c= true;
    }

    if(countXM > 0 && !d) {
        console.log("BUTTON - NG:")
        console.log(buttonPresses);
        d= true;
    }


    countFT = 0;


    // if (countLowPulseRX === 1) {
    //     console.log('DONE:');
    //     console.log(buttonPresses);
    //     return;
    // }
    // else {
    //     countLowPulseRX = 0;
    // }
}

// console.log(countLow);
// console.log(countHigh);
console.log(`SUM for buttonpresses: ${buttonPresses}`)
console.log(countSum());



// console.log(modules);



function countSum() {
    return countLow * countHigh;
}


function addPulseToQueue(pulse) {
    if (pulse.type === 'high') {
        countHigh++;
        if (pulse.origin.includes('ft')) {
            countFT++;
        }

        if (pulse.origin.includes('jz')) {
            countJZ++;
        }

        if (pulse.origin.includes('sv')) {
            countSV++;
        }

        if (pulse.origin.includes('ng')) {
            countXM++;
        }
    }
    else {
        countLow++;
        // console.log(pulse.destinations)
        if (pulse.destinations.includes('rx')) {
            countLowPulseRX++;
        }
    }

    pulseQueue.push(pulse);
}



function pressButton(modules, pulseQueue) {
    while(pulseQueue.length !== 0) {
        let pulseToProcess = pulseQueue.shift();

        processPulse(pulseToProcess, modules);

    }


}






function createPulse(pulseType, origin, destinations) {
    return { type: pulseType, origin: origin, destinations: [destinations] };
}


function processPulse(pulseToProcess, modules) {

    // console.log(pulseToProcess)

    pulseToProcess.destinations.forEach(mName => {
        let m = modules[mName];

        if (m === undefined) {
            return;
        }

        if (m.type === 'broadcaster') {
            m.destinations.forEach(dest => {
                addPulseToQueue(createPulse(pulseToProcess.type, mName,dest));
            });
        }
        else if (m.type === '%') {
            if (pulseToProcess.type === 'high') {
                return;
            }

            // got low
            if (m.state === 'off') {
                m.destinations.forEach(dest => {
                    addPulseToQueue(createPulse('high', mName, dest));
                });
                m.state = 'on';
                return;
            }
            else {
                m.destinations.forEach(dest => {
                    addPulseToQueue(createPulse('low', mName, dest));
                });
                m.state = 'off';
                return;
            }
        }
        else if (m.type === '&') {

            m.remember[pulseToProcess.origin] = pulseToProcess.type;
            let allHigh = bConjContainsAllHigh(m);

            if (allHigh) {
                m.destinations.forEach(dest => {
                    addPulseToQueue(createPulse('low', mName, dest));
                });
                return;
            }
            else {
                m.destinations.forEach(dest => {
                    addPulseToQueue(createPulse('high', mName,dest));
                });
                return;
            }


        }
        
    });


}




function parseInput(input) {
    let modulesDic = {};

    for (let index = 0; index < input.length; index++) {
        let line = input[index];
    
        line = line.split('->').map( e => e.trim());
    
        let moduleString = line[0];
    
        let destinations = line[1];
        destinations = destinations.split(',').map( e => e.trim());
    
        parseModuleAndSetModules(modulesDic, moduleString, destinations);
    }

    setInputsForConjunctions(modulesDic);
    return modulesDic;
}




function parseModuleAndSetModules(modulesDic, moduleString, destinations) {
    let type;
    let name;
    let state;
    let remember;



    if (moduleString === 'broadcaster') {
        type = 'broadcaster';
        name = 'broadcaster';
    }
    else if (moduleString.includes('%')) {
        type = '%';
        name = moduleString.substring(1);
        state = 'off';
        remember = undefined;

    }
    else if (moduleString.includes('&')) {
        type = '&';
        name = moduleString.substring(1);
        state = undefined;
        remember = {};
    }


    modulesDic[name] = createModule(type, destinations, state, remember);
}



function createModule(type, destinations, state, remember) {
    return { type: type, destinations: destinations, state: state, remember: remember };
}


function bConjContainsAllHigh(module) {
    let allHigh = true;

    for (const inp in module.remember) {
        const recentPulseType = module.remember[inp];

        if (recentPulseType === 'low') {
            allHigh = false;
        }
    }

    return allHigh;
}




function setInputsForConjunctions(modulesDic) {
    for (const key in modulesDic) {
        const m = modulesDic[key];

        if (m.type === '&') {
            let inputs = getAllInputsForConjunctions(modulesDic, key);

            inputs.forEach(inp => {
                m.remember[inp] = 'low';
            });

        }
    }
}

function getAllInputsForConjunctions(modulesDic, name) {
    let inputs = [];

    for (const key in modulesDic) {
        const m = modulesDic[key];

        if (m.destinations.includes(name)) {
            inputs.push(key);
        }
    }

    return inputs;
}


