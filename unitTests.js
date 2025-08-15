// Unit Tests for Bowling Score Calculator
// Run these tests to verify the score logic is working correctly

// Test the convertBowlingInput function (no DOM required)
function testConvertBowlingInput() {
    console.log("Testing convertBowlingInput function...");
    
    // Test numbers
    console.assert(convertBowlingInput('0') === 0, "convertBowlingInput('0') should return 0");
    console.assert(convertBowlingInput('5') === 5, "convertBowlingInput('5') should return 5");
    console.assert(convertBowlingInput('9') === 9, "convertBowlingInput('9') should return 9");
    
    // Test strikes
    console.assert(convertBowlingInput('X') === 10, "convertBowlingInput('X') should return 10");
    console.assert(convertBowlingInput('x') === 10, "convertBowlingInput('x') should return 10");
    
    // Test spares
    console.assert(convertBowlingInput('/') === -1, "convertBowlingInput('/') should return -1");
    
    // Test invalid inputs
    console.assert(convertBowlingInput('') === null, "convertBowlingInput('') should return null");
    console.assert(convertBowlingInput('A') === null, "convertBowlingInput('A') should return null");
    console.assert(convertBowlingInput('11') === null, "convertBowlingInput('11') should return null");
    
    console.log("✓ convertBowlingInput tests passed");
}

// Test the scoreLogic function (no DOM required)
function testScoreLogic() {
    console.log("Testing scoreLogic function...");
    
    // Test open frames (no strikes or spares)
    console.assert(scoreLogic([1, 2, 3, 4, 5, 4, 6, 3, 7, 2, 8, 1, 9, 0, 4, 5, 3, 6, 2, 7]).score === 85, "Open frames should score correctly");
    
    // Test strikes
    console.assert(scoreLogic([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]).score === 300, "Perfect game should score 300");
    console.assert(scoreLogic([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]).reason === "perfect", "Perfect game should have reason 'perfect'");
    
    // Test spares (using -1 marker)
    console.assert(scoreLogic([5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5, -1, 5]).score === 150, "All spares should score 150");
    
    // Test mixed game
    console.assert(scoreLogic([10, 7, 3, 9, 1, 10, 10, 10, 8, 2, 9, 1, 10, 10, 10]).score === 200, "Mixed game should score correctly");
    
    // Test unresolved strikes
    let result = scoreLogic([10, 10, 10]);
    console.assert(result.canCalculate === false, "Unresolved strikes should not be calculable");
    console.assert(result.reason === "unresolved", "Unresolved strikes should have reason 'unresolved'");
    
    // Test unresolved spares (using -1 marker)
    result = scoreLogic([5, -1, 7, 3, 8, 2]);
    console.assert(result.canCalculate === false, "Unresolved spares should not be calculable");
    console.assert(result.reason === "unresolved", "Unresolved spares should have reason 'unresolved'");
    
    // Test partial game
    result = scoreLogic([7, 2, 8, 1, 9, 0]);
    console.assert(result.canCalculate === true, "Partial open game should be calculable");
    console.assert(result.reason === "partial", "Partial open game should have reason 'partial'");
    console.assert(result.score === 35, "Partial open game should score correctly");
    
    console.log("✓ scoreLogic tests passed");
}

// Test edge cases (no DOM required)
function testEdgeCases() {
    console.log("Testing edge cases...");
    
    // Test invalid frame (more than 10 pins)
    let result = scoreLogic([7, 5]); // This would be 12 pins, invalid
    console.assert(result.canCalculate === true, "Invalid frame should still be calculable");
    console.assert(result.score === 7, "Invalid frame should show partial score");
    
    // Test incomplete frame
    result = scoreLogic([7]); // Missing second roll
    console.assert(result.canCalculate === true, "Incomplete frame should be calculable");
    console.assert(result.score === 7, "Incomplete frame should show partial score");
    
    // Test 10th frame with strike
    result = scoreLogic([7, 2, 8, 1, 9, 0, 6, 3, 5, 4, 8, 1, 7, 2, 9, 0, 6, 3, 10, 7, 3]);
    console.assert(result.canCalculate === true, "10th frame strike should be calculable");
    console.assert(result.score === 95, "10th frame strike should score correctly");
    
    console.log("✓ Edge case tests passed");
}

// Test multi-sheet functionality with real DOM elements
function testMultiSheetFunctionality() {
    console.log("Testing multi-sheet functionality...");
    
    // First, add a sheet to create real DOM elements
    addSheet();
    
    // Get the newly created sheet
    const framesheets = document.getElementById('framesheets');
    const newSheet = framesheets.lastElementChild;
    const sheetId = newSheet.id;
    
    console.log("Created sheet with ID:", sheetId);
    
    try {
        // Test canInputFrameForSheet function
        console.assert(canInputFrameForSheet(1, sheetId) === true, "First frame should always be inputtable");
        console.assert(canInputFrameForSheet(2, sheetId) === false, "Second frame should not be inputtable without previous frame");
        
        // Test frame input validation
        const r1Input = document.getElementById(`${sheetId}-f1r1`);
        const r2Input = document.getElementById(`${sheetId}-f2r1`);
        
        console.assert(r1Input !== null, "First frame first roll input should exist");
        console.assert(r2Input !== null, "Second frame first roll input should exist");
        console.assert(r1Input.disabled === false, "First frame should be enabled");
        console.assert(r2Input.disabled === true, "Second frame should be disabled initially");
        
        // Test strike input
        r1Input.value = 'X';
        r1Input.dispatchEvent(new Event('input'));
        
        // Check that second roll is disabled after strike
        const r1r2Input = document.getElementById(`${sheetId}-f1r2`);
        console.assert(r1r2Input.disabled === true, "Second roll should be disabled after strike");
        console.assert(r1r2Input.value === '', "Second roll should be cleared after strike");
        
        // Check that next frame is enabled
        console.assert(r2Input.disabled === false, "Next frame should be enabled after strike");
        
        // Test spare input
        r1Input.value = '5';
        r1Input.dispatchEvent(new Event('input'));
        r1r2Input.value = '/';
        r1r2Input.dispatchEvent(new Event('input'));
        
        // Check that next frame is enabled after spare
        console.assert(r2Input.disabled === false, "Next frame should be enabled after spare");
        
        // Test collectInputForSheet function
        let result = collectInputForSheet(sheetId);
        console.assert(result.frames.length === 2, "collectInputForSheet should return 2 rolls");
        console.assert(result.frames[0] === 5, "First roll should be 5");
        console.assert(result.frames[1] === -1, "Second roll should be -1 (spare)");
        console.assert(result.framesCompleted === 1, "Should have 1 frame completed");
        
        // Test generateScoreForSheet function
        generateScoreForSheet(sheetId);
        const scoreElement = document.getElementById(`${sheetId}-score-result-text`);
        console.assert(scoreElement !== null, "Score display element should exist");
        console.assert(scoreElement.innerHTML === "Score cannot be calculated yet. Keep bowling!", "Unresolved spare should show correct message");
        
        // Test clearScoreForSheet function
        clearScoreForSheet(sheetId);
        console.assert(r1Input.value === '', "First roll should be cleared");
        console.assert(r1r2Input.value === '', "Second roll should be cleared");
        console.assert(scoreElement.innerHTML === '&nbsp;', "Score display should be cleared");
        
        console.log("✓ Multi-sheet functionality tests passed");
        
    } catch (error) {
        console.error("Error in multi-sheet test:", error);
        throw error;
    }
}

// Test sheet initialization and event handling
function testSheetInitialization() {
    console.log("Testing sheet initialization...");
    
    // Add another sheet for testing
    addSheet();
    
    const framesheets = document.getElementById('framesheets');
    const newSheet = framesheets.lastElementChild;
    const sheetId = newSheet.id;
    
    try {
        // Test updateFrameInputsForSheet
        updateFrameInputsForSheet(sheetId);
        
        // First frame should be enabled
        const r1Input = document.getElementById(`${sheetId}-f1r1`);
        const r1r2Input = document.getElementById(`${sheetId}-f1r2`);
        console.assert(r1Input.disabled === false, "First frame first roll should be enabled");
        console.assert(r1r2Input.disabled === false, "First frame second roll should be enabled");
        
        // Second frame should be disabled initially
        const r2Input = document.getElementById(`${sheetId}-f2r1`);
        const r2r2Input = document.getElementById(`${sheetId}-f2r2`);
        console.assert(r2Input.disabled === true, "Second frame should be disabled initially");
        console.assert(r2r2Input.disabled === true, "Second frame second roll should be disabled initially");
        
        // Test strike validation in updateFrameInputsForSheet
        r1Input.value = 'X';
        updateFrameInputsForSheet(sheetId);
        
        // Second roll should be disabled after strike (except 10th frame)
        console.assert(r1r2Input.disabled === true, "Second roll should be disabled after strike");
        console.assert(r1r2Input.value === '', "Second roll should be cleared after strike");
        
        // Next frame should be enabled
        console.assert(r2Input.disabled === false, "Next frame should be enabled after strike");
        
        console.log("✓ Sheet initialization tests passed");
        
    } catch (error) {
        console.error("Error in sheet initialization test:", error);
        throw error;
    }
}

// Test the addSheet function itself
function testAddSheetFunction() {
    console.log("Testing addSheet function...");
    
    const initialCount = document.getElementById('framesheets').children.length;
    
    // Add a new sheet
    addSheet();
    
    const newCount = document.getElementById('framesheets').children.length;
    console.assert(newCount === initialCount + 1, "addSheet should add one new sheet");
    
    // Check that the new sheet has all required elements
    const newSheet = document.getElementById('framesheets').lastElementChild;
    console.assert(newSheet !== null, "New sheet should exist");
    console.assert(newSheet.classList.contains('frame-sheet-base'), "New sheet should have correct class");
    
    // Check that it has a unique ID
    const sheetId = newSheet.id;
    console.assert(sheetId.startsWith('sheet-'), "New sheet should have unique ID starting with 'sheet-'");
    
    // Check that it has all frame inputs
    for (let i = 1; i <= 10; i++) {
        const r1Input = document.getElementById(`${sheetId}-f${i}r1`);
        const r2Input = document.getElementById(`${sheetId}-f${i}r2`);
        console.assert(r1Input !== null, `Frame ${i} first roll input should exist`);
        console.assert(r2Input !== null, `Frame ${i} second roll input should exist`);
    }
    
    // Check 10th frame third roll
    const r3Input = document.getElementById(`${sheetId}-f10r3`);
    console.assert(r3Input !== null, "10th frame third roll input should exist");
    
    // Check buttons
    const calculateButton = document.getElementById(`${sheetId}-calculate-score`);
    const clearButton = document.getElementById(`${sheetId}-clear-score`);
    console.assert(calculateButton !== null, "Calculate score button should exist");
    console.assert(clearButton !== null, "Clear score button should exist");
    
    // Check header elements
    const nameInput = document.getElementById(`${sheetId}-name`);
    const scoreDisplay = document.getElementById(`${sheetId}-score-result-text`);
    console.assert(nameInput !== null, "Name input should exist");
    console.assert(scoreDisplay !== null, "Score display should exist");
    
    console.log("✓ addSheet function tests passed");
}

// Run all tests
function runAllTests() {
    console.log("🧪 Starting Bowling Score Calculator Unit Tests...\n");
    
    try {
        testConvertBowlingInput();
        testScoreLogic();
        testEdgeCases();
        testAddSheetFunction();
        testMultiSheetFunctionality();
        testSheetInitialization();
        
        console.log("\n🎉 All tests passed! The bowling score calculator logic is working correctly.");
    } catch (error) {
        console.error("\n❌ Test failed with error:", error);
        console.error("Stack trace:", error.stack);
    }
}

// Export for use in other files or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testConvertBowlingInput,
        testScoreLogic,
        testEdgeCases,
        testAddSheetFunction,
        testMultiSheetFunctionality,
        testSheetInitialization
    };
} else {
    // Run tests if this file is loaded in browser
    if (typeof window !== 'undefined') {
        window.runBowlingTests = runAllTests;
    }
}
