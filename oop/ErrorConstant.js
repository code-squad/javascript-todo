const ERR_MSG = {
    "NO_SHELL" : "명령어에 $를 포함시켜주세요.",
    "INCORRECT_INST" : "사용가능한 명령어는 add | update | delete | show 입니다.",
    "PARAMETER_ERROR" : "해당 명령어의 매게변수가 잘못되었습니다.",
    "NOT_EXIST_ID" : "존재하지 않는 아이디입니다.",
    "INCORRECT_STATUS" : "사용가능한 [[status]] 는 todo | doing | done 입니다.",
    "SAME_STATUS" : "같은 상태로 업데이트가 불가능합니다.",
    "TAG_SHAPE_ERROR" : "올바른 태그 형식이 아닙니다.",
    "NO_MORE_REDO" : "더 이상 redo 할 수 없습니다.",
    "NO_MORE_UNDO" : "더 이상 undo 할 수 없습니다.",
}

module.exports = {
    ERR_MSG
}
