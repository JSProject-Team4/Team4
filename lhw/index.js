const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
// html 태그 불러오기
const $gameStart = document.querySelector('.gameStart');
const $backDrop = document.querySelector('body .backdrop');
const $gameOver = document.querySelector('.gameOver');
const $main = document.querySelector('.main');
const $gamebox = document.querySelector('.gamebox');
const $bulletbox = document.querySelector('.Ybox');
const $hp = document.querySelector('.hp');
const $reloadbox = document.querySelector('.reloadbox');
const gameMusic = document.getElementById('game-music');
const gameMusic2 = document.getElementById('game-music2');
const gameMusic3 = document.getElementById('game-music3');
const gameMusic4 = document.getElementById('game-music4');
const gameMusic5 = document.getElementById('game-music5');
const gameMusic6 = document.getElementById('game-music6');
const gun = document.getElementById('gun');
const $thunder = document.querySelector('.thunder');
let enemyDie = false;
let die = {
  x: 0,
  y: 0,
};

// 크기
const WIDTH = 465;
let HEIGHT = window.innerHeight - 76;

// 최대 총알 갯수
const MAX_BULLETS = 10;

canvas.width = WIDTH;
canvas.height = HEIGHT;

let bgImage,
  charecterImg,
  bulletImage,
  enemyImage,
  gameOverImage,
  itemImage,
  gunImage;
let currentBullets = MAX_BULLETS;

let gameLoopInterval; // 게임 루프의 타이머 변수

let gameOver = false;
let gameStatus = false;
let score = 0;
// 캐릭터 좌표
let spaceShipX = 210;
let spaceShipY = HEIGHT - 68;
// 컨버스 그리기
let bulletAdd = 1;

let reloadAdd;
// 창화면시 게임 크기 조절
window.addEventListener('resize', () => {
  let HEIGHT = window.innerHeight - 78;
  canvas.style.height = `${HEIGHT}px`; // 높이 설정
});

function shakeScreen() {
  canvas.classList.add('shake');

  setTimeout(() => {
    canvas.classList.remove('shake');
  }, 500);
}
// 총알 hp UI
// 총알 리로드 주기
const reloadStart = () => {
  $reloadbox.classList.add('animate-reloadbox');
  reloadAdd = setInterval(() => {
    setTimeout(() => {
    }, 1000);
    currentBullets += bulletAdd;
    uiEvent();
  }, 5000);
};
const reloadEnd = () => {
  clearInterval(reloadAdd);
  $reloadbox.classList.remove('animate-reloadbox');
};

const specialMoveHandler = (event) => {
  if (imgCount1 === 5 || imgCount2 === 5 || imgCount3 === 5) {
    changeSM(false);
    gameMusic6.currentTime = 0;
    gameMusic6.play();
    setTimeout(() => {
      $thunder.style.display = 'block';
      shakeScreen();
      $main.classList.add('special-effect');
      setTimeout(() => {
        $thunder.style.display = 'none';
        $main.classList.remove('special-effect');
      }, 600);

      let Addscore = enemyList.length;
      score += Addscore;
      enemy2List = [];
      enemyList = [];
      imgCount3 = 1;
      imgCount2 = 1;
    }, 1000);

    // 1초 후에 요소를 다시 숨기도록 설정
  }
};

let iterationCount = 0;
let asdf = 0;
let imgCount1 = 1;
let imgCount2 = 1;
let imgCount3 = 1;
const changeSM = (e) => {
  const runForLoop = () => {
    // 에너지 충전 보이기
    if (true) {
      if (iterationCount < 4) {
        const $specialMoveChange1 = document.querySelector(`.c1`);

        $specialMoveChange1.style.backgroundImage = `url('Image/${imgCount1}.png')`;
        iterationCount++;
        imgCount1++;
        if (imgCount1 === 3) {
          asdf++;
        }
      } else if (iterationCount < 8 && asdf === 1) {
        const $specialMoveChange2 = document.querySelector(`.c2`);

        $specialMoveChange2.style.backgroundImage = `url('Image/${imgCount2}.png')`;
        iterationCount++;
        imgCount2++;
        console.log(imgCount2);
        if (imgCount2 === 5) {
          imgCount2 = 0;
          asdf++;
        }
      } else if (iterationCount < 12 && asdf === 2) {
        const $specialMoveChange3 = document.querySelector(`.c3`);
        $specialMoveChange3.style.backgroundImage = `url('Image/${imgCount3}.png')`;
        iterationCount++;
        imgCount3++;
        if (imgCount3 === 5) {
          asdf++;
        }
        console.log(`Iteration ${asdf}`);
      }
    }
  };

  if (e === false) {
    const $specialMoveChange2 = document.querySelector(`.c2`);
    const $specialMoveChange1 = document.querySelector(`.c1`);
    const $specialMoveChange3 = document.querySelector(`.c3`);
    if (asdf === 3) {
      console.log(asdf, 1);
      imgCount3 = 1;
      $specialMoveChange3.style.backgroundImage = `url('Image/${0}.png')`;
      asdf--;
      iterationCount = 8;
    } else if (asdf === 2) {
      console.log(asdf, 2);
      imgCount2 = 1;
      $specialMoveChange3.style.backgroundImage = `url('Image/${0}.png')`;
      $specialMoveChange2.style.backgroundImage = `url('Image/${0}.png')`;
      asdf--;
      iterationCount = 4;
    } else if (asdf === 1) {
      console.log(asdf, 3);
      imgCount1 = 1;
      $specialMoveChange3.style.backgroundImage = `url('Image/${0}.png')`;
      $specialMoveChange2.style.backgroundImage = `url('Image/${0}.png')`;
      $specialMoveChange1.style.backgroundImage = `url('Image/${0}.png')`;
      asdf--;
      iterationCount = 0;
    }
  }
  let intervalId = setInterval(runForLoop, 3000); // 1초마다 runForLoop 함수 실행
  if (e === false) {
    clearInterval(intervalId);
  }
};
const resetSM = () => {
  const $specialMoveChange2 = document.querySelector(`.c2`);
  const $specialMoveChange1 = document.querySelector(`.c1`);
  const $specialMoveChange3 = document.querySelector(`.c3`);
  $specialMoveChange3.style.backgroundImage = `url('Image/${0}.png')`;
  $specialMoveChange2.style.backgroundImage = `url('Image/${0}.png')`;
  $specialMoveChange1.style.backgroundImage = `url('Image/${0}.png')`;

  iterationCount = 0;
  asdf = 0;
  imgCount1 = 1;
  imgCount2 = 1;
  imgCount3 = 1;
};
const uiEvent = () => {
  function removeAllChildren(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
  if (!gameStatus) {
    removeAllChildren($bulletbox);

    for (let i = 0; i < MAX_BULLETS; i++) {
      const $bullet = document.createElement('img');
      $bullet.src = 'Image/bullet.png';
      $bullet.alt = '';
      $bulletbox.appendChild($bullet);
    }
  }
  if (!gameOver) {
    removeAllChildren($bulletbox);
    if (currentBullets >= 10) {
      currentBullets = 10;
    }
    for (let i = 0; i < currentBullets; i++) {
      const $bullet = document.createElement('img');
      $bullet.src = 'Image/bullet.png';
      $bullet.alt = '';
      $bulletbox.appendChild($bullet);
    }
  }
};
uiEvent();
let bulletList = []; //총알들을 저장하는 리스트
// 아이템 리스트 채워두기
let enemy2Spawned = false;
let hitcount = 0;
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = () => {
    if (currentBullets > 0) {
      // 현재 총알 갯수를 확인
      this.x = spaceShipX + 20;
      this.y = spaceShipY;
      this.alive = true;
      bulletList.push(this);
      uiEvent(); // UI 업데이트
    }
  };
  this.update = () => {
    this.y -= 9;
  };
  this.checkHit = () => {
    for (let i = 0; i < enemyList.length; i++) {
      const bulletLeft = this.x;
      const bulletRight = this.x + bulletImage.width;
      const bulletTop = this.y;
      const bulletBottom = this.y + bulletImage.height;

      const enemyLeft = enemyList[i].x;
      const enemyRight = enemyList[i].x + enemyImage.width;
      const enemyTop = enemyList[i].y;
      const enemyBottom = enemyList[i].y + enemyImage.height;
      if (
        bulletBottom > enemyTop &&
        bulletTop < enemyBottom &&
        bulletRight > enemyLeft &&
        bulletLeft < enemyRight
      ) {
        gameMusic2.currentTime = 0;
        gameMusic2.play();
        score++;
        this.alive = false;
        enemyList.splice(i, 1);

        enemyDie = true;
        die = {
          x: enemyLeft - 160,
          y: enemyBottom - 200,
        };

        setTimeout(() => {
          enemyDie = false;
        }, 100);

        uiEvent(); // UI 업데이트
      }
    }
    if (enemy2List) {
      for (let i = 0; i < enemy2List.length; i++) {
        const bulletLeft = this.x;
        const bulletRight = this.x + bulletImage.width;
        const bulletTop = this.y;
        const bulletBottom = this.y + bulletImage.height;

        const enemyLeft = enemy2List[i].x;
        const enemyRight = enemy2List[i].x + enemyImage.width;
        const enemyTop = enemy2List[i].y;
        const enemyBottom = enemy2List[i].y + enemyImage.height;
        if (
          bulletBottom > enemyTop &&
          bulletTop < enemyBottom &&
          bulletRight > enemyLeft &&
          bulletLeft < enemyRight
        ) {
          hitcount++;
          this.alive = false;
          if (hitcount === 2) {
            gameMusic2.currentTime = 0;
            gameMusic2.play();
            enemy2List.splice(i, 1);
            score = score + 2;
            hitcount = 0;
            enemyDie = true;
            die = {
              x: enemyLeft - 160,
              y: enemyBottom - 200,
            };

            setTimeout(() => {
              enemyDie = false;
            }, 100);
          }

          uiEvent(); // UI 업데이트
        }
      }
    }
    if (itemList) {
      for (let i = 0; i < itemList.length; i++) {
        const bulletLeft = this.x;
        const bulletRight = this.x + bulletImage.width;
        const bulletTop = this.y;
        const bulletBottom = this.y + bulletImage.height;

        const itemLeft = itemList[i].x;
        const itemRight = itemList[i].x + itemImage.width;
        const itemTop = itemList[i].y;
        const itemBottom = itemList[i].y + itemImage.height;
        if (
          bulletBottom > itemTop &&
          bulletTop < itemBottom &&
          bulletRight > itemLeft &&
          bulletLeft < itemRight
        ) {
          this.alive = false;
          itemList.splice(i, 1);
          if (currentBullets <= 10) {
            gameMusic3.currentTime = 0;
            gameMusic3.play();
            setTimeout(() => {
              gameMusic3.pause();
            }, 1000);
            currentBullets = currentBullets + 5;
            uiEvent(); // UI 업데이트
          }
        }
      }
    }
  };
}
const rendomMaker = (MIN, MAX) => {
  let rendomNum = Math.floor(Math.random() * (MAX - MIN + 1));
  return rendomNum;
};
let itemList = [];
function Item() {
  this.x = 0;
  this.y = 0;
  this.init = () => {
    this.x = rendomMaker(0, canvas.width - 48);
    this.y = 0;

    itemList.push(this);
  };
  this.update = () => {
    this.y += 2;

    const indexToRemove = itemList.indexOf(this);
    if (this.y >= canvas.height - 48) {
      if (indexToRemove !== -1) {
        itemList.splice(indexToRemove, 1);
      }
    }
  };
}

let hpcount = 0;
const decreaseHp = () => {
  hpcount += 1;
  const heightValues = ['100', '66%', '33%', '0'];
  $hp.style.height = heightValues[hpcount];
};
const EnemyRetouch = (value) => {
  if (score <= 5) {
    result = value === true ? 2 : 5;
  } else if (score <= 10) {
    result = value === true ? 3 : 5;
  } else if (score <= 15) {
    result = value === true ? 4 : 0;
  } else if (score <= 20) {
    result = value === true ? 5 : 6;
    if (!enemy2Spawned) {
      bulletAdd = 2;
      createEnemy2();
      createEnemy3();
      enemy2Spawned = true; // createEnemy2() 함수가 실행되었음을 표시
    }
  } else if (score <= 25) {
    result = value === true ? 6 : 7;
  } else if (score <= 35) {
    result = value === true ? 6 : 8;
  } else if (score <= 45) {
    result = value === true ? 7 : 9;
  } else if (score <= 55) {
    result = value === true ? 7 : 9;
  } else {
    result = value === true ? 9 : 10;
  }
  return result;
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
    this.y += EnemyRetouch(true);

    const indexToRemove = enemyList.indexOf(this);

    if (this.y >= canvas.height - 48) {
      if (indexToRemove !== -1) {
        gameMusic5.currentTime = 0;
        gameMusic5.play();
        shakeScreen();
        enemyList.splice(indexToRemove, 1);
      }
      decreaseHp();
      if (hpcount >= 3) {
        gameOver = true;
        gameMusic4.currentTime = 0;
        gameMusic4.play();
        reloadEnd();
        pauseMusic();
        clearInterval(einterval2);
      }
    }
  };
}
function Enemy2() {
  this.x = 0;
  this.y = 0;
  this.init = () => {
    this.x = rendomMaker(0, canvas.width - 48);
    this.y = 0;

    enemy2List.push(this);
  };
  this.update = () => {
    this.y += EnemyRetouch(false);

    const indexToRemove = enemy2List.indexOf(this);

    if (this.y >= canvas.height - 48) {
      if (indexToRemove !== -1) {
        gameMusic5.currentTime = 0;
        gameMusic5.play();
        shakeScreen();
        enemy2List.splice(indexToRemove, 1);
      }
      decreaseHp();
      if (hpcount >= 3) {
        gameOver = true;
        gameMusic4.currentTime = 0;
        gameMusic4.play();
        reloadEnd();
        pauseMusic();
        clearInterval(einterval2);
      }
    }
  };
}
let einterval;
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

  itemImage = new Image();
  itemImage.src = 'Image/item.png';

  gameOverImage.src = 'Image/gameOver.jpg';

  enemy2Image = new Image();
  enemy2Image.src = 'Image/enemy2.png';

  gunImage = new Image();
  gunImage.src = 'Image/gun.png';

  boomImage = new Image();
  boomImage.src = 'Image/unscreen.gif';
};
const createBullet = () => {
  if (gameStatus) {
    let b = new Bullet(); //총알 하나 생성
    b.init();
    if (currentBullets !== 0) {
      currentBullets--;
    }
  }
};
const createEnemy = () => {
  const einterval = setInterval(() => {
    if (gameStatus) {
      let e1 = new Enemy();
      e1.init();
    }
  }, 1500);
};
let enemy2List = [];
let einterval2;
function createEnemy2() {
  if (gameStatus && !enemy2Spawned) {
    einterval2 = setInterval(() => {
      if (gameStatus) {
        let e2 = new Enemy2(); // 새로운 적 객체 생성
        e2.init();
      }
    }, 5000);
  }
}
function createEnemy3() {
  if (gameStatus) {
    einterval = setInterval(() => {
      if (gameStatus) {
        let e2 = new Enemy(); // 새로운 적 객체 생성
        e2.init();
        console.log('test');
      }
    }, 3000);
  }
}
const createItem = () => {
  const initialItemCount = 5; // 초기 아이템 개수
  for (let i = 0; i < initialItemCount; i++) {
    let item = new Item();
    item.init();
  }
  const interval = setInterval(() => {
    if (gameStatus) {
      let item = new Item();
      item.init();
    }
  }, 5000);
};

// 음악 재생
function playMusic() {
  gameMusic.play();
}

// 음악 일시정지
function pauseMusic() {
  gameMusic.pause();
}

// 음악 정지 및 처음부터 재생
function stopMusic() {
  gameMusic.pause();
  gameMusic.currentTime = 0;
}
let keysDown = {};
const keyboardListener = () => {
  document.addEventListener('keydown', (e) => {
    keysDown[e.keyCode] = true;
    if (e.keyCode === 16) {
      specialMoveHandler(e);
    }
  });
  document.addEventListener('keyup', (e) => {
    delete keysDown[e.keyCode];
    if (e.keyCode === 32) {
      if (currentBullets !== 0) {
        gun.currentTime = 0;
        gun.volume = 0.4;
        gun.play();
      }
      createBullet();
      uiEvent();
    }
    if (e.keyCode === 16) {
    }
  });
};
const update = () => {
  if (!gameStatus) {
    return;
  }
  // 우주선 이동 관련
  if (39 in keysDown) {
    spaceShipX += 6;
  }
  if (37 in keysDown) {
    spaceShipX -= 6;
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
  for (let i = 0; i < itemList.length; i++) {
    itemList[i].update();
  }
  for (let i = 0; i < enemy2List.length; i++) {
    enemy2List[i].update();
  }
};
const rederHendler = () => {
  c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  c.drawImage(charecterImg, spaceShipX, spaceShipY);
  // 스코어
  c.fillText(`Score : ${score}`, 20, 20);
  c.fillText(`Bullet : ${currentBullets}`, 360, 20);

  c.fillStyle = 'black';
  c.font = '15px DungGeunMo';

  if (enemyDie === true) {
    c.drawImage(boomImage, die.x, die.y);
  }

  // 아이템 드랍
  for (let i = 0; i < itemList.length; i++) {
    c.drawImage(gunImage, itemList[i].x, itemList[i].y);
  }
  c.fillStyle = 'white';
  // c.font = "20px DOSIyagiMedium";
  // 총알 추가
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      c.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  } //적 추가
  for (let i = 0; i < enemyList.length; i++) {
    c.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
  for (let i = 0; i < enemy2List.length; i++) {
    c.drawImage(enemy2Image, enemy2List[i].x, enemy2List[i].y); // 에너미2 이미지 그리기
  }
};

const startEvent = () => {
  const removeUi = () => {
    if (!gameOver) {
      playMusic();
      reloadStart();
      changeSM(true);
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
  currentBullets = MAX_BULLETS;
  gameOver = false;
  score = 0;
  spaceShipX = 210;
  let iterationCount = 0;
  let asdf = 0;
  let imgCount1 = 1;
  let imgCount2 = 1;
  let imgCount3 = 1;
  bulletList = [];
  clearInterval(einterval);
  enemyList = [];
  enemy2List = [];
  itemList = [];

  enemy2Spawned = false; // enemy2Spawned 변수 초기화

  clearInterval(gameLoopInterval); // 기존의 게임 루프 중단

  // 다시 게임 루프 시작
  gameLoopInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(gameLoopInterval); // 게임 종료 시 타이머 중단
      $gameOver.style.display = 'block';
      $backDrop.style.display = 'block';

      $gameOver.addEventListener('click', () => {
        if (!gameStatus) {
          clearInterval(intervalId);
        }
        resetSM();
        gameMusic4.pause();
        hpcount = 0; // hp 초기화
        $hp.style.height = '100%';
        uiEvent();
        // 숨겨진 UI들 표시
        $gameOver.style.display = 'none';
        $backDrop.style.display = 'none';
        gameStatus = true;
        playMusic();
        reloadStart();
        restartGame();
        uiEvent();
      });
    } else {
      // 게임 루프 내용 실행

      update();
      rederHendler();
    }
  }, 1000 / 60); // 60FPS에 가까운 속도로 실행하도록 설정
};

loadImage();
keyboardListener();
createEnemy();
createItem();
startEvent();
restartGame();
