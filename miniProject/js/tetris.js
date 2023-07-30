import BLOCKS from "./blocks.js";

//DOM: 웹 페이지에 대한 인터페이스
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game_txt");
const gameSet = document.querySelector(".game_start");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game_txt > button");
const startButton = document.querySelector(".game_start > button");
const levelDisplay = document.querySelector(".level > span");

//Setting (테트리스 가로세로 판 크기지정값)
const GAME_ROWS = 20;
const GAME_COLS = 10;

//variables 변수
let score = 0;
let level = 0;
let duration = 700;
let downInterval;
let tempMovingItem;



const movingItem = {
    type: "",
    direction: 0,
    top: 0,
    left: 0,
};

//게임시작버튼
startButton.onclick = function () {
    // playground.innerHTML = "";
    gameSet.style.display = "none";
    init();
}


//funtions
function init() {
    // blockArray.forEach(block => {
    //     console.log(block[0]);
    // })

    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewline();
    }
    generateNewBlock(); //블럭이 하나가 다 내려가면 새로 하나를 불러주는 함수
}


function prependNewline() {

    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    }
    li.prepend(ul);
    playground.prepend(li);
}


function renderBlocks(moveType = "") {
    //테트리스 이동시 움직일때 이동만큼 이미지 이동
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving");
    })

    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        //화면 밖으로 이동하면 오류가 뜨지 않게하기 위해 조건을 세운다, 조건? 참일경우:거짓일경우
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        //블럭이 쌓이게 만들기
        const isAvailable = checkEmpty(target);
        if (isAvailable) {
            target.classList.add(type, "moving");
        } else {
            tempMovingItem = { ...movingItem }
            if (moveType === 'retry') {
                clearInterval(downInterval)
                showGameOverText();
            }
            //이벤트를 계속 호출하는 상황 방지 ( 상하좌우 전부 다 방지시켜야한다. )
            setTimeout(() => {
                renderBlocks('retry');
                if (moveType === "top") {
                    seizeBlock();
                } else {

                }
            }, 0)
            return true;
        }
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}


//상하좌우 모두 블록이 이탈하지 않게 하는 함수 생성 //블록 누적해서 쌓기
function seizeBlock() {
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch();
}

//한줄이 다 맞을경우 li가 다 맞았을 경우
function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            //li가 맞지 않으면, 블럭이 잘 결합되지 않은것이므로 false반환
            if (!li.classList.contains("seized")) {
                matched = false;
            }
        });
        //한줄이 다 맞았을 경우 지우고 점수 올리기
        if (matched) {
            child.remove();
            prependNewline();
            score += 10;
            scoreDisplay.innerHTML = score;
            if(score === 50){
                level = 1;
                levelDisplay.innerHTML = level;
                duration = 500;
            }else if(score === 100){
                level = 2;
                levelDisplay.innerHTML = level;
                duration = 300;
            }else if(score === 150){
                level = 3;
                levelDisplay.innerHTML = level;
                duration = 100;
            }
        }
    })
    generateNewBlock();
}

//블럭 한개가 쌓이면 새로운 블럭 새로 생성되는 함수
function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, duration)//duration 은 500으로 변수에 지정해놈.



    // console.log(BLOCKS); //블록모양의 종류함수 출력
    const blockArray = Object.entries(BLOCKS);
    // console.log(blockArray); //6, 블록종류의 갯수 출력

    //블록종류의 함수 인덱스 중에서 랜덤된 숫자(정수)의 값을 가져오기 floor은 소숫점 제거해주는 함수
    const randomIndex = Math.floor(Math.random() * blockArray.length);

    //블록종류의 이름을 가져와서 그 블록이름의 블록을 실행하게끔 만들기??
    //일단 블록종류가 각각의 인덱스가 정해져있는데 그 인덱스 0번째는 블록의 이름으로 설정되어있다.

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
}

function checkEmpty(target) {
    if (!target || target.classList.contains("seized")) {
        return false;
    }
    return true;
}
//테트리스 이동이미지 함수 // moveType은 블럭의 타입, amount는 뭐지?? 
function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
//테트리스 모양바꾸기 함수
function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
}
//스페이스바 누르면 아래로 쭉 내려가는 작업
function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1);
    }, 20)
}
//게임이 끝나면 나오는 화면
function showGameOverText() {
    gameText.style.display = "flex";
    score = 0;
    scoreDisplay.innerHTML = score;
    level = 0;
    levelDisplay.innerHTML = level;

}
//event handling ( 테트리스 이동 이벤트 )
document.addEventListener("keydown", e => {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1);
            break;
        case 40:
            moveBlock("top", 1);
            break;
        case 38:
            changeDirection();
            break;
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    init();
})