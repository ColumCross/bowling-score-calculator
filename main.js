// function that determines score logic.
// when given an array of integers that represent the frames of bowling in order, return the correct score for that game. OR return False if the score cannot be determined because of spares/strikes.
function scoreLogic(frames) {
    let score = 0;
    let frame = 0;
    let i = 0;
    while (frame < 10) {
        if (i >= frames.length) return false; // Not enough rolls
        // Strike
        if (typeof frames[i] !== 'number' || frames[i] < 0 || frames[i] > 10) {
            throw new Error('Invalid roll value at index ' + i);
        }
        if (frames[i] === 10) {
            if (i + 2 >= frames.length) return false; // Not enough rolls for bonus
            if (typeof frames[i + 1] !== 'number' || typeof frames[i + 2] !== 'number') {
                throw new Error('Invalid bonus roll value for strike at frame ' + (frame + 1));
            }
            score += 10 + frames[i + 1] + frames[i + 2];
            i += 1;
        } else {
            if (i + 1 >= frames.length) return false; // Not enough rolls for this frame
            if (typeof frames[i + 1] !== 'number' || frames[i + 1] < 0 || frames[i + 1] > 10) {
                throw new Error('Invalid roll value at index ' + (i + 1));
            }
            let frameSum = frames[i] + frames[i + 1];
            if (frameSum > 10) {
                throw new Error('Invalid frame: more than 10 pins in a frame at frame ' + (frame + 1));
            }
            // Spare
            if (frameSum === 10) {
                if (i + 2 >= frames.length) return false; // Not enough rolls for bonus
                if (typeof frames[i + 2] !== 'number' || frames[i + 2] < 0 || frames[i + 2] > 10) {
                    throw new Error('Invalid bonus roll value for spare at frame ' + (frame + 1));
                }
                score += 10 + frames[i + 2];
            } else if (frameSum < 10) {
                score += frameSum;
            }
            i += 2;
        }
        frame++;
    }
    return score;
}

/*
* @name: collectInput
* @description: collect input from the user and return an array of integers that represent the frames of bowling in order.
* @returns: array of integers that represent the frames of bowling in order.
*/
function collectInput() {
    let frames = [];

    //TODO: Think of a more elegant way to do this.
    for (let i = 0; i < 10; i++) {
        frames.push(parseInt(document.getElementById('sheet-f' + (i + 1) + 'r1').value));
        frames.push(parseInt(document.getElementById('sheet-f' + (i + 1) + 'r2').value));
    }
    frames.push(parseInt(document.getElementById('sheet-f10r3').value));

    
    return frames;
}

/*
* @name: generateScore
* @description: generate the score for the game and display it to the user.
* @returns: void
*/
function generateScore() {
    let frames = collectInput();
    try {
        let score = scoreLogic(frames);
        if(score) {
            document.getElementById('score-result-text').innerHTML = score;
        } else {
            document.getElementById('score-result-text').innerHTML = "Not enough rolls to determine score.";
        }
    } catch (error) {
        document.getElementById('score-result-text').innerHTML = error.message;
    }
    
}

/*
* @name: sheetToInputs
* @description: copy the values from the traditional frame sheet to the inputs above.
* @returns: void
*/
function sheetToInputs() {
    for (let i = 0; i < 10; i++) {
        // Copy roll 1
        const sheetR1 = document.getElementById('sheet-f' + (i + 1) + 'r1');
        const mainR1 = document.getElementById('f' + (i + 1) + 'r1');
        if (sheetR1 && mainR1) mainR1.value = sheetR1.value;
        // Copy roll 2
        const sheetR2 = document.getElementById('sheet-f' + (i + 1) + 'r2');
        const mainR2 = document.getElementById('f' + (i + 1) + 'r2');
        if (sheetR2 && mainR2) mainR2.value = sheetR2.value;
    }
    // Copy third roll for 10th frame
    const sheetR3 = document.getElementById('sheet-f10r3');
    const mainR3 = document.getElementById('f10r3');
    if (sheetR3 && mainR3) mainR3.value = sheetR3.value;
}

// Onload
function onload() {
    // Dynamically render frames 1-9
    for(let f=1; f<=9; f++) {
        const tpl = document.getElementById('frame-template').innerHTML
            .replace(/\{F\}/g, f)
            .replace('Frame', f);
        document.write(tpl);
    }
}
