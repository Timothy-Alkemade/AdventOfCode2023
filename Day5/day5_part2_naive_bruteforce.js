
// Bruteforce - put in seed ranges 1 by 1
let seeds = `2354891449 100000000`;


let soilMap = `803774611 641364296 1132421037
248421506 1797371961 494535345
1936195648 2752993203 133687519
2069883167 2294485405 458507798
2804145277 283074539 358289757
3162435034 2886680722 1132532262
2528390965 4019212984 275754312
766543479 248421506 34653033
742956851 1773785333 23586628
801196512 2291907306 2578099`

let fertMap = `2497067833 718912393 1047592994
3544660827 4222700866 72266430
770426288 3365742958 209338740
3698421476 2775964622 508284117
1441878450 1818019282 725791090
417593992 265113557 15217985
979765028 3760587444 462113422
2167669540 2543810372 143892547
3616927257 3284248739 81494219
4206705593 2687702919 88261703
2380194851 3575081698 116872982
0 280331542 15942291
718912393 1766505387 51513895
152480435 0 265113557
2311562087 3691954680 68632764
15942291 296273833 136538144`

let waterMap = `0 402310798 253353164
778924681 2773042028 194127973
2853824225 2967170001 585461563
3827117536 3909653920 385313376
4259877071 3552631564 35090225
973052654 3635167948 222704323
253353164 0 389964349
2230088185 778924681 571954391
1195756977 1490392659 342200935
2802042576 3857872271 51781649
643317513 389964349 12346449
4212430912 3587721789 47446159
3439285788 2385210280 387831748
1677471499 1832593594 552616686
1537957912 1350879072 139513587`

let lightMap = `1548505089 767179152 4433418
3833169479 2956286720 133538400
2966709060 3309731935 102304094
1552938507 844050660 203612289
4257043426 3089825120 37923870
2862957901 3567999512 28008008
127112704 319767838 4466599
840317941 174506417 34039792
2890965909 3596007520 40520529
15787022 2007458428 111325682
2398090681 21771313 152735104
1094590916 1294380254 4387553
517844904 840169267 3881393
2556445662 1535118242 8735340
1266005567 2376897884 172496096
874357733 1314885059 220233183
3696946976 2820064217 136222503
2271345339 208546209 111221629
703336145 477538609 136981796
389299157 1710880680 59057725
4183266377 2766992510 22982117
521726297 324234437 53105792
1438501663 1881931289 110003426
131579303 1298767807 16117252
2102535156 614520405 152658747
0 2549393980 15787022
1098978469 1543853582 167027098
3966707879 2789974627 30089590
2255193903 0 16151436
1756550796 377340229 100198380
574832089 2360386712 16511172
2382566968 1991934715 15523713
3069013154 3636528049 627933822
2766992510 3178543922 79332992
2931486438 3274509313 35222622
3996797469 4264461871 30505425
2846325502 3257876914 16632399
2033978459 771612570 68556697
4206248494 3127748990 50794932
2550825785 16151436 5619877
591343261 1769938405 111992884
448356882 1047662949 69488022
4027302894 3412036029 155963483
147696555 2118784110 241602602
1856749176 1117150971 177229283`

let tempMap = `2549521624 1806050718 400234502
1279003707 1469066403 336984315
2063720323 2518736018 367281175
4240496851 236622733 54470445
3737038415 1201359870 20798035
1170741345 1222157905 108262362
1925074187 1330420267 138646136
3757836450 291093178 323945285
3424587617 2206285220 312450798
236622733 2886017193 934118612
4138496410 1042644754 102000441
4081781735 1144645195 56714675
2431001498 615038463 118520126
1615988022 733558589 309086165
2949756126 3820135805 474831491`

let humMap = `725888341 86282489 843183510
3782717746 1630698708 99613080
2529768467 2786969418 347392693
2195908552 2059541517 89214959
3062107482 2168182310 90554707
1730470902 3134362111 465437650
2964061476 2688923412 98046006
2285123511 2358509211 13167510
2877161160 3875960109 61807956
0 929465999 639605852
3484769060 2148756476 19425834
2298291021 1730311788 170053852
639605852 0 86282489
3504194894 2371676721 119346975
4275382932 3599799761 19584364
2468344873 2491023696 61423594
3623541869 1900365640 159175877
4138906810 2552447290 136476122
3918976473 3656029772 219930337
2938969116 4269874936 25092360
3882330826 3619384125 36645647
3152662189 3937768065 332106871
1630698708 2258737017 99772194`

let locMap = `1426868383 2786540732 64165562
1639911414 2027746720 730664673
857589555 0 114197007
2370576087 1887556908 140189812
3396523523 1265337150 488817864
1491033945 2850706294 148877469
3885341387 2999583763 409625909
0 114197007 857589555
1293466489 1754155014 133401894
2510765899 3409209672 885757624
1265337150 2758411393 28129339`

const numRegex = /\d+/g;

seeds = seeds.match(numRegex);
seeds = seeds.map(num => Number(num))

newSeeds = [];
for (let index = 0; index < seeds.length; index+=2) {
    let start = seeds[index];
    let end = Number(seeds[index]) + Number(seeds[index + 1]);

    for (let j = start; j < end; j++) {
        newSeeds.push(j);
    }
    
}

seeds = newSeeds;

soilList = [];
soilMap = soilMap.split('\n');
soilMap.forEach(soilLine => {
    let soilNums = soilLine.match(numRegex);
    soilNums = soilNums.map(num => Number(num));

    soil = {};

    soil.start = soilNums[1];
    soil.end = soilNums[1] + soilNums[2] - 1;
    soil.trans = soilNums[0];

    soilList.push(soil);
});


fertList = [];
fertMap = fertMap.split('\n');
fertMap.forEach(fertLine => {
    let fertNums = fertLine.match(numRegex);
    fertNums = fertNums.map(num => Number(num));

    fert = {};

    fert.start = fertNums[1];
    fert.end = fertNums[1] + fertNums[2] - 1;
    fert.trans = fertNums[0];

    fertList.push(fert);
});

waterList = [];
waterMap = waterMap.split('\n');
waterMap.forEach(waterLine => {
    let waterNums = waterLine.match(numRegex);
    waterNums = waterNums.map(num => Number(num));

    water = {};

    water.start = waterNums[1];
    water.end = waterNums[1] + waterNums[2] - 1;
    water.trans = waterNums[0];

    waterList.push(water);
});

lightList = [];
lightMap = lightMap.split('\n');
lightMap.forEach(lightLine => {
    let lightNums = lightLine.match(numRegex);
    lightNums = lightNums.map(num => Number(num));

    light = {};

    light.start = lightNums[1];
    light.end = lightNums[1] + lightNums[2] - 1;
    light.trans = lightNums[0];

    lightList.push(light);
});

tempList = [];
tempMap = tempMap.split('\n');
tempMap.forEach(tempLine => {
    let tempNums = tempLine.match(numRegex);
    tempNums = tempNums.map(num => Number(num));

    temp = {};

    temp.start = tempNums[1];
    temp.end = tempNums[1] + tempNums[2] - 1;
    temp.trans = tempNums[0];

    tempList.push(temp);
});

humList = [];
humMap = humMap.split('\n');
humMap.forEach(humLine => {
    let humNums = humLine.match(numRegex);
    humNums = humNums.map(num => Number(num));

    hum = {};

    hum.start = humNums[1];
    hum.end = humNums[1] + humNums[2] - 1;
    hum.trans = humNums[0];

    humList.push(hum);
});

locList = [];
locMap = locMap.split('\n');
locMap.forEach(locLine => {
    let locNums = locLine.match(numRegex);
    locNums = locNums.map(num => Number(num));

    loc = {};

    loc.start = locNums[1];
    loc.end = locNums[1] + locNums[2] - 1;
    loc.trans = locNums[0];

    locList.push(loc);
});


locations = [];
seeds.forEach(seed => {

    num = seed;

    for (let index = 0; index < soilList.length; index++) {
        const elem = soilList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < fertList.length; index++) {
        const elem = fertList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < waterList.length; index++) {
        const elem = waterList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < lightList.length; index++) {
        const elem = lightList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < tempList.length; index++) {
        const elem = tempList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < humList.length; index++) {
        const elem = humList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    for (let index = 0; index < locList.length; index++) {
        const elem = locList[index];
        if (num >= elem.start && num <= elem.end) {
            num = elem.trans + (num - elem.start);
            break;
        }
    }

    locations.push(num);

});

final = locations[0];
locations.forEach(loc => {
    if(final > loc) {
        final = loc;
    }
});


console.log("END")
console.log(final)

