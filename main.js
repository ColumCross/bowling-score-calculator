// Input validation function for bowling symbols
function validateBowlingInput(input) {
    //console.log("validateBowlingInput");
    let value = input.value.toUpperCase();
    
    // Allow X, /, or numbers 0-9
    if (value === 'X' || value === '/' || (value >= '0' && value <= '9')) {
        input.value = value;
        
        // If this is a strike in the first roll, clear and disable the second roll
        // EXCEPT for the 10th frame, which allows bonus rolls after a strike
        if (value === 'X') {
            const inputId = input.id;
            const frameNumber = inputId.match(/sheet-(\d+)-f(\d+)r1/);
            if (frameNumber && frameNumber[2] !== '10') {
                const sheetId = `sheet-${frameNumber[1]}`;
                const frame = frameNumber[2];
                const r2Input = document.getElementById(`${sheetId}-f${frame}r2`);
                if (r2Input) {
                    r2Input.value = '';
                    r2Input.disabled = true;
                }
            }
        }
        
        // Extract sheet ID from input ID and update frame inputs for that sheet
        const sheetId = input.id.split('-f')[0];
        updateFrameInputsForSheet(sheetId);
    } else if (value !== '') {
        // Clear invalid input
        input.value = '';
        // Extract sheet ID from input ID and update frame inputs for that sheet
        const sheetId = input.id.split('-f')[0];
        updateFrameInputsForSheet(sheetId);
    }
}

// Check if a frame can be input (previous frame must have input)
function canInputFrame(frameNumber) {
    if (frameNumber === 1) return true; // First frame can always be input
    
    // Check if previous frame has any input
    const prevFrame = frameNumber - 1;
    const prevR1 = document.getElementById('sheet-f' + prevFrame + 'r1').value;
    const prevR2 = document.getElementById('sheet-f' + prevFrame + 'r2').value;
    
    // Allow input if previous frame has any input
    // For strikes, only first roll is needed
    // For other frames, both rolls are needed
    if (prevR1 === 'X' || prevR1 === 'x') {
        return true; // Strike in first roll, can input next frame
    }
    
    return prevR1 !== '' && prevR2 !== '';
}

// Enable/disable frame inputs based on previous frame completion
function updateFrameInputs() {
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById('sheet-f' + i + 'r1');
        const r2Input = document.getElementById('sheet-f' + i + 'r2');
        const r3Input = document.getElementById('sheet-f' + i + 'r3');
        
        if (canInputFrame(i)) {
            r1Input.disabled = false;
            
            // Check if first roll is a strike
            const r1Value = r1Input.value.toUpperCase();
            if (r1Value === 'X' && i !== 10) {
                // Strike in first roll - disable second roll (except for 10th frame)
                r2Input.disabled = true;
                r2Input.value = '';
            } else {
                // No strike or 10th frame - enable second roll
                r2Input.disabled = false;
            }
            
            if (r3Input) r3Input.disabled = false;
        } else {
            r1Input.disabled = true;
            r2Input.disabled = true;
            if (r3Input) r3Input.disabled = true;
        }
    }
    
    // Always recalculate score when frame inputs are updated
    // Note: This function is deprecated in favor of sheet-specific functions
    // Score calculation is now handled by updateFrameInputsForSheet
}

// Convert bowling input to numeric value
function convertBowlingInput(input) {
    if (input === '' || input === null) return null;
    
    const value = input.toString().toUpperCase();
    
    if (value === 'X') return 10; // Strike
    if (value === '/') return -1; // Spare (special marker, will be handled in logic)
    if (value.length === 1 && value >= '0' && value <= '9') return parseInt(value);
    
    return null;
}

// function that determines score logic.
// when given an array of integers that represent the frames of bowling in order, return the correct score for that game. OR return False if the score cannot be determined because of spares/strikes.
function scoreLogic(frames) {
    let score = 0;
    let frame = 0;
    let i = 0;
    let hasUnresolvedStrikes = false;
    let hasUnresolvedSpares = false;
    
    while (frame < 10) {
        if (i >= frames.length) {
            // Check if we have unresolved strikes or spares
            if (hasUnresolvedStrikes || hasUnresolvedSpares) {
                return { score: score, canCalculate: false, reason: "unresolved" };
            }
            return { score: score, canCalculate: true, reason: "partial" };
        }
        
        // Validate input
        if (frames[i] === null) {
            if (hasUnresolvedStrikes || hasUnresolvedSpares) {
                return { score: score, canCalculate: false, reason: "unresolved" };
            }
            return { score: score, canCalculate: true, reason: "partial" };
        }
        
        // Strike
        if (frames[i] === 10) {
            if (i + 2 >= frames.length) {
                hasUnresolvedStrikes = true;
                return { score: score, canCalculate: false, reason: "unresolved" };
            }
            if (frames[i + 1] === null || frames[i + 2] === null) {
                hasUnresolvedStrikes = true;
                return { score: score, canCalculate: false, reason: "unresolved" };
            }
            score += 10 + frames[i + 1] + frames[i + 2];
            i += 1;
        } else {
            if (i + 1 >= frames.length) {
                if (hasUnresolvedStrikes || hasUnresolvedSpares) {
                    return { score: score, canCalculate: false, reason: "unresolved" };
                }
                return { score: score, canCalculate: true, reason: "partial" };
            }
            if (frames[i + 1] === null) {
                if (hasUnresolvedStrikes || hasUnresolvedSpares) {
                    return { score: score, canCalculate: false, reason: "unresolved" };
                }
                return { score: score, canCalculate: true, reason: "partial" };
            }
            
            // Check if second roll is a spare
            if (frames[i + 1] === -1) {
                // Spare detected
                if (i + 2 >= frames.length) {
                    hasUnresolvedSpares = true;
                    return { score: score, canCalculate: false, reason: "unresolved" };
                }
                if (frames[i + 2] === null) {
                    hasUnresolvedSpares = true;
                    return { score: score, canCalculate: false, reason: "unresolved" };
                }
                score += 10 + frames[i + 2];
            } else {
                // Regular frame (no spare)
                let frameSum = frames[i] + frames[i + 1];
                if (frameSum > 10) {
                    // Invalid frame - return partial score up to this point
                    return { score: score, canCalculate: true, reason: "partial" };
                }
                score += frameSum;
            }
            i += 2;
        }
        frame++;
    }
    
    // Check for perfect game (300)
    if (score === 300) {
        return { score: score, canCalculate: true, reason: "perfect" };
    }
    
    return { score: score, canCalculate: true, reason: "complete" };
}

/*
* @name: collectInput
* @description: collect input from the user and return an array of integers that represent the frames of bowling in order.
* @returns: array of integers that represent the frames of bowling in order.
*/
function collectInput() {
    let frames = [];
    let framesCompleted = 0;

    //TODO: Think of a more elegant way to do this.
    for (let i = 0; i < 10; i++) {
        const r1Value = document.getElementById('sheet-f' + (i + 1) + 'r1').value;
        const r1 = convertBowlingInput(r1Value);
        
        // If no input in first roll, stop collecting
        if (r1 === null) {
            break;
        }
        
        frames.push(r1);
        
        // If first roll is a strike, skip second roll input for this frame
        if (r1 === 10) {
            framesCompleted++;
            continue;
        }
        
        // Only get second roll if first roll wasn't a strike
        const r2Value = document.getElementById('sheet-f' + (i + 1) + 'r2').value;
        const r2 = convertBowlingInput(r2Value);
        
        // If no input in second roll, stop collecting
        if (r2 === null) {
            break;
        }
        
        frames.push(r2);
        framesCompleted++;
    }
    
    // Handle 10th frame bonus rolls
    if (framesCompleted === 10) {
        // Check if 10th frame first roll was a strike
        const r10r1 = document.getElementById('sheet-f10r1').value;
        const r10r1Value = convertBowlingInput(r10r1);
        
        if (r10r1Value === 10) {
            // 10th frame strike - need 2 bonus rolls
            const r10r2 = document.getElementById('sheet-f10r2').value;
            const r10r3 = document.getElementById('sheet-f10r3').value;
            const r10r2Value = convertBowlingInput(r10r2);
            const r10r3Value = convertBowlingInput(r10r3);
            
            if (r10r2Value !== null) {
                frames.push(r10r2Value);
            }
            if (r10r3Value !== null) {
                frames.push(r10r3Value);
            }
        } else {
            // 10th frame not a strike - check if it was a spare
            const r10r2 = document.getElementById('sheet-f10r2').value;
            const r10r2Value = convertBowlingInput(r10r2);
            
            if (r10r2Value === -1) { // Check for spare marker
                // 10th frame spare - need 1 bonus roll
                const r10r3 = document.getElementById('sheet-f10r3').value;
                const r10r3Value = convertBowlingInput(r10r3);
                
                if (r10r3Value !== null) {
                    frames.push(r10r3Value);
                }
            }
        }
    }

    return { frames: frames, framesCompleted: framesCompleted };
}

/*
* @name: generateScore
* @description: generate the score for the game and display it to the user.
* @returns: void
*/
function generateScore() {
    let inputData = collectInput();
    let frames = inputData.frames;
    let framesCompleted = inputData.framesCompleted;
    
    console.log("Frames collected:", frames);
    console.log("Frames completed:", framesCompleted);
    
    try {
        let scoreResult = scoreLogic(frames);
        console.log("Score result:", scoreResult);
        
        if (!scoreResult.canCalculate) {
            document.getElementById('score-result-text').innerHTML = "Score cannot be calculated yet. Keep bowling!";
        } else if (scoreResult.reason === "perfect") {
            document.getElementById('score-result-text').innerHTML = "300! Perfect game!";
        } else if (framesCompleted === 10) {
            document.getElementById('score-result-text').innerHTML = "Total score: " + scoreResult.score;
        } else {
            document.getElementById('score-result-text').innerHTML = "Score so far: " + scoreResult.score;
        }
    } catch (error) {
        console.error("Error in generateScore:", error);
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
    // Create a default frame sheet for the first player
    addSheet();
    
    // Initialize frame input validation for the default sheet
    const defaultSheet = document.getElementById('framesheets').firstElementChild;
    if (defaultSheet) {
        updateFrameInputsForSheet(defaultSheet.id);
        
        // Add event listeners to update frame validation when inputs change
        for (let i = 1; i <= 10; i++) {
            const r1Input = document.getElementById(defaultSheet.id + '-f' + i + 'r1');
            const r2Input = document.getElementById(defaultSheet.id + '-f' + i + 'r2');
            const r3Input = document.getElementById(defaultSheet.id + '-f' + i + 'r3');
            
            if (r1Input) r1Input.addEventListener('input', () => updateFrameInputsForSheet(defaultSheet.id));
            if (r2Input) r2Input.addEventListener('input', () => updateFrameInputsForSheet(defaultSheet.id));
            if (r3Input) r3Input.addEventListener('input', () => updateFrameInputsForSheet(defaultSheet.id));
        }
    }
}

/**
 * @name: clearScore
 * @description: Clears all inputs and score displays on the traditional frame sheet.
 */
function clearScore() {
    // Clear all input fields for frames 1-10
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById('sheet-f' + i + 'r1');
        const r2Input = document.getElementById('sheet-f' + i + 'r2');
        if (r1Input) {
            r1Input.value = '';
            r1Input.disabled = false;
        }
        if (r2Input) {
            r2Input.value = '';
            r2Input.disabled = false;
        }
    }
    // Clear third roll for 10th frame
    const r3Input = document.getElementById('sheet-f10r3');
    if (r3Input) {
        r3Input.value = '';
        r3Input.disabled = false;
    }

    // Clear all frame score displays
    for (let i = 1; i <= 10; i++) {
        const scoreBox = document.getElementById('sheet-f' + i + '-score');
        if (scoreBox) {
            scoreBox.innerHTML = '';
        }
    }

    // Clear the main score result
    const scoreResult = document.getElementById('score-result-text');
    if (scoreResult) {
        scoreResult.innerHTML = '&nbsp;';
    }

    // Re-enable all inputs and update frame input states
    // Note: This function is deprecated in favor of sheet-specific functions
    // The default sheet will be handled by the onload function
}

/**
 * @name: addSheet
 * @description: Adds another frame sheet by generating the complete HTML content and inserting it into the framesheets div.
 */
function addSheet() {
    // Get the container that holds the frame sheets
    const container = document.getElementById('framesheets');
    
    // Generate a unique ID for this sheet
    const sheetId = 'sheet-' + Date.now();
    
    // Create the complete HTML structure for the new frame sheet
    let sheetHTML = `
        <div class="frame-sheet-base" id="${sheetId}">
            <div id="${sheetId}-header">
                <input type="text" id="${sheetId}-name" placeholder="Player Name" />
                <div id="${sheetId}-score-result"><p id="${sheetId}-score-result-text">&nbsp;</p></div>
            </div>
            <div id="${sheetId}-traditional-frame-sheet">
                <div class="traditional-frame-sheet-row">
                    <div class="traditional-frame-sheet-frames">
    `;
    
    // Add frames 1-9
    for (let f = 1; f <= 9; f++) {
        sheetHTML += `
            <div class="frame-box">
                <div class="frame-box-label">${f}</div>
                <div class="frame-box-rolls">
                    <input type="text" maxlength="1" class="traditional-frame-sheet-input" id="${sheetId}-f${f}r1" oninput="validateBowlingInput(this)">
                    <input type="text" maxlength="1" class="traditional-frame-sheet-input" id="${sheetId}-f${f}r2" oninput="validateBowlingInput(this)">
                </div>
                <div class="frame-box-score" id="${sheetId}-f${f}-score"></div>
            </div>
        `;
    }
    
    // Add frame 10
    sheetHTML += `
                    </div>
                    <div class="frame-box frame-10">
                        <div class="frame-box-label">10</div>
                        <div class="frame-box-rolls">
                            <input type="text" maxlength="1" class="traditional-frame-sheet-input" id="${sheetId}-f10r1" oninput="validateBowlingInput(this)">
                            <input type="text" maxlength="1" class="traditional-frame-sheet-input" id="${sheetId}-f10r2" oninput="validateBowlingInput(this)">
                            <input type="text" maxlength="1" class="traditional-frame-sheet-input" id="${sheetId}-f10r3" oninput="validateBowlingInput(this)">
                        </div>
                        <div class="frame-box-score" id="${sheetId}-f10-score"></div>
                    </div>
                </div>
                <button type="button" id="${sheetId}-calculate-score" onclick="generateScoreForSheet('${sheetId}')">Calculate Score</button>
                <button type="button" id="${sheetId}-clear-score" onclick="clearScoreForSheet('${sheetId}')">Clear Score</button>
            </div>
        </div>
    `;
    
    // Create the new sheet element
    const newSheet = document.createElement('div');
    newSheet.innerHTML = sheetHTML;
    const frameSheetContent = newSheet.firstElementChild;
    
    // Append the new sheet to the container
    container.appendChild(frameSheetContent);
    
    // Initialize the new sheet
    initializeNewSheet(sheetId);
}

/**
 * @name: initializeNewSheet
 * @description: Initializes a newly added frame sheet with proper event listeners and validation.
 * @param {string} sheetId - The unique ID of the sheet to initialize
 */
function initializeNewSheet(sheetId) {
    // Initialize frame input validation for the new sheet
    updateFrameInputsForSheet(sheetId);
    
    // Add event listeners to update frame validation when inputs change
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById(`${sheetId}-f${i}r1`);
        const r2Input = document.getElementById(`${sheetId}-f${i}r2`);
        const r3Input = document.getElementById(`${sheetId}-f${i}r3`);
        
        if (r1Input) r1Input.addEventListener('input', () => updateFrameInputsForSheet(sheetId));
        if (r2Input) r2Input.addEventListener('input', () => updateFrameInputsForSheet(sheetId));
        if (r3Input) r3Input.addEventListener('input', () => updateFrameInputsForSheet(sheetId));
    }
}

/**
 * @name: updateFrameInputsForSheet
 * @description: Updates frame input validation for a specific sheet.
 * @param {string} sheetId - The unique ID of the sheet to update
 */
function updateFrameInputsForSheet(sheetId) {
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById(`${sheetId}-f${i}r1`);
        const r2Input = document.getElementById(`${sheetId}-f${i}r2`);
        const r3Input = document.getElementById(`${sheetId}-f${i}r3`);
        
        if (canInputFrameForSheet(i, sheetId)) {
            if (r1Input) {
                r1Input.disabled = false;
                
                // Check if first roll is a strike
                const r1Value = r1Input.value.toUpperCase();
                if (r1Value === 'X' && i !== 10) {
                    // Strike in first roll - disable second roll (except for 10th frame)
                    if (r2Input) {
                        r2Input.disabled = true;
                        r2Input.value = '';
                    }
                } else {
                    // No strike or 10th frame - enable second roll
                    if (r2Input) {
                        r2Input.disabled = false;
                    }
                }
            }
            
            if (r3Input) r3Input.disabled = false;
        } else {
            if (r1Input) r1Input.disabled = true;
            if (r2Input) r2Input.disabled = true;
            if (r3Input) r3Input.disabled = true;
        }
    }
    
    // Always recalculate score when frame inputs are updated
    generateScoreForSheet(sheetId);
}

/**
 * @name: canInputFrameForSheet
 * @description: Checks if a frame can be input for a specific sheet.
 * @param {number} frameNumber - The frame number to check
 * @param {string} sheetId - The unique ID of the sheet
 * @returns {boolean} - Whether the frame can be input
 */
function canInputFrameForSheet(frameNumber, sheetId) {
    if (frameNumber === 1) return true; // First frame can always be input
    
    // Check if previous frame has any input
    const prevFrame = frameNumber - 1;
    const prevR1Element = document.getElementById(`${sheetId}-f${prevFrame}r1`);
    const prevR2Element = document.getElementById(`${sheetId}-f${prevFrame}r2`);
    
    // If elements don't exist yet, return false
    if (!prevR1Element || !prevR2Element) {
        return false;
    }
    
    const prevR1 = prevR1Element.value;
    const prevR2 = prevR2Element.value;
    
    // Allow input if previous frame has any input
    // For strikes, only first roll is needed
    // For other frames, both rolls are needed
    if (prevR1 === 'X' || prevR1 === 'x') {
        return true; // Strike in first roll, can input next frame
    }
    
    return prevR1 !== '' && prevR2 !== '';
}

/**
 * @name: collectInputForSheet
 * @description: Collects input from a specific sheet and returns frame data.
 * @param {string} sheetId - The unique ID of the sheet
 * @returns {object} - Object containing frames array and framesCompleted count
 */
function collectInputForSheet(sheetId) {
    let frames = [];
    let framesCompleted = 0;

    for (let i = 0; i < 10; i++) {
        const r1Element = document.getElementById(`${sheetId}-f${i + 1}r1`);
        if (!r1Element) break; // Element doesn't exist yet
        
        const r1Value = r1Element.value;
        const r1 = convertBowlingInput(r1Value);
        
        // If no input in first roll, stop collecting
        if (r1 === null) {
            break;
        }
        
        frames.push(r1);
        
        // If first roll is a strike, skip second roll input for this frame
        if (r1 === 10) {
            framesCompleted++;
            continue;
        }
        
        // Only get second roll if first roll wasn't a strike
        const r2Element = document.getElementById(`${sheetId}-f${i + 1}r2`);
        if (!r2Element) break; // Element doesn't exist yet
        
        const r2Value = r2Element.value;
        const r2 = convertBowlingInput(r2Value);
        
        // If no input in second roll, stop collecting
        if (r2 === null) {
            break;
        }
        
        frames.push(r2);
        framesCompleted++;
    }
    
    // Handle 10th frame bonus rolls
    if (framesCompleted === 10) {
        // Check if 10th frame first roll was a strike
        const r10r1Element = document.getElementById(`${sheetId}-f10r1`);
        if (!r10r1Element) return { frames: frames, framesCompleted: framesCompleted };
        
        const r10r1 = r10r1Element.value;
        const r10r1Value = convertBowlingInput(r10r1);
        
        if (r10r1Value === 10) {
            // 10th frame strike - need 2 bonus rolls
            const r10r2Element = document.getElementById(`${sheetId}-f10r2`);
            const r10r3Element = document.getElementById(`${sheetId}-f10r3`);
            if (!r10r2Element || !r10r3Element) return { frames: frames, framesCompleted: framesCompleted };
            
            const r10r2 = r10r2Element.value;
            const r10r3 = r10r3Element.value;
            const r10r2Value = convertBowlingInput(r10r2);
            const r10r3Value = convertBowlingInput(r10r3);
            
            if (r10r2Value !== null) {
                frames.push(r10r2Value);
            }
            if (r10r3Value !== null) {
                frames.push(r10r3Value);
            }
        } else {
            // 10th frame not a strike - check if it was a spare
            const r10r2Element = document.getElementById(`${sheetId}-f10r2`);
            if (!r10r2Element) return { frames: frames, framesCompleted: framesCompleted };
            
            const r10r2 = r10r2Element.value;
            const r10r2Value = convertBowlingInput(r10r2);
            
            if (r10r2Value === -1) { // Check for spare marker
                // 10th frame spare - need 1 bonus roll
                const r10r3Element = document.getElementById(`${sheetId}-f10r3`);
                if (!r10r3Element) return { frames: frames, framesCompleted: framesCompleted };
                
                const r10r3 = r10r3Element.value;
                const r10r3Value = convertBowlingInput(r10r3);
                
                if (r10r3Value !== null) {
                    frames.push(r10r3Value);
                }
            }
        }
    }

    return { frames: frames, framesCompleted: framesCompleted };
}

/**
 * @name: generateScoreForSheet
 * @description: Generates and displays the score for a specific sheet.
 * @param {string} sheetId - The unique ID of the sheet
 */
function generateScoreForSheet(sheetId) {
    let inputData = collectInputForSheet(sheetId);
    let frames = inputData.frames;
    let framesCompleted = inputData.framesCompleted;
    
    try {
        let scoreResult = scoreLogic(frames);
        
        // Find the score display element for this sheet
        const scoreElement = document.getElementById(`${sheetId}-score-result-text`);
        if (scoreElement) {
            if (!scoreResult.canCalculate) {
                scoreElement.innerHTML = "Score cannot be calculated yet. Keep bowling!";
            } else if (scoreResult.reason === "perfect") {
                scoreElement.innerHTML = "300! Perfect game!";
            } else if (framesCompleted === 10) {
                scoreElement.innerHTML = "Total score: " + scoreResult.score;
            } else {
                scoreElement.innerHTML = "Score so far: " + scoreResult.score;
            }
        }
    } catch (error) {
        console.error("Error in generateScoreForSheet:", error);
    }
}

/**
 * @name: clearScoreForSheet
 * @description: Clears all inputs and score displays for a specific sheet.
 * @param {string} sheetId - The unique ID of the sheet
 */
function clearScoreForSheet(sheetId) {
    // Clear the name input
    const nameInput = document.getElementById(`${sheetId}-name`);
    if (nameInput) {
        nameInput.value = '';
    }
    
    // Clear all input fields for frames 1-10
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById(`${sheetId}-f${i}r1`);
        const r2Input = document.getElementById(`${sheetId}-f${i}r2`);
        if (r1Input) {
            r1Input.value = '';
            r1Input.disabled = false;
        }
        if (r2Input) {
            r2Input.value = '';
            r2Input.disabled = false;
        }
    }
    // Clear third roll for 10th frame
    const r3Input = document.getElementById(`${sheetId}-f10r3`);
    if (r3Input) {
        r3Input.value = '';
        r3Input.disabled = false;
    }

    // Clear all frame score displays
    for (let i = 1; i <= 10; i++) {
        const scoreBox = document.getElementById(`${sheetId}-f${i}-score`);
        if (scoreBox) {
            scoreBox.innerHTML = '';
        }
    }

    // Clear the score display in the header
    const scoreElement = document.getElementById(`${sheetId}-score-result-text`);
    if (scoreElement) {
        scoreElement.innerHTML = '&nbsp;';
    }

    // Re-enable all inputs and update frame input states
    updateFrameInputsForSheet(sheetId);
}
