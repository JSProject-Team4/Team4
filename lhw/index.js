const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// html 태그 불러오기
const $gameStart = document.querySelector('.gameStart');
const $backDrop = document.querySelector('body .backdrop');
const $gameOver = document.querySelector('.gameOver');
const $main = document.querySelector('.main')
// 크기
const WIDTH = 415;
let HEIGHT = window.innerHeight-78;

// 최대 총알 갯수
const MAX_BULLETS=10;

canvas.width = WIDTH;
canvas.height = HEIGHT;

$main.appendChild(canvas);
let bgImage, charecterImg, bulletImage, enemyImage, gameOverImage;
let currentBullets=MAX_BULLETS;

let gameLoopInterval; // 게임 루프의 타이머 변수

let gameOver = false;
let gameStatus = false;
let score = 0;
// 캐릭터 좌표
let spaceShipX = 160;
let spaceShipY = HEIGHT - 64;

// 창화면시 게임 크기 조절
window.addEventListener('resize',()=>{
  let HEIGHT = window.innerHeight-78;
  canvas.style.height = `${HEIGHT}px`; // 높이 설정
});

let bulletList = []; //총알들을 저장하는 리스트

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = () => {
    if (bulletList.length >= MAX_BULLETS) {
      return;
    }
    this.x = spaceShipX + 20;
    this.y = spaceShipY;
    this.alive = true;
    bulletList.push(this);
  };
  this.update = () => {
    this.y -= 7;
  };
  this.checkHit = () => {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x > enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);

      }
    }
    
  };
}
const rendomMaker = (MIN, MAX) => {
  let rendomNum = Math.floor(Math.random() * (MAX - MIN + 1));
  return rendomNum;
};
let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = () => {
    this.x = rendomMaker(0, canvas.width - 48);
    this.y = 0;

    enemyList.push(this);
  };
  this.update = () => {
    this.y += 2;

    if (this.y >= canvas.height - 48) {
      gameOver = true;
      console.log(gameOver);
    }
  };
}

const loadImage = () => {
  bgImage = new Image();
  bgImage.src = 'Image/backgruond.jpg';

  charecterImg = new Image();
  charecterImg.src = 'Image/spaceShip.png';

  bulletImage = new Image();
  bulletImage.src = 'Image/bullet.png';

  enemyImage = new Image();
  enemyImage.src = 'Image/enemy.png';

  gameOverImage = new Image();
  gameOverImage.src = 'Image/gameOver.jpg';
};
const createBullet = () => {
  if(gameStatus){
    let b = new Bullet(); //총알 하나 생성
    b.init();
    if(!currentBullets===0){
      currentBullets--;
    }
    
    console.log(currentBullets);
  }

};
const createEnemy = () => {
  const interval = setInterval(() => {
    if (gameStatus) {
      let e = new Enemy();
      e.init();
    }
  }, 1000);
};
let keysDown = {};
const keyboardListener = () => {
  document.addEventListener('keydown', (e) => {
    keysDown[e.keyCode] = true;
  });
  document.addEventListener('keyup', (e) => {
    delete keysDown[e.keyCode];
    if (e.keyCode === 32) {
      createBullet();
    }
  });
};
const update = () => {
  if (!gameStatus) {
    return;
  }
  // 우주선 이동 관련
  if (39 in keysDown) {
    spaceShipX += 5;
  }
  if (37 in keysDown) {
    spaceShipX -= 5;
  }
  // 우주선 탈출 방지
  if (spaceShipX <= -10) {
    spaceShipX = 0;
    return;
  }
  if (spaceShipX >= WIDTH - 54) {
    spaceShipX = canvas.width - 54;
  }

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
};
const rederHendler = () => {
  c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  c.drawImage(charecterImg, spaceShipX, spaceShipY);
  // 스코어
  c.fillText(`Score : ${score}`, 20, 20);
  c.fillStyle = 'white';
  c.font = '20px Arial';
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      c.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    c.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
};

const startEvent = () => {
  const removeUi = () => {
    if(!gameOver){   
      $backDrop.style.display = 'none';
      $gameStart.style.display = 'none';
      gameStatus = true;
    }

  };
  $backDrop.addEventListener('click', () => removeUi());
  $gameStart.addEventListener('click', () => removeUi());
};
const restartGame = () => {
  // 초기화 작업
  gameOver = false;
  score = 0;
  spaceShipX = 160;
  bulletList = [];
  enemyList = [];
  clearInterval(gameLoopInterval); // 기존의 게임 루프 중단

  // 다시 게임 루프 시작
  gameLoopInterval = setInterval(() => {
    
    if (gameOver) {
      clearInterval(gameLoopInterval); // 게임 종료 시 타이머 중단
      $gameOver.style.display = 'block';
      $backDrop.style.display = 'block';

      $gameOver.addEventListener('click', () => {
        // 숨겨진 UI들 표시
        $gameOver.style.display = 'none';
        $backDrop.style.display = 'none';
        gameStatus = true;
        restartGame();
        console.log('중복테스트');
      });
    } else {
      // 게임 루프 내용 실행
      update();
      rederHendler();
    }
  }, 1000 / 60); // 60FPS에 가까운 속도로 실행하도록 설정
};


// 게임 초기화 및 루프 시작
loadImage();
keyboardListener();
createEnemy();
startEvent();
restartGame();

