let input = `Time:      7  15   30
Distance:  9  40  200`;

let times = `48938595`;
let distances = ` 296192812361391`;

const numRegex = /\d+/g;

times = times.match(numRegex);
times = times.map(num => Number(num));

distances = distances.match(numRegex);
distances = distances.map(num => Number(num));

input = input.split('\n');

numbers = [];

for (let index = 0; index < times.length; index++) {
    const time = times[index];
    const distance = distances[index];

    let options = [];
    for (let j = 0; j <= time; j++) {
        options.push(j * (time - j));
    }

    options = options.filter(num => num > distance);
    numbers.push(options.length);
}

let sum = 1;
numbers.forEach(num => {
    sum *= num;
});


console.log("END")
console.log(sum)
