const readline = require("readline")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.setPrompt("명령어를 입력하세요 : ")
rl.prompt()

rl.on("line", (command) => {
    if (command === "quit") {
        rl.close()
    } 
    else {
        console.log(command)
        rl.prompt()
    }
}).on("close", () => {
    process.exit()
})


