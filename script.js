const GUARANTEE_EPS = 1e-95;
const DISPLAY_EPS = 1e-15;
const CONFIG = {
    "picupC5": {
        MaxHitNum: 7,
        Pity: 90,
        softPity: 73,
        pp0: 0.006,
        hp0: 0.5,
        mp0: 0.00018
    },
    "picupC4": {
        MaxHitNum: 7,
        Pity: 10,
        softPity: 8,
        pp0: 0.051,
        hp0: 0.5,
        pu: 3
    },
    "picupW5": {
        MaxHitNum: 5,
        Pity: 77,
        softPity: 62,
        pp0: 0.007,
        hp0: (0.75 / 2),
    },
    "picupW4": {
        MaxHitNum: 5,
        Pity: 9,
        softPity: 7,
        pp0: 0.06,
        hp0: 0.5,
        pu: 5
    },
    "selectedC5": {
        MaxHitNum: 7,
        Pity: 90,
        softPity: 73,
        pp0: 0.006,
        hp0: 0.5
    },
    "selectedW5": {
        MaxHitNum: 5,
        Pity: 90,
        softPity: 73,
        pp0: 0.006,
        hp0: 0.5
    }
};

function checkEmpty(values, errors) {
    for(const v of values) {
        if(v === "") {
            errors.push("*の項目はすべて入力してください");
            break;
        }
    }
    return;
}
function checkNumber(values, errors) {
    for(const v of values) {
        const n = Number(v);
        if(Number.isNaN(n)) {
            errors.push("すべて数値で入力してください");
            break;
        }
    }
    return;
}
function checkRates(str, value, errors){
    if(value <= 0 || value >= 100){
        errors.push('「0 < 排出率 < 100」の範囲で入力してください');
    }
    else if(!/^\d+(\.\d{1,5})?$/.test(str)){
        errors.push('排出率は小数第5位までで入力してください');
    }
}
function checkCost(str, value, errors){
    if(value <= 0 || value >= 1000){
        errors.push('「0 < ガチャコスト < 1000」の範囲で入力してください');
    }
    else if(!/^\d+(\.\d{1,2})?$/.test(str)){
        errors.push('ガチャコストは小数第2位までで入力してください');
    }
}
function checkPriceRange(value, errors){
    if(value <= 0 || value >= 100000000000){
        errors.push('「0 < 予算 < 100,000,000,000」の範囲で入力してください');
    }
    else if(!Number.isInteger(value)){
        errors.push('予算は整数で入力してください')
    }
}
function checkRolledNum(value, pity ,errors){
    if(value < 0 || value >= pity){
        errors.push(`「0 ≦ すでに引いた回数 < ${pity}」の範囲で入力してください`);
    }
    else if(!Number.isInteger(value)){
        errors.push('すでに引いた回数は整数で入力してください');
    }
}
function checkContents(values){
    let i =0;
    for(v of values){
        if(v !== ""){
            i++;
        }
    }
    switch(i){
        case 0: return "TABLE";
        default: return "RATES";
    }
}
function checkStoneNum(value, errors){
    if(value <= 0 || value >= 1000000000){
        errors.push('「0 < 所持原石 < 1,000,000,000」の範囲で入力してください');
    }
    else if(!Number.isInteger(value)){
        errors.push('所持原石は整数で入力してください')
    }
}
function checkRollNum(value, errors){
    if(value <= 0 || value >= 10000000){
        errors.push('「0 < ガチャ回数 < 10,000,000」の範囲で入力してください');
    }
    else if(!Number.isInteger(value)){
        errors.push('ガチャ回数は整数で入力してください')
    }
}

function runCheckMyokoCount(Clipping, mc, errors){
    checkNumber([mc], errors);
    if(errors.length > 0) {
        return -1;
    }

    const myokoCount = Number(mc);

    if(myokoCount < 0 || myokoCount >= 4){
        errors.push("「0 < 連続すり抜け回数 < 4」の範囲で入力してください");
        return -1;
    }
    if(Clipping === "Cliped" && myokoCount === 3){
        errors.push("イベント祈願・キャラクターにおいて、PU星5の連続すり抜けが3回起きている状態で、すり抜けている状況はあり得ません");
        return -1;
    }
    
    return myokoCount;
}
function runCheckRolledNum(rdn, Target, errors){
    checkNumber([rdn], errors);
    if(errors.length > 0) {
        return -1;
    }

    const rolledNum = Number(rdn);

    switch(Target){
        case "picupC5":
        case "selectedC5":
        case "selectedW5":{
            checkRolledNum(rolledNum, 90, errors);         
            break;
        }
        case "picupW5":{
            checkRolledNum(rolledNum, 77, errors);
            break;
        }
        case "picupC4":{
            checkRolledNum(rolledNum, 10, errors);
            break;
        }
        case "picupW4":{
            checkRolledNum(rolledNum, 9, errors);
            break;
        }
    }
    if(errors.length > 0) {
        return -1;
    }
    
    return rolledNum;
}
function runCheckInput(pr, sn, rn, errors){
    let i = 0, input = [0, 0, 0];
    for(v of [pr, sn, rn]){
        if(v === ""){
            input[i] = 0;
        }
        else{
            checkNumber([v], errors);
            if(errors.length > 0) {
                return [-1, -1, -1];
            }
        }
        input[i] = Number(v);
        i++;
    }
    let t = 0;
    for(let i = 0; i < 3; i++){
        if(input[i] === 0) t++;
        else switch(i){
            case 0:{
                checkPriceRange(input[i], errors);
                break;
            }
            case 1:{
                checkStoneNum(input[i], errors);
                break;
            }
            case 2:{
                checkRollNum(input[i], errors);
                break;
            }
        }
        if(errors.length > 0) {
            return [-1, -1, -1];
        }
    }
    if(t === 3){    
        errors.push("予算・所持原石・ガチャ回数の項目が全て0の場合は、これらの項目への入力は不要です")
        return [-1, -1, -1];
    }
    return input;
}

function sum2Darry(arr){
    let sum = 0;

    for(const row of arr){
        for(const v of row){
            sum += v;
        }
    }

    return sum;
}
function sum3DArray(arr, hMin = 0, hMax = arr.length - 1){
    let sum = 0;

    for(let h = hMin; h <= hMax; h++){
        for(const d2 of arr[h]){
            for(const v of d2){
                sum += v;
            }
        }
    }

    return sum;
}
function sum4DArray(arr, hMin = 0, hMax = arr.length - 1){
    let sum = 0;

    for(let h = hMin; h <= hMax; h++){
        for(const d2 of arr[h]){
            for(const d3 of d2){
                for(const v of d3){
                    sum += v;
                }
            }
        }
    }

    return sum;
}

function assert(cond, msg){
    if(!cond){
        throw new Error(msg);
    }
}

function calcInput(input, stoneRate){
    pR = input[0];
    sN = input[1] +  Math.floor(pR / stoneRate) * 8080;
    rN = input[2] + Math.floor(sN / 160);

    return {
        priceRange: pR,
        moneyLeft: pR % stoneRate,
        stoneNum: sN,
        stoneLeft: sN % 160, 
        rollNum: rN
    }; 
}

function calcProb(Target, Clipping, rolledNum, rollNum, puNum, myokoCount){
    const result = {
        mainProb: 0,
        cumulativeProbs: Array(CONFIG[Target].MaxHitNum).fill(0),
        distribution: Array(CONFIG[Target].MaxHitNum + 1).fill(0),
        rollNumleft: 0,
        isGuaranteedMain: false,
        isGuaranteed: Array(CONFIG[Target].MaxHitNum).fill(false)
    }

    switch(Target){
        case "picupC5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () => Array.from(
                        {length: 4},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                )
            );            

            dp[0][clipCase][myokoCount][rolledNum] = 1;
            
            for(let i = 0; i < rollNum; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array.from(
                            {length: 4},
                            () => Array(CONFIG[Target].Pity).fill(0)
                        )
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Mcount = 0; Mcount < 4; Mcount++){
                            for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                                const prob = dp[Hcount][s][Mcount][Pcount];

                                if(prob === 0) continue;

                                let pp;
                                if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                                else pp = CONFIG[Target].pp0;

                                let hp;
                                if (s === 1) hp = 1;
                                else hp = CONFIG[Target].hp0;

                                let mp;
                                if (Mcount === 3) mp = 1;
                                else mp = CONFIG[Target].mp0

                                const nextM = Math.min(Mcount + 1, 3);
                                const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                                const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                                assert(
                                    !(s === 1 && Mcount === 3),
                                    "invalid state"
                                );

                                if(s === 0){
                                    next[nextH][0][0][0] += prob * pp * hp;
                                }
                                else{
                                    next[nextH][0][nextM][0] += prob * pp * hp;
                                }

                                next[nextH][0][0][0] += prob * pp * (1 - hp) * mp;
                                next[Hcount][1][Mcount][0] += prob * pp * (1 - hp) * (1 - mp);
                                next[Hcount][s][Mcount][nextP] += prob * (1 - pp);
                            }
                        }
                    }
                }
                dp = next;
                

                const failProb = sum4DArray(dp, 0, puNum - 1);
                result.mainProb = 1 - failProb;
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    result.rollNumleft = rollNum - (i + 1);
                }
            }
            
            for(let i = 0; i < CONFIG[Target].MaxHitNum; i++){
                const failProb = sum4DArray(dp, 0, i);
                result.cumulativeProbs[i] = 1 - failProb;
                if(failProb < GUARANTEE_EPS){
                    result.isGuaranteed[i] = true;
                }
            }
            for(let i = 0; i < CONFIG[Target].MaxHitNum + 1; i++){
                result.distribution[i] = sum4DArray(dp, i, i);
            }

            break;
        }
        case "selectedC5":
        case "selectedW5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < rollNum; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp;
                            next[Hcount][1][0] += prob * pp * (1 - hp)
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                result.mainProb = 1 - failProb;
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    result.rollNumleft = rollNum - (i + 1);
                }
            }
            
            for(let i = 0; i < CONFIG[Target].MaxHitNum; i++){
                const failProb = sum3DArray(dp, 0, i);
                result.cumulativeProbs[i] = 1 - failProb;
                if(failProb < GUARANTEE_EPS){
                    result.isGuaranteed[i] = true;
                }
            }
            for(let i = 0; i < CONFIG[Target].MaxHitNum + 1; i++){
                result.distribution[i] = sum3DArray(dp, i, i);
            }
           
            break;
        }
        case "picupW5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < rollNum; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp;
                            next[Hcount][1][0] += prob * pp * (1 - hp)
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                result.mainProb = 1 - failProb;
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    result.rollNumleft = rollNum - (i + 1);
                }
            }
            
            for(let i = 0; i < CONFIG[Target].MaxHitNum; i++){
                const failProb = sum3DArray(dp, 0, i);
                result.cumulativeProbs[i] = 1 - failProb;
                if(failProb < GUARANTEE_EPS){
                    result.isGuaranteed[i] = true;
                }
            }
            for(let i = 0; i < CONFIG[Target].MaxHitNum + 1; i++){
                result.distribution[i] = sum3DArray(dp, i, i);
            }
           
            break;
        }
        case "picupC4":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < rollNum; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp * (1 / CONFIG[Target].pu);
                            next[Hcount][0][0] += prob * pp * hp * (1 - 1 / CONFIG[Target].pu)
                            next[Hcount][1][0] += prob * pp * (1 - hp);
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                result.mainProb = 1 - failProb;
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    result.rollNumleft = rollNum - (i + 1);
                }
            }

            for(let i = 0; i < CONFIG[Target].MaxHitNum; i++){
                const failProb = sum3DArray(dp, 0, i);
                result.cumulativeProbs[i] = 1 - failProb;
                if(failProb < GUARANTEE_EPS){
                    result.isGuaranteed[i] = true;
                }
            }
            for(let i = 0; i < CONFIG[Target].MaxHitNum + 1; i++){
                result.distribution[i] = sum3DArray(dp, i, i);
            }
           
            break;
        }
        case "picupW4":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < rollNum; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp * (1 / CONFIG[Target].pu);
                            next[Hcount][0][0] += prob * pp * hp * (1 - 1 / CONFIG[Target].pu)
                            next[Hcount][1][0] += prob * pp * (1 - hp);
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                result.mainProb = 1 - failProb;
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    result.rollNumleft = rollNum - (i + 1);
                }
            }
            
            for(let i = 0; i < CONFIG[Target].MaxHitNum; i++){
                const failProb = sum3DArray(dp, 0, i);
                result.cumulativeProbs[i] = 1 - failProb;
                if(failProb < GUARANTEE_EPS){
                    result.isGuaranteed[i] = true;
                }
            }
            for(let i = 0; i < CONFIG[Target].MaxHitNum + 1; i++){
                result.distribution[i] = sum3DArray(dp, i, i);
            }
           
            break;
        }
    }

    return result;
}
function calcTable(Target, Clipping, rolledNum, puNum, myokoCount, stoneRate, significanceLevels){
    const result = {
        isGuaranteedMain: false,
        requiredNums: Array(significanceLevels.length).fill(0),
        requiredStones: Array(significanceLevels.length).fill(0),
        requiredMoney: Array(significanceLevels.length).fill(0),
        stonelefts: Array(significanceLevels.length).fill(0),
    }
    let levelIndex = 0;

    switch(Target){
        case "picupC5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () => Array.from(
                        {length: 4},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                )
            );            

            dp[0][clipCase][myokoCount][rolledNum] = 1;
            for(let i = 0; i < 2000; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array.from(
                            {length: 4},
                            () => Array(CONFIG[Target].Pity).fill(0)
                        )
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Mcount = 0; Mcount < 4; Mcount++){
                            for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                                const prob = dp[Hcount][s][Mcount][Pcount];

                                if(prob === 0) continue;

                                let pp;
                                if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                                else pp = CONFIG[Target].pp0;

                                let hp;
                                if (s === 1) hp = 1;
                                else hp = CONFIG[Target].hp0;

                                let mp;
                                if (Mcount === 3) mp = 1;
                                else mp = CONFIG[Target].mp0

                                const nextM = Math.min(Mcount + 1, 3);
                                const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                                const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                                assert(
                                    !(s === 1 && Mcount === 3),
                                    "invalid state"
                                );

                                if(s === 0){
                                    next[nextH][0][0][0] += prob * pp * hp;
                                }
                                else{
                                    next[nextH][0][nextM][0] += prob * pp * hp;
                                }

                                next[nextH][0][0][0] += prob * pp * (1 - hp) * mp;
                                next[Hcount][1][Mcount][0] += prob * pp * (1 - hp) * (1 - mp);
                                next[Hcount][s][Mcount][nextP] += prob * (1 - pp);
                            }
                        }
                    }
                }
                dp = next;

                const failProb = sum4DArray(dp, 0, puNum - 1);
                while(failProb < significanceLevels[levelIndex] && levelIndex < significanceLevels.length){
                    result.requiredNums[levelIndex] = i + 1;
                    levelIndex++;
                }
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    break;
                }
            }
            
            break;
        }
        case "selectedC5":
        case "selectedW5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < 2000; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp;
                            next[Hcount][1][0] += prob * pp * (1 - hp)
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                while(failProb < significanceLevels[levelIndex] && levelIndex < significanceLevels.length){
                    result.requiredNums[levelIndex] = i + 1;
                    levelIndex++;
                }
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    break;
                }
            }
           
            break;
        }
        case "picupW5":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < 2000; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp;
                            next[Hcount][1][0] += prob * pp * (1 - hp)
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                while(failProb < significanceLevels[levelIndex] && levelIndex < significanceLevels.length){
                    result.requiredNums[levelIndex] = i + 1;
                    levelIndex++;
                }
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    break;
                }
            }
           
            break;
        }
        case "picupC4":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < 2000; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp * (1 / CONFIG[Target].pu);
                            next[Hcount][0][0] += prob * pp * hp * (1 - 1 / CONFIG[Target].pu)
                            next[Hcount][1][0] += prob * pp * (1 - hp);
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                while(failProb < significanceLevels[levelIndex] && levelIndex < significanceLevels.length){
                    result.requiredNums[levelIndex] = i + 1;
                    levelIndex++;
                }
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    break;
                }
            }
           
            break;
        }
        case "picupW4":{
            let clipCase;
            if(Clipping === "Cliped") clipCase = 1;
            else clipCase = 0;

            let dp = Array.from(
                {length: CONFIG[Target].MaxHitNum + 1},
                () => Array.from(
                    {length: 2},
                    () =>  Array(CONFIG[Target].Pity).fill(0)
                )
            );   

            dp[0][clipCase][rolledNum] = 1;
            
            for(let i = 0; i < 2000; i++){
                const next = Array.from(
                    {length: CONFIG[Target].MaxHitNum + 1},
                    () => Array.from(
                        {length: 2},
                        () => Array(CONFIG[Target].Pity).fill(0)
                    )
                );

                for(let Hcount = 0; Hcount < CONFIG[Target].MaxHitNum + 1; Hcount++){
                    for(let s = 0; s < 2; s++){
                        for(let Pcount = 0; Pcount < CONFIG[Target].Pity; Pcount++){
                            const prob = dp[Hcount][s][Pcount];

                            if(prob === 0) continue;

                            let pp;
                            if(Pcount >= CONFIG[Target].softPity) pp = Math.min(CONFIG[Target].pp0 + CONFIG[Target].pp0 * 10 * (Pcount - CONFIG[Target].softPity + 1), 1);
                            else pp = CONFIG[Target].pp0;

                            let hp;
                            if (s === 1) hp = 1;
                            else hp = CONFIG[Target].hp0;

                            const nextP = (Pcount + 1) % CONFIG[Target].Pity;
                            const nextH = Math.min(Hcount + 1, CONFIG[Target].MaxHitNum);

                            next[nextH][0][0] += prob * pp * hp * (1 / CONFIG[Target].pu);
                            next[Hcount][0][0] += prob * pp * hp * (1 - 1 / CONFIG[Target].pu)
                            next[Hcount][1][0] += prob * pp * (1 - hp);
                            next[Hcount][s][nextP] += prob * (1 - pp);
                        }
                    }
                }
                dp = next;

                const failProb = sum3DArray(dp, 0, puNum - 1);
                while(failProb < significanceLevels[levelIndex] && levelIndex < significanceLevels.length){
                    result.requiredNums[levelIndex] = i + 1;
                    levelIndex++;
                }
                if(failProb < GUARANTEE_EPS && !(result.isGuaranteedMain)){
                    result.isGuaranteedMain = true;
                    break;
                }
                
            }
            
            break;
        }
    }

    result.requiredStones = result.requiredNums.map(v => v * 160);
    result.requiredMoney = result.requiredStones.map(v => Math.ceil(v / 8080) * stoneRate);
    result.stonelefts = (result.requiredStones.map(v => Math.ceil(v / 8080) * 8080)).map((v, i) => v - result.requiredStones[i]);
    if(!(result.isGuaranteedMain)){
        result.requiredNums[significanceLevels.length - 1] = null;
        result.requiredStones[significanceLevels.length - 1] = null;
        result.requiredMoney[significanceLevels.length - 1] = null;
        result.stonelefts[significanceLevels.length - 1] = null;
    }

    return result;
}

function makeRateText(prob, isGuaranteed){
    if(isGuaranteed){
        return `${100}％（確定）`;
    }
    else if(1 - prob < DISPLAY_EPS){
        return `${99.99999}％以上（非確定）`;
    }
    else if(prob <= 0){
        return `${0}％`
    }

    return `${((Math.floor(prob * 10000000)) / 100000).toFixed(5)}％`;
}

function makeDistributionGraph(distribution){
    const graph = document.getElementById("distributionGraph");

    graph.innerHTML = "";

    for(let i = 0; i < distribution.length; i++){

        const prob = distribution[i];

        const barWrap = document.createElement("div");
        barWrap.className = "barWrap";

        const rate = document.createElement("div");
        rate.className = "barRate";
        rate.textContent =
            `${(prob * 100).toFixed(2)}%`;

        const bar = document.createElement("div");
        bar.className = "bar";

        // 最大高さ250px
        bar.style.height = `${prob * 250}px`;

        const label = document.createElement("div");
        label.className = "barLabel";

        if(i === 0){
            label.textContent = "未入手";
        }
        else{
            label.textContent = `${i - 1}凸`;
        }

        barWrap.appendChild(rate);
        barWrap.appendChild(bar);
        barWrap.appendChild(label);

        graph.appendChild(barWrap);
    }
}

//ノーマルモード
function printUI01(){
    const ui = document.getElementById("UI");
    
    ui.innerHTML = `
        <h2  class ="calcTytle">少なくとも1回は当たる確率とガチャ回数、必要金額を計算します</h2>

        <p>
            排出率 [％]：
            <input type="text" id="dropRates">
            *
        </p>

        <p>
            ガチャコスト [円/回]：
            <input type="text" id="rollCost">
            *
        </p>

        <p>
            予算 [円]：
            <input type="text" id="priceRange">
            （入力した場合、予算を使い切った場合に当たる確率を計算する）
        </p>

        <p>*は入力必須項目</p>

        <button onclick="calc01()">計算する</button>   
    
        <p id="result"></p>
    `;
}
function calc01(){
    const result = document.getElementById("result");
    result.textContent = "";  
    let errors = [];
    let dropRates, rollCost, priceRange;

    const dr = document.getElementById("dropRates").value;
    const rc = document.getElementById("rollCost").value;
    const pr = document.getElementById("priceRange").value;

    const haspr = pr !== "";

    checkEmpty([dr, rc], errors);
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    checkNumber([dr, rc], errors);
    if(haspr && errors.length === 0){
        checkNumber([pr], errors);
    }
    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    dropRates = Number(dr);
    rollCost = Number(rc);

    checkRates(dr, dropRates, errors);
    checkCost(rc, rollCost, errors);

    if(haspr){
        priceRange = Number(pr);
        checkPriceRange(priceRange, errors);
    }

    if(errors.length > 0) {
        result.innerHTML = errors.join("<br>");
        return;
    }

    dropRates = Math.round(dropRates * 100000) / 10000000;
    rollCost = Math.round(rollCost * 100) / 100;

    if(haspr){
        priceRange = Math.round(priceRange);

        const rollNum = Math.floor(priceRange / rollCost);
        const finalDropRates = Math.min(1, 1 - (1 - dropRates) ** (rollNum));

        result.innerHTML = `あなたの予算「${priceRange.toLocaleString()}円」では、最大${rollNum.toLocaleString()}回ガチャを引くことができ、<br>
                            そのとき約${(finalDropRates * 100).toFixed(5)}％の確率で少なくとも1回は当たります`

        return;
    }

    const significanceLevels = [0.5, 0.2, 0.1, 0.05, 0.01, 0.001];

    let html = `
    <table>
        <tr>
            <th>排出率[％]</th>
            <th>ガチャ回数[回]</th>
            <th>必要金額[円]</th>
        </tr>
    `;

    for(const level of significanceLevels){
        const rollNum = Math.ceil(Math.log(level)/Math.log(1 - dropRates));
        const sumCosts = rollCost * rollNum;
        
        html +=`
        <tr>
            <td>${((1 - level) * 100).toFixed(1)}</td>
            <td>${rollNum.toLocaleString()}</td>
            <td>${sumCosts.toLocaleString()}</td>
        </tr>
        `
    }

    html += `</table>`

    result.innerHTML = html;

    return;
}
//原神モード
function printUI02(){
    const ui = document.getElementById("UI");
    
    ui.innerHTML = `
        <h2 class ="calcTytle">原神モード（ガチャシミュレーション）</h2>

        <h3 class ="optionTytle">祈願設定</h3>
        <div id="UI02_1"></div>
        <div id="UI02_2"></div>
        <div id="UI02_3"></div>
        <br>
        <h3 class="optionTytle">現在の祈願状態</h3>
        <p>
            すり抜け状態：
            <select id="clipping" class="small">
                <option value="noCliped">未すり抜け</option>
                <option value="Cliped">すり抜け済み</option>
            </select>
        </p>
        <p>
            連続すり抜け回数（すり抜け→PU確定の連続回数）：<br>
            <input type="text" id="myokoCount">（未入力の場合、0として計算）<br>
            ※イベント祈願・キャラクターで排出されるPU星5のみ有効（それ以外はこの値を無視）
        </p>
        <p>
            すでに引いた回数：<br>
            <input type="text" id="rolledNum">（未入力の場合、0として計算）<br>
            （前回の天井到達から換算）
        </p>
        <br>
        <h3 class="optionTytle">祈願計画</h3>
        <p>
            使用OS：
            <select id="device" class="small">
                <option value="iOS">iOS</option>
                <option value="PC">PC / Android</option>
                <option value="PS">PS4 / PS5</option>
            </select>
        </p>
        <p>
            予算 [円]：
            <input type="text" id="priceRange">
        </p>
        <p>
            所持原石：
            <input type="text" id="stoneNum">
        </p>
        <p>
            ガチャ回数：
            <input type="text" id="rollNum">
        </p>
        <p>
            ※予算・所持原石・ガチャ回数の値から算出される合計のガチャ回数で、対象を引ける確率を求めます<br>
            （複数入力でも可、未入力の場合は基準の確率までに必要なガチャ回数・予算などを表形式で出力します）
        </p>

        <button onclick="calc02()">計算する</button>   
    
        <p id="result"></p>
        <div id="distributionGraph"></div>
    `;

    selectGacha();
}
function selectGacha(){
    const UI02_1 = document.getElementById("UI02_1");

    UI02_1.innerHTML = `
        <p>
            祈願選択：
            <select id="gacha" onchange="selectTarget()">
                <option value="eventC">イベント祈願・キャラクター</option>
                <option value="eventW">イベント祈願・武器</option>
                <option value="chronicle">収録祈願</option>
            </select>
        </p>
    `;

    selectTarget();
}
function selectTarget(){
    const UI02_2 = document.getElementById("UI02_2");
    const gacha = document.getElementById("gacha").value;
    let html = `
        <p>
            対象選択：
            <select id="target" onchange="selectConstellation()">
    `;

    switch(gacha){
        case "eventC":{
            html +=`
                        <option value="picupC5">ピックアップ☆5キャラ</option>
                        <option value="picupC4">ピックアップ☆4キャラ（特定の1キャラ）</option>
            `;
            break
        }
        case "eventW":{
            html +=`
                        <option value="picupW5">ピックアップ☆5武器（軌定武器）</option>
                        <option value="picupW4">ピックアップ☆4武器（特定の1武器）</option>
            `;
            break;
        }
        case "chronicle":{
            html +=`
                        <option value="selectedC5">ピックアップ☆5キャラ（軌定キャラ）</option>
                        <option value="selectedW5">ピックアップ☆5武器（軌定武器）</option>
            `;
            break;
        }
    }

    html +=`
            </select>
        </p>
    `;

    UI02_2.innerHTML = html;

    selectConstellation();
}
function selectConstellation(){
    const UI02_3 = document.getElementById("UI02_3");
    const target = document.getElementById("target").value;
    let html = `
        <p>
            目標凸数：
                <select id="constellation">
    `;
    switch(target){
        case "picupC5":
        case "picupC4":
        case "selectedC5":
            html += ` 
                        <option value="0">C0（命の星座：0）</option>
                        <option value="1">C1（命の星座：1）</option>
                        <option value="2">C2（命の星座：2）</option>
                        <option value="3">C3（命の星座：3）</option>
                        <option value="4">C4（命の星座：4）</option>
                        <option value="5">C5（命の星座：5）</option>
                        <option value="6">C6（命の星座：6）</option>
            `;
            break;

        case "picupW5":
        case "picupW4":
        case "selectedW5":
            html +=`
                        <option value="0">R1（精錬ランク：1）</option>
                        <option value="1">R2（精錬ランク：2）</option>
                        <option value="2">R3（精錬ランク：3）</option>
                        <option value="3">R4（精錬ランク：4）</option>
                        <option value="4">R5（精錬ランク：5）</option>
            `;
    }

    html += `
                </select><br>
            （確保済みの場合は、現在の凸数を差し引いて選択）
        </p>
    `;

    UI02_3.innerHTML = html;
}
function calc02(){
    const result = document.getElementById("result");
    const graph = document.getElementById("distributionGraph");
    graph.innerHTML = ``;
    result.textContent = "";
    let mode = "";
    let html = "";
    let errors = [];
    let myokoCount, rolledNum;
    let input = [0, 0, 0];
    const significanceLevels = [0.5, 0.2, 0.1, 0.05, 0.01, 0.001, GUARANTEE_EPS];

    const Target = document.getElementById("target").value;
    const Device = document.getElementById("device").value;
    const Clipping = document.getElementById("clipping").value;

    const mc = document.getElementById("myokoCount").value
    const rdn = document.getElementById("rolledNum").value;
    const pr = document.getElementById("priceRange").value;
    const sn = document.getElementById("stoneNum").value;
    const rn = document.getElementById("rollNum").value;

    mode += checkContents([pr, sn, rn], errors);

    const puNum = Number(document.getElementById("constellation").value) + 1;
    
    if(Target === "picupC5" && mc !== ""){
        runCheckMyokoCount(Clipping, mc, errors);
        if(errors.length > 0) {
            result.innerHTML = errors.join("<br>");
            return;
        }
    }
    else myokoCount = 0;

    if(rdn !== ""){
        rolledNum = runCheckRolledNum(rdn, Target, errors);
        if(errors.length > 0) {
            result.innerHTML = errors.join("<br>");
            return;
        }
    }
    else rolledNum = 0;

    let stoneRate;
    if(Device === "iOS") stoneRate = 15000;
    else stoneRate =  12000;

    /*出力処理*/
    switch(mode){
        case "TABLE":{
            html = `
                <table>
                    <tr>
                        <th>目標到達率[％]</th>
                        <th>ガチャ回数[回]</th>
                        <th>必要原石[個]</th>
                        <th>必要金額[円]<br>（余り原石[個]）</th>
                    </tr>
            `;
            const resultCalc = calcTable(Target, Clipping, rolledNum, puNum, myokoCount, stoneRate, significanceLevels);

            for(let i = 0; i < significanceLevels.length - 1; i++){
                html +=`
                    <tr>
                        <td>${((1 - significanceLevels[i]) * 100).toFixed(1)}</td>
                        <td>${resultCalc.requiredNums[i]}</td>
                        <td>${resultCalc.requiredStones[i].toLocaleString()}</td>
                        <td>
                            ${resultCalc.requiredMoney[i].toLocaleString()}<br>
                            （${resultCalc.stonelefts[i]}）
                        </td>
                    </tr>
                `;
            }
            html +=`
                    <tr>
                        <td>確定</td>
            `;

            if(resultCalc.isGuaranteedMain){
                html +=`
                        <td>${resultCalc.requiredNums[significanceLevels.length - 1]}</td>
                        <td>${resultCalc.requiredStones[significanceLevels.length - 1].toLocaleString()}</td>
                        <td>
                            ${resultCalc.requiredMoney[significanceLevels.length - 1].toLocaleString()}<br>
                            （${resultCalc.stonelefts[significanceLevels.length - 1]}）
                        </td>
                    </tr>
                `;
            }
            else{
                html +=`
                        <td>なし</td>
                        <td>　ー　</td>
                        <td>　ー　</td>
                    </tr>
                `;
            }

            html +=` 
                </table>
            `;

            break;
        }
        case "RATES": {
            input = runCheckInput(pr, sn, rn, errors);
            if(errors.length > 0) {
                result.innerHTML = errors.join("<br>");
                return;
            }

            statusCalc = calcInput(input, stoneRate);
            
            const resultCalc = calcProb(Target, Clipping, rolledNum, statusCalc.rollNum, puNum, myokoCount);

            html +=`
                あなたは「` + makeRateText(resultCalc.mainProb, resultCalc.isGuaranteedMain) + `」の確率で目標を達成できます<br>
                （予算余り：${statusCalc.moneyLeft}円、原石余り：${statusCalc.stoneLeft + resultCalc.rollNumleft * 160}個）<br>
                ※予算は可能な限りすべて原石に交換（原石8080個で${stoneRate}円）したものとし、確定で対象を入手した場合には原石の余りを表示しています<br>
                <br>
                予算・原石・ガチャ回数を全て使い切った場合における、該当の凸数以上で終わる確率表
                <table>
                    <tr>
                        <th>凸状態</th>
                        <th>確率</th>
                    </tr>
                    
            `;

            switch(Target){
                case "picupC5":
                case "picupC4":
                case "selectedC5":
                    for(let i = 0; i < CONFIG["picupC5"].MaxHitNum; i++){
                        html +=`
                                <tr>
                                    <th>C${i}</th>
                                    <th>` + makeRateText(resultCalc.cumulativeProbs[i], resultCalc.isGuaranteed[i]) + `</th>
                                </tr>
                        `;
                    }
                    break;

                case "picupW5":
                case "picupW4":
                case "selectedW5":
                    for(let i = 0; i < CONFIG["picupW5"].MaxHitNum; i++){
                        html +=`
                                <tr>
                                    <th>R${i + 1}</th>
                                    <th>` + makeRateText(resultCalc.cumulativeProbs[i], resultCalc.isGuaranteed[i]) + `</th>
                                </tr>
                        `;
                    }
                    break;
            }

            html += `        
                </table>
            `;
            
            makeDistributionGraph(resultCalc.distribution);

            break;
        }
    }

    result.innerHTML = html;

    return;
}