class Rover {
   // Write code here!
   constructor(position, generatorWatts = 110) {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = generatorWatts;
   }
   receiveMessage(msg) {
      let commandResults = [];
      let commands = msg.commands;

      // only if atleast one command exist, we are executing the command
      if (commands) {
         for (let i = 0; i < commands.length; i++) {
            let currentCommand = commands[i];
            if (currentCommand.commandType === 'STATUS_CHECK') {
               commandResults.push(this.executeStatusCheckCommand());
            }
            else if (currentCommand.commandType === 'MODE_CHANGE') {
               commandResults.push(this.executeModeChangeCommand(currentCommand.value));
            }
            else if (currentCommand.commandType === 'MOVE') {
               commandResults.push(this.executeMoveCommand(currentCommand.value));
            }
         }
      }

      let returnMessage = {
         message : msg.name,
         results : commandResults
      }

      return returnMessage;     
   }

   executeStatusCheckCommand() {
    return {
      completed: true,
      roverStatus: {
         mode: this.mode,
         generatorWatts: this.generatorWatts,
         position : this.position
      }
    };
   }

   executeModeChangeCommand(value) {
      this.mode = value;
      return {
         completed : true
      };
   }

   executeMoveCommand(value) {
      let completedStatus = false;
      if (this.mode === "NORMAL") {
         this.position = value;
         completedStatus = true;
      } 
      return {
         completed : completedStatus
      };
   }
}

module.exports = Rover;