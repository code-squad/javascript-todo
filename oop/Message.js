const ERR_MSG = {
    "NO_SHELL" : "명령어에 $를 포함시켜주세요.",
    "INCORRECT_INST" : "사용가능한 명령어는 add | update | delete | show 입니다.",
    "LACK_PARAMETER" : "명령어를 실행하는데 매게변수가 부족합니다.",
    "NOT_EXIST_ID" : "존재하지 않는 아이디입니다.",
    "INCORRECT_STATUS" : "사용가능한 [[status]] 는 todo | doing | done 입니다.",
    "SAME_STATUS" : "같은 상태로 업데이트가 불가능합니다."
}

module.exports = {
    ERR_MSG
}
