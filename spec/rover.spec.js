const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!
  it("constructor sets position and default values for mode and generatorWatts", function() {
    const expectedPosition = 10000;
    const actualRover = new Rover(expectedPosition);

    expect(actualRover.position).toBe(expectedPosition);
    expect(actualRover.mode).toBe('NORMAL');      // Default rover mode must be NORMAL
    expect(actualRover.generatorWatts).toBe(110); // Default generatorWatts must be 110
  });

  it("response returned by receiveMessage contains the name of the message", function() {
    const expectedMessage = "Test message with expected commands";
    const testMessage = new Message(expectedMessage);
    const testRover = new Rover(1);
    const actualResult = testRover.receiveMessage(testMessage);

    expect(actualResult.message).toBe(expectedMessage);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    const testMessage = "Test message with expected commands";
    const inputCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    const inputMessage = new Message(testMessage, inputCommands);
    const testRover = new Rover(1);

    const actualResult = testRover.receiveMessage(inputMessage);
    expect(actualResult.message).toBe(testMessage);
    expect(actualResult.results.length).toBe(inputCommands.length);
  });

  it("responds correctly to the status check command", function() {
    const initialPosition = 1000;
    const testMessage = "Test message with Status command";
    const statusCheckCommand = [new Command('STATUS_CHECK')];
    const inputMessage = new Message(testMessage, statusCheckCommand);
    const testRover = new Rover(initialPosition);
    const actualResult = testRover.receiveMessage(inputMessage);

    expect(actualResult.message).toBe(testMessage);
    expect(actualResult.results[0].roverStatus.mode).toBe("NORMAL");
    expect(actualResult.results[0].roverStatus.generatorWatts).toBe(110);
    expect(actualResult.results[0].roverStatus.position).toBe(initialPosition);
  });

  it("responds correctly to the mode change command", function() {
    const testPosition = 1;
    const testMessage = "Test message with mode change command";
    const testRover = new Rover(testPosition);

    //Checking whether change to Low Power mode is successful
    const lowPowerCommand = [new Command('MODE_CHANGE', 'LOW_POWER')];
    const lowPowerMessage = new Message(testMessage, lowPowerCommand);
    const lowPowerResult = testRover.receiveMessage(lowPowerMessage);

    expect(lowPowerResult.results[0].completed).toBe(true);
    expect(testRover.mode).toBe("LOW_POWER");

    //Checking whether change back to Normal mode is successful
    const normalValueCommand = [new Command('MODE_CHANGE', 'NORMAL')];
    const normalValueMessage = new Message(testMessage, normalValueCommand);
    const normalValueResult = testRover.receiveMessage(normalValueMessage);
    
    expect(normalValueResult.results[0].completed).toBe(true);
    expect(testRover.mode).toBe("NORMAL");
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    const initialPosition = 10;
    const testMessage = "Test message with Move command";
    const testRover = new Rover(initialPosition);

    // Setting the rover in low power mode
    const lowPowerCommand = [new Command('MODE_CHANGE', 'LOW_POWER')];
    const lowPowerMessage = new Message(testMessage, lowPowerCommand);
    const lowPowerResult = testRover.receiveMessage(lowPowerMessage);
    expect(testRover.mode).toBe("LOW_POWER");
    expect(lowPowerResult.results[0].completed).toBe(true);

    // Attempting to move the rover during low power mode
    const moveCommand = [new Command("MOVE", 20)];
    const moveMessage = new Message(testMessage, moveCommand);
    const moveResult = testRover.receiveMessage(moveMessage);

    // Rover move to fail and return completed as false
    expect(moveResult.results[0].completed).toBe(false);
    expect(testRover.position).toBe(initialPosition);
  });

  it("responds with the position for the move command", function() {
    const initialPosition = 999;
    const testMessage = "Test message with Move command";
    const testRover = new Rover(initialPosition);

    // Move the rover to new position
    const moveCommand = [new Command("MOVE", 1000)];
    const moveMessage = new Message(testMessage, moveCommand);
    const moveResult = testRover.receiveMessage(moveMessage);

    // Move should be successful as rover is in normal mode
    expect(moveResult.results[0].completed).toBe(true);
    expect(testRover.position).toBe(1000);
  });
});
