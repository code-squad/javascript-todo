let todos = [];

const ops = require("./todoFunction");
const readline = require("readline");
const helpMsg = `명령하세요 : `;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt(helpMsg);
rl.prompt();

rl.on("line", function(input) {
  const parsedInput = input.split("$");
  const command = parsedInput[0];
  const args = parsedInput.slice(1);

  if (command === "exit") {
    rl.close();
  }

  if (ops[command] !== undefined) {
    ops[command](todos, ...args);
  }

  rl.prompt();
}).on("close", function() {
  process.exit(0);
});
