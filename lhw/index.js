const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// 크기
const WIDTH = 400;
const HEIGHT = 700;

canvas.width = WIDTH;
canvas.height = HEIGHT;

document.body.appendChild(canvas);

let bgImage, charecterImg, bulletImage, enemyImage, gameOverImage;
// 캐릭터 좌표
let spaceShipX = 160;
let spaceShipY = HEIGHT - 64;

let bulletList =[]//총알들을 저장하는 리스트

function Bullet  (){
    this.x=0;
    this.y=0;
    this.init=()=>{
        this.x=spaceShipX;
        this.y=spaceShipY;
        
    };
};

const loadImage = () => {
  bgImage = new Image();
  bgImage.src = 'Image/backgruond.jpg';

  charecterImg = new Image();
  charecterImg.src = 'Image/spaceShip.png';

  bulletImage = new Image();
  bulletImage = src = 'Image/bullet.png';

  enemyImage = new Image();
  enemyImage = src = 'Image/enemy.png';

  gameOverImage = new Image();
  gameOverImage = src = 'Image/gameOver.jpg';
};
const createBullet = () => {
    let b = new Bullet(); //총알 하나 생성
    b.init();
    console.log('test');
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
};
const rederHendler = () => {
  c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  c.drawImage(charecterImg, spaceShipX, spaceShipY);
  for(let i=0;i<bulletList.length;i++){
    c.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
  }
};
const main = () => {
  // 1좌표 변경, 렌더링 순서
  update();
  rederHendler();
  requestAnimationFrame(main);
};
loadImage();
main();
keyboardListener();
