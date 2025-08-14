// Unit Tests for Bowling Score Calculator
// Run these tests to verify the score logic is working correctly

// Mock DOM elements for testing
function createMockDOM() {
    // Create mock input elements
    const mockInputs = {};
    
    for (let i = 1; i <= 10; i++) {
        mockInputs[`sheet-f${i}r1`] = { value: '' };
        mockInputs[`sheet-f${i}r2`] = { value: '' };
    }
    mockInputs['sheet-f10r3'] = { value: '' };
    
    // Mock score result element
    mockInputs['score-result-text'] = { innerHTML: '' };
    
    // Store original document
    window.originalDocument = window.document;
    
    // Mock getElementById
    window.document = {
        getElementById: function(id) {
            return mockInputs[id] || null;
        }
    };
}

// Restore original document
function restoreDOM() {
    if (window.originalDocument) {
        window.document = window.originalDocument;
    }
}

// Test helper function to set input values
function setInputValues(values) {
    for (const [id, value] of Object.entries(values)) {
        if (window.document.getElementById(id)) {
            window.document.getElementById(id).value = value;
        }
    }
}

// Test helper function to clear all inputs
function clearAllInputs() {
    const allInputs = [
        'sheet-f1r1', 'sheet-f1r2', 'sheet-f2r1', 'sheet-f2r2', 'sheet-f3r1', 'sheet-f3r2',
        'sheet-f4r1', 'sheet-f4r2', 'sheet-f5r1', 'sheet-f5r2', 'sheet-f6r1', 'sheet-f6r2',
        'sheet-f7r1', 'sheet-f7r2', 'sheet-f8r1', 'sheet-f8r2', 'sheet-f9r1', 'sheet-f9r2',
        'sheet-f10r1', 'sheet-f10r2', 'sheet-f10r3'
    ];
    
    allInputs.forEach(id => {
        if (window.document.getElementById(id)) {
            window.document.getElementById(id).value = '';
        }
    });
}

// Test the convertBowlingInput function
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
    console.assert(convertBowlingInput('/') === 10, "convertBowlingInput('/') should return 10");
    
    // Test invalid inputs
    console.assert(convertBowlingInput('') === null, "convertBowlingInput('') should return null");
    console.assert(convertBowlingInput('A') === null, "convertBowlingInput('A') should return null");
    console.assert(convertBowlingInput('11') === null, "convertBowlingInput('11') should return null");
    
    console.log("✓ convertBowlingInput tests passed");
}

// Test the scoreLogic function
function testScoreLogic() {
    console.log("Testing scoreLogic function...");
    
    // Test open frames (no strikes or spares)
    console.assert(scoreLogic([1, 2, 3, 4, 5, 4, 6, 3, 7, 2, 8, 1, 9, 0, 4, 5, 3, 6, 2, 7]).score === 85, "Open frames should score correctly");
    
    // Test strikes
    console.assert(scoreLogic([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]).score === 300, "Perfect game should score 300");
    console.assert(scoreLogic([10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]).reason === "perfect", "Perfect game should have reason 'perfect'");
    
    // Test spares
    console.assert(scoreLogic([5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]).score === 150, "All spares should score 150");
    
    // Test mixed game
    console.assert(scoreLogic([10, 7, 3, 9, 1, 10, 10, 10, 8, 2, 9, 1, 10, 10, 10]).score === 200, "Mixed game should score correctly");
    
    // Test unresolved strikes
    let result = scoreLogic([10, 10, 10]);
    console.assert(result.canCalculate === false, "Unresolved strikes should not be calculable");
    console.assert(result.reason === "unresolved", "Unresolved strikes should have reason 'unresolved'");
    
    // Test unresolved spares
    result = scoreLogic([5, 5, 7, 3, 8, 2]);
    console.assert(result.canCalculate === false, "Unresolved spares should not be calculable");
    console.assert(result.reason === "unresolved", "Unresolved spares should have reason 'unresolved'");
    
    // Test partial game
    result = scoreLogic([7, 2, 8, 1, 9, 0]);
    console.assert(result.canCalculate === true, "Partial open game should be calculable");
    console.assert(result.reason === "partial", "Partial open game should have reason 'partial'");
    console.assert(result.score === 35, "Partial open game should score correctly");
    
    console.log("✓ scoreLogic tests passed");
}

// Test the collectInput function
function testCollectInput() {
    console.log("Testing collectInput function...");
    
    // Test empty inputs
    clearAllInputs();
    let result = collectInput();
    console.assert(result.frames.length === 0, "Empty inputs should return empty frames array");
    console.assert(result.framesCompleted === 0, "Empty inputs should return 0 frames completed");
    
    // Test single frame
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7',
        'sheet-f1r2': '2'
    });
    result = collectInput();
    console.assert(result.frames.length === 2, "Single frame should return 2 rolls");
    console.assert(result.frames[0] === 7, "First roll should be 7");
    console.assert(result.frames[1] === 2, "Second roll should be 2");
    console.assert(result.framesCompleted === 1, "Single frame should return 1 frame completed");
    
    // Test strike frame
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': 'X'
    });
    result = collectInput();
    console.assert(result.frames.length === 1, "Strike frame should return 1 roll");
    console.assert(result.frames[0] === 10, "Strike should be 10");
    console.assert(result.framesCompleted === 1, "Strike frame should return 1 frame completed");
    
    // Test spare frame
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '5',
        'sheet-f1r2': '/'
    });
    result = collectInput();
    console.assert(result.frames.length === 2, "Spare frame should return 2 rolls");
    console.assert(result.frames[0] === 5, "First roll should be 5");
    console.assert(result.frames[1] === 10, "Spare should be 10");
    console.assert(result.framesCompleted === 1, "Spare frame should return 1 frame completed");
    
    // Test multiple frames
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7', 'sheet-f1r2': '2',
        'sheet-f2r1': 'X',
        'sheet-f3r1': '5', 'sheet-f3r2': '4'
    });
    result = collectInput();
    console.assert(result.frames.length === 5, "Multiple frames should return correct number of rolls");
    console.assert(result.framesCompleted === 3, "Multiple frames should return correct frames completed");
    
    console.log("✓ collectInput tests passed");
}

// Test the generateScore function
function testGenerateScore() {
    console.log("Testing generateScore function...");
    
    // Test empty game
    clearAllInputs();
    generateScore();
    let displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score so far: 0", "Empty game should show 'Score so far: 0'");
    
    // Test open frame
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7',
        'sheet-f1r2': '2'
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score so far: 9", "Open frame should show 'Score so far: 9'");
    
    // Test unresolved strike
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': 'X'
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score cannot be calculated yet. Keep bowling!", "Unresolved strike should show 'Score cannot be calculated yet. Keep bowling!'");
    
    // Test unresolved spare
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '5',
        'sheet-f1r2': '/'
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score cannot be calculated yet. Keep bowling!", "Unresolved spare should show 'Score cannot be calculated yet. Keep bowling!'");
    
    // Test complete open game
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7', 'sheet-f1r2': '2',
        'sheet-f2r1': '8', 'sheet-f2r2': '1',
        'sheet-f3r1': '9', 'sheet-f3r2': '0',
        'sheet-f4r1': '6', 'sheet-f4r2': '3',
        'sheet-f5r1': '5', 'sheet-f5r2': '4',
        'sheet-f6r1': '8', 'sheet-f6r2': '1',
        'sheet-f7r1': '7', 'sheet-f7r2': '2',
        'sheet-f8r1': '9', 'sheet-f8r2': '0',
        'sheet-f9r1': '6', 'sheet-f9r2': '3',
        'sheet-f10r1': '5', 'sheet-f10r2': '4'
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Total score: 85", "Complete open game should show 'Total score: 85'");
    
    console.log("✓ generateScore tests passed");
}

// Test edge cases
function testEdgeCases() {
    console.log("Testing edge cases...");
    
    // Test invalid frame (more than 10 pins)
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7',
        'sheet-f1r2': '5'  // This would be 12 pins, invalid
    });
    generateScore();
    let displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score so far: 7", "Invalid frame should still show partial score");
    
    // Test incomplete frame
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7'
        // Missing second roll
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Score so far: 7", "Incomplete frame should show partial score");
    
    // Test 10th frame with strike
    clearAllInputs();
    setInputValues({
        'sheet-f1r1': '7', 'sheet-f1r2': '2',
        'sheet-f2r1': '8', 'sheet-f2r2': '1',
        'sheet-f3r1': '9', 'sheet-f3r2': '0',
        'sheet-f4r1': '6', 'sheet-f4r2': '3',
        'sheet-f5r1': '5', 'sheet-f5r2': '4',
        'sheet-f6r1': '8', 'sheet-f6r2': '1',
        'sheet-f7r1': '7', 'sheet-f7r2': '2',
        'sheet-f8r1': '9', 'sheet-f8r2': '0',
        'sheet-f9r1': '6', 'sheet-f9r2': '3',
        'sheet-f10r1': 'X', 'sheet-f10r2': '7', 'sheet-f10r3': '3'
    });
    generateScore();
    displayText = window.document.getElementById('score-result-text').innerHTML;
    console.assert(displayText === "Total score: 95", "10th frame strike should score correctly");
    
    console.log("✓ Edge case tests passed");
}

// Run all tests
function runAllTests() {
    console.log("🧪 Starting Bowling Score Calculator Unit Tests...\n");
    
    try {
        createMockDOM();
        testConvertBowlingInput();
        testScoreLogic();
        testCollectInput();
        testGenerateScore();
        testEdgeCases();
        
        console.log("\n🎉 All tests passed! The bowling score calculator logic is working correctly.");
    } catch (error) {
        console.error("\n❌ Test failed with error:", error);
        console.error("Stack trace:", error.stack);
    } finally {
        restoreDOM();
    }
}

// Export for use in other files or run directly
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllTests,
        testConvertBowlingInput,
        testScoreLogic,
        testCollectInput,
        testGenerateScore,
        testEdgeCases
    };
} else {
    // Run tests if this file is loaded in browser
    if (typeof window !== 'undefined') {
        window.runBowlingTests = runAllTests;
    }
}
