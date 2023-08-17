// ============ 변수 모음zip ============ //
// 캔버스 위에 그래픽을 렌더링하기 위해서
// 캔버스 엘리먼트에 대한 참조를 [ canvas ] 변수에 저장함
// 그림을 그리는 실질적 도구인 2D rendering context를 [ ctx ]변수에 저장함
const canvas = document.getElementById('Canvas');
const ctx = canvas.getContext('2d');

// 공의 시작위치 지정 ( 화면 중앙 + 하단부터 30px 윗칸)
let x = canvas.width / 2;
let y = canvas.height - 30;

// 공의 반지름
const ballRadius = 10;

// 공의 좌표를 계속 변하게 하기 위해서 프레임마다 x와 y에 추가될 값
let movingX = 2;
let MovingY = -2;

// 라켓 높이, 길이, 시작위치
// let 사용이유 = 아이템 등 여러 요인으로 라켓의 넓이,높이가 변경될 수 있기 때문에
let racketHeight = 10;
let racketWidth = 75;
let racketX = (canvas.width - racketWidth) / 2; // canvas의 길이에서 라켓길이를 빼고 그것의 반절의 위치

// 좌, 우 키보드 입력변수
let rightKey = false;
let leftKey = false;

// ============ 주인"공"을 캔버스 위에 그리는 파트 ============ //

// 주인"공"을 그리는 함수
function drawBall() {
  ctx.beginPath(); // 그리기 시작
  ctx.arc(x, y, ballRadius, 0, 10); // x: 50, y: 50, 반지름: 10, 시작각도, 끝 각도
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath(); // 그리기 끝
} // drawBall() 함수 끝

// 라켓을 그리는 함수
function drawRacket() {
  ctx.beginPath();
  ctx.rect(racketX, canvas.height - racketHeight, racketWidth, racketHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// 게임을 리셋하는 함수
function resetGame() {
  x = canvas.width / 2;
  y = canvas.height - 30;
  movingX = 2;
  MovingY = -2;
}

// 그리기 함수 (10밀리초마다 호출됨 = 무한작동)
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 공을 그리기 전에 기존에 공을 지운다
  drawBall(); // 주인"공" 그리기 함수 호출
  drawRacket(); // 라켓 그리기 함수 호출

  // ============ 주인"공"을 벽에 튕기게 하는 파트 ============ //
  // 만약에 현재의 높이에서 + MovingY( -2 )를 했을때 0보다 작아지는경우(벽을넘어감)
  // plusY를 양수로 바꿔서 반대로 움직이게해서 벽에 튕기는것처럼 보이게 한다
  // (화면 위를 넘어갈때)
  if (y + MovingY < ballRadius) {
    MovingY = -MovingY;
  }
  // 공이 화면 아래로 향했을때의 코드
  if (y + MovingY > canvas.height - ballRadius) {
    alert('Game Over...');
    // 공의 위치를 시작지점으로 돌린다.
    resetGame();

  }
  // (화면 왼쪽을 넘어가거나 화면 오른쪽으로 넘어가거나)
  if (x + movingX > canvas.width - ballRadius || x + movingX < ballRadius) {
    movingX = -movingX;
  }

  // 라켓에 주인"공"이 닿았을 때, 벽에 튀긴것처럼 튕기게 하기

  // 좌우 각 방향키를 누르면 10의 속도(10px)로 움직인다. 라켓이 벽을 넘지않는 선에서
  if (rightKey && racketX < canvas.width - racketWidth) {
    racketX += 10;
  } else if (leftKey && racketX > 0) {
    racketX -= 10;
  }

  x += movingX; // x의 값 +2
  y += MovingY; // y의 값 -2
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

setInterval(draw, 10); // 10밀리초 간격 draw함수 반복호출
