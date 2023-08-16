const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// 크기
const WIDTH = 400;
const HEIGHT = 700;

canvas.width = WIDTH;
canvas.height = HEIGHT;

document.body.appendChild(canvas);

let bgImage, charecterImg, bulletImage, enemyImage, gameOverImage;

let gameOver = false;
let score=0;
// 캐릭터 좌표
let spaceShipX = 160;
let spaceShipY = HEIGHT - 64;

let bulletList =[]//총알들을 저장하는 리스트

function Bullet() {
    this.x=0;
    this.y=0;
    this.init=()=>{
        this.x=spaceShipX+20;
        this.y=spaceShipY;
        this.alive=true;
        bulletList.push(this);
        
    };
    this.update = ()=>{
      this.y-=7;
    };
    this.checkHit=()=>{
      for(let i=0;i<enemyList.length;i++){
        if(this.y <=enemyList[i].y && this.x>enemyList[i].x && this.x<=enemyList[i].x+40){
          score++;
          this.alive=false;
          enemyList.splice(i,1);
        }
      }
    };
};
const rendomMaker=(MIN,MAX)=>{
  let rendomNum = Math.floor(Math.random()*(MAX-MIN+1));
  return rendomNum;
}
let enemyList=[];
function Enemy(){
  this.x=0;
  this.y=0;
  this.init=()=>{
      this.x=rendomMaker(0,canvas.width-48);
      this.y=0;

      enemyList.push(this);
      
  };
  this.update=()=>{
    this.y+=2;

    if(this.y >=canvas.height-48){
      gameOver=true;
      console.log(gameOver);
    }
  }
  
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
    let b = new Bullet(); //총알 하나 생성
    b.init();
    console.log(bulletList);
};
const createEnemy=()=>{
  const interval = setInterval(()=>{
    let e = new Enemy();
    e.init();
  },1000);
}
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

  for(let i=0;i<bulletList.length;i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }

  }
  for(let i=0;i<enemyList.length;i++){
    enemyList[i].update();
  }
};
const rederHendler = () => {
  c.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
  c.drawImage(charecterImg, spaceShipX, spaceShipY);
  // 스코어
  c.fillText(`Score : ${score}`,20,20);
  c.fillStyle='white';
  c.font="20px Arial";
  for(let i=0;i<bulletList.length;i++){
    if(bulletList[i].alive){
      c.drawImage(bulletImage,bulletList[i].x,bulletList[i].y);
    }
    
  }
  for(let i=0;i<enemyList.length;i++){
    c.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
  }
};
const main = () => {
  if(!gameOver){
      // 1좌표 변경, 렌더링 순서
  update();
  rederHendler();
  requestAnimationFrame(main);
  }
  else{
    c.drawImage(gameOverImage,10,100,380,380);
  }

};

loadImage();
keyboardListener();
createEnemy();
main();

