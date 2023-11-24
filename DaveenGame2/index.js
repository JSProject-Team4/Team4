// ============ 변수 모음zip ============ //
// 캔버스 위에 그래픽을 렌더링하기 위해서
// 캔버스 엘리먼트에 대한 참조를 [ canvas ] 변수에 저장함
// 그림을 그리는 실질적 도구인 2D rendering ctx를 [ ctx ]변수에 저장함
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// 공의 시작위치 지정 ( 화면 중앙 + 하단부터 30px 윗칸)
let x = canvas.width / 2;
let y = canvas.height - 70;

// 공의 반지름
let ballRadius = 10;
// const ballRadius = 30;

// 아이템의 반지름
const itemRadius = 20;
// 아이템의 시작위치
let itemX;
let itemY;
let itemDrop = false;
let randomNum = 0;

let rndm;

// 공튕기는 소리
let bSound = new Audio('./Sound/ballSound.mp3');

// 공의 좌표를 계속 변하게 하기 위해서 프레임마다 x와 y에 추가될 값
let movingX = 2;
let MovingY = -2;

// 라켓 높이, 길이, 시작위치
// let 사용이유 = 아이템 등 여러 요인으로 라켓의 넓이,높이가 변경될 수 있기 때문에
let racketHeight = 10;
let racketWidth = 75;
let racketX = (canvas.width - racketWidth) / 2; // canvas의 길이에서 라켓길이를 빼고 그것의 반절의 위치
let racketY = canvas.height - 40;

// 좌, 우 키보드 입력변수
let rightKey = false;
let leftKey = false;

// 벽돌의 행과 열
const blockRow = 7;
const blockColumn = 6;
// 벽돌의 넓이와 높이
const blockWidth = 75;
const blockHeight = 20;
// 벽돌 추워서 패딩입음
const blockPadding = 10;
const blockOffsetLeft = 30;
const blockOffsetTop = 30;

// 벽돌 배열을 초기화함 status: 1  <<== 1이면 그림, 0이면 안그림(삭제)
const blocks = [];
for (let i = 0; i < blockColumn; i++) {
  blocks[i] = [];
  for (let z = 0; z < blockRow; z++) {
    blocks[i][z] = { x: 0, y: 0, status: 1 };
  }
}

// 이미지 로딩 및 그리기
let ballImageLoaded = false;
let ballImage = new Image();
ballImage.src = './image/발리볼.png';
ballImage.onload = function () {
  ballImageLoaded = true;
};
let itemImageLoaded = false;
let itemImage = new Image();
itemImage.src = './image/star.png';
itemImage.onload = function () {
  itemImageLoaded = true;
};
let blockImageLoaded = false;
let blockImage = new Image();
blockImage.src = './image/block.jpg';
blockImage.onload = function () {
  blockImageLoaded = true;
};

// 헤더의 스코어 <p>태그
const $score = document.getElementById('score');
$score.textContent = 0;

let firstMusic = false;

// 일시정지 스코어
let $pauseScore = document.querySelector('.sscore');
// 게임오버 스코어
let $gameOverScore = document.querySelector('.ssscore');

const $gameOverModal = document.querySelector('.gameOverModal');

// ============ 주인"공"을 캔버스 위에 그리는 파트 ============ //
// 주인"공"을 그리는 함수
function drawBallWithImage(image) {
  ctx.drawImage(
    image,
    x - ballRadius,
    y - ballRadius,
    ballRadius * 2,
    ballRadius * 2
  );
}
function drawBall() {
  ctx.beginPath(); // 그리기 시작
  ctx.arc(x, y, ballRadius, 0, 10); // x: 50, y: 50, 반지름: 10, 시작각도, 끝 각도
  // ctx.fillStyle = 'yellow';
  // ctx.fill();
  ctx.closePath(); // 그리기 끝

  if (ballImageLoaded) {
    ctx.drawImage(
      ballImage,
      x - ballRadius,
      y - ballRadius,
      ballRadius * 2,
      ballRadius * 2
    );
  }
} // drawBall() 함수 끝

// 라켓을 그리는 함수
function drawRacket() {
  ctx.beginPath();
  ctx.shadowBlur = 10; // 그림자의 흐림 정도
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 그림자 색상
  ctx.shadowOffsetX = 5; // 그림자의 X축 오프셋
  ctx.shadowOffsetY = 5; // 그림자의 Y축 오프셋
  ctx.rect(racketX, racketY, racketWidth, racketHeight);
  ctx.fillStyle = 'yellowgreen';
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
}

// for (let i = 0; i < blockColumn; i++) {
//   blocks[i] = [];

//   for (let z = 0; z < blockRow; z++) {
//       blocks[i][z] = { x: 0, y: 0 };
//   }
// }
// const randomNum = Math.floor(Math.random() * (10 - 1) + 1);
// console.log(randomNum);
// if (randomNum === 7) {
//   ctx.fillStyle = 'gray';
// } else {
//   ctx.fillStyle = '#0095DD';
// }

// 파괴할 오브젝트(블록)을 그리는 함수
function makeBlock() {
  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      if (blocks[i][z].status === 1) {
        let blockX = i * (blockWidth + blockPadding) + blockOffsetLeft;
        let blockY = z * (blockHeight + blockPadding) + blockOffsetTop;
        blocks[i][z].x = blockX;
        blocks[i][z].y = blockY;

        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        // ctx.fillStyle = '#0095DD';
        // ctx.fill();
        ctx.closePath();

        if (itemImageLoaded) {
          ctx.drawImage(blockImage, blockX, blockY, blockWidth, blockHeight);
        }
      }
    }
  }
}

const bSoundPlay = () => {
  if (firstMusic) bSound.volume = 1;
  bSound.play();
  randomNum = Math.floor(Math.random() * (8 - 1) + 1);
  // console.log('숫자:', randomNum);

  rndm = Math.floor(Math.random() * (3 - 1) + 1);
};

// 주인"공"이 블록에 닿았을때 블록을 삭제하는 함수
// && 공이 블록에 닿았을때 튕기는 함수
function blockDelete() {
  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      const target = blocks[i][z];

      // if (target.status === 1) {
      //   if (
      //     x > target.x &&
      //     x < target.x + blockWidth &&
      //     y > ballRadius + target.y &&
      //     // y < target.y + blockHeight*2.4
      //     y < target.y + blockHeight * 1.6
      //   ) {
      //     MovingY = -MovingY;
      //     target.status = 0;
      //     $score.textContent = +$score.textContent + 100;
      //     bSoundPlay();
      //   }

      //   $pauseScore.textContent = $score.textContent;
      //   $gameOverScore.textContent = $score.textContent;
      // }

      if (target.status === 1) {
        if (
          x >= target.x &&
          x <= target.x + blockWidth &&
          y - ballRadius <= target.y + blockHeight
        ) {
          MovingY = -MovingY;
          target.status = 0;
          $score.textContent = +$score.textContent + 100;
          bSoundPlay();
          if (+$score.textContent > 4100) {
            gameOver();
          }
          if (randomNum === 2) {
            console.log('랜덤아이템 드랍!');
            itemDrop = true;
            itemX = target.x + blockWidth / 2 - 12;
            itemY = target.y;
          }
        }

        if (
          y >= target.y &&
          y <= target.y + blockHeight &&
          x + ballRadius >= target.x &&
          x - ballRadius <= target.x + blockWidth
        ) {
          movingX = -movingX;
          target.status = 0;
          $score.textContent = +$score.textContent + 100;
          bSoundPlay();
          if (+$score.textContent > 4100) {
            gameOver();
          }
        }

        $pauseScore.textContent = $score.textContent;
        $gameOverScore.textContent = $score.textContent;
      }
    }
  }
}

function drawItem() {
  ctx.beginPath(); // 그리기 시작
  ctx.rect(itemX, itemY, 30, 30);
  // ctx.fillStyle = 'yellow';
  // ctx.fill();
  ctx.closePath(); // 그리기 끝

  if (itemImageLoaded) {
    ctx.drawImage(itemImage, itemX, itemY, 30, 30);
  }
}
const $bigTimer = document.querySelector('.bigTimer');
const $longTimer = document.querySelector('.longTimer');
function setTT(e) {
  e.textContent = 10;
  setTimeout(function () {
    e.textContent = 9;
  }, 1000);
  setTimeout(function () {
    e.textContent = 8;
  }, 2000);
  setTimeout(function () {
    e.textContent = 7;
  }, 3000);
  setTimeout(function () {
    e.textContent = 6;
  }, 4000);
  setTimeout(function () {
    e.textContent = 5;
  }, 5000);
  setTimeout(function () {
    e.textContent = 4;
  }, 6000);
  setTimeout(function () {
    e.textContent = 3;
  }, 7000);
  setTimeout(function () {
    e.textContent = 2;
  }, 8000);
  setTimeout(function () {
    e.textContent = 1;
  }, 9000);
  setTimeout(function () {
    e.textContent = 0;
  }, 10000);
}

let isBig = false;
// 떨어지는 아이템을 라켓으로 먹으면 능력이 발동하는 함수!!
function catchItemHandler() {
  if (isBig === false) {
    if (x < 30) {
      x = 40;
      console.log('왼쪽벽으로부터 이동!');
    } else if (x > 520) {
      x = 520;
      console.log('오른벽으로부터 이동!');
    } else if (y < 30) {
      y = 40;
    }
    isBig = true;
    ballRadius = 30;

    setTT($bigTimer);

    setTimeout(function () {
      ballRadius = 10;
      itemX=0;
      itemY=0;
      isBig = false;
    }, 10000);
  }
}
let isLong = false;
function catchItemHandler2() {
  if (isLong === false) {
    isLong = true;
    racketWidth = 150;
    racketHeight = 20;

    setTT($longTimer);

    setTimeout(function () {
      racketWidth = 75;
      racketHeight = 10;
      itemX=0;
      itemY=0;
      isLong = false;
    }, 10000);
  }
}

// 게임을 리셋하는 함수
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 70;
  movingX = 2;
  MovingY = -2;

  racketX = (canvas.width - racketWidth) / 2; // canvas의 길이에서 라켓길이를 빼고 그것의 반절의 위치
  racketY = canvas.height - 40;

  for (let i = 0; i < blockColumn; i++) {
    for (let z = 0; z < blockRow; z++) {
      blocks[i][z].status = 1;
    }
  }

  $score.textContent = 0;
}

// 게임을 종료하는 함수
function gameOver() {
  if (+$score.textContent > 4100) {
    setTimeout(function () {
      // clearInterval(intervalId);
      pauseDrawing();
      $gameClearModal.style.display = 'flex';
      $pauseBackdrop.style.display = 'flex';
    }, 200);
    return;
  }
  setTimeout(function () {
    // clearInterval(intervalId);
    pauseDrawing();
    $gameOverModal.style.display = 'flex';
    $pauseBackdrop.style.display = 'flex';
  }, 200);
}

// 그리기 함수 (10밀리초마다 호출됨 = 무한작동)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 공을 그리기 전에 기존에 공을 지운다
  makeBlock(); // 블록 그리기 함수
  drawBall(); // 주인"공" 그리기 함수 호출
  drawRacket(); // 라켓 그리기 함수 호출
  blockDelete();
  if (itemDrop === true) {
    drawItem();
    itemY += 1;
  }

  // ============ 주인"공"을 벽에 튕기게 하는 파트 ============ //
  // 만약에 현재의 높이에서 + MovingY( -2 )를 했을때 0보다 작아지는경우(벽을넘어감)
  // plusY를 양수로 바꿔서 반대로 움직이게해서 벽에 튕기는것처럼 보이게 한다
  // (화면 위를 넘어갈때)
  if (y + MovingY < ballRadius) {
    MovingY = -MovingY;
  }
  // 공이 화면 아래로 향했을때의 코드
  else if (y + MovingY > racketY - ballRadius) {
    if (y + movingX > canvas.height - ballRadius) {
      gameOver();
    }
  }

  // (화면 왼쪽을 넘어가거나 화면 오른쪽으로 넘어가거나)
  if (x + movingX > canvas.width - ballRadius || x + movingX < ballRadius) {
    movingX = -movingX;
  }

  // 라켓에 주인"공"이 닿았을 때, 벽에 튀긴것처럼 튕기게 하기
  if (x > racketX && x < racketX + racketWidth && y + ballRadius > racketY) {
    MovingY = -MovingY;
    if (y + ballRadius >= 460) {
      y = 450;
    }
    if (isBig) {
      if (y + ballRadius >= 460) {
        y = 430;
      }
    }
    // bSound.volume = 5;
    // bSound.play();
  }

  // 라켓으로 아이템을 먹으면?
  if (itemX > racketX && racketX + racketWidth && itemY + 10 > racketY) {
    itemDrop = false;

    if (rndm === 2) {
      if (isBig === false) catchItemHandler();
    } else {
      if (isLong === false) catchItemHandler2();
    }
  }

  if (rightKey && racketX < canvas.width - racketWidth) {
    // 좌우 각 방향키를 누르면 10의 속도(10px)로 움직인다. 라켓이 벽을 넘지않는 선에서
    racketX += 10;
  } else if (leftKey && racketX > 0) {
    racketX -= 10;
  }

  x += movingX; // x의 값 +2
  y += MovingY; // y의 값 -2

  if (stop === false) {
    requestAnimationFrame(draw);
  }
} // draw() 함수 끝

// 키보드 이벤트리스너
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightKey = true;
  } else if (e.keyCode == 37) {
    leftKey = true;
  }
}
function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightKey = false;
  } else if (e.keyCode == 37) {
    leftKey = false;
  }
}
// document.addEventListener("mousemove", mouseMoveHandler, false);
// function mouseMoveHandler(e) {
//   const relativeX = e.clientX - canvas.offsetLeft;
//   if (relativeX > 0 && relativeX < canvas.width) {
//     racketX = relativeX - racketWidthWidth / 2;
//   }
// }

// BGM 온오프 버튼
const $bgmBtn = document.getElementById('bgm');
const $musicIcon = document.querySelector('.custom-loader');
let isPlaying = false;
let audio = new Audio('./Sound/song.mp3');
$bgmBtn.addEventListener('click', () => {
  if (isPlaying === false) {
    isPlaying = true;
    audio.volume = 1;
    audio.play();
    $musicIcon.style.width = '22.5px';
    $musicIcon.style.height = '30px';
  } else {
    isPlaying = false;
    audio.pause();
    $musicIcon.style.width = 0;
    $musicIcon.style.height = 0;
  }
});

// 일시정지 모달
const $pauseModal = document.querySelector('.pauseModal');
const $pauseBackdrop = document.querySelector('.backdrop');
const pauseHandler = () => {
  pauseDrawing();

  if ($pauseModal.style.display === '') {
    $pauseModal.style.display = 'flex';
    $pauseBackdrop.style.display = 'flex';
  }
};

// 일시정지 모달에서 돌아가기 버튼
const $returnBtn = document.querySelector('.pauseExitBtn');
$returnBtn.addEventListener('click', returnBtnClick);
$pauseBackdrop.addEventListener('click', returnBtnClick);

function returnBtnClick() {
  if ($pauseModal.style.display === 'flex') {
    $pauseModal.style.display = '';
    $pauseBackdrop.style.display = '';

    setTimeout(function () {
      pauseDrawing();
    }, 500);
    // pauseDrawing()
  }
}

// 일시정지 모달에서 처음부터 버튼
const $resetBtn = document.querySelector('.pauseResetBtn');
$resetBtn.addEventListener('click', resetBtnClick);
// 게임오버 모달에서 처음부터 버튼
const $gameOverResetBtn = document.querySelector('.gameOverResetBtn');
$gameOverResetBtn.addEventListener('click', resetBtnClick);

function resetBtnClick() {
  if ($pauseModal.style.display === 'flex') {
    $pauseModal.style.display = '';
    $pauseBackdrop.style.display = '';

    setTimeout(function () {
      resetGame();
      pauseDrawing();
    }, 200);
  } else if ($gameOverModal.style.display === 'flex') {
    window.location.reload();
  } else if ($gameClearModal.style.display === 'flex') {
    window.location.reload();
  }
}

// =========== 일시정지 버튼과 draw함수 반복호출문 ========== //
let stop = false;
// let intervalId;
const $btn = document.getElementById('pause');

$btn.addEventListener('click', pauseHandler);

function startDrawing() {
  draw(); // 10밀리초마다 draw 함수 호출
}
function pauseDrawing() {
  if (stop === false) {
    stop = true;
    clearInterval(draw); // 타이머 일시정지
  } else {
    stop = false;
    draw(); // 10밀리초마다 draw 함수 호출
  }
}

// 게임시작 버튼
const $gameStartModal = document.querySelector('.gameStartModal');
const $gameStartBtn = document.querySelector('.gameStartModal .gameStartBtn');
$gameStartBtn.addEventListener('click', gameStartHandler);
// console.log($gameStartModal.style.display);
$btn.disabled = true;

function gameStartHandler() {
  $gameStartModal.style.display = 'flex';
  if ($gameStartModal.style.display === 'flex') {
    $gameStartModal.style.display = 'none';
    startDrawing();
    $btn.disabled = false;

    // 처음 실행이면 음악실행
    if (firstMusic === false && !isPlaying === true) {
      firstMusic = true;
      isPlaying = true;
      audio.volume = 1;
      audio.play();
      $musicIcon.style.width = '22.5px';
      $musicIcon.style.height = '30px';
    }
  }
}

// if (!$gameStartModal.style.display === 'flex'){
//   startDrawing();
// }

// 게임 클리어 모달
const $gameClearModal = document.querySelector('.gameClearModal');
const $gameClearResetBtn = document.querySelector('.gameClearResetBtn');
// console.log($gameClearResetBtn);
$gameClearResetBtn.addEventListener('click', resetBtnClick);

const $hackBtn = document.querySelector('.hack');
$hackBtn.addEventListener('click', clearHack);
function clearHack() {
  $score.textContent = 4100;
  // gameOver();
}
