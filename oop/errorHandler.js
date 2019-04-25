module.exports = function ErrorHandler() {
    this.showUsage = () => {
        console.log("[command]$[args1]$[args2]");
    }
    this.showNotExistIdErrorMessage = () => {
        console.log("존재하지 않는 아이디입니다.");
    }
    this.showExistErrorMessage = (status) => {
        console.log(`이 놈은 이미 ${status}`);
    }
}